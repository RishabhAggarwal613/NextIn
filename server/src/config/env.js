import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/nextin",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};
