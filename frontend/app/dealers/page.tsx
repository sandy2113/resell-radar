import { CityPills } from "@/components/CityPills";
import { api } from "@/lib/api";

const DEFAULT = "mumbai";

export default async function DealersPage({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  const slug = (searchParams.city ?? DEFAULT).toLowerCase();
  const cities = await api.listCities().catch(() => [] as Awaited<ReturnType<typeof api.listCities>>);
  const current = cities.find((c) => c.slug === slug) ?? cities[0];
  const cityId = current?.id ?? 1;
  const dealers = await api.listDealers(cityId).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Local & wholesale contacts
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Sample <strong>dealer-style</strong> entries for the selected city —
          use them as a map of where to source or compare stock. Listings are
          illustrative; verify before you move money.
        </p>
        {current ? (
          <p className="mt-1 text-sm text-slate-500">
            {current.name}
            {current.region ? ` · ${current.region}` : ""} · {current.country.name}
          </p>
        ) : null}
      </div>

      {cities.length > 0 ? (
        <CityPills
          cities={cities}
          activeSlug={current?.slug ?? DEFAULT}
          basePath="/dealers"
        />
      ) : null}

      <ul className="space-y-4">
        {dealers.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center text-slate-500">
            No dealers for this city in the database yet. Run{" "}
            <code className="rounded bg-slate-100 px-1">migration_002</code> and
            seed, or add rows in DBeaver.
          </li>
        ) : (
          dealers.map((d) => (
            <li
              key={d.id}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-glass"
            >
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {d.name}
                  </h2>
                  {d.area ? (
                    <p className="text-sm text-slate-500">Area: {d.area}</p>
                  ) : null}
                  {d.notes ? (
                    <p className="mt-2 text-sm text-slate-600">{d.notes}</p>
                  ) : null}
                </div>
                <div className="shrink-0 text-sm text-slate-600">
                  {d.phone ? <div>{d.phone}</div> : null}
                  {d.website ? (
                    <a
                      className="font-medium text-cyan-700 hover:underline"
                      href={d.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Website
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
