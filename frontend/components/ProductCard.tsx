import Link from "next/link";
import type { Product } from "@/types/product";
import { formatINR } from "@/lib/format";

function clip(s: string, n: number) {
  if (s.length <= n) {
    return s;
  }
  return `${s.slice(0, n).trim()}…`;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-glass transition duration-300 hover:-translate-y-1 hover:shadow-glass-lg"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-50/50 via-white to-amber-50/40 opacity-0 transition group-hover:opacity-100" />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="w-fit rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {product.category}
          </span>
          <span className="w-fit rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            Momentum {product.trendScore}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {clip(product.description, 120)}
        </p>
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Indicative street price
            </div>
            <div className="text-lg font-bold text-slate-900">
              {formatINR(product.sellingPrice)}
            </div>
            <div className="text-[11px] text-slate-500">Not a offer — a signal</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase text-slate-500">
              Buzz
            </div>
            <div className="text-sm font-bold text-emerald-600">
              {product.demandScore}/100
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
