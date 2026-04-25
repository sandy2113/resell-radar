"""Google Trends (pytrends) → structured scores per city and national table."""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
from pytrends.request import TrendReq

from config import EXTRA_KEYWORDS, SLEEP_BETWEEN_CALLS, TIMEFRAMES, TRENDS_GEO

logger = logging.getLogger(__name__)

# Our DB city slug → substrings in Google’s metro names (IN / CITY)
CITY_NAME_ALIASES: Dict[str, List[str]] = {
    "mumbai": ["mumbai", "thane", "navi mumbai", "bhiwandi"],
    "delhi": ["delhi", "new delhi", "gurgaon", "gurugram", "noida", "ghaziabad", "faridabad"],
    "bengaluru": ["bengaluru", "bangalore", "bengaluru urban"],
    "hyderabad": ["hyderabad", "secunderabad", "ranga reddy", "cyberabad"],
}

MAX_KEYWORDS = 4  # pytrends URL length safety


def _trendreq() -> TrendReq:
    return TrendReq(hl="en-IN", tz=330, timeout=(10, 25))


def fetch_interest_by_region_for_keywords(
    keywords: List[str], timeframe: str, geo: str
) -> Optional[pd.DataFrame]:
    if not keywords:
        return None
    tr = _trendreq()
    tr.build_payload(keywords, cat=0, timeframe=timeframe, geo=geo, gprop="")
    time.sleep(SLEEP_BETWEEN_CALLS)
    try:
        return tr.interest_by_region(resolution="CITY", inc_low_vol=True, inc_geo_code=False)
    except Exception as e:
        logger.warning("interest_by_region failed: %s", e)
        return None


def fetch_interest_over_time_india(
    keywords: List[str], timeframe: str
) -> Optional[pd.DataFrame]:
    if not keywords:
        return None
    tr = _trendreq()
    tr.build_payload(keywords, cat=0, timeframe=timeframe, geo=TRENDS_GEO, gprop="")
    time.sleep(SLEEP_BETWEEN_CALLS)
    try:
        return tr.interest_over_time()
    except Exception as e:
        logger.warning("interest_over_time failed: %s", e)
        return None


def _norm(s: str) -> str:
    return s.lower().strip()


def _region_score_for_slug(df: pd.DataFrame, col: str, slug: str) -> Optional[int]:
    if df is None or col not in df.columns or df.index.empty:
        return None
    aliases = CITY_NAME_ALIASES.get(slug, [slug.replace("-", " ")])
    best: List[float] = []
    for idx in df.index:
        iname = _norm(str(idx))
        for a in aliases:
            if a in iname or iname in a:
                try:
                    val = float(df.loc[idx, col])
                except (KeyError, TypeError, ValueError):
                    continue
                if pd.notna(val):
                    best.append(val)
                break
    if not best:
        return None
    return int(min(100, max(0, round(max(best)))))


def run_city_fetch(
    keywords: List[str], city_rows: List[Tuple[int, str, str]]
) -> Dict[Tuple[int, str], int]:
    """
    Returns (city_id, keyword) -> interest 0-100
    """
    out: Dict[Tuple[int, str], int] = {}
    for timeframe in TIMEFRAMES:
        for i in range(0, len(keywords), MAX_KEYWORDS):
            batch = keywords[i : i + MAX_KEYWORDS]
            df = fetch_interest_by_region_for_keywords(batch, timeframe, TRENDS_GEO)
            if df is None or df.empty:
                continue
            for col in batch:
                if col not in df.columns:
                    continue
                for cid, _name, slug in city_rows:
                    score = _region_score_for_slug(df, col, slug)
                    if score is not None:
                        out[(cid, col)] = score
        if out:
            break
    return out


def run_national_totals(
    keywords: List[str],
) -> List[Tuple[str, int, int]]:
    """
    (keyword, search_volume_proxy, trend_score) for trend_keywords table.
    Uses last rows of interest_over_time as proxy.
    """
    res: List[Tuple[str, int, int]] = []
    for timeframe in TIMEFRAMES:
        for i in range(0, len(keywords), MAX_KEYWORDS):
            batch = keywords[i : i + MAX_KEYWORDS]
            iot = fetch_interest_over_time_india(batch, timeframe)
            if iot is None or iot.empty:
                continue
            for col in batch:
                if col not in iot.columns:
                    continue
                series = iot[col].dropna()
                if series.empty:
                    continue
                last = int(min(100, max(0, round(float(series.iloc[-1])))))
                mean7 = int(min(100, max(0, round(float(series.tail(7).mean())))))
                # Search volume is not provided by free Trends — scale interest
                svol = max(0, int(mean7 * 300 + last * 100))
                res.append((col, svol, max(last, mean7)))
        if res:
            break
    return res
