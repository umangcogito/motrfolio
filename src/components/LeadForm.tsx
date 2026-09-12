"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-sm border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink " +
  "placeholder:text-muted-soft outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

export default function LeadForm({
  listingId,
  carTitle,
}: {
  listingId: string;
  carTitle: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      listing_id: listingId,
      name: data.get("name"),
      phone: data.get("phone"),
      message: data.get("message"),
    };

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-hairline bg-surface-soft p-6 text-center" role="status">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rausch text-canvas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-ink">Enquiry sent!</h3>
        <p className="mt-1 text-[14px] text-muted">The dealer will reach out to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <input name="name" type="text" autoComplete="name" placeholder="Your name" className={inputClass} />
      <input
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        placeholder="Mobile number"
        className={inputClass}
      />
      <textarea
        name="message"
        rows={3}
        placeholder={`I'm interested in the ${carTitle}. Is it still available?`}
        className={inputClass + " resize-none"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-sm bg-rausch text-[16px] font-medium text-canvas transition hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
      >
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>
      {status === "error" && error && (
        <p className="text-[14px] text-rausch-active" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
