import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null; // Destroys the cookie.

  res.send({}); // Always send back a response, even an empty one.
});

export { router as signoutRouter };
