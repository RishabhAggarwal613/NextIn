import { api } from "./client";

/** Create a queue (auth required) → { queueId } */
export async function createQueue({ name }) {
  const { data } = await api.post("/api/v1/queues", { name });
  return data;
}

/** Get queue meta (public) */
export async function getQueue(queueId) {
  const { data } = await api.get(`/api/v1/queues/${queueId}`);
  return data;
}

/** Join a queue (public) → { ticket, position, total } */
export async function joinQueue(queueId, { name, phone }) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/join`, { name, phone });
  return data;
}

/** Poll status (public) → { position, ahead, total, isOpen, eta, nextTicket, servedTicket, avgServiceMs } */
export async function getStatus(queueId, ticket) {
  const { data } = await api.get(`/api/v1/queues/${queueId}/status`, { params: { ticket } });
  return data;
}

/** Advance the queue (owner) */
export async function serveNext(queueId) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/next`);
  return data;
}

/** Pause / Resume (owner) */
export async function pauseQueue(queueId) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/pause`);
  return data;
}
export async function resumeQueue(queueId) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/resume`);
  return data;
}
