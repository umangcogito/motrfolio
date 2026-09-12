import Link from "next/link";
import { getStats, getLeads, getListings } from "@/lib/adminData";
import { formatINR } from "@/lib/listings";

export const dynamic = "force-dynamic";

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-hairline bg-canvas p-5 transition hover:shadow-card"
    >
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[32px] font-bold text-ink">{value}</p>
    </Link>
  );
}

export default async function AdminOverview() {
  const [stats, leads, listings] = await Promise.all([
    getStats(),
    getLeads(6),
    getListings(6),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-[24px] font-bold tracking-tight text-ink">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Listings" value={stats.listings} href="/admin/listings" />
        <StatCard label="Leads" value={stats.leads} href="/admin/leads" />
        <StatCard label="Waitlist signups" value={stats.waitlist} href="/admin/waitlist" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <section className="rounded-lg border border-hairline bg-canvas p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">Recent leads</h2>
            <Link href="/admin/leads" className="text-[13px] text-rausch hover:underline">View all</Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-[14px] text-muted">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-hairline-soft">
              {leads.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-ink">
                      {l.name || "—"} · {l.phone}
                    </p>
                    <p className="truncate text-[12px] text-muted">{l.listing_title ?? "Unknown car"}</p>
                  </div>
                  <span className="shrink-0 text-[12px] text-muted-soft">{fmtDate(l.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent listings */}
        <section className="rounded-lg border border-hairline bg-canvas p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink">Recent listings</h2>
            <Link href="/admin/listings" className="text-[13px] text-rausch hover:underline">View all</Link>
          </div>
          {listings.length === 0 ? (
            <p className="text-[14px] text-muted">No listings yet.</p>
          ) : (
            <ul className="divide-y divide-hairline-soft">
              {listings.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link href={`/${l.slug}`} target="_blank" className="truncate text-[14px] font-medium text-ink hover:text-rausch">
                      {l.title ?? "Untitled"}
                    </Link>
                    <p className="truncate text-[12px] text-muted">{l.dealer_name ?? "—"}</p>
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold text-ink">{formatINR(l.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
