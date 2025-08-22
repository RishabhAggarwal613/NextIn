// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";

/**
 * POST /api/v1/auth/register
 * body: { name, email, password }
 */
export async function postRegister(req, res, next) {
  try {
    let { name, email, password } = req.body || {};
    name = typeof name === "string" ? name.trim() : "";
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password : "";

    if (!name || !email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "weak_password" });
    }

    const out = await authService.register(name, email, password);
    return res.status(201).json(out);
  } catch (e) {
    // surface known service errors with status if present
    if (e.status) return res.status(e.status).json({ error: e.message });
    return next(e);
  }
}

/**
 * POST /api/v1/auth/login
 * body: { email, password }
 */
export async function postLogin(req, res, next) {
  try {
    let { email, password } = req.body || {};
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password : "";

    if (!email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const out = await authService.login(email, password);
    return res.status(200).json(out);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ error: e.message });
    return next(e);
  }
}
