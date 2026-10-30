import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

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
