import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_NAMESPACE } from "../config/env";

// Single shared socket instance
export const socket = io(SOCKET_URL + SOCKET_NAMESPACE, {
  autoConnect: false,
  transports: ["websocket"],
});

/** Ensure the socket is connected (idempotent) */
export function ensureSocket() {
  if (!socket.connected) {
    try {
      socket.connect();
    } catch {}
  }
}
