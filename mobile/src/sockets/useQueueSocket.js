import { useEffect, useRef } from "react";
import { socket, ensureSocket } from "./socket";

/**
 * Subscribe to queue room updates.
 * - Joins the room for `queueId`
 * - Listens to "queue:update" events and calls onUpdate(payload)
 */
export default function useQueueSocket(queueId, onUpdate) {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!queueId) return;

    ensureSocket();

    // Join the room once per queueId
    if (!joinedRef.current) {
      socket.emit("room:join", { queueId });
      joinedRef.current = true;
    }

    const handleUpdate = (payload) => {
      if (payload?.queueId === queueId) onUpdate?.(payload);
    };

    socket.on("queue:update", handleUpdate);

    return () => {
      socket.off("queue:update", handleUpdate);
      joinedRef.current = false;
      // (server doesn't implement "leave"; removing listeners is enough)
    };
  }, [queueId, onUpdate]);
}
