import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

// Accepts Indian mobile numbers, optionally with +91 / spaces / dashes.
const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

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
  const listingId = str(body.listing_id);
  const name = str(body.name);
  const phoneRaw = str(body.phone);
  const message = str(body.message);
  const phone = phoneRaw.replace(/[\s-]/g, "");

  if (!listingId) return bad("Missing listing.");
  if (!PHONE_RE.test(phone)) return bad("Please enter a valid 10-digit mobile number.");
  if (name.length > 120 || message.length > 500) return bad("One of the fields is too long.");

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn("[leads] Supabase env not set; lead not persisted.");
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("leads").insert({
    listing_id: listingId,
    name: name || null,
    phone,
    message: message || null,
    source: "listing",
  });

  if (error) {
    console.error("[leads] insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not send your enquiry. Please try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, persisted: true });
}
