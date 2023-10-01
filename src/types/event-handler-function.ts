import { EventOptions } from "../interfaces";

export type EventHandlerFunction<T> = (
  data: T,
  options?: EventOptions,
) => Promise<void>;
