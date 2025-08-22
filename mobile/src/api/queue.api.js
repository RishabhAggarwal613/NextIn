import { api } from "./client";
export async function createQueue({ name }) {
  const { data } = await api.post("/api/v1/queues", { name });
  return data;
}
export async function getQueue(queueId) {
  const { data } = await api.get(`/api/v1/queues/${queueId}`);
  return data;
}
export async function joinQueue(queueId, { name, phone }) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/join`, { name, phone });
  return data;
}
export async function getStatus(queueId, ticket) {
  const { data } = await api.get(`/api/v1/queues/${queueId}/status`, { params: { ticket } });
  return data;
}
export async function serveNext(queueId) {
  const { data } = await api.post(`/api/v1/queues/${queueId}/next`);
  return data;
}
