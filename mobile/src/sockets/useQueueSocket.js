import { useEffect, useRef } from "react";
import { socket } from "./socket";

export default function useQueueSocket(queueId, onUpdate) {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!queueId) return;
    if (!socket.connected) socket.connect();

    if (!joinedRef.current) {
      socket.emit("room:join", { queueId }, (ack) => {
        joinedRef.current = ack?.ok ?? true;
      });
    }

    const handleUpdate = (payload) => { if (payload?.queueId === queueId) onUpdate?.(payload); };
    socket.on("queue:update", handleUpdate);

    return () => { socket.off("queue:update", handleUpdate); };
  }, [queueId, onUpdate]);
}
