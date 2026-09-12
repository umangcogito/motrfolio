import type { ReactNode } from "react";
import WaitlistForm from "@/components/WaitlistForm";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-rausch text-canvas font-bold">
        M
      </span>
      <span className="text-[18px] font-semibold tracking-tight text-ink">Motrfolio</span>
    </div>
  );
}

function StepCard({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline-soft bg-canvas p-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-strong text-[15px] font-semibold text-ink">
        {n}
      </span>
      <h3 className="mt-4 text-[18px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-hairline-soft bg-canvas p-6 transition hover:shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-rausch/10 text-rausch">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-bodytext">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hairline-soft bg-canvas/90 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-content items-center justify-between px-5">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-[16px] font-medium text-ink hover:text-rausch">How it works</a>
            <a href="#features" className="text-[16px] font-medium text-ink hover:text-rausch">Features</a>
            <a href="#pricing" className="text-[16px] font-medium text-ink hover:text-rausch">Pricing</a>
          </div>
          <a
            href="#waitlist"
            className="rounded-full bg-rausch px-5 py-2.5 text-[14px] font-medium text-canvas transition hover:bg-rausch-active"
          >
            Get early access
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-content px-5 pb-section pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-[13px] font-medium text-ink">
              <span className="h-2 w-2 rounded-full bg-rausch" />
              Now onboarding Delhi NCR dealers
            </span>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.08] tracking-tight text-ink md:text-[56px]">
              Ek link mein
              <br />
              poori gaadi.
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-bodytext text-pretty">
              Upload 5–8 photos and a 30-second voice note. Motrfolio&apos;s AI builds a
              clean, professional listing page for every car — ready to share on WhatsApp
              in under 60 seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="flex h-12 items-center justify-center rounded-sm bg-rausch px-6 text-[16px] font-medium text-canvas transition hover:bg-rausch-active"
              >
                Get early access — free
              </a>
              <a
                href="#how"
                className="flex h-12 items-center justify-center rounded-sm border border-strongborder bg-canvas px-6 text-[16px] font-medium text-ink transition hover:bg-surface-soft"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-[14px] text-muted">
              Free for your first 3 listings · No app download to start
            </p>
          </div>

          {/* Before / After visual */}
          <div className="animate-fade-up">
            <div className="grid grid-cols-2 gap-4">
              {/* Before */}
              <div className="rounded-lg border border-hairline bg-surface-soft p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-muted-soft">
                  Before · WhatsApp dump
                </p>
                <div className="space-y-2">
                  <div className="h-20 rounded-sm bg-strongborder/40" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-sm bg-strongborder/40" />
                    <div className="h-10 rounded-sm bg-strongborder/40" />
                    <div className="h-10 rounded-sm bg-strongborder/40" />
                  </div>
                  <div className="h-2 w-4/5 rounded-full bg-strongborder/50" />
                  <div className="h-2 w-2/3 rounded-full bg-strongborder/50" />
                  <div className="h-2 w-1/2 rounded-full bg-strongborder/50" />
                </div>
              </div>
              {/* After */}
              <div className="rounded-lg border border-hairline bg-canvas p-4 shadow-card">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-rausch">
                  After · Motrfolio page
                </p>
                <div className="space-y-2">
                  <div className="relative h-20 overflow-hidden rounded-sm bg-gradient-to-br from-ink/80 to-ink">
                    <span className="absolute bottom-1 left-1 rounded-full bg-canvas/90 px-2 py-0.5 text-[10px] font-semibold text-ink">
                      2019 · 42,000 km
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-sm bg-surface-strong" />
                    <div className="h-10 rounded-sm bg-surface-strong" />
                    <div className="h-10 rounded-sm bg-surface-strong" />
                  </div>
                  <div className="h-3 w-3/4 rounded-full bg-ink/80" />
                  <div className="h-2 w-full rounded-full bg-hairline" />
                  <div className="h-2 w-5/6 rounded-full bg-hairline" />
                  <div className="mt-1 h-7 rounded-full bg-rausch" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-[13px] text-muted">
              Same car. One is a mess. One closes the deal.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-hairline-soft bg-surface-soft">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {[
            ["< 60 sec", "to build a listing"],
            ["₹149", "per listing to start"],
            ["70%", "of India's used cars sell via local dealers"],
            ["WhatsApp", "-first — no app needed"],
          ].map(([big, small]) => (
            <div key={small} className="text-center">
              <p className="text-[26px] font-bold text-ink">{big}</p>
              <p className="mt-1 text-[13px] text-muted">{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-content px-5 py-section">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-bold tracking-tight text-ink">From voice note to live link</h2>
          <p className="mt-3 text-[17px] text-muted">
            No forms to fill. No typing. Your dealers already know how to send photos and
            a voice note on WhatsApp — that&apos;s the whole workflow.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <StepCard n="1" title="Send photos + a voice note">
            Snap 5–8 photos of the car and record a 30-second voice note describing it —
            in Hindi, English, or a mix. Send it on WhatsApp or in the app.
          </StepCard>
          <StepCard n="2" title="AI builds the page">
            Motrfolio transcribes the voice note, reads the photos for specs and condition,
            and writes a clean listing — year, make, model, mileage, highlights.
          </StepCard>
          <StepCard n="3" title="Share the link anywhere">
            Get a shareable motrfolio.in link and a WhatsApp-ready message. Every buyer
            enquiry lands in your dealer dashboard as a lead.
          </StepCard>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-hairline-soft bg-surface-soft">
        <div className="mx-auto max-w-content px-5 py-section">
          <div className="max-w-2xl">
            <h2 className="text-[32px] font-bold tracking-tight text-ink">
              Everything a dealer needs to look professional
            </h2>
            <p className="mt-3 text-[17px] text-muted">
              Not a marketplace. Not a CRM you have to learn. The listing engine that makes
              your OLX post, WhatsApp share, and showroom pitch all point to one clean page.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<Icon path="M4 5h16v10H4z M4 19h16" />} title="AI-written descriptions">
              Claude turns your voice note into crisp listing copy with the details buyers
              actually ask about.
            </FeatureCard>
            <FeatureCard icon={<Icon path="M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7" />} title="Specs from photos">
              Vision AI reads colour, condition and visible details straight from the images —
              no manual data entry.
            </FeatureCard>
            <FeatureCard icon={<Icon path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />} title="WhatsApp-ready share">
              A formatted share message and link your dealer can forward to buyers in one tap.
            </FeatureCard>
            <FeatureCard icon={<Icon path="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />} title="Lead capture + dashboard">
              Every buyer who fills the enquiry form on a listing becomes a tracked lead in
              the dealer dashboard.
            </FeatureCard>
            <FeatureCard icon={<Icon path="M3 3v18h18 M7 15l4-4 3 3 5-6" />} title="Market pricing intel">
              See what similar cars are listed at, so dealers price to sell — coming as the
              inventory grows.
            </FeatureCard>
            <FeatureCard icon={<Icon path="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />} title="Built for Indian dealers">
              Hindi + English voice notes, ₹ pricing, WhatsApp-first — designed for how the
              unorganised market actually sells.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-content px-5 py-section">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-bold tracking-tight text-ink">Simple pricing that starts free</h2>
          <p className="mt-3 text-[17px] text-muted">
            Try it on 3 real listings before you pay anything. Then pick a plan that fits your
            inventory.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Per Listing", price: "₹149", unit: "/ listing", pts: ["One AI-generated page", "Shareable WhatsApp link", "Pay as you go"] },
            { name: "Starter", price: "₹999", unit: "/ month", pts: ["Up to 10 listings/mo", "Shareable links", "Basic lead capture"] },
            { name: "Growth", price: "₹1,999", unit: "/ month", pts: ["Up to 30 listings/mo", "Lead dashboard", "Follow-up reminders"], featured: true },
            { name: "Pro", price: "₹3,499", unit: "/ month", pts: ["Unlimited listings", "WhatsApp CRM", "Team access"] },
          ].map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-lg border p-6 ${
                p.featured ? "border-rausch bg-canvas shadow-card" : "border-hairline bg-canvas"
              }`}
            >
              {p.featured && (
                <span className="mb-3 inline-block w-fit rounded-full bg-rausch px-2.5 py-0.5 text-[11px] font-semibold text-canvas">
                  Most popular
                </span>
              )}
              <h3 className="text-[16px] font-semibold text-ink">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[30px] font-bold text-ink">{p.price}</span>
                <span className="text-[14px] text-muted">{p.unit}</span>
              </div>
              <ul className="mt-5 space-y-3">
                {p.pts.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-[14px] text-bodytext">
                    <span className="mt-0.5 text-rausch"><Check /></span>
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-6 flex h-11 items-center justify-center rounded-sm text-[15px] font-medium transition ${
                  p.featured
                    ? "bg-rausch text-canvas hover:bg-rausch-active"
                    : "border border-strongborder text-ink hover:bg-surface-soft"
                }`}
              >
                Get early access
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-t border-hairline-soft bg-surface-soft">
        <div className="mx-auto max-w-content px-5 py-section">
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <h2 className="text-[32px] font-bold tracking-tight text-ink">
                Be one of the first 50 dealers
              </h2>
              <p className="mt-3 text-[17px] text-muted">
                We&apos;re onboarding Delhi NCR dealers first. Join the waitlist and we&apos;ll
                set up your first 3 listings for free.
              </p>
            </div>
            <div className="mt-8 rounded-lg border border-hairline bg-canvas p-6 shadow-card sm:p-8">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline-soft bg-canvas">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <Logo />
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} Motrfolio · Ek link mein poori gaadi.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Inline stroke icon */
function Icon({ path }: { path: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {path.trim().split(" M").map((seg, i) => (
        <path
          key={i}
          d={(i === 0 ? seg : "M" + seg).trim()}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
