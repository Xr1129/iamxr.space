import { NextResponse } from "next/server";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = signToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set("editor_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
