import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default function AdminLoginPage() {
  if (isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-soft px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-rausch text-[18px] font-bold text-canvas">
            M
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-ink">Motrfolio Admin</span>
        </div>
        <div className="rounded-lg border border-hairline bg-canvas p-6 shadow-card">
          <AdminLoginForm />
        </div>
        <p className="mt-4 text-center text-[13px] text-muted-soft">Operator access only.</p>
      </div>
    </div>
  );
}
