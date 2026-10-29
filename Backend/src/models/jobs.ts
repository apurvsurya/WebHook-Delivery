export interface JobList{
    jobId:string;
    eventId:string;
}

export interface EventDetails {
  destination_id: number;
  event_type: string;
  payload: object;
}

export interface WebhookJobData {
  eventDetails: EventDetails;
}