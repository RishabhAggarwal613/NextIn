import jwt from "jsonwebtoken";

/**
 * Auth middleware for protected routes.
 * Expects Authorization: Bearer <token>
 */
export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
