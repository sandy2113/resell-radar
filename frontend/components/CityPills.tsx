import Link from "next/link";

import type { City } from "@/types/discovery";

type Props = {
  cities: City[];
  activeSlug: string;
  basePath: string;
  /** "All" = no city filter (list everything) */
  showAll?: boolean;
  /** Preserve e.g. category= when changing city */
  extraQuery?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  citySlug: string | undefined,
  extraQuery?: Record<string, string | undefined>
) {
  const p = new URLSearchParams();
  if (citySlug) {
    p.set("city", citySlug);
  }
  if (extraQuery) {
    for (const [k, v] of Object.entries(extraQuery)) {
      if (v) {
        p.set(k, v);
      }
    }
  }
  const q = p.toString();
  return q ? `${basePath}?${q}` : basePath;
}

/** Server-friendly city switcher (no client JS). */
export function CityPills({
  cities,
  activeSlug,
  basePath,
  showAll = false,
  extraQuery,
}: Props) {
  const allOn = showAll && activeSlug === "";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        City
      </span>
      {showAll ? (
        <Link
          href={buildHref(basePath, undefined, extraQuery)}
          className={
            allOn
              ? "rounded-full bg-gradient-to-r from-cyan-500 to-brand-600 px-3 py-1.5 text-sm font-semibold text-white shadow-md ring-2 ring-cyan-400/40"
              : "rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:text-cyan-800"
          }
        >
          All
        </Link>
      ) : null}
      {cities.map((c) => {
        const on = c.slug === activeSlug;
        const href = buildHref(basePath, c.slug, extraQuery);
        return (
          <Link
            key={c.id}
            href={href}
            className={
              on
                ? "rounded-full bg-gradient-to-r from-cyan-500 to-brand-600 px-3 py-1.5 text-sm font-semibold text-white shadow-md ring-2 ring-cyan-400/40"
                : "rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:text-cyan-800"
            }
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
