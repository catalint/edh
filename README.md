# Event Driven Helper

This is a POC , don't use this

## Why do it?

I wanted to create a simple event emitter POC that would allow me keep a stack trace of the event emitter calls. This is useful for debugging and auditing purposes.

## How?

Using async context

## Please investigate other packages before using this one

https://www.npmjs.com/package/typed-emitter

https://www.npmjs.com/package/eventemitter3


## Example

```typescript
// Example usage

import { EventEmitterH } from "../src";

interface MyEvents {
    userLoggedIn: { username: string };
    messageReceived: { sender: string; message: string };
    messageReceived2: { sender: string; message: string };
    // Add more event types as needed
}

const eventEmitter = new EventEmitterH<MyEvents>();

eventEmitter.setDebugMode(true);

eventEmitter.on("userLoggedIn", {
    name: "userLoginHandler",
    await: true,
    func: async () => {
        await eventEmitter.emit("messageReceived", {
            sender: "john_doe",
            message: "Hello World!",
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("User login handling completed.");
    },
});

eventEmitter.on("messageReceived", {
    name: "messageReceivedHandler",
    await: true,
    func: async () => {
        await eventEmitter.emit("messageReceived2", {
            sender: "john_doe",
            message: "Hello World!",
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
    },
});

eventEmitter.on("messageReceived2", {
    name: "messageReceivedHandler2",
    await: true,
    func: async () => {
        throw new Error("Error in messageReceivedHandler2");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    },
});

// Emit event and handle the promise
eventEmitter
    .emit("userLoggedIn", { username: "john_doe" })
    .then(() => {
        console.log("All handlers completed.");
    })
    .catch((error) => {
        console.error("Error:", error);
    });



// Output
// [EventEmitter] [START]  userLoginHandler(userLoggedIn:81os0jt)
// [EventEmitter] [START]  userLoginHandler(userLoggedIn:81os0jt) -> messageReceivedHandler(messageReceived:yw2cka7)
// [EventEmitter] [START]  userLoginHandler(userLoggedIn:81os0jt) -> messageReceivedHandler(messageReceived:yw2cka7) -> messageReceivedHandler2(messageReceived2:ajl0cv7)
// Error: [EventEmitter] [ERROR] Error in messageReceivedHandler2 userLoginHandler(userLoggedIn:81os0jt) -> messageReceivedHandler(messageReceived:yw2cka7) -> messageReceivedHandler2(messageReceived2:ajl0cv7)
// [EventEmitter] [ALL_DONE] Handling all event listeners of messageReceived2
// [EventEmitter] [DONE] userLoginHandler(userLoggedIn:81os0jt) -> messageReceivedHandler(messageReceived:yw2cka7)
// [EventEmitter] [ALL_DONE] Handling all event listeners of messageReceived
// User login handling completed.
// [EventEmitter] [DONE] userLoginHandler(userLoggedIn:81os0jt)
// [EventEmitter] [ALL_DONE] Handling all event listeners of userLoggedIn

```