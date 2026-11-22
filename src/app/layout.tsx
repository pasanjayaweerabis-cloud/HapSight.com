import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { brand, meta } from "@/content/site";
import { bootScript } from "@/lib/a11yPrefs";
import { SkipLink } from "@/components/layout/SkipLink";
import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/** Designed by the Braille Institute for low-vision readability; a better motivated choice than a default UI sans for this audience. */
const sans = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? brand.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: meta.title, template: `%s · ${brand.name}` },
  description: meta.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: meta.title,
    description: meta.description,
    url: "/",
    locale: "en_LK",
  },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  alternates: { canonical: "/" },
  // The site has its own light/dark/high-contrast themes. This asks the Dark Reader extension
  // not to restyle the page: its injected attributes broke React hydration.
  other: { "darkreader-lock": "true" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f5" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla adds cz-shortcut-listen) edit <body> attributes before React loads */}
      <body className="flex min-h-dvh flex-col antialiased" suppressHydrationWarning>
        <SkipLink />
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <BackToTop />
        {/* Vercel Web Analytics only exists on Vercel deployments (no cookies, no personal data). */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
