import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (username === "iamprakashchy" && password === "Prakash@Manoj") {
    const response = NextResponse.json({ success: true });

    // Set HTTP-only cookie that expires in 24 hours
    response.cookies.set({
      name: "admin_token",
      value: "your_secure_token_here", // In production, use a proper JWT token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
