import { api } from "./client";

// ===== Auth =====
export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// ===== Queue =====
export const createQueue = (name) =>
  api.post("/queues", { name });

export const getQueue = (queueId) =>
  api.get(`/queues/${queueId}`);

export const joinQueue = (queueId, name, phone) =>
  api.post(`/queues/${queueId}/join`, { name, phone });

export const getStatus = (queueId, ticket) =>
  api.get(`/queues/${queueId}/status`, { params: { ticket } });

export const nextServe = (queueId) =>
  api.post(`/queues/${queueId}/next`);

export const pauseQueue = (queueId) =>
  api.post(`/queues/${queueId}/pause`);

export const resumeQueue = (queueId) =>
  api.post(`/queues/${queueId}/resume`);
