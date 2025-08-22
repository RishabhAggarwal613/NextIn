// src/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import { initQueueNamespace } from "./sockets/queue.namespace.js";

import authRoutes from "./routes/auth.routes.js";
import queueRoutes from "./routes/queue.routes.js";

// ====== Express ======
const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ====== HTTP + Socket.IO ======
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.CORS_ORIGIN } });

// Make io available to controllers via req.app.get("io")
app.set("io", io);

// Socket namespace (rooms + io.queueEmit helper)
initQueueNamespace(io);

// ====== Routes ======
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/queues", queueRoutes);

// ====== Error handler (keep last) ======
app.use(errorHandler);

// ====== Start ======
(async () => {
  try {
    await connectDB();
    server.listen(env.PORT, () => {
      console.log(`[srv] NextIn API http://localhost:${env.PORT}`);
    });
  } catch (e) {
    console.error("[boot] Failed to start:", e);
    process.exit(1);
  }
})();

// ====== Graceful shutdown ======
const shutdown = async (sig) => {
  try {
    console.log(`\n[${sig}] shutting down...`);
    await io.close();
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  } catch (e) {
    console.error("[shutdown] error:", e);
    process.exit(1);
  }
};
["SIGINT", "SIGTERM"].forEach((s) => process.on(s, () => shutdown(s)));
