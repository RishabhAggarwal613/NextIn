import Queue from "../models/Queue.js";
import { customAlphabet } from "nanoid";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const genQueueId = customAlphabet(ALPHABET, 6);

/** Create a new queue owned by userId */
export async function createQueue(ownerId, name) {
  return Queue.create({
    queueId: genQueueId(),
    owner: ownerId,
    name,
  });
}

/** Get queue by its public queueId */
export async function getQueue(queueId) {
  return Queue.findOne({ queueId });
}

/** Compute waiting totals from counters */
export function computeTotals(q) {
  // tickets issued go from 1..(nextTicket-1); servedTicket is last served
  const total = q.nextTicket - q.servedTicket - 1;
  return {
    total: Math.max(0, total),
    nextTicket: q.nextTicket,
    servedTicket: q.servedTicket,
  };
}

/** Join queue; returns { ticket, position, total } */
export async function join(q, { name, phone }) {
  const ticket = q.nextTicket++;
  q.entries.push({ name, phone, ticket });
  await q.save();
  const position = Math.max(0, ticket - q.servedTicket);
  const { total } = computeTotals(q);
  return { ticket, position, total };
}

/** Serve next: advances servedTicket and updates avg service time */
export async function serveNext(q) {
  // nothing to serve
  if (q.servedTicket >= q.nextTicket - 1) {
    return { empty: true };
  }

  const now = new Date();
  // compute delta between serves (ms)
  const previous = q.lastServedAt || now;
  const delta = now.getTime() - previous.getTime();

  // advance queue head
  q.servedTicket += 1;

  // drop already served entries for consistency (optional optimization)
  q.entries = q.entries.filter((e) => e.ticket > q.servedTicket);

  // update moving average of service time
  const n = q.statsWindow || 10;
  q.avgServiceMs = Math.round((q.avgServiceMs * (n - 1) + delta) / n);
  q.lastServedAt = now;

  await q.save();

  const { total } = computeTotals(q);
  return { servedTicket: q.servedTicket, total, avgServiceMs: q.avgServiceMs };
}

/** ETA in minutes range + confidence based on variability */
export function eta(position, avgServiceMs, stdMs) {
  const minutes = Math.max(0, position) * (avgServiceMs / 60000);
  // spread: use provided std dev or fallback 20% of estimate (min 1 min)
  const spread =
    typeof stdMs === "number"
      ? Math.min(minutes * 0.5, stdMs / 60000)
      : Math.max(1, minutes * 0.2);

  const low = Math.max(0, Math.round(minutes - spread));
  const high = Math.round(minutes + spread);

  const ratio =
    typeof stdMs === "number" ? stdMs / Math.max(avgServiceMs, 1) : 0.3;

  const confidence = ratio < 0.25 ? "high" : ratio < 0.5 ? "medium" : "low";
  return { low, high, confidence };
}
