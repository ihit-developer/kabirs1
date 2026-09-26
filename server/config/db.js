const mongoose = require('mongoose');

// Serverless platforms (Vercel, etc.) reuse the same warm container between
// requests. If we call mongoose.connect() on every cold start without
// caching, two things go wrong: (1) requests that arrive before the
// connection finishes just hang waiting on Mongoose's command buffer, which
// looks like "randomly not loading", and (2) repeated connects across
// invocations can exhaust your Atlas connection limit. Caching the
// connection (and the in-flight promise) on `global` fixes both — every
// request in a warm container reuses the same ready connection, and cold
// starts only connect once.

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in your environment variables');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log('✅ MongoDB Atlas Connected Successfully');
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;