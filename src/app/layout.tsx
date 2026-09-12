import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Airbnb Cereal VF (the design spec's typeface) is not freely licensable.
// Geist is used as the working substitute — geometric, friendly, same spirit.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motrfolio.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Motrfolio — Ek link mein poori gaadi",
    template: "%s · Motrfolio",
  },
  description:
    "AI-powered car listings for India's used-car dealers. Upload photos and a voice note, get a shareable, professional listing page in under 60 seconds.",
  keywords: [
    "used car listing software India",
    "car dealer app India",
    "AI car listing",
    "WhatsApp car listing",
    "Motrfolio",
  ],
  openGraph: {
    title: "Motrfolio — Ek link mein poori gaadi",
    description:
      "One link per car. Built in 60 seconds from photos + a voice note. Shareable on WhatsApp.",
    url: siteUrl,
    siteName: "Motrfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motrfolio — Ek link mein poori gaadi",
    description:
      "AI-generated, shareable car listing pages for India's used-car dealers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
