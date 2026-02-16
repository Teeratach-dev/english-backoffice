import mongoose from "mongoose";
import "@/models/User";
import "@/models/Course";
import "@/models/Unit";
import "@/models/Topic";
import "@/models/SessionGroup";
import "@/models/SessionDetail";
import "@/models/SessionTemplate";

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/english-backoffice";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: any; // eslint-disable-line no-var
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Enable buffering to handle short temporary connection issues
      maxPoolSize: 10, // Limit pool size for serverless functions
      serverSelectionTimeoutMS: 10000, // Timeout to wait for server selection (Atlas wake up)
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
