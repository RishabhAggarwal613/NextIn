import Queue from "../models/Queue.js";
import { genQueueId } from "../utils/id.js";

/** Create a new queue owned by userId */
export async function createQueue(ownerId, name) {
  return Queue.create({
    queueId: genQueueId(),
    owner: ownerId,
    name: String(name || "My Queue").trim().slice(0, 60),
  });
}

/** Get queue by its public queueId (case-insensitive input) */
export async function getQueue(queueId) {
  const id = String(queueId || "").toUpperCase();
  return Queue.findOne({ queueId: id });
}

/** Compute waiting totals from counters */
export function computeTotals(q) {
  const issued = Math.max(0, (q.nextTicket ?? 1) - 1);   // tickets issued so far
  const served = Math.max(0, q.servedTicket ?? 0);       // last served ticket #
  const total = Math.max(0, issued - served);            // people currently waiting
  return {
    total,
    nextTicket: q.nextTicket,
    servedTicket: q.servedTicket,
  };
}

/** Join queue; returns { ticket, position, total } */
export async function join(q, { name, phone }) {
  // NOTE: This is simple and adequate for MVP. For full atomicity under heavy concurrency,
  // switch to a single "aggregation pipeline" findOneAndUpdate or a transaction.
  const ticket = q.nextTicket;
  q.nextTicket = ticket + 1;
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
  const previous = q.lastServedAt || now;
  const delta = now.getTime() - previous.getTime();

  // advance queue head
  q.servedTicket += 1;

  // drop already served entries for consistency (optional optimization)
  if (Array.isArray(q.entries) && q.entries.length) {
    q.entries = q.entries.filter((e) => e.ticket > q.servedTicket);
  }

  // update moving average of service time with clamps
  const n = Math.max(1, Math.min(q.statsWindow || 10, 100));
  const base = Number.isFinite(q.avgServiceMs) ? q.avgServiceMs : 5 * 60 * 1000;
  const updatedAvg = Math.round((base * (n - 1) + Math.max(1000, delta)) / n);
  q.avgServiceMs = Math.max(1000, updatedAvg); // ≥ 1s
  q.lastServedAt = now;

  await q.save();

  const { total } = computeTotals(q);
  return { servedTicket: q.servedTicket, total, avgServiceMs: q.avgServiceMs };
}

/** ETA in minutes range + confidence based on variability */
export function eta(position, avgServiceMs, stdMs) {
  const avg = Number.isFinite(avgServiceMs) ? avgServiceMs : 5 * 60 * 1000;
  const pos = Math.max(0, Number(position) || 0);
  const minutes = (pos * avg) / 60000;

  // spread: use provided std dev or fallback 20% (min 1 min)
  const spread =
    typeof stdMs === "number"
      ? Math.min(minutes * 0.5, stdMs / 60000)
      : Math.max(1, minutes * 0.2);

  const low = Math.max(0, Math.round(minutes - spread));
  const high = Math.round(minutes + spread);

  const ratio = typeof stdMs === "number" ? stdMs / Math.max(avg, 1) : 0.3;
  const confidence = ratio < 0.25 ? "high" : ratio < 0.5 ? "medium" : "low";

  return { low, high, confidence };
}
