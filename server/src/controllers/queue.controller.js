// src/controllers/queue.controller.js
import * as queueService from "../services/queue.service.js";

/**
 * POST /api/v1/queues
 * auth required
 * body: { name }
 */
export async function postCreate(req, res, next) {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ error: "unauthorized" });

    const name = (req.body?.name || "My Queue").toString().slice(0, 60);
    const q = await queueService.createQueue(ownerId, name);

    res.json({ queueId: q.queueId });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/v1/queues/:queueId
 */
export async function getQueue(req, res, next) {
  try {
    const { queueId } = req.params;
    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });

    const meta = queueService.computeTotals(q);
    res.json({
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

/**
 * POST /api/v1/queues/:queueId/join
 * body: { name, phone? }
 */
export async function postJoin(req, res, next) {
  try {
    const { queueId } = req.params;
    const q = await queueService.getQueue(queueId);
    if (!q || !q.isOpen) return res.status(404).json({ error: "not_found_or_closed" });

    const name = (req.body?.name || "").toString().trim();
    const phone = req.body?.phone ? String(req.body.phone) : undefined;
    if (!name) return res.status(400).json({ error: "name_required" });

    const out = await queueService.join(q, { name, phone });

    // Emit real-time update
    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, "queue:update", {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
      });
    }

    res.json(out);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/v1/queues/:queueId/status?ticket=NN
 */
export async function getStatus(req, res, next) {
  try {
    const { queueId } = req.params;
    const ticket = Number(req.query.ticket);
    if (!Number.isFinite(ticket)) return res.status(400).json({ error: "invalid_ticket" });

    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });

    const position = Math.max(0, ticket - q.servedTicket);
    const ahead = Math.max(0, position - 1);
    const { total } = queueService.computeTotals(q);
    const eta = queueService.eta(position, q.avgServiceMs);

    res.json({ position, ahead, total, isOpen: q.isOpen, eta });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/v1/queues/:queueId/next
 * auth required (owner only)
 */
export async function postNext(req, res, next) {
  try {
    const { queueId } = req.params;
    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });

    const out = await queueService.serveNext(q);

    // Emit served + update events
    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, "queue:served", { queueId: q.queueId, servedTicket: q.servedTicket });
      io.queueEmit(q.queueId, "queue:update", {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
      });
    }

    res.json(out);
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/v1/queues/:queueId/pause
 * auth required (owner)
 */
export async function postPause(req, res, next) {
  try {
    const { queueId } = req.params;
    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });

    q.isOpen = false;
    await q.save();

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, "queue:update", {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/v1/queues/:queueId/resume
 * auth required (owner)
 */
export async function postResume(req, res, next) {
  try {
    const { queueId } = req.params;
    const q = await queueService.getQueue(queueId);
    if (!q) return res.status(404).json({ error: "not_found" });
    if (String(q.owner) !== req.user?.id) return res.status(403).json({ error: "forbidden" });

    q.isOpen = true;
    await q.save();

    const io = req.app.get("io");
    if (io?.queueEmit) {
      io.queueEmit(q.queueId, "queue:update", {
        queueId: q.queueId,
        ...queueService.computeTotals(q),
        isOpen: q.isOpen,
      });
    }

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
