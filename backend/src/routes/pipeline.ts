import { Router } from "express";
import { getPool, isDatabaseConfigured } from "../db/pool";

export const pipelineRouter = Router();

/** Last N pipeline runs (Python pytrends job) — for dashboards / health */
pipelineRouter.get("/runs", async (_req, res, next) => {
  try {
    if (!isDatabaseConfigured()) {
      return res.json({ message: "Database not configured", runs: [] });
    }
    const { rows } = await getPool().query(
      `SELECT id, started_at, finished_at, status, message
       FROM pipeline_runs
       ORDER BY id DESC
       LIMIT 10`
    );
    return res.json({ runs: rows });
  } catch (e) {
    next(e);
  }
});
