"""This module provides functionality to work with routes data."""

from api.utils import get_time_range
from mongo.worker import MONGER
from settings import TIMESERIES_COLLECTION


class Route:
    """Class to work with routes."""

    @staticmethod
    def coordinates(route_name):
        """Return routes coordinates in certain time period."""
        result = MONGER.find(
            TIMESERIES_COLLECTION,
            query_filter={"route_name": route_name},
            fields={"_id": 0, "timestamp": 1, "route_trips": 1},
            order_by=[("timestamp", 1)],
            limit=1
        )

        return result

    @staticmethod
    def available_routes():
        """Return available route names aggregated by route_type."""
        start, end = get_time_range(10800)

        match = {"$match": {"timestamp": {"$gte": start, "$lte": end}, "route_name": {"$ne": None}}}
        group = {"$group": {"_id": "$route_type", "route_names": {"$addToSet": "$route_name"}}}
        query = [match, group]

        result = MONGER.aggregate(TIMESERIES_COLLECTION, pipeline=query)
        return result

    @staticmethod
    def timeseries(route_name, units, delta):
        """Return values with timestamps by certain time period."""
        start, end = get_time_range(delta)

        fields = {"_id": 0, "timestamp": 1, units: 1}
        timestamp_query = {"$gte": start, "$lte": end}
        query_filter = {"route_name": route_name, "timestamp": timestamp_query}

        result = MONGER.find(TIMESERIES_COLLECTION, query_filter, fields=fields)
        return result
