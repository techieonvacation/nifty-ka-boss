import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const { id } = payload;
    // Fetch user from DB
    const client = await clientPromise;
    const db = client.db("Iamrakeshbansal");
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Remove sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, otp: _otp, otpExpiry: _otpExpiry, ...safeUser } = user;
    // Convert _id to string
    (safeUser as { [key: string]: unknown })._id = String(safeUser._id);
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
