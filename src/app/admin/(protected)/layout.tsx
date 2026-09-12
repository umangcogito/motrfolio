import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/adminAuth";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/waitlist", label: "Waitlist" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();

  return (
    <div className="min-h-screen bg-surface-soft text-bodytext">
      <header className="border-b border-hairline-soft bg-canvas">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-rausch font-bold text-canvas">M</span>
              <span className="text-[16px] font-semibold tracking-tight text-ink">Admin</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-sm px-3 py-1.5 text-[14px] font-medium text-muted transition hover:bg-surface-soft hover:text-ink"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
        <nav className="flex items-center gap-1 border-t border-hairline-soft px-5 py-2 sm:hidden">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-sm px-3 py-1.5 text-[13px] font-medium text-muted">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-content px-5 py-8">{children}</main>
    </div>
  );
}
