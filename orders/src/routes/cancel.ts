import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@mini-ticketing/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// Cancel an unpaid order, which releases the ticket again. We don't delete, we just set the status (like the course app).
router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
    throw new NotFoundError();
  }

  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  if (order.status === OrderStatus.Complete) {
    throw new BadRequestError("Cannot cancel a paid order");
  }

  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  // Tell the tickets service to unlock the ticket.
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: { id: order.ticket.id },
  });

  res.status(204).send(order);
});

export { router as cancelOrderRouter };
