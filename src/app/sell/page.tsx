import Link from "next/link";
import type { Metadata } from "next";
import SellForm from "@/components/SellForm";

export const metadata: Metadata = {
  title: "Create a listing",
  description: "Turn photos and a voice note into a professional car listing in 60 seconds.",
};

export default function SellPage() {
  return (
    <div className="min-h-screen bg-canvas text-bodytext">
      <header className="border-b border-hairline-soft bg-canvas">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-rausch font-bold text-canvas">M</span>
            <span className="text-[17px] font-semibold tracking-tight text-ink">Motrfolio</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="text-[28px] font-bold tracking-tight text-ink">Create a listing</h1>
        <p className="mt-2 text-[16px] text-muted">
          Add photos and record a voice note. Our AI writes a clean, shareable listing page —
          in about 60 seconds.
        </p>
        <div className="mt-8 rounded-lg border border-hairline bg-canvas p-6 shadow-card sm:p-8">
          <SellForm />
        </div>
      </main>
    </div>
  );
}
