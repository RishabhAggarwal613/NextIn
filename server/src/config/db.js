import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/nextin";

  try {
    await mongoose.connect(url, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("[db] MongoDB connected:", url);
  } catch (err) {
    console.error("[db] connection error:", err.message);
    // Exit with failure so process managers (e.g. pm2, docker) restart correctly
    process.exit(1);
  }

  // Optional: handle runtime disconnects
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB error:", err.message);
  });
}

