import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import clientPromise from "@/lib/mongodb";

// --- SMS API CONFIG ---
const SMS_API_KEY =
  process.env.PING4SMS_API_KEY || "ed7bb9d336647174d8652aebbfd7bbc3";
const SMS_ROUTE = "2";
const SMS_SENDER = "ELESOF";
const SMS_TEMPLATE_ID = "1607100000000328045";
const OTP_EXPIRY_MINUTES = 15;

// --- Zod schema for validation ---
const signupSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^\d{10,15}$/),
  email: z.string().email(),
  password: z.string().min(8),
  state: z.string().min(2),
  city: z.string().min(2),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
});

// --- Helper: Generate 6-digit OTP ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- Helper: Send OTP via SMS API ---
async function sendOtpSms(phone: string, otp: string) {
  const sms = `Dear Users,\n\nYour login OTP is ${otp}. Please do not share this code with anyone. It will expire in 15 minutes.\nTeam - Eleserv`;
  const url = `https://site.ping4sms.com/api/smsapi?key=${SMS_API_KEY}&route=${SMS_ROUTE}&sender=${SMS_SENDER}&number=${phone}&sms=${encodeURIComponent(
    sms
  )}&templateid=${SMS_TEMPLATE_ID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to send OTP SMS");
}

// --- Main handler ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { phone } = parsed.data;

    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");
    const pending = db.collection("pending_signups");

    // Ensure TTL index exists (runs every time, but is idempotent)
    await pending.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Upsert OTP and user details (replace if exists for this phone)
    await pending.updateOne(
      { phone },
      {
        $set: {
          phone,
          otp,
          user: parsed.data,
          expiresAt,
        },
      },
      { upsert: true }
    );

    // Send OTP SMS
    await sendOtpSms(phone, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent to phone. Please verify to complete registration.",
    });
  } catch (err: unknown) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
