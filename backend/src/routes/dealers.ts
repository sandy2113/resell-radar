import { Router } from "express";
import { mockDealers } from "../data/mockLocation";
import { isDatabaseConfigured } from "../db/pool";
import { listDealersByCity } from "../repositories/locationRepository";

export const dealersRouter = Router();

dealersRouter.get("/", async (req, res, next) => {
  try {
    const cityId = req.query.cityId;
    const id =
      typeof cityId === "string" && !Number.isNaN(Number(cityId))
        ? Number(cityId)
        : null;
    if (id == null) {
      return res
        .status(400)
        .json({ error: "Query parameter cityId is required" });
    }
    if (isDatabaseConfigured()) {
      const data = await listDealersByCity(id);
      return res.json(data);
    }
    return res.json(mockDealers.filter((d) => d.cityId === id));
  } catch (e) {
    next(e);
  }
});
