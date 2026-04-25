import { getPool } from "../db/pool";
import type { CompetitionLevel, Product, Supplier } from "../types/product";

const productFields = `
    p.id, p.name, p.category, p.description, p.image_url, p.cost_price, p.selling_price,
    p.profit_margin, p.trend_score, p.demand_score, p.competition_level, p.target_audience, p.created_at,
    c.reel_hook, c.demo_idea, c.caption, c.hashtags,
    (
      SELECT COALESCE(
        json_agg(json_build_object('name', s.name, 'url', s.url, 'price', s.price) ORDER BY s.id),
        '[]'::json
      )
      FROM suppliers s
      WHERE s.product_id = p.id
    ) AS suppliers
`;

const baseFrom = `
  FROM products p
  INNER JOIN product_content c ON c.product_id = p.id
`;

type Row = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  cost_price: number;
  selling_price: number;
  profit_margin: number;
  trend_score: number;
  demand_score: number;
  competition_level: string;
  target_audience: string;
  created_at: Date | string;
  reel_hook: string;
  demo_idea: string;
  caption: string;
  hashtags: string[];
  suppliers: unknown;
  city_trend_score?: number | null;
};

function toProduct(row: Row): Product {
  const suppliers = row.suppliers as Supplier[] | null;
  const trend =
    row.city_trend_score != null && row.city_trend_score !== undefined
      ? Number(row.city_trend_score)
      : row.trend_score;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    imageUrl: row.image_url,
    costPrice: row.cost_price,
    sellingPrice: row.selling_price,
    profitMargin: row.profit_margin,
    trendScore: trend,
    demandScore: row.demand_score,
    competitionLevel: row.competition_level as CompetitionLevel,
    targetAudience: row.target_audience,
    suppliers: Array.isArray(suppliers) ? suppliers : [],
    content: {
      reelHook: row.reel_hook,
      demoIdea: row.demo_idea,
      caption: row.caption,
      hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
    },
    createdAt: new Date(row.created_at as string | number | Date).toISOString(),
  };
}

export type ProductListFilters = {
  category?: string;
  minMargin?: number;
  maxPrice?: number;
  cityId?: number;
};

export async function listProducts(
  filters: ProductListFilters
): Promise<Product[]> {
  const values: unknown[] = [];
  const parts: string[] = [];
  let n = 1;

  const useCity = filters.cityId != null && !Number.isNaN(filters.cityId);
  if (useCity) {
    values.push(filters.cityId);
    n += 1;
  }

  if (filters.category) {
    values.push(filters.category);
    parts.push(`LOWER(p.category) = LOWER($${n}::text)`);
    n += 1;
  }
  if (filters.minMargin != null) {
    values.push(filters.minMargin);
    parts.push(`p.profit_margin >= $${n}::int`);
    n += 1;
  }
  if (filters.maxPrice != null) {
    values.push(filters.maxPrice);
    parts.push(`p.selling_price <= $${n}::int`);
    n += 1;
  }

  const where = parts.length > 0 ? `WHERE ${parts.join(" AND ")}` : "";

  const joinCity = useCity
    ? `INNER JOIN product_city_trend pct ON pct.product_id = p.id AND pct.city_id = $1::int`
    : "";

  const selectExtra = useCity ? `, pct.local_trend_score AS city_trend_score` : "";
  const orderBy = useCity
    ? `ORDER BY pct.local_trend_score DESC, pct.local_rank NULLS LAST, p.id`
    : `ORDER BY p.trend_score DESC, p.id`;

  const sql = `
    SELECT ${productFields} ${selectExtra}
    ${baseFrom}
    ${joinCity}
    ${where}
    ${orderBy}
  `;
  const { rows } = await getPool().query<Row>(sql, values);
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const sql = `SELECT ${productFields} ${baseFrom} WHERE p.id = $1::text`;
  const { rows } = await getPool().query<Row>(sql, [id]);
  if (rows.length === 0) {
    return null;
  }
  return toProduct(rows[0]!);
}

export async function listTrending(limit: number): Promise<Product[]> {
  const sql = `SELECT ${productFields} ${baseFrom} ORDER BY p.trend_score DESC, p.id LIMIT $1::int`;
  const { rows } = await getPool().query<Row>(sql, [limit]);
  return rows.map(toProduct);
}

/** Trending for a specific city; uses product_city_trend when migration is applied. */
export async function listTrendingByCity(
  cityId: number,
  limit: number
): Promise<Product[]> {
  const sql = `
    SELECT ${productFields}, pct.local_trend_score AS city_trend_score
    ${baseFrom}
    INNER JOIN product_city_trend pct
      ON pct.product_id = p.id AND pct.city_id = $1::int
    ORDER BY pct.local_trend_score DESC, pct.local_rank NULLS LAST, p.id
    LIMIT $2::int
  `;
  const { rows } = await getPool().query<Row>(sql, [cityId, limit]);
  return rows.map(toProduct);
}

export type TrendKeyword = {
  keyword: string;
  searchVolume: number;
  trendScore: number;
};

export async function listTrendKeywords(): Promise<TrendKeyword[]> {
  const { rows } = await getPool().query<{
    keyword: string;
    search_volume: number;
    trend_score: number;
  }>(
    `SELECT keyword, search_volume, trend_score FROM trend_keywords
     ORDER BY trend_score DESC, keyword`
  );
  return rows.map((r) => ({
    keyword: r.keyword,
    searchVolume: r.search_volume,
    trendScore: r.trend_score,
  }));
}
