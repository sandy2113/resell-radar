"""Postgres helpers for the pipeline."""

from __future__ import annotations

import logging
from contextlib import contextmanager
from typing import Any, Generator, List, Tuple

import psycopg2
import psycopg2.extras

from config import DATABASE_URL

logger = logging.getLogger(__name__)


@contextmanager
def db_session() -> Generator:
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def fetch_keywords(cur) -> List[str]:
    cur.execute(
        """
        SELECT DISTINCT keyword FROM trend_keywords
        ORDER BY keyword
        """
    )
    rows = [r[0] for r in cur.fetchall() if r[0]]
    return rows


def fetch_cities(cur) -> List[Tuple[int, str, str]]:
    """id, name, slug"""
    cur.execute(
        """
        SELECT id, name, slug FROM cities ORDER BY name
        """
    )
    return [(r[0], r[1], r[2]) for r in cur.fetchall()]


def start_run(cur) -> int:
    cur.execute(
        """
        INSERT INTO pipeline_runs (status, message)
        VALUES ('running', 'pytrends fetch started')
        RETURNING id
        """
    )
    return cur.fetchone()[0]


def finish_run(cur, run_id: int, ok: bool, message: str) -> None:
    cur.execute(
        """
        UPDATE pipeline_runs
        SET finished_at = now(),
            status = %s,
            message = %s
        WHERE id = %s
        """,
        ("ok" if ok else "error", message[:2000], run_id),
    )


def upsert_city_snapshot(
    cur, city_id: int, keyword: str, interest: int, search_proxy: int, score: int
) -> None:
    cur.execute(
        """
        INSERT INTO city_trend_snapshot
          (city_id, keyword, interest_raw, search_volume_proxy, trend_score, fetched_at)
        VALUES (%s, %s, %s, %s, %s, now())
        ON CONFLICT (city_id, keyword) DO UPDATE SET
          interest_raw = EXCLUDED.interest_raw,
          search_volume_proxy = EXCLUDED.search_volume_proxy,
          trend_score = EXCLUDED.trend_score,
          fetched_at = now()
        """,
        (city_id, keyword, int(interest), int(search_proxy), int(score)),
    )


def update_national_keywords(cur, keyword_scores: List[Tuple[str, int, int]]) -> None:
    """(keyword, search_volume_proxy, trend_score)"""
    for kw, svol, tscore in keyword_scores:
        cur.execute(
            """
            UPDATE trend_keywords
            SET search_volume = %s,
                trend_score = %s
            WHERE LOWER(TRIM(keyword)) = LOWER(TRIM(%s))
            """,
            (int(svol), int(tscore), kw),
        )


def sync_product_rows_from_trend_keywords(cur) -> int:
    """
    Google Trends does not list products — it only scores *keywords*.

    When a `products.name` contains a `trend_keywords.keyword`, we copy the
    **live** `trend_score` / a derived `demand_score` into `products` so the
    app shows up-to-date momentum for the same **curated** catalogue (seed/seed
    is still the product source of truth, not a live shopping feed).
    """
    cur.execute(
        """
        UPDATE products p
        SET
          trend_score = s.ts,
          demand_score = s.dm
        FROM (
          SELECT
            p2.id,
            MAX(tk.trend_score)::int AS ts,
            LEAST(100, GREATEST(35, (MAX(tk.trend_score) * 0.92)::int))::int AS dm
          FROM products p2
          INNER JOIN trend_keywords tk
            ON strpos(lower(p2.name), lower(tk.keyword)) > 0
          GROUP BY p2.id
        ) s
        WHERE p.id = s.id
        """
    )
    n = cur.rowcount
    logger.info("products table: %s rows synced with live trend_keywords scores", n)
    return n
