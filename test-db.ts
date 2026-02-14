import mongoose from "mongoose";

async function testConn() {
  const uris = [
    process.env.MONGO_URI,
    "mongodb://localhost:27017/english-backoffice",
  ];

  for (const uri of uris) {
    if (!uri) continue;
    console.log(`Testing connection to: ${uri}`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log("SUCCESS: Connected to MongoDB");
      await mongoose.disconnect();
      return;
    } catch (error: unknown) {
      console.error(`FAILED: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

testConn();
