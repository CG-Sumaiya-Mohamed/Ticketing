// This file starts up the express app (app.ts is kept separate so tests can import it without listening on a port).
import "./load-env"; // Before ./app, which reads COOKIE_SECURE while the module loads.
import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // CI/CD Test
  console.log("CI/CD Test");
  // Make sure the environment variables are defined before we do anything else.
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb successfully");
  } catch (err) {
    console.error(err);
  }

  const port = process.env.PORT || 3000; // Defaults to 3000 like the k8s services expect.
  app.listen(port, () => {
    console.log(`Auth listening on port ${port}!`);
  });
};

start();
