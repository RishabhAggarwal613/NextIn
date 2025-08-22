import * as queueService from "../services/queue.service.js";
import { EVENTS } from "../constants/index.js";

const isValidQueueId = (s) => /^[A-Z2-9]{6}$/.test(String(s || ""));

const normQueueId = (s) => String(s || "").toUpperCase();

export async function postCreate(req, res, next) {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "unauthorized" });

    const name = (req.body?.name || "My Queue").toString().trim().slice(0, 60);
    const q = await queueService.createQueue(ownerId, name);

    return res.status(201).json({ queueId: q.queueId });
  } catch (e) {
    next(e);
  }
}

export async function getQueue(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });

    const meta = queueService.computeTotals(q);
    return res.json({
      queueId: q.queueId,
      name: q.name,
      isOpen: q.isOpen,
      ...meta,
      avgServiceMs: q.avgServiceMs,
    });
  } catch (e) {
    next(e);
  }
}

export async function postJoin(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const q = await queueService.getQueue(queueId);
    if (!q || !q.isOpen) return res.status(404).json({ error: "not_found_or_closed" });

    const name = (req.body?.name || "").toString().trim().slice(0, 60);
    const phoneRaw = req.body?.phone ? String(req.body.phone) : undefined;
    const phone = phoneRaw && phoneRaw.length <= 20 ? phoneRaw : undefined;
    if (!name) return res.status(400).json({ error: "name_required" });

    const out = await queueService.join(q, { name, phone });

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, EVENTS.QUEUE_UPDATE, {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    return res.json(out);
  } catch (e) {
    next(e);
  }
}

export async function getStatus(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const rawTicket = req.query.ticket;
    const ticket = Math.floor(Number(rawTicket));
    if (!Number.isFinite(ticket) || ticket < 1) {
      return res.status(400).json({ error: "invalid_ticket" });
    }

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });

    const position = Math.max(0, ticket - q.servedTicket);
    const ahead = Math.max(0, position - 1);
    const meta = queueService.computeTotals(q);
    const eta = queueService.eta(position, q.avgServiceMs);

    return res.json({
      position,
      ahead,
      total: meta.total,
      isOpen: q.isOpen,
      eta,
      nextTicket: meta.nextTicket,
      servedTicket: meta.servedTicket,
      avgServiceMs: q.avgServiceMs,
    });
  } catch (e) {
    next(e);
  }
}

export async function postNext(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });
    if (!q.isOpen) return res.status(409).json({ error: "queue_paused" });

    const out = await queueService.serveNext(q);

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, EVENTS.QUEUE_SERVED, {
        queueId: q.queueId,
        servedTicket: q.servedTicket,
      });
      io.queueEmit(q.queueId, EVENTS.QUEUE_UPDATE, {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    const meta = queueService.computeTotals(q);
    return res.json({ ...out, ...meta, isOpen: q.isOpen, avgServiceMs: q.avgServiceMs });
  } catch (e) {
    next(e);
  }
}

export async function postPause(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });

    q.isOpen = false;
    await q.save();

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, EVENTS.QUEUE_UPDATE, {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function postResume(req, res, next) {
  try {
    const queueId = normQueueId(req.params.queueId);
    if (!isValidQueueId(queueId)) return res.status(400).json({ error: "bad_queue_id" });

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });

    q.isOpen = true;
    await q.save();

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, EVENTS.QUEUE_UPDATE, {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    return res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
