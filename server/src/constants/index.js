// src/constants/index.js

// Socket namespace
export const SOCKET_NAMESPACE = "/q";

// Helper to format room name
export const ROOM = (queueId) => `queue:${queueId}`;

// Queue ID generator alphabet & length
export const QUEUE_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const QUEUE_ID_LENGTH = 6;

// Event names (Socket.IO)
export const EVENTS = {
  QUEUE_UPDATE: "queue:update",
  QUEUE_SERVED: "queue:served",
  ROOM_JOIN: "room:join"
};

// Roles (for clarity)
export const ROLES = {
  CLIENT: "client",
  CUSTOMER: "customer"
};
