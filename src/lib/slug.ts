/** Build a short, URL-safe slug from a title plus a random suffix. */
export function makeSlug(title: string): string {
  const base = (title || "car")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  const rand = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${rand}` : `car-${rand}`;
}
