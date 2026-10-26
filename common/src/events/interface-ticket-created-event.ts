import { Subjects } from "./subjects";

// Describes what the 'ticket:created' event looks like.
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
