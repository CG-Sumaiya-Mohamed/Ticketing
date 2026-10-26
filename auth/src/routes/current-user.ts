import express from "express";
import { currentUser } from "@mini-ticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null }); // null instead of undefined when not logged in.
});

export { router as currentUserRouter };
