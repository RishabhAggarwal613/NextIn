import { SOCKET_NAMESPACE, ROOM } from "../constants/index.js";

/**
 * Initializes the queue namespace for Socket.IO
 * Listens for room joins and provides a helper to emit to specific queues.
 *
 * Usage in src/index.js:
 *   import { initQueueNamespace } from "./sockets/queue.namespace.js";
 *   const nsp = initQueueNamespace(io);
 */
export function initQueueNamespace(io) {
  const nsp = io.of(SOCKET_NAMESPACE);

  nsp.on("connection", (socket) => {
    console.log("[ws] client connected to namespace:", SOCKET_NAMESPACE);

    socket.on("room:join", ({ queueId }) => {
      if (queueId) {
        socket.join(ROOM(queueId));
        console.log(`[ws] socket ${socket.id} joined room queue:${queueId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("[ws] client disconnected:", socket.id);
    });
  });

  // Add a helper so controllers/services can push updates:
  io.queueEmit = (queueId, event, payload) => {
    nsp.to(ROOM(queueId)).emit(event, payload);
  };

  return nsp;
}
