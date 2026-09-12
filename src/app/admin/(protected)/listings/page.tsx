import Link from "next/link";
import { getListings } from "@/lib/adminData";
import { formatINR } from "@/lib/listings";
import DeleteListingButton from "@/components/DeleteListingButton";

export const dynamic = "force-dynamic";

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export default async function AdminListings() {
  const listings = await getListings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight text-ink">Listings ({listings.length})</h1>
        <Link
          href="/sell"
          target="_blank"
          className="rounded-sm bg-rausch px-4 py-2 text-[14px] font-medium text-canvas transition hover:bg-rausch-active"
        >
          + New listing
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-hairline bg-canvas">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-hairline-soft text-[12px] uppercase tracking-wide text-muted-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Car</th>
              <th className="px-4 py-3 font-semibold">Dealer</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-soft text-[14px]">
            {listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No listings yet.</td>
              </tr>
            ) : (
              listings.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <Link href={`/${l.slug}`} target="_blank" className="font-medium text-ink hover:text-rausch">
                      {l.title ?? "Untitled"}
                    </Link>
                    <div className="text-[12px] text-muted-soft">/{l.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {l.dealer_name ?? "—"}
                    {l.dealer_city ? <div className="text-[12px] text-muted-soft">{l.dealer_city}</div> : null}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{formatINR(l.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${
                      l.status === "published" ? "bg-rausch/10 text-rausch" : "bg-surface-strong text-muted"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{fmtDate(l.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/${l.slug}`} target="_blank" className="text-[13px] text-muted hover:text-ink">View</Link>
                      <DeleteListingButton id={l.id} title={l.title ?? "this listing"} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
