import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\d{10,15}$/),
  otp: z.string().length(6),
});

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = "7d"; // 7 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Determine login type
    let loginType: "email" | "phone" | null = null;
    if (body.email && body.password) loginType = "email";
    else if (body.phone && body.otp) loginType = "phone";
    else {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");
    const users = db.collection("users");

    let user;
    if (loginType === "email") {
      const parsed = emailLoginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
      }
      const { email, password } = parsed.data;
      user = await users.findOne({ email });
      if (!user || !user.verified) {
        return NextResponse.json({ error: "User not found or not verified." }, { status: 404 });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid password." }, { status: 401 });
      }
    } else if (loginType === "phone") {
      const parsed = phoneLoginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
      }
      const { phone, otp } = parsed.data;
      user = await users.findOne({ phone });
      if (!user || !user.verified) {
        return NextResponse.json({ error: "User not found or not verified." }, { status: 404 });
      }
      if (!user.otp || !user.otpExpiry) {
        return NextResponse.json({ error: "No OTP found. Please request OTP." }, { status: 400 });
      }
      if (user.otp !== otp) {
        return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
      }
      if (new Date() > new Date(user.otpExpiry)) {
        return NextResponse.json({ error: "OTP expired. Please request OTP again." }, { status: 400 });
      }
      // Optionally clear OTP after successful login
      await users.updateOne({ phone }, { $unset: { otp: "", otpExpiry: "" } });
    }

    // At this point, 'user' must be defined and valid
    if (!user) {
      // This should never happen, but is a type guard for TypeScript
      return NextResponse.json({ error: "User not found after validation." }, { status: 500 });
    }
    // Create JWT token with minimal user info
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set JWT as HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: tokenPayload,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });
    return response;
  } catch (err: unknown) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
