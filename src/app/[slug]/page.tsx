import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getListingBySlug,
  formatINR,
  formatKm,
  ownerLabel,
  shareMessage,
  type Listing,
} from "@/lib/listings";
import ListingGallery from "@/components/ListingGallery";
import LeadForm from "@/components/LeadForm";

// Dedupe the DB read between generateMetadata and the page render.
const getCached = cache(getListingBySlug);

function absoluteUrl(path: string): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "motrfolio.vercel.app";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const listing = await getCached(params.slug);
  if (!listing) return { title: "Listing not found" };
  const title = listing.title ?? "Car for sale";
  const desc =
    listing.description?.slice(0, 155) ??
    `${formatINR(listing.price)} · ${formatKm(listing.km_driven)}`;
  const firstPhoto = listing.photos?.[0]?.url;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: firstPhoto ? [firstPhoto] : undefined,
      type: "website",
    },
  };
}

function SpecPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline-soft bg-canvas px-4 py-3 text-center">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing: Listing | null = await getCached(params.slug);
  if (!listing) notFound();

  const url = absoluteUrl(`/${listing.slug}`);
  const shareHref = `https://wa.me/?text=${encodeURIComponent(shareMessage(listing, url))}`;
  const contactHref = listing.dealer_phone
    ? `https://wa.me/${listing.dealer_phone}?text=${encodeURIComponent(
        `Hi, I'm interested in the ${listing.title ?? "car"} listed on Motrfolio.`,
      )}`
    : null;

  const keySpecs: Array<[string, string | null]> = [
    ["Year", listing.year ? String(listing.year) : null],
    ["KM driven", listing.km_driven != null ? formatKm(listing.km_driven) : null],
    ["Fuel", listing.fuel_type],
    ["Transmission", listing.transmission],
    ["Owner", ownerLabel(listing.owners)],
  ];

  return (
    <div className="min-h-screen bg-canvas text-bodytext">
      {/* Nav */}
      <header className="border-b border-hairline-soft bg-canvas">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-rausch font-bold text-canvas">
              M
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-ink">Motrfolio</span>
          </Link>
          <a
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-rausch px-4 py-2 text-[13px] font-medium text-canvas transition hover:bg-rausch-active"
          >
            Share on WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-content px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: gallery + details */}
          <div>
            <ListingGallery photos={listing.photos} />

            <div className="mt-6">
              <h1 className="text-[26px] font-bold tracking-tight text-ink md:text-[30px]">
                {listing.title}
              </h1>
              {listing.dealer_city && (
                <p className="mt-1 text-[15px] text-muted">{listing.dealer_city}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {keySpecs
                .filter(([, v]) => v)
                .map(([label, v]) => (
                  <SpecPill key={label} label={label} value={v as string} />
                ))}
            </div>

            {listing.description && (
              <section className="mt-8">
                <h2 className="text-[18px] font-semibold text-ink">Description</h2>
                <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-bodytext">
                  {listing.description}
                </p>
              </section>
            )}

            {listing.highlights.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[18px] font-semibold text-ink">Highlights</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {listing.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-[15px] text-bodytext">
                      <span className="mt-0.5 text-rausch">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {Object.keys(listing.specs ?? {}).length > 0 && (
              <section className="mt-8">
                <h2 className="text-[18px] font-semibold text-ink">Specifications</h2>
                <dl className="mt-3 divide-y divide-hairline-soft overflow-hidden rounded-md border border-hairline-soft">
                  {Object.entries(listing.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-4 py-3">
                      <dt className="text-[14px] text-muted">{k}</dt>
                      <dd className="text-[14px] font-medium text-ink">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {/* Right: sticky price + contact */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border border-hairline bg-canvas p-6 shadow-card">
              <p className="text-[13px] text-muted">Price</p>
              <p className="text-[32px] font-bold tracking-tight text-ink">
                {formatINR(listing.price)}
              </p>

              {(listing.dealer_name || listing.dealer_city) && (
                <div className="mt-4 rounded-md bg-surface-soft p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">
                    Sold by
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-ink">
                    {listing.dealer_name ?? "Dealer"}
                  </p>
                  {listing.dealer_city && (
                    <p className="text-[14px] text-muted">{listing.dealer_city}</p>
                  )}
                </div>
              )}

              {contactHref && (
                <a
                  href={contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] text-[15px] font-medium text-white transition hover:brightness-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4zM12 2A10 10 0 0 0 3.5 17.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" />
                  </svg>
                  Contact on WhatsApp
                </a>
              )}

              <div className="mt-5 border-t border-hairline-soft pt-5">
                <p className="text-[15px] font-semibold text-ink">Enquire about this car</p>
                <p className="mb-3 mt-0.5 text-[13px] text-muted">
                  Leave your number and the dealer will call you back.
                </p>
                <LeadForm listingId={listing.id} carTitle={listing.title ?? "car"} />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-hairline-soft bg-canvas">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-6">
          <Link href="/" className="text-[14px] font-semibold text-ink">
            Motrfolio
          </Link>
          <p className="text-[12px] text-muted">Ek link mein poori gaadi.</p>
        </div>
      </footer>
    </div>
  );
}
