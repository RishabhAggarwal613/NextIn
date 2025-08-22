import { create } from "zustand";

export const useQueueStore = create((set) => ({
  // identity
  queueId: null,
  ticket: null,

  // status
  position: null,
  ahead: null,
  total: null,
  isOpen: true,
  eta: null,
  nextTicket: null,
  servedTicket: null,
  avgServiceMs: null,

  // actions
  setTicket(queueId, ticket) {
    set({ queueId, ticket });
  },

  // meta from GET /queues/:id
  setFromMeta(meta) {
    set({
      queueId: meta.queueId,
      total: meta.total,
      nextTicket: meta.nextTicket,
      servedTicket: meta.servedTicket,
      avgServiceMs: meta.avgServiceMs,
      isOpen: meta.isOpen,
    });
  },

  // status from GET /queues/:id/status
  setFromStatus(s) {
    set({
      position: s.position,
      ahead: s.ahead,
      total: s.total,
      isOpen: s.isOpen,
      eta: s.eta,
      nextTicket: s.nextTicket,
      servedTicket: s.servedTicket,
      avgServiceMs: s.avgServiceMs,
    });
  },

  // realtime from socket "queue:update"
  setFromUpdate(p) {
    set({
      total: p.total ?? null,
      nextTicket: p.nextTicket ?? null,
      servedTicket: p.servedTicket ?? null,
      isOpen: p.isOpen ?? true,
    });
  },
}));
