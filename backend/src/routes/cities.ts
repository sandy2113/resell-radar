import { Router } from "express";
import { mockCities } from "../data/mockLocation";
import { isDatabaseConfigured } from "../db/pool";
import { listCities } from "../repositories/locationRepository";

export const citiesRouter = Router();

citiesRouter.get("/", async (_req, res, next) => {
  try {
    if (isDatabaseConfigured()) {
      const data = await listCities();
      return res.json(data);
    }
    return res.json(mockCities);
  } catch (e) {
    next(e);
  }
});
