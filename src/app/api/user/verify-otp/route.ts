import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import clientPromise from "@/lib/mongodb";

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10,15}$/),
  otp: z.string().length(6),
});

const OTP_ATTEMPT_LIMIT = 5;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { phone, otp } = parsed.data;

    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");
    const pending = db.collection("pending_signups");
    const users = db.collection("users");

    // Find pending signup by phone
    const pendingDoc = await pending.findOne({ phone });
    if (!pendingDoc) {
      return NextResponse.json({ error: "No OTP found. Please register again." }, { status: 400 });
    }

    // Brute-force protection: increment attempt count
    const attempts = (pendingDoc.attempts || 0) + 1;
    if (attempts > OTP_ATTEMPT_LIMIT) {
      await pending.deleteOne({ phone });
      return NextResponse.json({ error: "Too many invalid attempts. Please try again later." }, { status: 429 });
    }
    if (pendingDoc.otp !== otp) {
      await pending.updateOne({ phone }, { $set: { attempts } });
      return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
    }

    // Get user details from pending signup
    const userData = pendingDoc.user;
    if (!userData) {
      await pending.deleteOne({ phone });
      return NextResponse.json({ error: "User data missing. Please register again." }, { status: 400 });
    }

    // Check for existing user in DB
    const existing = await users.findOne({ $or: [{ email: userData.email }, { phone: userData.phone }] });
    if (existing) {
      await pending.deleteOne({ phone });
      return NextResponse.json({ error: "User already exists with this email or phone." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Save user to DB
    await users.insertOne({
      ...userData,
      password: hashedPassword,
      verified: true,
      createdAt: new Date(),
    });

    // Remove pending signup
    await pending.deleteOne({ phone });

    return NextResponse.json({ success: true, message: "Phone verified. You can now log in." });
  } catch (err: unknown) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
