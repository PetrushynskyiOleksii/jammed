"""This modules provides functionality to work with traffic timeseries."""

import logging

from pymongo.errors import PyMongoError

from app import DATABASE as db
from app.utils import get_time_range


LOG = logging.getLogger(__name__)


class Congestion:
    """Class that provides method to work with traffic congestion."""

    collection = db.traffic_congestion

    @classmethod
    def region_congestion(cls, region, limit):
        """Retrieve region congestion by region name."""
        try:
            result = list(cls.collection.find(
                filter={"id": region},
                limit=limit,
                projection={'_id': 0}
            ))
        except (PyMongoError, TypeError) as err:
            LOG.error("Couldn't retrieve region congestion (%s): %s", region, err)
            return None

        return result


class Transport:
    """Class that provides methods for interaction with transport static data."""

    collection = db.transport

    @classmethod
    def static_info(cls, info_id):
        """Retrieve transport static information by id."""
        try:
            cursor = cls.collection.find_one(
                filter={"id": info_id},
                projection={'_id': 0}
            )
        except PyMongoError as err:
            LOG.error("Couldn't retrieve transport static info (%s): %s", info_id, err)
            return None

        return cursor.get("data", [])


class TrafficTimeseries:
    """Class that provides methods for interaction with traffic timeseries."""

    collection = db.traffic

    @staticmethod
    def _format_timeseries(cursor):
        """Return format timeseries - timestamp:value."""
        return [
            {"timestamp": x["_id"]["timestamp"], "value": x["value"]} for x in cursor
        ]

    @classmethod
    def route_avg_speed(cls, route, delta):
        """Retrieve aggregated timeseries by route average speed."""
        start, end = get_time_range(delta)
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

        return TrafficTimeseries._format_timeseries(cursor)

    @classmethod
    def route_trips_count(cls, route, delta):
        """Retrieve aggregated timeseries by routes trips count."""
        start, end = get_time_range(delta)
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

        return TrafficTimeseries._format_timeseries(cursor)

    @classmethod
    def route_avg_distance(cls, route, delta):
        """Retrieve aggregated timeseries by routes trip distance."""
        start, end = get_time_range(delta)
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

        return TrafficTimeseries._format_timeseries(cursor)

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

        return TrafficTimeseries._format_timeseries(cursor)

    @classmethod
    def routes_names(cls, delta):
        """Retrieve unique route names for the specific period."""
        start, end = get_time_range(delta)
        pipeline = [
            {"$match": {
                "route_short_name": {"$ne": ""},
                "timestamp": {"$gte": start, "$lte": end},
            }},
            {"$group": {
                "_id": "$route_type",
                "route_names": {"$addToSet": "$route_short_name"}
            }}
        ]
        try:
            cursor = cls.collection.aggregate(pipeline)
        except PyMongoError as err:
            LOG.error("Couldn't retrieve aggregated timeseries: %s", err)
            return None

        return cursor
