"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        autoComplete="current-password"
        autoFocus
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-sm border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-sm bg-rausch text-[16px] font-medium text-canvas transition hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      {error && (
        <p className="text-[14px] text-rausch-active" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
