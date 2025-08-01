import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import clientPromise from "@/lib/mongodb";

const SMS_API_KEY = process.env.PING4SMS_API_KEY || "ed7bb9d336647174d8652aebbfd7bbc3";
const SMS_ROUTE = "2";
const SMS_SENDER = "ELESOF";
const SMS_TEMPLATE_ID = "1607100000000328045";
const OTP_EXPIRY_MINUTES = 15;

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10,15}$/),
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpSms(phone: string, otp: string) {
  const sms = `Dear Users,\n\nYour login OTP is ${otp}. Please do not share this code with anyone. It will expire in 15 minutes.\nTeam - Eleserv`;
  const url = `https://site.ping4sms.com/api/smsapi?key=${SMS_API_KEY}&route=${SMS_ROUTE}&sender=${SMS_SENDER}&number=${phone}&sms=${encodeURIComponent(sms)}&templateid=${SMS_TEMPLATE_ID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to send OTP SMS");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { phone } = parsed.data;

    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");
    const users = db.collection("users");

    // Find user by phone
    const user = await users.findOne({ phone });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (!user.verified) {
      return NextResponse.json({ error: "User not verified. Please register first." }, { status: 400 });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await users.updateOne(
      { phone },
      { $set: { otp, otpExpiry } }
    );

    // Send OTP SMS
    await sendOtpSms(phone, otp);

    return NextResponse.json({ success: true, message: "OTP sent to phone." });
  } catch (err: unknown) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 