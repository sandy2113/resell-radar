"""
One pipeline run (pytrends → Postgres).

- Does **not** insert new product SKUs: Google Trends only returns **keyword** interest.
- `trend_keywords` + `city_trend_snapshot` hold that live data.
- `SYNC_PRODUCT_TABLE=1`: copies matching keyword scores into existing `products` rows
  (curated catalogue from seed/admin) so the API shows **live momentum** on the same items.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Dict, List, Set, Tuple

from config import EXTRA_KEYWORDS, SYNC_PRODUCT_TABLE, UPDATE_PRODUCT_SCORES
from db import (
    db_session,
    fetch_cities,
    fetch_keywords,
    finish_run,
    start_run,
    sync_product_rows_from_trend_keywords,
    update_national_keywords,
    upsert_city_snapshot,
)
from trends_fetch import run_city_fetch, run_national_totals

logger = logging.getLogger(__name__)


def _merge_keywords(cur) -> List[str]:
    from_db: List[str] = fetch_keywords(cur) or []
    extra = list(EXTRA_KEYWORDS)
    seen: Set[str] = set()
    out: List[str] = []
    for k in from_db + extra:
        k2 = " ".join(k.lower().split())
        if k2 and k2 not in seen:
            seen.add(k2)
            out.append(k2)
    if not out:
        out = [
            "wall lamp",
            "portable fan",
            "yoga mat",
            "lunch box",
            "earbuds",
        ]
    return out


def _refresh_product_scores(cur) -> None:
    cur.execute(
        """
        UPDATE product_city_trend pct
        SET local_trend_score = s.score
        FROM (
          SELECT
            p.id AS product_id,
            c.id AS city_id,
            LEAST(100, GREATEST(35, MAX(cts.trend_score)))::int AS score
          FROM product_city_trend ptx
          INNER JOIN products p ON p.id = ptx.product_id
          INNER JOIN cities c ON c.id = ptx.city_id
          INNER JOIN city_trend_snapshot cts
            ON cts.city_id = c.id
            AND cts.fetched_at > now() - interval '7 days'
            AND lower(p.name) LIKE ('%%' || lower(cts.keyword) || '%%')
          WHERE ptx.product_id = p.id AND ptx.city_id = c.id
          GROUP BY p.id, c.id
        ) s
        WHERE pct.product_id = s.product_id AND pct.city_id = s.city_id
        """
    )
    n = cur.rowcount
    logger.info("product_city_trend rows updated from keyword match: %s", n)


def run_once() -> int:
    """Run a single fetch. Returns exit code 0 on success."""
    with db_session() as conn:
        with conn.cursor() as cur:
            run_id = start_run(cur)
            msg = "ok"
            ok = True
            try:
                kws = _merge_keywords(cur)
                logger.info("Keywords (%s): %s", len(kws), kws[:8])
                cities = fetch_cities(cur)
                if not cities:
                    raise RuntimeError("No rows in `cities` — run migration_002 and seed first.")

                by_city_kw = run_city_fetch(kws, cities)
                n_snap = 0
                for (cid, kw), val in by_city_kw.items():
                    svol = min(1_000_000, int(val) * 5000 + 10_000)
                    upsert_city_snapshot(cur, cid, kw, val, svol, val)
                    n_snap += 1
                logger.info("city_trend_snapshot upserts: %s", n_snap)

                if not by_city_kw:
                    msg += (
                        " | No per-city data from interest_by_region (common if Google throttles "
                        "or returns empty for IN/CITY). National totals will still be updated."
                    )

                nat = run_national_totals(kws)
                if nat:
                    merged: Dict[str, Tuple[int, int]] = {}
                    for kw, svol, tsc in nat:
                        merged[kw] = (svol, tsc)
                    for kw, (svol, tsc) in merged.items():
                        update_national_keywords(cur, [(kw, svol, tsc)])
                    logger.info("National trend_keywords updated: %s", len(merged))
                    if SYNC_PRODUCT_TABLE:
                        sync_product_rows_from_trend_keywords(cur)
                else:
                    msg += " | interest_over_time empty — skip national table."

                if UPDATE_PRODUCT_SCORES and n_snap:
                    _refresh_product_scores(cur)
                elif UPDATE_PRODUCT_SCORES and not n_snap:
                    logger.info(
                        "No city snapshots this run; skipped product_city_trend refresh."
                    )
                else:
                    logger.info("Skipping product_city_trend refresh (flag off).")
            except Exception as e:
                ok = False
                msg = f"{type(e).__name__}: {e}"
                logger.exception("Pipeline run failed")
            finally:
                finish_run(cur, run_id, ok, msg)
            return 0 if ok else 1
    return 0


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.DEBUG if os.environ.get("DEBUG") else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    sys.exit(run_once())
