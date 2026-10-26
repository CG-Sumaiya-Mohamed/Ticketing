import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

// List all tickets (the client shows which ones are already reserved/sold).
router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { router as indexTicketRouter };
