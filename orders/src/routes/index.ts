import express, { Request, Response } from "express";
import { requireAuth } from "@mini-ticketing/common";
import { Order } from "../models/order";

const router = express.Router();

// All orders for the signed in user, with the ticket details filled in.
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
