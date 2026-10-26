export enum OrderStatus {
  // The order has been created and the ticket is reserved, but it has not been paid for yet.
  Created = "created",

  // The user cancelled the order (the ticket gets released again).
  Cancelled = "cancelled",

  // The (mock) payment went through, the ticket is bought.
  Complete = "complete",
}
