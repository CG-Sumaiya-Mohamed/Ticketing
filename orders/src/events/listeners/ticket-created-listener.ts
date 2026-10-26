import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@mini-ticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

// Save a copy of every new ticket so orders can be created without asking the tickets service.
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack(); // Tell NATS we processed this event.
  }
}
