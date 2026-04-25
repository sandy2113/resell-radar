import "dotenv/config";
import { createApp } from "./app";
import { isDatabaseConfigured } from "./db/pool";

const PORT = Number(process.env.PORT ?? 4000);

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[resell-radar] API listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(
    isDatabaseConfigured()
      ? "[resell-radar] Data: PostgreSQL (DATABASE_URL is set)"
      : "[resell-radar] Data: in-memory mock (set DATABASE_URL to use PostgreSQL)"
  );
});
