"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteListingButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (busy) return;
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Could not delete the listing.");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-[13px] font-medium text-rausch-active hover:underline disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
