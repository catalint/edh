import { EventMetadata } from "./interfaces";

export function getPrintableEventStack(stack: EventMetadata[]): string {
  return stack
    .map(
      (event) => `${event?.handler?.name}(${event.eventType}:${event.eventId})`,
    )
    .join(" -> ");
}

export function generateEventId(): string {
  return Math.random().toString(36).substring(2, 9);
}
