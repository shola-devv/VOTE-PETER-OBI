import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    await connect();

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("[login]", error);
    return NextResponse.json({ success: false, message: error.message || "Login failed" }, { status: 500 });
  }
}
