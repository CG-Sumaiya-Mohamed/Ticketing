import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";

declare global {
  var signup: () => Promise<string[]>; // Returns the cookie for a signed up user.
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "test-only-key"; // Test only value, the real one comes from the k8s secret.

  mongo = await MongoMemoryServer.create(); // An in-memory mongo just for the tests.
  await mongoose.connect(mongo.getUri(), {});
});

beforeEach(async () => {
  // Wipe all the data between tests.
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signup = async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  return response.get("Set-Cookie")!;
};
