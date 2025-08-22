
// ====== Socket ======
export const SOCKET_NAMESPACE = "/q";
export const ROOM = (queueId) => `queue:${queueId}`;

// ====== Queue ID ======
export const QUEUE_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const QUEUE_ID_LENGTH = 6;

// ====== Socket Events ======
export const EVENTS = Object.freeze({
  ROOM_JOIN: "room:join",
  QUEUE_UPDATE: "queue:update",
  QUEUE_SERVED: "queue:served",
});

// ====== User Roles ======
export const ROLES = Object.freeze({
  CLIENT: "client",
  CUSTOMER: "customer",
});
