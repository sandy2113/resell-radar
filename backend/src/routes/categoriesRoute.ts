import { Router } from "express";
import { mockCategories } from "../data/mockLocation";
import { isDatabaseConfigured } from "../db/pool";
import { listCategories } from "../repositories/locationRepository";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    if (isDatabaseConfigured()) {
      const data = await listCategories();
      return res.json(data);
    }
    return res.json(mockCategories);
  } catch (e) {
    next(e);
  }
});
