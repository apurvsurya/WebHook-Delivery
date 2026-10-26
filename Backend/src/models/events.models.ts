export interface CreatedEvent{
    id:number;
    destination_id:number;
    event_type:string;
    status:string;
    payload:Record<string,unknown>;
}

export interface CreateEventInput {
  destinationId: number;
  eventType: string;
  payload: Record<string, unknown>;
}