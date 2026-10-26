// All copies (pods) of the tickets service share this queue group, so each event is handled by only ONE of them.
export const queueGroupName = "tickets-service";
