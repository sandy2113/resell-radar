import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import Link from "next/link";
import { DataExplainerBar } from "@/components/DataExplainerBar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resell Radar — What’s trending in products today",
  description:
    "See what’s heating up in categories, cities, and search — with context, not a hard sell. Explore trends, then dig into products.",
};

const nav = [
  { href: "/", label: "Today" },
  { href: "/trending", label: "Trending" },
  { href: "/categories", label: "Categories" },
  { href: "/dealers", label: "Local map" },
  { href: "/products", label: "All picks" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <div className="mesh-bg min-h-screen">
          <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <Link href="/" className="group flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                  <span className="bg-gradient-to-r from-cyan-600 to-brand-600 bg-clip-text text-transparent">
                    Resell
                  </span>{" "}
                  Radar
                </span>
                <span className="hidden rounded-md bg-amber-100/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-900 md:inline">
                  trends
                </span>
              </Link>
              <nav className="flex flex-wrap items-center gap-1 md:gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white/80 hover:text-cyan-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <DataExplainerBar />
            {children}
          </main>
          <footer className="mt-8 border-t border-slate-200/80 bg-slate-50/50">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
              <p className="max-w-2xl leading-relaxed">
                Resell Radar is a <strong>discovery</strong> surface: momentum
                scores, city lenses, and category context. We highlight what
                people are looking at right now — not a checkout flow.
              </p>
              <p className="mt-2">© {new Date().getFullYear()} Resell Radar.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
