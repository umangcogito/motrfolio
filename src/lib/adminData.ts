import { getSupabaseAdminClient } from "@/lib/supabase";

export type AdminStats = { listings: number; leads: number; waitlist: number };

export type AdminListing = {
  id: string;
  slug: string;
  title: string | null;
  price: number | null;
  dealer_name: string | null;
  dealer_city: string | null;
  status: string;
  created_at: string;
};

export type AdminLead = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string;
  message: string | null;
  listing_title: string | null;
  listing_slug: string | null;
};

export type AdminWaitlist = {
  id: string;
  created_at: string;
  name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  dealership: string | null;
};

async function count(table: string): Promise<number> {
  const admin = getSupabaseAdminClient();
  if (!admin) return 0;
  const { count } = await admin.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getStats(): Promise<AdminStats> {
  const [listings, leads, waitlist] = await Promise.all([
    count("listings"),
    count("leads"),
    count("waitlist"),
  ]);
  return { listings, leads, waitlist };
}

export async function getListings(limit = 200): Promise<AdminListing[]> {
  const admin = getSupabaseAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("listings")
    .select("id, slug, title, price, dealer_name, dealer_city, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AdminListing[]) ?? [];
}

export async function getLeads(limit = 200): Promise<AdminLead[]> {
  const admin = getSupabaseAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("leads")
    .select("id, created_at, name, phone, message, listings(title, slug)")
    .order("created_at", { ascending: false })
    .limit(limit);
  // Flatten the joined listing.
  return (
    (data as unknown as Array<{
      id: string;
      created_at: string;
      name: string | null;
      phone: string;
      message: string | null;
      listings: { title: string | null; slug: string } | null;
    }>) ?? []
  ).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    name: r.name,
    phone: r.phone,
    message: r.message,
    listing_title: r.listings?.title ?? null,
    listing_slug: r.listings?.slug ?? null,
  }));
}

export async function getWaitlist(limit = 500): Promise<AdminWaitlist[]> {
  const admin = getSupabaseAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("waitlist")
    .select("id, created_at, name, email, phone, city, dealership")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AdminWaitlist[]) ?? [];
}
