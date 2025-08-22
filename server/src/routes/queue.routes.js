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

// Create a queue (client only)
router.post("/", auth, postCreate);

// Get queue meta (public)
router.get("/:queueId", getQueue);

// Join a queue (public)
router.post("/:queueId/join", postJoin);

// Poll status for a ticket (public)
router.get("/:queueId/status", getStatus);

// Serve next in queue (owner only)
router.post("/:queueId/next", auth, postNext);

// Pause / Resume (owner only)
router.post("/:queueId/pause", auth, postPause);
router.post("/:queueId/resume", auth, postResume);

export default router;
