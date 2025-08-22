// src/routes/queue.routes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  postCreate,
  getQueue,
  postJoin,
  getStatus,
  postNext,
  postPause,
  postResume,
} from "../controllers/queue.controller.js";

const router = Router();

/**
 * @route POST /api/v1/queues
 * @desc Create a new queue (client only)
 * @auth Required
 */
router.post("/", auth, postCreate);

/**
 * @route GET /api/v1/queues/:queueId
 * @desc Get queue metadata
 */
router.get("/:queueId", getQueue);

/**
 * @route POST /api/v1/queues/:queueId/join
 * @desc Join a queue as customer
 */
router.post("/:queueId/join", postJoin);

/**
 * @route GET /api/v1/queues/:queueId/status?ticket=NN
 * @desc Poll ticket status
 */
router.get("/:queueId/status", getStatus);

/**
 * @route POST /api/v1/queues/:queueId/next
 * @desc Advance queue (owner only)
 * @auth Required
 */
router.post("/:queueId/next", auth, postNext);

/**
 * @route POST /api/v1/queues/:queueId/pause
 * @desc Pause queue (owner only)
 * @auth Required
 */
router.post("/:queueId/pause", auth, postPause);

/**
 * @route POST /api/v1/queues/:queueId/resume
 * @desc Resume queue (owner only)
 * @auth Required
 */
router.post("/:queueId/resume", auth, postResume);

export default router;
