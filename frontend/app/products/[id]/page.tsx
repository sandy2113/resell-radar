import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product;
  try {
    product = await api.getProduct(params.id);
  } catch {
    return notFound();
  }

  return (
    <article className="space-y-8">
      <section className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-glass">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="leading-relaxed text-slate-600">{product.description}</p>
          <p className="text-sm text-slate-500">
            Numbers below are <strong>market-style signals</strong> for
            research — not a price quote from us.
          </p>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-glass">
            <Stat label="Cost band (indic.)" value={formatINR(product.costPrice)} />
            <Stat
              label="Street / ref. price"
              value={formatINR(product.sellingPrice)}
            />
            <Stat
              label="Headroom"
              value={`+${product.profitMargin}%`}
              accent="emerald"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-glass">
            <Stat label="Momentum" value={String(product.trendScore)} />
            <Stat label="Interest" value={String(product.demandScore)} />
            <Stat
              label="Noise level"
              value={product.competitionLevel.toUpperCase()}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-glass">
        <h2 className="font-display text-xl font-semibold text-slate-900">Where it shows up</h2>
        <p className="text-sm text-slate-500">
          Marketplaces and B2B links — for comparison, not an endorsement.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {product.suppliers.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 transition hover:border-brand-500 hover:shadow-sm"
            >
              <div className="text-sm uppercase tracking-wide text-gray-500">
                {s.name}
              </div>
              <div className="mt-1 text-lg font-semibold">
                {formatINR(s.price)}
              </div>
              <div className="mt-2 text-xs text-brand-600">
                Open supplier →
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-glass">
        <h2 className="font-display text-xl font-semibold text-slate-900">Story angles</h2>
        <p className="text-sm text-slate-500">
          Angles that usually perform well in short video — adapt freely.
        </p>
        <div className="mt-4 space-y-4">
          <ContentRow label="Reel hook" value={product.content.reelHook} />
          <ContentRow label="Demo idea" value={product.content.demoIdea} />
          <ContentRow label="Caption" value={product.content.caption} />
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Hashtags
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.content.hashtags.map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-glass">
        <h2 className="font-display text-xl font-semibold text-slate-900">Who’s looking</h2>
        <p className="mt-2 text-slate-700">{product.targetAudience}</p>
      </section>
    </article>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "emerald";
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div
        className={`text-lg font-bold ${
          accent === "emerald" ? "text-emerald-700" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ContentRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  );
}
