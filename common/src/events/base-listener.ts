import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

// Generic shape every event must have.
interface Event {
  subject: Subjects;
  data: any;
}

// Abstract class: extend it and provide subject, queueGroupName and onMessage.
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void | Promise<void>;
  protected client: Stan;
  protected ackWait = 5 * 1000; // 5 secs before NATS re-sends an un-acked event.

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true) // We ack ourselves once the event was processed.
      .setDeliverAllAvailable() // Deliver all stored events the first time we subscribe.
      .setDurableName(this.queueGroupName) // Remember which events this queue group already processed.
      .setAckWait(this.ackWait);
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      // If onMessage throws we DON'T ack, so NATS re-sends the event after ackWait (e.g. an out-of-order ticket:updated).
      // Catching it here stops an unhandled promise rejection from crashing the whole service on newer Node versions.
      Promise.resolve()
        .then(() => this.onMessage(parsedData, msg))
        .catch((err) => console.error(`Error handling ${this.subject}, will retry:`, err.message));
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData(); // Either a string or a buffer.
    return typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString("utf8"));
  }
}
