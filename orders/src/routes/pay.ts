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

const router = express.Router();

// Step 2 of buying: a MOCK payment. No Stripe, no card details, no secrets - it just marks the order complete.
// In the course app this is a separate payments service that publishes payment:created; here we keep it small.
router.post("/api/orders/:orderId/pay", requireAuth, async (req: Request, res: Response) => {
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
  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError("Cannot pay for a cancelled order");
  }
  if (order.status === OrderStatus.Complete) {
    throw new BadRequestError("Order is already paid");
  }

  order.set({ status: OrderStatus.Complete });
  await order.save();

  // The ticket stays locked (orderId set in the tickets service) because it is now bought.
  res.send(order);
});

export { router as payOrderRouter };
