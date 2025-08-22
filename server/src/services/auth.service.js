import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function issueToken(user) {
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function register(name, email, password) {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("email_in_use");
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const u = await User.create({ name, email, passwordHash });
  return issueToken(u);
}

export async function login(email, password) {
  const u = await User.findOne({ email });
  if (!u) {
    const err = new Error("invalid_credentials");
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) {
    const err = new Error("invalid_credentials");
    err.status = 401;
    throw err;
  }
  return issueToken(u);
}
