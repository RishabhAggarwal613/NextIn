import dotenv from "dotenv";
dotenv.config();

function requireEnv(name, fallback) {
  const value = process.env[name];
  if (value && value.trim() !== "") return value.trim();
  if (fallback !== undefined) return fallback;
  throw new Error(`[env] Missing required environment variable: ${name}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
  PORT: parseInt(process.env.PORT, 10) || 4000,
  MONGO_URL: requireEnv("MONGO_URL", "mongodb://127.0.0.1:27017/nextin"),
  JWT_SECRET: requireEnv("JWT_SECRET", "dev_secret"),
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : ["*"],
};
