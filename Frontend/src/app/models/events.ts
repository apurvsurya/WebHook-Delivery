export interface Eventsdetails {
  id: number;
  destination_id: number;
   "destinations": {
                "url": string;
            };
  event_type: string;
  status: string;
  created_at: string;
}

export interface EventsDTO{
    success:boolean;
    data:Eventsdetails[];
}