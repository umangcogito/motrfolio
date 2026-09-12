import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "motr_admin";

/** The cookie value that proves a valid admin session (sha256 of the password). */
export function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** True if the submitted password matches ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return timingSafeEqualStr(input, pw);
}

/** True if the current request carries a valid admin session cookie. */
export function isAdmin(): boolean {
  const expected = sessionToken();
  if (!expected) return false;
  const value = cookies().get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return timingSafeEqualStr(value, expected);
}

/** Redirect to the login page unless the request is an authenticated admin. */
export function requireAdmin(): void {
  if (!isAdmin()) redirect("/admin/login");
}

/** Whether the server is configured with an admin password at all. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
