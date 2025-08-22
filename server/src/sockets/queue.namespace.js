import { SOCKET_NAMESPACE, ROOM, EVENTS } from "../constants/index.js";

const isValidQueueId = (s) => /^[A-Z2-9]{6}$/.test(String(s || "").toUpperCase());

/**
 * Initialize the queue namespace and attach a room emitter helper.
 * Usage in src/index.js:
 *   import { initQueueNamespace } from "./sockets/queue.namespace.js";
 *   initQueueNamespace(io);
 */
export function initQueueNamespace(io) {
  const nsp = io.of(SOCKET_NAMESPACE);

  // Expose a single helper to emit to a queue room (id normalized)
  if (!io.queueEmit) {
    io.queueEmit = (queueId, event, payload) => {
      const id = String(queueId || "").toUpperCase();
      if (!isValidQueueId(id)) return;
      nsp.to(ROOM(id)).emit(event, payload);
    };
  }

  nsp.on("connection", (socket) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[ws] connected ${socket.id} -> ${SOCKET_NAMESPACE}`);
    }

    // Client asks to join a queue room
    socket.on(EVENTS.ROOM_JOIN, (data = {}, ack) => {
      const id = String(data.queueId || "").toUpperCase();
      if (!isValidQueueId(id)) {
        if (typeof ack === "function") ack({ ok: false, error: "bad_queue_id" });
        return;
      }
      socket.join(ROOM(id));
      if (typeof ack === "function") ack({ ok: true, room: ROOM(id) });

      if (process.env.NODE_ENV !== "production") {
        console.log(`[ws] ${socket.id} joined ${ROOM(id)}`);
      }
    });

    socket.on("disconnect", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[ws] disconnected ${socket.id}`);
      }
    });
  });

  return nsp;
}
