import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    await connect();

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = new User({
      email: normalizedEmail,
      username: String(username || normalizedEmail.split("@")[0] || "User"),
      password: hashedPassword,
      provider: "email",
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "account created",
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("[register]", error);
    return NextResponse.json({ success: false, message: error.message || "Registration failed" }, { status: 500 });
  }
}
