import { ErrorHandlerFunction, EventHandlerFunction } from "../types";

export interface EventHandler<T> {
  name: string;
  await: boolean;
  func: EventHandlerFunction<T>;
  onError?: ErrorHandlerFunction<T>;
}
