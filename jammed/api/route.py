"""
This module provides functionality to work with routes data.
"""

from datetime import datetime

from mongo.worker import MONGER
from settings import TIMESERIES_COLLECTION


def get_routes_by_date(date):
    """
    Return all existing routes data for specified date.
    """
    start = date.replace(hour=0, minute=0, second=0)
    end = date.replace(hour=23, minute=59, second=59)
    result = MONGER.find(
        TIMESERIES_COLLECTION,
        query_filter={"timestamp": {"$gte": datetime.timestamp(start), "$lte": datetime.timestamp(end)}},
        fields={"_id": 0}
    )

    return result
