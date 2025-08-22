import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/nextin";
  try {
    await mongoose.connect(url);
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] connection error:", err.message);
    process.exit(1);
  }
}
