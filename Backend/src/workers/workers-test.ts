import { Worker } from "bullmq";
import prisma from "../config/prisma.js";
import type { WebhookJobData } from "../models/jobs.js";
import "dotenv/config";

const worker = new Worker<WebhookJobData>("webhook-queue", async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);

    const event = job.data.eventDetails;

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
            event.payload
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

async function performJob(destination: string, eventType: string, payload: object): Promise<void> {
    const startTime = Date.now();
    try {
        const response = await fetch(destination, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "webhook-event-type": eventType,

            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10_000),
        });

        const responseData = await response.text();
        const duration = Date.now() - startTime;
        console.log(`Job completed in ${duration} ms. Response:`, responseData);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Webhook delivered successfully", {
            status: response.status,
            duration,
            responseData,
        });
    }
    catch (error) {
        console.error("Webhook delivery error:", error);
        throw error; // lets BullMQ retry the job
    }

}