import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { getPool, isDatabaseConfigured } from "./db/pool";
import { categoriesRouter } from "./routes/categoriesRoute";
import { citiesRouter } from "./routes/cities";
import { dealersRouter } from "./routes/dealers";
import { pipelineRouter } from "./routes/pipeline";
import { productsRouter } from "./routes/products";
import { trendingRouter } from "./routes/trending";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/health/db", async (_req, res) => {
    if (!isDatabaseConfigured()) {
      return res.json({
        status: "ok",
        dataSource: "mock",
        message: "DATABASE_URL not set; API uses in-memory data",
      });
    }
    try {
      await getPool().query("SELECT 1 as ok");
      return res.json({
        status: "ok",
        dataSource: "postgresql",
        database: "connected",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return res.status(503).json({
        status: "error",
        dataSource: "postgresql",
        database: "unreachable",
        error: message,
      });
    }
  });

  app.use("/api/products", productsRouter);
  app.use("/api/trending", trendingRouter);
  app.use("/api/cities", citiesRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/dealers", dealersRouter);
  app.use("/api/pipeline", pipelineRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
  });

  app.use(errorHandler);

  return app;
}
