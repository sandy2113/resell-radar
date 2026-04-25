import { getPool } from "../db/pool";
import type { CategoryMeta, City, Dealer } from "../types/discovery";

export async function listCities(): Promise<City[]> {
  const { rows } = await getPool().query<{
    id: number;
    name: string;
    slug: string;
    region: string | null;
    country_code: string;
    country_name: string;
  }>(
    `SELECT ci.id, ci.name, ci.slug, ci.region,
            co.code AS country_code, co.name AS country_name
     FROM cities ci
     INNER JOIN countries co ON co.id = ci.country_id
     ORDER BY ci.name`
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    region: r.region,
    country: { code: r.country_code.trim(), name: r.country_name },
  }));
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { rows } = await getPool().query<{
    id: number;
    name: string;
    slug: string;
    region: string | null;
    country_code: string;
    country_name: string;
  }>(
    `SELECT ci.id, ci.name, ci.slug, ci.region,
            co.code AS country_code, co.name AS country_name
     FROM cities ci
     INNER JOIN countries co ON co.id = ci.country_id
     WHERE ci.slug = $1::text`,
    [slug]
  );
  const r = rows[0];
  if (!r) {
    return null;
  }
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    region: r.region,
    country: { code: r.country_code.trim(), name: r.country_name },
  };
}

export async function listCategories(): Promise<CategoryMeta[]> {
  const { rows } = await getPool().query<{
    id: number;
    slug: string;
    name: string;
    description: string | null;
    tagline: string | null;
    sort_order: number;
  }>(
    `SELECT id, slug, name, description, tagline, sort_order
     FROM categories
     ORDER BY sort_order, name`
  );
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    tagline: r.tagline,
    sortOrder: r.sort_order,
  }));
}

export async function listDealersByCity(cityId: number): Promise<Dealer[]> {
  const { rows } = await getPool().query<{
    id: number;
    city_id: number;
    name: string;
    area: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    notes: string | null;
  }>(
    `SELECT id, city_id, name, area, phone, whatsapp, website, notes
     FROM dealers
     WHERE city_id = $1::int
     ORDER BY name`,
    [cityId]
  );
  return rows.map((r) => ({
    id: r.id,
    cityId: r.city_id,
    name: r.name,
    area: r.area,
    phone: r.phone,
    whatsapp: r.whatsapp,
    website: r.website,
    notes: r.notes,
  }));
}
