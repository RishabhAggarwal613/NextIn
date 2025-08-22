import { env } from "../config/env.js";

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const DEFAULT_LEVEL = env.NODE_ENV === "production" ? "info" : "debug";
const ACTIVE_LEVEL =
  LEVELS[String(process.env.LOG_LEVEL || DEFAULT_LEVEL).toLowerCase()] ??
  LEVELS.info;

const COLORS =
  env.NODE_ENV === "production"
    ? { reset: "", dim: "", red: "", yellow: "", blue: "", gray: "" }
    : {
        reset: "\x1b[0m",
        dim: "\x1b[2m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        gray: "\x1b[90m",
      };

const redactKeys = /pass|secret|token|authorization|cookie/i;

function ts() {
  return new Date().toISOString();
}

function safe(val, depth = 0) {
  if (val == null) return String(val);
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    return (
      "[" +
      (depth > 1 ? "…" : val.map((v) => safe(v, depth + 1)).join(", ")) +
      "]"
    );
  }
  if (typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = redactKeys.test(k) ? "***" : depth > 1 ? "…" : safe(v, depth + 1);
    }
    try {
      return JSON.stringify(out);
    } catch {
      return "[Object]";
    }
  }
  try {
    return String(val);
  } catch {
    return "[Unprintable]";
  }
}

function fmtCtx(ctx) {
  if (!ctx || typeof ctx !== "object") return "";
  const pairs = Object.entries(ctx)
    .map(([k, v]) => `${k}=${safe(v)}`)
    .join(" ");
  return pairs ? ` ${COLORS.gray}{ ${pairs} }${COLORS.reset}` : "";
}

function makePrinter(levelName, color, ctx) {
  const level = LEVELS[levelName];
  return (msg, ...args) => {
    if (level > ACTIVE_LEVEL) return;
    const line =
      `${COLORS.dim}[${ts()}]${COLORS.reset} ` +
      `${color}[${levelName}]${COLORS.reset} ` +
      String(msg) +
      (args.length ? " " + args.map((a) => safe(a)).join(" ") : "") +
      fmtCtx(ctx);
    const sink =
      levelName === "error"
        ? console.error
        : levelName === "warn"
        ? console.warn
        : console.log;
    sink(line);
  };
}

export function createLogger(context = {}) {
  const base = {
    error: makePrinter("error", COLORS.red, context),
    warn: makePrinter("warn", COLORS.yellow, context),
    info: makePrinter("info", COLORS.blue, context),
    debug: makePrinter("debug", COLORS.gray, context),

    /** Time a block of work. Usage:
     *   const end = logger.time("joinQueue");
     *   ...work...
     *   end();  // logs "joinQueue completed in 42ms"
     */
    time(label = "op", level = "debug") {
      const start = Date.now();
      return () =>
        base[level]?.(`${label} completed in ${Date.now() - start}ms`);
    },

    /** Child logger with merged context */
    child(extra = {}) {
      return createLogger({ ...context, ...extra });
    },
  };
  return base;
}

// Default app logger
export const logger = createLogger();
