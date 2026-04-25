"""
Run the trend job in a loop (every PIPELINE_INTERVAL_SECONDS).
Usage:
  python run_scheduler.py
Or one-shot (also: python -m job):
  set INTERVAL=0 && python run_scheduler.py
"""

from __future__ import annotations

import logging
import os
import sys
import time

from config import INTERVAL_SEC
from job import run_once

logger = logging.getLogger(__name__)


def main() -> None:
    logging.basicConfig(
        level=logging.DEBUG if os.environ.get("DEBUG") else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    once = os.environ.get("RUN_ONCE", "0") == "1" or os.environ.get("INTERVAL", "") == "0"
    if once:
        sys.exit(run_once())
    if INTERVAL_SEC < 300:
        logger.warning("INTERVAL_SEC is very low; consider >= 300s to avoid Google blocks.")
    while True:
        code = run_once()
        if code != 0:
            logger.error("Run failed with exit %s; still sleeping", code)
        logger.info("Sleeping %s s until next run", INTERVAL_SEC)
        time.sleep(INTERVAL_SEC)


if __name__ == "__main__":
    main()
