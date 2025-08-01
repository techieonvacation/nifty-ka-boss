import { MongoClient, MongoClientOptions } from "mongodb";

// Validate environment variable
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || "10", 10),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || "5", 10),
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  serverSelectionTimeoutMS: 5000,
  // Enable TLS explicitly
  tls: uri.includes("ssl=true") || uri.includes("mongodb+srv://"),
  // Monitor connection pool events
  monitorCommands: process.env.NODE_ENV === "development",
};

// Global client and promise
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Global type for development
interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}
const globalWithMongo = global as typeof globalThis & GlobalWithMongo;

// Reconnection logic with exponential backoff
const connectWithRetry = async (
  uri: string,
  options: MongoClientOptions,
  retries = 5,
  delay = 1000
): Promise<MongoClient> => {
  for (let i = 0; i < retries; i++) {
    try {
      const newClient = new MongoClient(uri, options);
      const connectedClient = await newClient.connect();
      console.log("MongoDB connected successfully");
      // Log connection pool stats in development
      if (process.env.NODE_ENV === "development") {
        connectedClient.on("connectionPoolCreated", () =>
          console.log("MongoDB connection pool created")
        );
        connectedClient.on("connectionPoolClosed", () =>
          console.log("MongoDB connection pool closed")
        );
      }
      return connectedClient;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("MongoDB connection failed after maximum retries");
};

// Initialize connection
const initializeConnection = (): Promise<MongoClient> => {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = connectWithRetry(uri, options);
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    return connectWithRetry(uri, options);
  }
};

// Lazy initialization
const getClientPromise = async (): Promise<MongoClient> => {
  if (!clientPromise) {
    clientPromise = initializeConnection();
    client = await clientPromise;
  }
  return clientPromise;
};

// Health check
export const checkMongoHealth = async (): Promise<boolean> => {
  try {
    const currentClient = client || (await getClientPromise());
    await currentClient.db("admin").command({ ping: 1 });
    return true;
  } catch (err) {
    console.error("MongoDB health check failed:", err);
    return false;
  }
};

// Graceful shutdown
export const closeMongoConnection = async (): Promise<void> => {
  if (client) {
    try {
      await client.close();
      console.log("MongoDB connection closed");
      client = null;
      clientPromise = null;
      if (process.env.NODE_ENV === "development") {
        delete globalWithMongo._mongoClientPromise;
      }
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
    }
  }
};

// Handle process termination
if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    await closeMongoConnection();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await closeMongoConnection();
    process.exit(0);
  });
}

// Error handling for initial connection
getClientPromise().catch((err) => {
  console.error("Initial MongoDB connection error:", err);
  if (process.env.NODE_ENV === "production") {
    // Add error reporting (e.g., Sentry)
    // Example: Sentry.captureException(err);
  }
});

// Export the client promise and its type
export default getClientPromise();
export type MongoClientPromise = Promise<MongoClient>;
