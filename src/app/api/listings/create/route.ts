import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { transcribeAudio, generateListingContent } from "@/lib/generateListing";
import { makeSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const maxDuration = 60; // AI calls can take a while

const BUCKET = "listing-photos";
const MAX_PHOTOS = 8;

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits.length >= 10 ? digits : null;
}

export async function POST(req: Request) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return bad(
      "Server not configured for listing creation (missing SUPABASE_SERVICE_ROLE_KEY).",
      503,
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Expected multipart form data.");
  }

  const photos = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const audio = form.get("audio");
  const audioFile = audio instanceof File && audio.size > 0 ? audio : null;

  const dealerName = (form.get("dealer_name") as string | null)?.trim() || null;
  const dealerCity = (form.get("dealer_city") as string | null)?.trim() || null;
  const dealerPhone = normalizePhone((form.get("dealer_phone") as string | null) ?? "");

  if (photos.length === 0) return bad("Please add at least one photo.");
  if (photos.length > MAX_PHOTOS) return bad(`Please add at most ${MAX_PHOTOS} photos.`);

  // 1) Upload photos to storage → public URLs.
  const folder = crypto.randomUUID();
  const imageUrls: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const file = photos[i];
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
    const path = `${folder}/${i}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await admin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) {
      console.error("[create] photo upload failed:", error.message);
      return bad("Could not upload photos. Please try again.", 500);
    }
    imageUrls.push(admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  // 2) Transcribe the voice note (optional).
  let transcript = "";
  try {
    if (audioFile) transcript = await transcribeAudio(audioFile);
  } catch (e) {
    console.error("[create] transcription failed:", e);
    // Non-fatal: continue with photos only.
  }

  // 3) Generate the structured listing.
  let gen;
  try {
    gen = await generateListingContent({ imageUrls, transcript });
  } catch (e) {
    console.error("[create] generation failed:", e);
    return bad("The AI could not generate a listing. Please try again.", 502);
  }
  if (!gen) return bad("AI is not configured (missing OPENAI_API_KEY).", 503);

  // 4) Insert the listing (retry once on slug collision).
  const specsObj: Record<string, string> = {};
  for (const s of gen.specs ?? []) {
    if (s?.label && s?.value) specsObj[s.label] = s.value;
  }
  const row = {
    status: "published",
    dealer_name: dealerName,
    dealer_city: dealerCity,
    dealer_phone: dealerPhone,
    make: gen.make,
    model: gen.model,
    variant: gen.variant,
    year: gen.year,
    km_driven: gen.km_driven,
    fuel_type: gen.fuel_type,
    transmission: gen.transmission,
    owners: gen.owners,
    color: gen.color,
    price: gen.price,
    title: gen.title,
    description: gen.description,
    highlights: gen.highlights ?? [],
    specs: specsObj,
    photos: imageUrls.map((url) => ({ url, alt: gen!.title })),
    voice_transcript: transcript || null,
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = makeSlug(gen.title);
    const { error } = await admin.from("listings").insert({ ...row, slug });
    if (!error) return NextResponse.json({ ok: true, slug });
    if (error.code !== "23505") {
      console.error("[create] insert failed:", error.message);
      return bad("Could not save the listing. Please try again.", 500);
    }
    // else slug collision → loop and try a new slug
  }
  return bad("Could not generate a unique link. Please try again.", 500);
}
