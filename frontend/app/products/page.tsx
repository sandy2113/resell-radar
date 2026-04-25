import Link from "next/link";
import { CityPills } from "@/components/CityPills";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { city?: string; category?: string };
}) {
  const city = searchParams.city
    ? searchParams.city.toLowerCase()
    : undefined;
  const category = searchParams.category;

  let products: Product[] = [];
  const cities = await api.listCities().catch(
    () => [] as Awaited<ReturnType<typeof api.listCities>>
  );
  let error: string | null = null;
  try {
    products = await api.listProducts(
      city ? { city, category } : { category }
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  const active = city
    ? cities.find((c) => c.slug === city)?.slug ?? city
    : "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          All picks
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Filter by city to match <strong>local momentum</strong> when the DB has
          city rows. Category filter uses the product label.
        </p>
        {category ? (
          <p className="mt-2 text-sm text-cyan-800">
            Category: <strong>{decodeURIComponent(category)}</strong> ·{" "}
            <Link href="/products" className="underline">
              clear
            </Link>
          </p>
        ) : null}
      </div>

      {cities.length > 0 ? (
        <CityPills
          cities={cities}
          activeSlug={active}
          basePath="/products"
          showAll
          extraQuery={category ? { category } : undefined}
        />
      ) : null}

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          {error}
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center text-slate-600">
          No products for this city in the database yet. Run{" "}
          <code className="rounded bg-slate-100 px-1">db/migration_002_discovery.sql</code>{" "}
          or try another city.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
