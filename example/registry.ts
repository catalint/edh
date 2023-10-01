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
