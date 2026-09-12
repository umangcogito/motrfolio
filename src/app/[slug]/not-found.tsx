import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-rausch text-[20px] font-bold text-canvas">
        M
      </span>
      <h1 className="mt-6 text-[24px] font-bold text-ink">Listing not found</h1>
      <p className="mt-2 max-w-sm text-[15px] text-muted">
        This car may have been sold or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm bg-rausch px-6 py-3 text-[15px] font-medium text-canvas transition hover:bg-rausch-active"
      >
        Go to Motrfolio
      </Link>
    </div>
  );
}
