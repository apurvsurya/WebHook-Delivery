import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { JobAttemptDetails, UpdateJobStatusInput } from "../models/jobs.js";

export async function findPendingJobs() {
    try {
        const pendingJobs = await prisma.delivery_jobs.findMany({
            where: {
                status: "pending"
            },
            include: {
                events: true
            },
            orderBy: {
                created_at: "asc"
            }
        })
        return pendingJobs
    }
    catch (err) {
        throw new Error("Unable to find any pending or new jobs!" + err);
    }

}

export async function findJobById(jobId: string) {
    try {
        const job = await prisma.delivery_jobs.findUnique({
            where: {
                id: BigInt(jobId),
            },
            include: {
                events: true,
            },
        });
        return job;
    }
    catch (err) {
        throw new Error("Unable to find job with ID: " + jobId + ". Error: " + err);
    }
}

export async function getAllJobsForUser(userID: string) {
    try {
        const jobs = await prisma.delivery_jobs.findMany({
            where: {
                events: {
                    destinations: {
                        user_id: userID
                    }
                }
            },
            include: {
                events: {
                    include: {
                        destinations: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
        return jobs;
    }
    catch (err) {
        throw new Error("Error occured while getting all jobs!" + err);
    }
}

export async function recordAttempt(
    eventId: number,
    attemptNumber: number,
    input: JobAttemptDetails,
    attemptedAt: Date
) {
    return prisma.delivery_attempts.create({
        data: {
            event_id: eventId,
            attempt_number: attemptNumber,
            status_code: input.statusCode,
            response_body: input.responseData,
            duration_ms: input.duration,
            error: input.error,
            attempted_at: attemptedAt
        }
    });
}

export async function UpdateJobStatus(jobId: string, status: string, attempts: number, lockedUntil: Date) {

    return prisma.delivery_jobs.update({
        where: {
            id: Number(jobId)
        },
        data: {
            status: status,
            attempts: attempts,
            locked_until: lockedUntil
        }
    })

}

export async function updateDeliveryJobStatus(
    input: UpdateJobStatusInput
) {
    const {
        deliveryJobId,
        eventId,
        attemptNumber,
        success,
        maxAttempts,
        error,
        nextAttemptAt
    } = input;

    const finalStatus = success
        ? "succeeded"
        : attemptNumber >= maxAttempts
            ? "failed"
            : "retrying";

    return prisma.$transaction(async (tx) => {

        await tx.delivery_jobs.update({
            where: {
                id: BigInt(deliveryJobId)
            },
            data: {
                status: finalStatus,
                attempts: attemptNumber,
                last_error: error,
                locked_until: null,
                ...(finalStatus === "retrying" && nextAttemptAt
                    ? { next_attempt_at: nextAttemptAt }
                    : {})
            }
        });

        await tx.events.update({
            where: {
                id: eventId
            },
            data: {
                status: finalStatus
            }
        });

        return finalStatus;
    });
}