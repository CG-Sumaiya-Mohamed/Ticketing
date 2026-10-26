import nats, { Stan } from "node-nats-streaming";

// A singleton that holds the NATS client so routes and listeners can share ONE connection (like mongoose does for mongo).
class NatsWrapper {
  private _client?: Stan; // Undefined until we connect.

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before it is connected!");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
