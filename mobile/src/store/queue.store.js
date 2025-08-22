import { create } from "zustand";
export const useQueueStore = create((set) => ({
  queueId: null, ticket: null,
  position: null, ahead: null, total: null, isOpen: true, eta: null,
  nextTicket: null, servedTicket: null, avgServiceMs: null,
  setTicket(queueId, ticket) { set({ queueId, ticket }); },
  setFromMeta(m) { set({ queueId:m.queueId, total:m.total, nextTicket:m.nextTicket, servedTicket:m.servedTicket, avgServiceMs:m.avgServiceMs, isOpen:m.isOpen }); },
  setFromStatus(s) { set({ position:s.position, ahead:s.ahead, total:s.total, isOpen:s.isOpen, eta:s.eta, nextTicket:s.nextTicket, servedTicket:s.servedTicket, avgServiceMs:s.avgServiceMs }); },
  setFromUpdate(p) { set({ total:p.total, nextTicket:p.nextTicket, servedTicket:p.servedTicket, isOpen:p.isOpen ?? true }); },
}));
