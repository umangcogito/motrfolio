import Link from "next/link";
import { getLeads } from "@/lib/adminData";

export const dynamic = "force-dynamic";

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminLeads() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold tracking-tight text-ink">Leads ({leads.length})</h1>

      <div className="overflow-x-auto rounded-lg border border-hairline bg-canvas">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-hairline-soft text-[12px] uppercase tracking-wide text-muted-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Buyer</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Car</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-soft text-[14px]">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">No leads yet.</td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium text-ink">{l.name || "—"}</td>
                  <td className="px-4 py-3">
                    <a href={`https://wa.me/91${l.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" className="text-rausch hover:underline">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {l.listing_slug ? (
                      <Link href={`/${l.listing_slug}`} target="_blank" className="hover:text-ink">
                        {l.listing_title ?? "Listing"}
                      </Link>
                    ) : (
                      l.listing_title ?? "—"
                    )}
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-muted">{l.message || "—"}</td>
                  <td className="px-4 py-3 text-muted-soft">{fmtDate(l.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
