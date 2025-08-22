import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

function extractBearer(req) {
  const h = req.headers?.authorization || req.headers?.Authorization || "";
  // allow case-insensitive "Bearer"
  const [scheme, token] = String(h).split(" ");
  if (scheme && /^Bearer$/i.test(scheme) && token) return token.trim();
  return null;
}

/**
 * Auth middleware for protected routes.
 * Expects: Authorization: Bearer <token>
 * On success: attaches req.user = { id, email, name }
 */
export function auth(req, res, next) {
  const token = extractBearer(req);

  if (!token) {
    res.set("WWW-Authenticate", 'Bearer realm="NextIn", error="invalid_request"');
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET); // honors exp/nbf
    if (!payload?.sub) {
      return res.status(401).json({ error: "invalid_token" });
    }

    req.user = {
      id: String(payload.sub),
      email: payload.email,
      name: payload.name,
    };
    req.token = token; // optional: may help with audits/logging
    return next();
  } catch (err) {
    const code = err?.name === "TokenExpiredError" ? 401 : 401;
    const error =
      err?.name === "TokenExpiredError"
        ? "token_expired"
        : err?.name === "JsonWebTokenError"
        ? "invalid_token"
        : "unauthorized";

    // Hint to clients how to re-auth
    res.set(
      "WWW-Authenticate",
      `Bearer realm="NextIn", error="${error}"`
    );
    return res.status(code).json({ error });
  }
}
