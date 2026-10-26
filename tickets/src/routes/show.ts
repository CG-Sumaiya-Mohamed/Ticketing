import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { NotFoundError } from "@mini-ticketing/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  // An invalid id would make mongoose throw, so treat it as not found.
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
