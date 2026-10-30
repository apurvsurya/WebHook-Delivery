import type { delivery_jobs, events } from "../generated/prisma/client.js";
export interface JobList {
    jobId: string;
    eventId: string;
}

export interface EventDetails {
    destination_id: number;
    event_type: string;
    payload: object;
}

export interface WebhookJobData {
    eventDetails: EventDetails;
}

export type DeliveryJob = delivery_jobs & {
  events: events;
};