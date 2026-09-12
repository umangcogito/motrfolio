import { getSupabaseServerClient } from "@/lib/supabase";

export type ListingPhoto = { url: string; alt?: string };

export type Listing = {
  id: string;
  slug: string;
  status: string;
  created_at: string;
  dealer_name: string | null;
  dealer_city: string | null;
  dealer_phone: string | null;
  make: string | null;
  model: string | null;
  variant: string | null;
  year: number | null;
  km_driven: number | null;
  fuel_type: string | null;
  transmission: string | null;
  owners: number | null;
  registration_state: string | null;
  color: string | null;
  price: number | null;
  title: string | null;
  description: string | null;
  highlights: string[];
  specs: Record<string, string>;
  photos: ListingPhoto[];
  voice_transcript: string | null;
};

/** Fetch a published listing by slug. Returns null if missing or misconfigured. */
export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[listings] fetch failed:", error.message);
    return null;
  }
  return (data as Listing) ?? null;
}

/** ₹ with Indian digit grouping. */
export function formatINR(n: number | null | undefined): string {
  if (n == null) return "Price on request";
  return "₹" + n.toLocaleString("en-IN");
}

export function formatKm(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-IN") + " km";
}

/** The ordinal owner label, e.g. 1 -> "1st owner". */
export function ownerLabel(n: number | null | undefined): string | null {
  if (n == null) return null;
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]) + " owner";
}

/** Ready-to-forward WhatsApp share text for a listing. */
export function shareMessage(listing: Listing, url: string): string {
  const parts = [
    `🚗 ${listing.title ?? "Car for sale"}`,
    listing.price != null ? `Price: ${formatINR(listing.price)}` : null,
    listing.km_driven != null ? `${formatKm(listing.km_driven)} • ${listing.fuel_type ?? ""}`.trim() : null,
    "",
    `See full details & photos:`,
    url,
  ].filter((x): x is string => x !== null);
  return parts.join("\n");
}
