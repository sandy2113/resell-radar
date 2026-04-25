import { Router } from "express";
import { mockCities } from "../data/mockLocation";
import { mockProducts } from "../data/mockProducts";
import { isDatabaseConfigured } from "../db/pool";
import { getCityBySlug } from "../repositories/locationRepository";
import {
  listTrendKeywords,
  listTrending,
  listTrendingByCity,
} from "../repositories/productRepository";

const fallbackKeywords = [
  { keyword: "galaxy projector", searchVolume: 14000, trendScore: 92 },
  { keyword: "magnetic charger", searchVolume: 9800, trendScore: 87 },
  { keyword: "mini sealer", searchVolume: 7600, trendScore: 81 },
  { keyword: "self stirring mug", searchVolume: 5400, trendScore: 79 },
  { keyword: "posture corrector", searchVolume: 12300, trendScore: 74 },
];

/** Default and max number of products returned in one trending response (per city). */
const TRENDING_DEFAULT_LIMIT = 20;
const TRENDING_MAX_LIMIT = 50;

function parseLimit(q: unknown, fallback: number): number {
  if (typeof q !== "string") {
    return fallback;
  }
  const n = Number.parseInt(q, 10);
  if (Number.isNaN(n) || n < 1) {
    return fallback;
  }
  return Math.min(TRENDING_MAX_LIMIT, n);
}

export const trendingRouter = Router();

function mockCityIdFromQuery(cityId?: string, citySlug?: string): number | null {
  if (cityId && !Number.isNaN(Number(cityId))) {
    return Number(cityId);
  }
  if (citySlug) {
    const c = mockCities.find((x) => x.slug === citySlug);
    return c ? c.id : null;
  }
  return null;
}

trendingRouter.get("/", async (req, res, next) => {
  try {
    const qCityId = req.query.cityId;
    const qCity = req.query.city;
    const idStr = typeof qCityId === "string" ? qCityId : undefined;
    const slugStr = typeof qCity === "string" ? qCity : undefined;
    const limit = parseLimit(req.query.limit, TRENDING_DEFAULT_LIMIT);

    if (isDatabaseConfigured()) {
      let resolvedId: number | null =
        idStr && !Number.isNaN(Number(idStr)) ? Number(idStr) : null;
      if (resolvedId == null && slugStr) {
        const row = await getCityBySlug(slugStr);
        resolvedId = row?.id ?? null;
      }
      if (resolvedId != null) {
        const local = await listTrendingByCity(resolvedId, limit);
        if (local.length > 0) {
          return res.json(local);
        }
      }
      const sorted = await listTrending(limit);
      return res.json(sorted);
    }

    const mockId = mockCityIdFromQuery(idStr, slugStr);
    if (mockId != null) {
      const shuffled = [...mockProducts].sort((a, b) => b.trendScore - a.trendScore);
      return res.json(shuffled.slice(0, limit));
    }
    const sorted = [...mockProducts].sort((a, b) => b.trendScore - a.trendScore);
    return res.json(sorted.slice(0, limit));
  } catch (e) {
    next(e);
  }
});

trendingRouter.get("/keywords", async (_req, res, next) => {
  try {
    if (isDatabaseConfigured()) {
      const keywords = await listTrendKeywords();
      return res.json(keywords);
    }
    return res.json(fallbackKeywords);
  } catch (e) {
    next(e);
  }
});
