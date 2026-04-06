import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

mongoose.set("strictQuery", false);

const baseOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

const connect = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
    });
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "appdb",
      ...baseOptions,
      ...(MONGO_URI.startsWith("mongodb+srv://") ? {} : { family: 4 }),
    });

    isConnected = true;

    mongoose.connection.on("connected", () => { isConnected = true; });
    mongoose.connection.on("error",     () => { isConnected = false; });
    mongoose.connection.on("disconnected", () => { isConnected = false; });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    return mongoose.connection;
  } catch (err: any) {
    isConnected = false;
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
};

export default connect;