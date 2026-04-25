import { Router } from "express";
import { mockProducts } from "../data/mockProducts";
import { isDatabaseConfigured } from "../db/pool";
import { getCityBySlug } from "../repositories/locationRepository";
import { getProductById, listProducts } from "../repositories/productRepository";

export const productsRouter = Router();

function filterMock(query: {
  category?: string;
  minMargin?: string;
  maxPrice?: string;
}) {
  let result = [...mockProducts];
  if (typeof query.category === "string" && query.category.length > 0) {
    result = result.filter(
      (p) => p.category.toLowerCase() === query.category!.toLowerCase()
    );
  }
  if (typeof query.minMargin === "string") {
    const m = Number(query.minMargin);
    if (!Number.isNaN(m)) {
      result = result.filter((p) => p.profitMargin >= m);
    }
  }
  if (typeof query.maxPrice === "string") {
    const p = Number(query.maxPrice);
    if (!Number.isNaN(p)) {
      result = result.filter((x) => x.sellingPrice <= p);
    }
  }
  return result;
}

productsRouter.get("/", async (req, res, next) => {
  try {
    if (isDatabaseConfigured()) {
      const { category, minMargin, maxPrice, cityId, city } = req.query;
      let cityNum: number | undefined;
      if (typeof cityId === "string" && !Number.isNaN(Number(cityId))) {
        cityNum = Number(cityId);
      } else if (typeof city === "string" && city.length > 0) {
        const row = await getCityBySlug(city);
        cityNum = row?.id;
      }
      const baseFilters = {
        category: typeof category === "string" ? category : undefined,
        minMargin:
          typeof minMargin === "string" && !Number.isNaN(Number(minMargin))
            ? Number(minMargin)
            : undefined,
        maxPrice:
          typeof maxPrice === "string" && !Number.isNaN(Number(maxPrice))
            ? Number(maxPrice)
            : undefined,
      };
      let list = await listProducts({
        ...baseFilters,
        cityId: cityNum,
      });
      if (list.length === 0 && cityNum != null) {
        list = await listProducts(baseFilters);
      }
      return res.json(list);
    }
    res.json(filterMock(req.query));
  } catch (e) {
    next(e);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    if (isDatabaseConfigured()) {
      const product = await getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json(product);
    }
    const product = mockProducts.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (e) {
    next(e);
  }
});
