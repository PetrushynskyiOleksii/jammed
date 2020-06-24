"""This module provides daemon to work with GTFS data."""

import re
import time
import logging
from datetime import datetime

from pymongo.errors import PyMongoError

from settings import VEHICLE_URL
from app.utils import download_context
from app.easyway import compile_gtfs, parse_routes_names


LOG = logging.getLogger("JAMMED")
ROUTES_NAMES = parse_routes_names()
ROUTE_TYPE_MAP = {
    "А": "Автобус",
    "Н-А": "Нічний Автобус",
    "Т": "Трамвай",
    "Тр": "Тролейбус"
}


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    def __init__(self, database, frequency):
        """Initializes the new daemon instance with provided configurations."""
        self.collect_date = datetime.now()
        self.frequency = frequency
        self.attempts = 1
        self.sleep_time = 10
        self.prev_odometers = {}
        self.collection = database.timeseries

    def run(self):
        """Define commands to repeat its per frequency."""
        LOG.info("GTFSCollector was successfully started.")
        while True:
            collected = self._collect()
            if not collected:
                self.attempts += 1
                LOG.warning("Could not execute collecting. Attempt #%s.", self.attempts)
                time.sleep(self.sleep_time * self.attempts)
                continue

            self.attempts = 1
            time.sleep(self.frequency)

    def _insert_routes(self, routes):
        """Insert collected routes to database."""
        try:
            return self.collection.insert_many(routes).inserted_ids
        except PyMongoError as err:
            LOG.error("Could not insert collected routes: %s", err)

    def _parse_routes(self, gtfs_compiled):
        """Prepare route to inserting to database."""
        routes = []
        timestamp = int(time.time())
        route_type_re = re.compile(r"\d+")
        for route_id, trips in gtfs_compiled.items():
            for trip in trips:
                vehicle_id = trip["vehicle_id"]
                curr_odometer = trip["odometer"]
                prev_odometer = self.prev_odometers.get(vehicle_id, curr_odometer)
                self.prev_odometers[vehicle_id] = curr_odometer

                route_short_name = ROUTES_NAMES.get(route_id, "")
                route_type_short = re.sub(route_type_re, "", route_short_name)
                route_type = ROUTE_TYPE_MAP.get(route_type_short, "Інші")

                routes.append({
                    "route_id": route_id,
                    "route_short_name": route_short_name,
                    "route_type": route_type,

                    "trip_latitude": trip.get("latitude"),
                    "trip_longitude": trip.get("longitude"),
                    "trip_vehicle_id": trip.get("vehicle_id"),
                    "trip_bearing": trip.get("bearing"),
                    "trip_speed": trip.get("speed"),
                    "trip_odometer": curr_odometer,
                    "trip_distance": curr_odometer - prev_odometer,

                    "timestamp": timestamp
                })

        return routes

    def _collect(self):
        """
        Defines commands to download data about Lviv transport geolocation,
        compile it to the dictionary format and insert it to the database.
        """
        gtfs_content = download_context(VEHICLE_URL)
        if not gtfs_content:
            LOG.error("Failed to download file with GTFS data.")
            return False

        gtfs_compiled = compile_gtfs(gtfs_content)
        if not gtfs_compiled:
            LOG.error("Failed to compile GTFS data to json format.")
            return False

        routes = self._parse_routes(gtfs_compiled)
        inserted_ids = self._insert_routes(routes)
        if not inserted_ids:
            return False

        LOG.info("Successfully inserted %s trips.", len(inserted_ids))
        return True
