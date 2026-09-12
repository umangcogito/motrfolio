"use client";

import { useState } from "react";
import type { ListingPhoto } from "@/lib/listings";

export default function ListingGallery({ photos }: { photos: ListingPhoto[] }) {
  const [active, setActive] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-surface-strong text-muted">
        No photos yet
      </div>
    );
  }

  const main = photos[Math.min(active, photos.length - 1)];

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={main.url}
        alt={main.alt ?? "Car photo"}
        className="aspect-[4/3] w-full rounded-lg object-cover"
      />
      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`overflow-hidden rounded-sm transition ${
                i === active ? "ring-2 ring-rausch ring-offset-2" : "opacity-80 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.alt ?? ""} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
