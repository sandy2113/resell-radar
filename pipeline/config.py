"""Load environment for the trend pipeline."""

import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required (same as Node backend .env)")

INTERVAL_SEC = int(os.environ.get("PIPELINE_INTERVAL_SECONDS", "7200"))
UPDATE_PRODUCT_SCORES = os.environ.get("UPDATE_PRODUCT_CITY_TREND", "1") == "1"
# After trend_keywords is updated, push live scores into `products` (same rows, not new SKUs)
SYNC_PRODUCT_TABLE = os.environ.get("SYNC_PRODUCT_TABLE", "1") == "1"
SLEEP_BETWEEN_CALLS = float(os.environ.get("TRENDS_SLEEP_SECONDS", "3"))
# Comma-separated override; otherwise keywords are read from DB trend_keywords
EXTRA_KEYWORDS = [
    k.strip()
    for k in os.environ.get("TREND_KEYWORDS", "").split(",")
    if k.strip()
]

# Google Trends geo for interest_by_region (country)
TRENDS_GEO = os.environ.get("TRENDS_GEO", "IN")
# "now 7-d" | "today 1-m" — if region data is empty, try fallback timeframes
TIMEFRAMES = [os.environ.get("TRENDS_TIMEFRAME", "now 7-d"), "today 3-m"]
