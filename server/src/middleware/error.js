/**
 * Global error handler.
 * Attach after routes in src/index.js:
 *   app.use(errorHandler);
 */
export function errorHandler(err, _req, res, _next) {
  const code = err.status || 500;
  const message = err.message || "server_error";

  if (process.env.NODE_ENV !== "production") {
    console.error("[err]", err);
  }

  res.status(code).json({ error: message });
}
