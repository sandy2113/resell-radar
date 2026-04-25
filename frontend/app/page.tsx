import Link from "next/link";
import { CityPills } from "@/components/CityPills";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const DEFAULT_CITY = "mumbai";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  const citySlug = (searchParams.city ?? DEFAULT_CITY).toLowerCase();

  let products: Product[] = [];
  let cities = await api.listCities().catch(() => [] as Awaited<ReturnType<typeof api.listCities>>);
  let categories = await api
    .listCategories()
    .catch(() => [] as Awaited<ReturnType<typeof api.listCategories>>);
  let keywords: { keyword: string; trendScore: number }[] = [];
  let error: string | null = null;

  try {
    [products, keywords] = await Promise.all([
      api.listTrending({ city: citySlug }),
      api.listKeywords().catch(() => []),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load";
  }

  const active =
    cities.find((c) => c.slug === citySlug)?.slug ?? DEFAULT_CITY;

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-200/30 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-8 text-white shadow-glass-lg md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/90">
            Daily pulse — not a storefront
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight text-balance md:text-5xl">
            See what’s{" "}
            <span className="bg-gradient-to-r from-cyan-200 to-amber-200 bg-clip-text text-transparent">
              actually trending
            </span>{" "}
            in products — by city & category
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            We’re building a <strong>signal board</strong>: what’s rising in
            search, what categories are hot, and how that shifts between cities.
            No pressure to buy—explore, compare cities, and use the intel your
            way. Dealers and reference prices are context, not a pitch.
          </p>
          <div className="mt-6 flex min-h-[2.5rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {cities.length > 0 ? (
              <CityPills
                cities={cities}
                activeSlug={active}
                basePath="/"
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/categories"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
              >
                Browse categories
              </Link>
              <Link
                href="/dealers"
                className="rounded-xl border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white/95 hover:bg-white/10"
              >
                Who lists near you
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-glass">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Why use this
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Trending isn’t the same in Mumbai and Bengaluru. We surface{" "}
            <strong>local momentum</strong> (when data exists) and category
            stories you can read in 30 seconds.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-glass">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Categories
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {categories.length > 0
              ? categories.slice(0, 4).map((c) => c.name).join(" · ")
              : "Kitchen · Tech · Home · Travel — structured picks coming live."}
          </p>
          <Link
            href="/categories"
            className="mt-3 inline-block text-sm font-semibold text-cyan-700 hover:underline"
          >
            All categories →
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-6 shadow-glass">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Keywords
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {keywords.length > 0
              ? keywords
                  .slice(0, 4)
                  .map((k) => `${k.keyword} (${k.trendScore})`)
                  .join(" · ")
              : "Search interest snapshots load when the API is up."}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
              Hot in your selected city
            </h2>
            <p className="mt-1 text-slate-600">
              Ranked by local momentum when city data is in the database;
              otherwise national signals.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-cyan-700 hover:underline"
          >
            See full list →
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
            <strong>API unreachable.</strong> Start the backend (
            <code className="rounded bg-amber-100/80 px-1">npm run dev</code> in{" "}
            <code className="rounded bg-amber-100/80 px-1">backend</code>
            ). {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
