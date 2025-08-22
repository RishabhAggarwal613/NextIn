import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

// Normalize helpers
const normEmail = (s) => String(s || "").trim().toLowerCase();
const safeUser = (u) => ({ id: String(u.id), name: u.name, email: u.email });

function issueToken(user) {
  const payload = { sub: String(user.id), email: user.email, name: user.name };
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
    // issuer/audience are optional; uncomment if you enforce them on verify
    // issuer: "nextin.api",
    // audience: "nextin.app",
  });
  return { token, user: safeUser(user) };
}

export async function register(name, email, password) {
  const emailL = normEmail(email);

  // Fast pre-check to avoid hash work on obvious dupes
  const exists = await User.findOne({ email: emailL }).lean();
  if (exists) {
    const err = new Error("email_in_use");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

  try {
    const u = await User.create({ name: String(name).trim(), email: emailL, passwordHash });
    return issueToken(u);
  } catch (e) {
    // Handle race condition: unique index violation
    if (e && e.code === 11000) {
      const err = new Error("email_in_use");
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

export async function login(email, password) {
  const emailL = normEmail(email);

  const u = await User.findOne({ email: emailL });
  // Use the same error message to avoid leaking which part failed
  const bad = () => {
    const err = new Error("invalid_credentials");
    err.status = 401;
    return err;
  };

  if (!u) throw bad();

  const ok = await bcrypt.compare(String(password), u.passwordHash);
  if (!ok) throw bad();

  return issueToken(u);
}
