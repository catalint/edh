import { AsyncLocalStorage } from "node:async_hooks";
import { EventHandler, EventMetadata } from "./interfaces";
import { generateEventId, getPrintableEventStack } from "./lib";

const asyncLocalStorage = new AsyncLocalStorage();

export class EventEmitterH<MyEvents> {
  private handlers: {
    [EventKey in keyof MyEvents & string]?: EventHandler<MyEvents[EventKey]>[];
  } = {};

  private debugMode: boolean = false;

  setDebugMode(debugMode: boolean) {
    this.debugMode = debugMode;
  }

  on<EventKey extends keyof MyEvents & string>(
    event: EventKey,
    listener: EventHandler<MyEvents[EventKey]>,
  ): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]?.push(listener);
  }

  async emit<EventKey extends keyof MyEvents & string>(
    eventType: EventKey,
    data: MyEvents[EventKey],
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const metadata: EventMetadata = {
        eventType: eventType.toString(),
        eventId: generateEventId(),
        timestamp: new Date(),
      };

      const handlers = this.handlers[eventType];

      if (handlers) {
        const stack = (asyncLocalStorage.getStore() as EventMetadata[]) || [];

        const promises: Promise<void>[] = handlers.map((handler) =>
          this.emitHandler<EventKey>(handler, metadata, stack, data),
        );

        try {
          await Promise.allSettled(promises);
          if (this.debugMode) {
            console.log(
              `[EventEmitter] [ALL_DONE] Handling all event listeners of ${metadata.eventType}`,
            );
          }
          resolve();
        } catch (error) {
          await this.handleError(error, metadata, stack);
          reject(error);
        }
      } else {
        if (this.debugMode) {
          console.log(
            `[EventEmitter] [ALL_DONE] No event listener for ${metadata.eventType}`,
          );
        }
        resolve();
      }
    });
  }

  private async emitHandler<EventKey extends keyof MyEvents>(
    handler: EventHandler<MyEvents[EventKey]>,
    metadata: EventMetadata,
    stack: EventMetadata[],
    data: MyEvents[EventKey],
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const handlerMetadata: EventMetadata = {
        ...metadata,
        handler,
      };
      const runHandler = async () => {
        try {
          if (this.debugMode) {
            console.log(
              `[EventEmitter] [START] `,
              getPrintableEventStack([...stack, handlerMetadata]),
            );
          }
          if (handler.await) {
            await handler.func(data, {
              metadata: handlerMetadata,
              stack,
            });
          } else {
            handler
              .func(data, {
                metadata: handlerMetadata,
                stack,
              })
              .catch((error) =>
                this.catchError(error, data, handler, handlerMetadata, stack),
              );
          }

          if (this.debugMode) {
            console.log(
              `[EventEmitter] [DONE]`,
              getPrintableEventStack([...stack, handlerMetadata]),
            );
          }
        } catch (error) {
          await this.catchError(error, data, handler, handlerMetadata, stack);
        }
        resolve();
      };

      await asyncLocalStorage.run([...stack, handlerMetadata], runHandler);
    });
  }

  private async handleError(
    error: Error,
    handlerMetadata: EventMetadata,
    stack: EventMetadata[],
  ) {
    error.message = `[EventEmitter] [ERROR] ${
      error.message
    } ${getPrintableEventStack([...stack, handlerMetadata])}`;
    console.error(error);
    // Handle additional error handling logic here
    // Log to error monitoring services, etc.
  }

  private async catchError<EventKey extends keyof MyEvents>(
    error: Error,
    data: MyEvents[EventKey],
    handler: EventHandler<MyEvents[EventKey]>,
    handlerMetadata: EventMetadata,
    stack: EventMetadata[],
  ) {
    if (handler.onError) {
      try {
        await handler.onError(error, data, {
          metadata: handlerMetadata,
          stack,
        });
      } catch (onError) {
        await this.handleError(error, handlerMetadata, stack);
        await this.handleError(onError, handlerMetadata, stack);
      }
    } else {
      await this.handleError(error, handlerMetadata, stack);
    }
  }
}
