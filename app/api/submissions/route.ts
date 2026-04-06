import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { listRatelimit } from "@/lib/rate-limit";

const PAGE_SIZE = 50;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function GET(req: NextRequest) {
  const ip = getIp(req);

  const { success, remaining } = await listRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = new URL(req.url);
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const skip = (page - 1) * PAGE_SIZE;

  await connect();

  const [submissions, total] = await Promise.all([
    Submission.find({ status: "pending" })
      .sort({ id: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .select("-ip -_id -__v")
      .lean(),
    Submission.countDocuments({ status: "pending" }),
  ]);

  return NextResponse.json(
    {
      submissions,
      page,
      pageSize: PAGE_SIZE,
      total,
      hasMore: skip + PAGE_SIZE < total,
    },
    {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "no-store",
      },
    }
  );
}