import { env } from "../config/env.js";

// --- simple anti-spam cooldown (per target) ---
const lastSent = new Map(); // key -> timestamp
const DEFAULT_COOLDOWN_MS = 30 * 1000;

function withinCooldown(key, ms = DEFAULT_COOLDOWN_MS) {
  const prev = lastSent.get(key) || 0;
  const now = Date.now();
  if (now - prev < ms) return true;
  lastSent.set(key, now);
  return false;
}

// --- helpers ---
const sanitizePhone = (p) => {
  if (!p) return null;
  const s = String(p).trim();
  const kept = s[0] === "+" ? "+" + s.slice(1).replace(/\D+/g, "") : s.replace(/\D+/g, "");
  if (kept.length < 7 || kept.length > 20) return null;
  return kept;
};

const clamp = (s, n) => (s || "").toString().slice(0, n);

// Dry run by default in non-prod; override with NOTIFY_DRY_RUN=true/false
const isDryRun = () => {
  const flag = String(process.env.NOTIFY_DRY_RUN || "").toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return env.NODE_ENV !== "production";
};

/**
 * SMS notify (stub).
 * @returns { ok, provider, dryRun, error? }
 */
export async function smsNotify(phone, text, opts = {}) {
  const to = sanitizePhone(phone);
  if (!to) return { ok: false, provider: "console", dryRun: true, error: "bad_phone" };

  if (withinCooldown(`sms:${to}`, opts.cooldownMs)) {
    return { ok: false, provider: "console", dryRun: true, error: "cooldown" };
  }

  const body = clamp(text, 480);
  const dryRun = opts.dryRun ?? isDryRun();

  // TODO: integrate Twilio here when ready
  if (dryRun) {
    console.log(`[sms:dry] -> ${to}: ${body}`);
    return { ok: true, provider: "console", dryRun: true };
  } else {
    // Example (when you add twilio):
    // const twilio = require("twilio")(env.TWILIO_SID, env.TWILIO_TOKEN);
    // const msg = await twilio.messages.create({ to, from: env.TWILIO_FROM, body });
    // return { ok: true, provider: "twilio", dryRun: false, id: msg.sid };
    console.log(`[sms] -> ${to}: ${body}`);
    return { ok: true, provider: "console", dryRun: false };
  }
}

/**
 * Push notify (stub).
 * @returns { ok, provider, dryRun, error? }
 */
export async function pushNotify(userId, title, body, opts = {}) {
  const uid = String(userId || "").trim();
  if (!uid) return { ok: false, provider: "console", dryRun: true, error: "bad_user" };

  if (withinCooldown(`push:${uid}`, opts.cooldownMs)) {
    return { ok: false, provider: "console", dryRun: true, error: "cooldown" };
  }

  const t = clamp(title, 80);
  const b = clamp(body, 500);
  const dryRun = opts.dryRun ?? isDryRun();

  // TODO: integrate FCM/Expo when ready
  if (dryRun) {
    console.log(`[push:dry] -> ${uid}: ${t} | ${b}`);
    return { ok: true, provider: "console", dryRun: true };
  } else {
    console.log(`[push] -> ${uid}: ${t} | ${b}`);
    return { ok: true, provider: "console", dryRun: false };
  }
}
