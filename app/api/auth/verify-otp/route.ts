import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Otp from "@/lib/models/otp";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;

function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // ✅ await headers() — Next.js 15 change
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const identifier = `${ip}-${email}`;

    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      console.log(`🚫 [Send OTP] Rate limit exceeded for ${email} from ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please try again in ${rateLimitCheck.retryAfter} seconds.`,
          retryAfter: rateLimitCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitCheck.retryAfter?.toString() || "300",
          },
        }
      );
    }

    const emailString = email.trim().toLowerCase();
    console.log("📧 [Send OTP] Sending OTP to:", emailString);

    await connect();

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP is required for verification" },
        { status: 400 }
      );
    }

    const record = await Otp.findOne({ email: emailString });
    if (!record) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otp);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 401 }
      );
    }

    await Otp.deleteOne({ _id: record._id });

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [Send OTP] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}