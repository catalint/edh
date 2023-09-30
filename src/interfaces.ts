import { ErrorHandlerFunction, EventHandlerFunction } from "./types";

export interface EventOptions {
  metadata: EventMetadata;
  stack: EventMetadata[];
}

export interface EventMetadata {
  eventType: string;
  eventId: string;
  timestamp: Date;
  handler?: {
    name: string;
    func: EventHandlerFunction<any>;
    onError?: ErrorHandlerFunction<any>;
  };
}

export interface EventHandler<T> {
  name: string;
  await: boolean;
  func: EventHandlerFunction<T>;
  onError?: ErrorHandlerFunction<T>;
}
