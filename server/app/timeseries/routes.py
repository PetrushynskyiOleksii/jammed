"""This modules provides functionality to work with route timeseries."""

import logging
from datetime import datetime

from pymongo.errors import PyMongoError

from app import DATABASE as db


LOG = logging.getLogger(__name__)


class RoutesTimeseries:
    """Class that provides methods for interaction with route timeseries."""

    collection = db.timeseries

    @staticmethod
    def _format_timeseries(cursor):
        """Return format timeseries - timestamp:value."""
        return [
            {"timestamp": x["_id"]["timestamp"], "value": x["value"]} for x in cursor
        ]

    @staticmethod
    def get_time_range(delta):
        """Return time range by delta."""
        end = datetime.now().timestamp()
        start = end - delta
        return start, end

    @classmethod
    def route_avg_speed(cls, route, delta):
        """Retrieve aggregated timeseries by route average speed."""
        start, end = RoutesTimeseries.get_time_range(delta)
        pipeline = [
            {"$match": {
                "route_short_name": route,
                "timestamp": {"$gte": start, "$lte": end}
            }},
            {"$group": {
                "_id": {
                    "route_short_name": "$route_short_name",
                    "timestamp": "$timestamp"
                },
                "value": {"$avg": "$trip_speed"}
            }},
            {"$sort": {"_id.timestamp": 1}}
        ]
        try:
            cursor = cls.collection.aggregate(pipeline)
        except PyMongoError as err:
            LOG.error("Couldn't retrieve aggregated timeseries: %s", err)
            return None

        return RoutesTimeseries._format_timeseries(cursor)

    @classmethod
    def route_trips_count(cls, route, delta):
        """Retrieve aggregated timeseries by routes trips count."""
        start, end = RoutesTimeseries.get_time_range(delta)
        pipeline = [
            {"$match": {
                "route_short_name": route,
                "timestamp": {"$gte": start, "$lte": end}
            }},
            {"$group": {
                "_id": {
                    "route_short_name": "$route_short_name",
                    "timestamp": "$timestamp"
                },
                "value": {"$sum": 1}
            }},
            {"$sort": {"_id.timestamp": 1}}
        ]
        try:
            cursor = cls.collection.aggregate(pipeline)
        except PyMongoError as err:
            LOG.error("Couldn't retrieve aggregated timeseries: %s", err)
            return None

        return RoutesTimeseries._format_timeseries(cursor)

    @classmethod
    def route_avg_distance(cls, route, delta):
        """Retrieve aggregated timeseries by routes trip distance."""
        start, end = RoutesTimeseries.get_time_range(delta)
        pipeline = [
            {"$match": {
                "route_short_name": route,
                "timestamp": {"$gte": start, "$lte": end}
            }},
            {"$group": {
                "_id": {
                    "route_short_name": "$route_short_name",
                    "timestamp": "$timestamp"
                },
                "value": {"$avg": "$trip_distance"}
            }},
            {"$sort": {"_id.timestamp": 1}}
        ]
        try:
            cursor = cls.collection.aggregate(pipeline)
        except PyMongoError as err:
            LOG.error("Couldn't retrieve aggregated timeseries: %s", err)
            return None

        return RoutesTimeseries._format_timeseries(cursor)

    @classmethod
    def route_coordinates(cls, route):
        """Retrieve last coordinates for route."""
        pipeline = [
            {"$match": {"route_short_name": route}},
            {"$group": {
                "_id": {
                    "route_name": "$route_short_name",
                    "timestamp": "$timestamp"
                },
                "value": {
                    "$addToSet": {
                        "latitude": "$trip_latitude",
                        "longitude": "$trip_longitude"
                    }
                }
            }},
            {"$sort": {"_id.timestamp": -1}},
            {"$limit": 1}
        ]
        try:
            cursor = cls.collection.aggregate(pipeline)
        except PyMongoError as err:
            LOG.error("Couldn't retrieve aggregated timeseries: %s", err)
            return None

        return RoutesTimeseries._format_timeseries(cursor)
