import mongoose, { Schema, Model } from "mongoose";
import connect from "./db";

// ── Schema ─────────────────────────────────────────────────────────────────
interface IRateLimit {
  key: string;
  hits: number[];
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key:       { type: String, required: true, unique: true, index: true },
  hits:      { type: [Number], default: [] },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
});

const RateLimitModel: Model<IRateLimit> =
  mongoose.models.RateLimit ??
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

// ── Core function ───────────────────────────────────────────────────────────
async function check(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  await connect();

  const now = Date.now();
  const windowStart = now - windowMs;

  // Push the new hit and extend TTL atomically
  const doc = await RateLimitModel.findOneAndUpdate(
    { key },
    {
      $push:  { hits: now },
      $set:   { expiresAt: new Date(now + windowMs) },
    },
    { upsert: true, new: true }
  );

  // Count only hits within current window
  const recent = (doc.hits as number[]).filter((t) => t > windowStart);
  const success = recent.length <= limit;

  // Prune stale hits — fire and forget, don't block the response
  RateLimitModel.updateOne({ key }, { $set: { hits: recent } }).catch(() => {});

  return { success, remaining: Math.max(0, limit - recent.length) };
}

// ── Named limiters — mirrors what the Upstash version exported ─────────────
export const submitRatelimit = {
  limit: (ip: string) => check(`submit:${ip}`, 3, 60 * 60 * 1000),   // 3 per hour
};

export const listRatelimit = {
  limit: (ip: string) => check(`list:${ip}`, 20, 60 * 1000),          // 20 per minute
};

export const deleteRatelimit = {
  limit: (ip: string) => check(`delete:${ip}`, 10, 60 * 1000),        // 10 per minute
};