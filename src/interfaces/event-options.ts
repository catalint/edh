import { EventMetadata } from "./event-metadata";

export interface EventOptions {
  metadata: EventMetadata;
  stack: EventMetadata[];
}
