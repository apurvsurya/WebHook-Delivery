export interface RegisterDestinationInput {
  url: string;
}

export interface Destination {
  id: number;
  url: string;
  secret: string;
  created_at: Date;
}