"""This module provides daemon to work with GTFS data."""

import re
import time
import logging
import collections
from datetime import datetime

from pymongo.errors import PyMongoError
from shapely.geometry import Point

from settings import VEHICLE_URL
from app import database
from app.utils import download_context
from app.easyway import compile_gtfs, parse_routes_names, ROUTE_TYPE_MAP, REGIONS_BOUNDS


LOG = logging.getLogger("JAMMED")
MIN_DISTANCE = 1 / 0.25  # TODO: get min distance from the database
ROUTES_NAMES = parse_routes_names()


class TrafficCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    def __init__(self, frequency):
        """Initializes the new daemon instance with provided configurations."""
        self.collect_date = datetime.now()
        self.frequency = frequency
        self.attempts = 1
        self.sleep_time = 10
        self.prev_odometers = {}  # TODO: get prev odometers from database

        self.traffic = database.traffic
        self.traffic_congestion = database.traffic_congestion

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

    def _insert_data(self, traffic, congestion):
        """Insert collected data to database."""
        try:
            self.traffic.insert_many(traffic)
            self.traffic_congestion.insert_many(congestion)
        except PyMongoError as err:
            LOG.error("Could not insert collected routes: %s", err)

    def _parse_traffic(self, gtfs_compiled):
        """Prepare traffic transport timeseries for inserting to database."""
        traffic = []
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

                traffic.append({
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

        return traffic

    @staticmethod
    def _parse_traffic_congestion(traffic):
        """Prepare traffic congestion for inserting to database."""
        regions_distances = collections.defaultdict(list)
        for route in traffic:
            trip_distance = route["trip_distance"]
            point = Point((route["trip_latitude"], route["trip_longitude"]))
            for name, poly in REGIONS_BOUNDS.items():
                if poly.contains(point):
                    regions_distances[name].append(trip_distance)

        def get_congestion_percentage(distances):
            """Return region congestion in percentage."""
            distances = list(filter(lambda x: x != 0, distances))
            try:
                avg_distance = sum(distances) / len(distances)
                return 100 / avg_distance / MIN_DISTANCE
            except ZeroDivisionError:
                return 0

        timestamp = int(time.time())
        traffic_congestion = [{
            "id": region,
            "value": get_congestion_percentage(distances),
            "timestamp": timestamp
        } for region, distances in regions_distances.items()]

        return traffic_congestion

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

        traffic = self._parse_traffic(gtfs_compiled)
        traffic_congestion = TrafficCollector._parse_traffic_congestion(traffic)

        self._insert_data(traffic, traffic_congestion)

        LOG.info("Successfully collected %s trips.", len(traffic))
        return True
