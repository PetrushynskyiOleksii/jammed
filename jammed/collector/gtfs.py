"""This module provides daemon to work with GTFS data."""

import re
import os
import time
import psutil
import logging
from datetime import datetime

from mongo.worker import MONGER
from collector.utils import dump_route_trips
from utils.file_helpers import download_file
from utils.easyway_helpers import compile_gtfs, parse_routes
from settings import ROUTES_COLLECTION, TIMESERIES_COLLECTION, VEHICLE_URL


DEFAULT_SLEEP_TIME = 10
LOGGER = logging.getLogger('JAMMED')


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""
    def __init__(self, frequency=300):
        """Initializes the new daemon instance."""
        self.pid = None
        self.name = 'GTFSCollector'
        self.collect_date = datetime.now()
        self.frequency = frequency
        self.attempts = 1
        self.prev_odometers = {}

        routes = parse_routes()
        self.route_types = {x['id']: x['transport_type'] for x in routes}
        self.route_names = {x['id']: x['short_name'] for x in routes}

    def is_running(self):
        """Check if daemon is already running."""
        current_pid = os.getpid()
        pattern = re.compile(r"python .*manage\.py collect \d*")
        for process in psutil.process_iter(attrs=["pid", "cmdline"]):
            process_id, cmdline = process.info.values()
            process_command = " ".join(cmdline) if type(cmdline) == list else [cmdline]
            if pattern.search(process_command) and current_pid != process_id:
                LOGGER.warning(f'{self.name} is already exist with pid={process_id}.')
                return True

        return False

    def run(self):
        """Implements permanent repetition for the execution of certain commands."""
        if self.is_running():
            return

        self.pid = os.getpid()
        LOGGER.info(f'{self.name} was started with pid={self.pid}.')

        try:
            self.repeat()
        except KeyboardInterrupt:
            LOGGER.info(f'{self.name} was stopped with pid={self.pid}.')
            self.pid = None

    def repeat(self):
        """Define commands to repeat every frequency."""
        while True:
            current_date = datetime.now()
            if self.collect_date.day != current_date.day:
                filename = self.collect_date.strftime('%Y%m%d')
                dumped = dump_route_trips(filename)
                if not dumped:
                    LOGGER.error(f"Could not dump trips to `{filename}.json`")

                LOGGER.info(f'Dumped documents to `{filename}.json`')
                self.collect_date = current_date

            executed = self.collect()
            if executed:
                self.attempts = 1
                time.sleep(self.frequency)
            else:
                self.attempts += 1
                LOGGER.warning(f'Could not execute collecting. Attempt #{self.attempts}')
                time.sleep(DEFAULT_SLEEP_TIME * self.attempts)

    def collect(self):
        """
        Defines commands to download data about Lviv transport geolocation,
        compile it to the dictionary format and insert it to the database.
        """
        gtfs_content = download_file(VEHICLE_URL)
        if not gtfs_content:
            LOGGER.error('Failed to download file with GTFS data.')
            return False

        gtfs_dict = compile_gtfs(gtfs_content)
        if not gtfs_dict:
            LOGGER.error('Failed to compile GTFS data to json format.')
            return False

        graphs_data = []
        timestamp = int(time.time())
        for route_id, trips in gtfs_dict.items():
            MONGER.update(
                query_filter={'id': route_id},
                modifications={'$push': {'trips': {'$each': trips}}},
                collection_name=ROUTES_COLLECTION
            )
            route_speeds = [trip['speed'] for trip in trips]
            route_avg_speed = sum(route_speeds) / len(route_speeds)

            route_trips = {}
            for trip in trips:
                vehicle_id = trip["vehicle_id"]
                curr_odometer = trip["odometer"]
                prev_odometer = self.prev_odometers.get(vehicle_id, curr_odometer)
                self.prev_odometers[vehicle_id] = curr_odometer

                route_trips[trip["license_plate"]] = {
                    "coordinates": {
                        "latitude": trip['latitude'],
                        "longitude": trip['longitude']
                    },
                    "speed": trip["speed"],
                    "odometer": curr_odometer,
                    "distance": curr_odometer - prev_odometer
                }

            route_distances = [x["distance"] for x in route_trips.values()]
            route_avg_distance = sum(route_distances) / len(route_distances)

            graphs_data.append({
                'route_id': route_id,
                'route_name': self.route_names.get(route_id),
                'route_type': self.route_types.get(route_id, "Інші"),
                'avg_speed': route_avg_speed,
                'avg_distance': route_avg_distance,
                'trips_count': len(trips),
                'route_trips': route_trips,
                'timestamp': timestamp
            })

        inserted_ids = MONGER.insert(graphs_data, TIMESERIES_COLLECTION)
        LOGGER.info(f'Successfully pushed {len(inserted_ids)} routes.')
        return True


GTFS_COLLECTOR = GTFSCollector()
