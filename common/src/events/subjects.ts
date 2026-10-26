// These are essentially the event names (channels) used on NATS.
export enum Subjects {
  // Tickets service events.
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",

  // Orders service events.
  OrderCreated = "order:created",
  OrderCancelled = "order:cancelled",
}
