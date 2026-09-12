"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-sm border border-hairline bg-canvas px-4 py-3 text-[16px] text-ink " +
  "placeholder:text-muted-soft outline-none transition focus:border-ink " +
  "focus:ring-2 focus:ring-ink/10";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      dealership: data.get("dealership"),
      city: data.get("city"),
      phone: data.get("phone"),
      email: data.get("email"),
    };

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-md border border-hairline bg-surface-soft p-8 text-center animate-fade-up"
        role="status"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rausch text-canvas">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-[20px] font-semibold text-ink">You&apos;re on the list!</h3>
        <p className="mt-2 text-[15px] text-muted">
          We&apos;ll message you on WhatsApp when your early access is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="name" type="text" autoComplete="name" placeholder="Your name" className={inputClass} />
        <input
          name="dealership"
          type="text"
          autoComplete="organization"
          placeholder="Dealership name"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="city" type="text" placeholder="City (e.g. Delhi)" className={inputClass} />
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="WhatsApp number"
          className={inputClass}
        />
      </div>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className={inputClass}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-sm bg-rausch text-[16px] font-medium text-canvas transition hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
      >
        {status === "loading" ? "Joining…" : "Get early access — free"}
      </button>

      {status === "error" && error && (
        <p className="text-[14px] text-rausch-active" role="alert">
          {error}
        </p>
      )}
      <p className="text-center text-[13px] text-muted-soft">
        Free for your first 3 listings. No card required.
      </p>
    </form>
  );
}
