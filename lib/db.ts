import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

// Configure mongoose for better connection handling
mongoose.set('strictQuery', false);

// Connection options
const baseOptions = {
  bufferCommands: false, // Disable buffering
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of 30s
  socketTimeoutMS: 45000,
};

let isConnected = false;

const connect = async () => {
  // Ensure MONGO_URI is present when attempting to connect. We avoid throwing
  // at import time so server-side builds or preview environments without a
  // configured DB don't crash during static analysis.
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured. Set MONGO_URI in environment to connect to MongoDB.');
  }
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ MongoDB connection in progress...");
    // Wait for the connection to complete
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return mongoose.connection;
  }

  try {
    console.log("🔄 Creating new MongoDB connection...");
    
    // Use a configurable DB name for templates. Replace with your DB name
    // or set the `MONGO_DB_NAME` env var when deploying.
    const connectOptions = {
      dbName: process.env.MONGO_DB_NAME || "appdb",
      ...baseOptions,
      // SRV URIs rely on DNS seedlist; avoid forcing family to 4 in that case
      ...(MONGO_URI.startsWith("mongodb+srv://") ? {} : { family: 4 }),
    };

    await mongoose.connect(MONGO_URI!, connectOptions);

    isConnected = true;
    console.log("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (err: any) {
    isConnected = false;
    console.error("❌ MongoDB connection error:", err);

    if (err.message?.includes("ECONNREFUSED") || err.message?.includes("querySrv")) {
      throw new Error(
        `Failed to connect to MongoDB: ${err.message}. ` +
        `Check MONGO_URI and DNS resolution for the cluster hostname, and ensure your network allows MongoDB Atlas traffic.`
      );
    }

    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
};

export default connect;