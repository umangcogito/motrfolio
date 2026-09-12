"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-sm border border-strongborder px-3 py-1.5 text-[13px] font-medium text-ink transition hover:bg-surface-soft"
    >
      Sign out
    </button>
  );
}
