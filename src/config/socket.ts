"use client";

import { io, Socket } from "socket.io-client";
let socket: Socket;

export const getSocket = (): Socket => {
  if (socket) return socket;
  socket = io({
    transports: ["websocket"],
    withCredentials: true
  });
  return socket;
};
