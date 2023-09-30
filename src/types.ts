import { EventOptions } from "./interfaces";

export type ErrorHandlerFunction<T> = (
  error: Error,
  data: T,
  options?: EventOptions,
) => Promise<void>;

export type EventHandlerFunction<T> = (
  data: T,
  options?: EventOptions,
) => Promise<void>;
