import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminConfigured, verifyPassword, sessionToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin is not configured (missing ADMIN_PASSWORD)." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    password = String((await req.json())?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  cookies().set(ADMIN_COOKIE, sessionToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
