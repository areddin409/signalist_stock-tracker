import mongoose from 'mongoose';

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using mongoose with connection caching.
 *
 * The function implements a caching mechanism to store and reuse database connections:
 * - If a connection exists in cache, it returns the cached connection
 * - If no connection exists but a connection promise is pending, it waits for that promise
 * - If no connection or promise exists, it creates a new connection
 *
 * The cache is implemented through the 'cached' object which stores:
 * - conn: The active mongoose connection instance
 * - promise: The pending connection promise
 *
 * @throws {Error} If MONGODB_URI environment variable is not defined
 * @throws {Error} If the database connection fails
 *
 * @returns {Promise<typeof mongoose>} A promise that resolves to the mongoose connection
 */
export const connectToDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  console.log(
    `Database connected successfully in ${process.env.NODE_ENV} environment`
  );

  return cached.conn;
};
