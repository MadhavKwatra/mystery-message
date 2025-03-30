// lib/socketProvider.ts
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

// Extend global to include our Socket.IO instance
interface Global {
  io?: IOServer;
}

/**
 * Initialize or retrieve the existing Socket.IO instance.
 * @param server Optional HTTP server instance. Required on first call.
 * @returns Socket.IO server instance.
 */
export function getSocketServer(server?: HTTPServer): IOServer {
  if (!globalThis.io) {
    if (!server) {
      throw new Error(
        "Socket.IO is not initialized yet. Provide the HTTP server instance."
      );
    }
    globalThis.io = new IOServer(server, {
      // Add any options you need here.
      cors: {
        origin: "*"
      },
      transports: ["websocket"]
    });
    console.log("Socket.IO initialized.");
  }
  return globalThis.io;
}
