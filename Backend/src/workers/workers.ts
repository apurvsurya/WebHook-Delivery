import { Worker } from "bullmq";
import prisma from "../config/prisma.js";
import type { WebhookJobData } from "../models/jobs.js";
import "dotenv/config";
import { recordAttempt, updateDeliveryJobStatus, UpdateJobStatus } from "../services/jobs.services.js";
import { start } from "node:repl";

const worker = new Worker<WebhookJobData>("webhook-queue", async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    const attemptsMade = job.attemptsMade + 1;
    const event = job.data.eventDetails;
    const jobId = job.data.deliveryJobId;
        await prisma.delivery_jobs.update({
            where: {
                id: Number(jobId)
            },
            data: {
                status: "processing",
                attempts: attemptsMade,
                locked_until: new Date(Date.now() + 15_000)
            }
        });


    // Fetch the destination using the ID from the event
    const destination = await prisma.destinations.findUnique({
        where: {
            id: event.destination_id,
        },
        select: {
            url: true,
            secret: true,
        },
    });

    if (!destination) {
        throw new Error(
            `Destination not found: ${event.destination_id}`
        );
    }


    await performJob(
        destination.url,
        event.event_type,
        event.payload,
        event.id,
        attemptsMade,
        jobId
    );
},
    {
        connection: {
            host: "127.0.0.1",
            port: 6379,
            maxRetriesPerRequest: null,
        },
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
})

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
    console.error("Worker error:", error);
});

console.log("Test worker is waiting for jobs...");

async function performJob(
    destination: string,
    eventType: string,
    payload: object,
    eventId: number,
    attemptNumber: number,
    jobId:string
): Promise<void> {

    const startTime = Date.now();
    const attemptedAt = new Date();

    let statusCode: number | null = null;
    let responseData: string | null = null;
    let errorMessage: string | null = null;

    try {
        const response = await fetch(destination, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "webhook-event-type": eventType
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10_000)
        });

        statusCode = response.status;
        responseData = (await response.text()).slice(0, 10_000);

        if (!response.ok) {
            errorMessage = `HTTP error: ${response.status}`;
        }

    } catch (error) {
        errorMessage = (error as Error).message;
    }
    const deliveryJobId = jobId;
    const duration = Date.now() - startTime;
    const maxAttempts = 5;
    const success = errorMessage === null;
    const isFinalAttempt = attemptNumber >= maxAttempts;
    const nextAttemptAt = !success && !isFinalAttempt
        ? new Date(Date.now() + 1000 * Math.pow(2, attemptNumber - 1))
        : null;
    await updateDeliveryJobStatus({
        deliveryJobId,
        eventId,
        attemptNumber,
        success,
        maxAttempts,
        error: errorMessage,
        nextAttemptAt
    });


    // Record every attempt
    await recordAttempt(
        eventId,
        attemptNumber,
        {
            status: success ? "success" : "failed",
            statusCode,
            duration,
            responseData,
            error: errorMessage
        },
        attemptedAt
    );

    if (!success) {
        throw new Error(errorMessage!);
    }

    console.log("Webhook delivered successfully", {
        status: statusCode,
        duration,
        responseData
    });
}