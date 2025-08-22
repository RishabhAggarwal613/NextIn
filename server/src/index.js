// src/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { env } from "./config/env.js";              // ← centralized env
import authRoutes from "./routes/auth.routes.js";
import queueRoutes from "./routes/queue.routes.js";

dotenv.config();

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

// Socket namespace + room joins
const SOCKET_NAMESPACE = "/q";
const ROOM = (id) => `queue:${id}`;

io.of(SOCKET_NAMESPACE).on("connection", (socket) => {
  socket.on("room:join", ({ queueId }) => {
    if (queueId) socket.join(ROOM(queueId));
  });
});

// Convenience emitter for queue rooms
io.queueEmit = (queueId, event, payload) => {
  io.of(SOCKET_NAMESPACE).to(ROOM(queueId)).emit(event, payload);
};

// ====== Routes ======
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/queues", queueRoutes);

// ====== Error handler (keep last) ======
app.use((err, _req, res, _next) => {
  const code = err.status || 500;
  if (env.NODE_ENV !== "production") console.error(err);
  res.status(code).json({ error: err.message || "server_error" });
});

// ====== Start ======
(async () => {
  try {
    await mongoose.connect(env.MONGO_URL, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("[db] MongoDB connected");

    server.listen(env.PORT, () => {
      console.log(`[srv] NextIn API running at http://localhost:${env.PORT}`);
      console.log(`[ws ] Socket namespace ready at ${SOCKET_NAMESPACE}`);
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
