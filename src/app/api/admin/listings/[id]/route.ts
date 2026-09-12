import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  const { error } = await admin.from("listings").delete().eq("id", params.id);
  if (error) {
    console.error("[admin] delete listing failed:", error.message);
    return NextResponse.json({ ok: false, error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
