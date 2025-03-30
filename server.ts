import { createServer, IncomingMessage, ServerResponse } from "node:http";
import next from "next";
import { getSocketServer } from "./socketProvider";

const dev = process.env.NODE_ENV !== "production";
console.log(process.env.NODE_ENV, "HELLO");
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = getSocketServer(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinRoom", (username) => {
      if (!username) {
        console.log("❌ Username is missing in joinRoom event.");
        return;
      }
      socket.join(username);
      console.log(`User ${username} joined room`);
      console.log(`🔍 Rooms after join:`, io.sockets.adapter.rooms);
    });

    socket.on("newMessage", async (messageData) => {
      const { username, message } = messageData; // Extract recipient username
      console.log(`New message received for ${username}: ${message}`);

      if (!messageData || !messageData.username || !messageData.message) {
        console.log("Invalid message data received:", messageData);
        return;
      }

      // Check if username is active
      const recipientSockets = io.sockets.adapter.rooms.get(username);
      if (!recipientSockets || recipientSockets.size === 0) {
        console.log(`User ${username} is not online. Message not delivered.`);
        return;
      }

      // Emit to the recipient's room (identified by their username):
      io.to(username).emit("newMessage", { message });
    });

    // socket.io logic here
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
