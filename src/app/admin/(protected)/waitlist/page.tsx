import { getWaitlist } from "@/lib/adminData";

export const dynamic = "force-dynamic";

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminWaitlist() {
  const rows = await getWaitlist();

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-bold tracking-tight text-ink">Waitlist ({rows.length})</h1>

      <div className="overflow-x-auto rounded-lg border border-hairline bg-canvas">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-hairline-soft text-[12px] uppercase tracking-wide text-muted-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">City</th>
              <th className="px-4 py-3 font-semibold">Dealership</th>
              <th className="px-4 py-3 font-semibold">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-soft text-[14px]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No signups yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-ink">{r.name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{r.email}</td>
                  <td className="px-4 py-3 text-muted">{r.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted">{r.city || "—"}</td>
                  <td className="px-4 py-3 text-muted">{r.dealership || "—"}</td>
                  <td className="px-4 py-3 text-muted-soft">{fmtDate(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
