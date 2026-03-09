import { NextResponse, NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { ratelimit } from '@/lib/rate-limit';

const CACHE_KEY = 'external_api:market_data';
const CACHE_TTL_SECONDS = 60;
const API_TIMEOUT = 10000;

// ----------------------------
// Security Headers
// ----------------------------
function securityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy":
      "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'",
  };
}

export async function GET(request: NextRequest) {
  const now = Date.now();

  // ----------------------------
  // 1. Extract IP
  // ----------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "127.0.0.1";

  console.log("📊 Market data request from IP:", ip);

  // ----------------------------
  // 2. RATE LIMIT (do this FIRST)
  // ----------------------------
  let cached: any = null;

  try {
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      console.warn("⚠️ Rate limit exceeded for IP:", ip);

      // Try returning cached data if available
      try {
        const cachedString = await redis.get(CACHE_KEY);
        if (cachedString) {
          cached =
            typeof cachedString === "string"
              ? JSON.parse(cachedString)
              : cachedString;

          return new NextResponse(
            JSON.stringify({
              source: "cache-rate-limited",
              data: cached.data,
              timestamp: cached.timestamp,
              warning: "Rate limit exceeded, returning cached data",
            }),
            { status: 429, headers: securityHeaders() }
          );
        }
      } catch {}

      // Otherwise return 429
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        { status: 429, headers: securityHeaders() }
      );
    }
  } catch (err) {
    console.warn("⚠️ Rate limit check error:", err);
    // Continue if Redis is down
  }

  // ----------------------------
  // 3. Try reading cache AFTER rate limit
  // ----------------------------
  try {
    const cachedString = await redis.get(CACHE_KEY);

    if (cachedString) {
      cached =
        typeof cachedString === "string"
          ? JSON.parse(cachedString)
          : cachedString;

      const age = now - (cached.timestamp || 0);

      if (age < CACHE_TTL_SECONDS * 1000) {
        return new NextResponse(
          JSON.stringify({
            source: "cache",
            data: cached.data,
            timestamp: cached.timestamp,
            age: Math.floor(age / 1000),
          }),
          { status: 200, headers: securityHeaders() }
        );
      }
    }
  } catch (cacheError) {
    console.warn("⚠️ Cache read error:", cacheError);
  }

  // ----------------------------
  // 4. Fetch fresh data from Etherscan Gas Oracle
  // ----------------------------
  console.log("🔄 Fetching fresh gas oracle data from Etherscan...");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

    if (!ETHERSCAN_API_KEY) {
      throw new Error("Etherscan API key not configured");
    }

    const res = await fetch(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("❌ Etherscan API error:", res.status);

      if (cached) {
        return new NextResponse(
          JSON.stringify({
            source: "cache-stale-api-error",
            data: cached.data,
            timestamp: cached.timestamp,
            warning: "Using stale data due to API error",
          }),
          { status: 200, headers: securityHeaders() }
        );
      }

      throw new Error(`Etherscan API returned ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "1") {
      console.error("Etherscan returned non-success status", data);

      if (cached) {
        return new NextResponse(
          JSON.stringify({
            source: "cache-stale-api-error",
            data: cached.data,
            timestamp: cached.timestamp,
            warning: "Using stale data due to Etherscan error",
          }),
          { status: 200, headers: securityHeaders() }
        );
      }

      throw new Error("Failed to fetch gas price from Etherscan");
    }

    const result = data.result || {};

    const responsePayload = {
      safeGasPrice: result.SafeGasPrice,
      proposeGasPrice: result.ProposeGasPrice || result.ProposeGasPrice,
      fastGasPrice: result.FastGasPrice,
      suggestBaseFee: result.suggestBaseFee,
      gasUsedRatio: result.gasUsedRatio,
      lastBlock: result.LastBlock,
    };

    // Store in cache
    try {
      await redis.set(
        CACHE_KEY,
        JSON.stringify({
          data: responsePayload,
          timestamp: now,
        }),
        { ex: CACHE_TTL_SECONDS * 5 }
      );
    } catch (cacheError) {
      console.warn("⚠️ Cache write error:", cacheError);
    }

    return new NextResponse(JSON.stringify({ source: "fresh", data: responsePayload, timestamp: now }), {
      status: 200,
      headers: securityHeaders(),
    });
  } catch (err: any) {
    clearTimeout(timeout);

    // Timeout fallback
    if (err.name === "AbortError") {
      if (cached) {
        return new NextResponse(
          JSON.stringify({
            source: "cache-stale-timeout",
            data: cached.data,
            timestamp: cached.timestamp,
            warning: "Using stale cache due to API timeout",
          }),
          { status: 200, headers: securityHeaders() }
        );
      }

      return new NextResponse(JSON.stringify({ error: "API request timeout" }), {
        status: 504,
        headers: securityHeaders(),
      });
    }

    console.error("Market data API error:", err);

    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch gas oracle data",
        details: err?.message,
        timestamp: now,
      }),
      { status: 500, headers: securityHeaders() }
    );
  }
}
