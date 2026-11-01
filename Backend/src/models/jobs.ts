import type { delivery_jobs, events } from "../generated/prisma/client.js";
export interface JobList {
    jobId: string;
    eventId: string;
}

export interface EventDetails {
    destination_id: number;
    event_type: string;
    payload: object;
    id:number;
}

export interface WebhookJobData {
    eventDetails: EventDetails;
    deliveryJobId:string;
}

export type DeliveryJob = delivery_jobs & {
    events: events;
    
};

export interface JobAttemptDetails {
    status: "success" | "failed";
    statusCode: number | null;
    duration: number;
    responseData: string | null;
    error: string | null;
}

export interface UpdateJobStatusInput {
    deliveryJobId: string;
    eventId: number;
    attemptNumber: number;
    success: boolean;
    maxAttempts: number;
    error: string | null;
    nextAttemptAt?: Date | null;
}

