import { env } from "../config/env.js";

/**
 * Global error handler.
 * Attach after routes in src/index.js:
 *   app.use(errorHandler);
 */
export function errorHandler(err, _req, res, _next) {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.expose ? err.message : err.message || "server_error";

  if (env.NODE_ENV !== "production") {
    console.error("[err]", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      status,
    });
  }

  res.status(status).json({
    error: message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }), // include stack only in dev
  });
}
