import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request body.");
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const city = str(body.city);
  const dealership = str(body.dealership);

  if (!email || !EMAIL_RE.test(email)) {
    return bad("Please enter a valid email address.");
  }
  if (email.length > 254 || name.length > 120 || dealership.length > 160) {
    return bad("One of the fields is too long.");
  }

  const supabase = getSupabaseServerClient();

  // Not configured yet: accept the signup so the UI is testable in early dev,
  // but signal that nothing was persisted.
  if (!supabase) {
    console.warn("[waitlist] Supabase env not set; signup not persisted.");
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("waitlist").insert({
    name: name || null,
    email,
    phone: phone || null,
    city: city || null,
    dealership: dealership || null,
    source: "landing",
  });

  if (error) {
    // 23505 = unique_violation — already on the list, which is fine.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[waitlist] insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not join the waitlist. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
