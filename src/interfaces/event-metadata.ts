import { ErrorHandlerFunction, EventHandlerFunction } from "../types";

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
