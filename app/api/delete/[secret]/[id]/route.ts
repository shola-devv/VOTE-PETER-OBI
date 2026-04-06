import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { deleteRatelimit } from "@/lib/rate-limit";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { secret: string; id: string } }
) {
  const ip = getIp(req);

  const { success } = await deleteRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  const deleteSecret = process.env.DELETE_SECRET;
  if (!deleteSecret || params.secret !== deleteSecret) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const numericId = parseInt(params.id, 10);
  if (!Number.isFinite(numericId) || numericId < 1) {
    return NextResponse.json({ message: "Invalid submission ID." }, { status: 400 });
  }

  await connect();

  const deleted = await Submission.findOneAndDelete({ id: numericId });
  if (!deleted) {
    return NextResponse.json({ message: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json(
    { message: `Submission #${numericId} deleted.` },
    { status: 200 }
  );
}