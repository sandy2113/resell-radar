import Link from "next/link";
import { api } from "@/lib/api";

export default async function CategoriesPage() {
  const categories = await api.listCategories().catch(() => []);

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-slate-600">
          Each category is a lens on what people are searching and watching. Use
          them to explore trends without wading through unrelated noise.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-slate-500">No categories yet — check the API.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-glass transition hover:border-cyan-300 hover:shadow-glass-lg"
            >
              <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-cyan-800">
                {c.name}
              </h2>
              {c.tagline ? (
                <p className="mt-1 text-sm font-medium text-amber-700/90">
                  {c.tagline}
                </p>
              ) : null}
              {c.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.description}
                </p>
              ) : null}
              <span className="mt-3 inline-block text-sm font-semibold text-cyan-700">
                View products →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
