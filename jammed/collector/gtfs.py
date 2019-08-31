"""This module provides daemon to work with GTFS data."""

import os
import time
import json
import logging
from datetime import datetime

from mongo.worker import MONGER
from utils.file_helpers import download_file
from utils.easyway_helpers import compile_gtfs, parse_routes
from utils.constants import ROUTES_COLLECTION, DYNAMIC_GRAPHS_COLLECTION, VEHICLE_URL, COLLECTED_DIR


DEFAULT_SLEEP_TIME = 10
LOGGER = logging.getLogger('JAMMED')


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    def __init__(self, frequency):
        """Initializes the new daemon instance."""
        self.collect_date = datetime.now()
        self.frequency = frequency
        self.attempts = 1
        self.pid = None

        self.static_routes = {x['id']: x['transport_type'] for x in parse_routes()}

    def dump_data(self):
        """Dump collection data from database to file."""
        documents = MONGER.find(collection=ROUTES_COLLECTION, fields={'_id': 0})
        if not documents:
            LOGGER.warning(f'Could not find any document in collection {ROUTES_COLLECTION}')
            return

        modifications = {'$set': {'trips': []}}
        routes_updated = MONGER.update(
            query_filter={},
            modifications=modifications,
            collection=ROUTES_COLLECTION)
        LOGGER.info(f'Flushed trips for {routes_updated} routes.')

        filename = self.collect_date.strftime('%Y%m%d')
        with open(f'{COLLECTED_DIR}/{filename}.json', 'w+') as f:
            try:
                json.dump(documents, f)
            except (TypeError, AttributeError) as err:
                LOGGER.error(f'Could not deserialize documents: {err}')
                return

        LOGGER.info(f'Successfully dumped documents to `{filename}.json`')

    def run(self):
        """Implements permanent repetition for the execution of certain commands."""
        self.pid = os.getpid()
        LOGGER.info(f'{self.__class__.__name__} was successfully started with pid={self.pid}.')

        while True:
            current_date = datetime.now()
            if self.collect_date.day != current_date.day:
                self.dump_data()
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
        total_routes = total_trips = 0
        for route_id, trips in gtfs_dict.items():
            MONGER.update(
                query_filter={'id': route_id},
                modifications={'$push': {'trips': {'$each': trips}}},
                collection=ROUTES_COLLECTION
            )

            trips_count = len(trips)
            route_speeds = [trip['speed'] for trip in trips if trip['speed'] > 0]
            route_avg_speed = sum(route_speeds) / trips_count
            route_coordinates = [(trip['latitude'], trip['longitude']) for trip in trips]
            graphs_data.append({
                'route_id': route_id,
                'route_type': self.static_routes.get(route_id),
                'avg_speed': route_avg_speed,
                'trips_count': trips_count,
                'coordinates': route_coordinates,
                'timestamp': time.time()
            })

            total_routes += 1
            total_trips += trips_count

        MONGER.insert_many(graphs_data, DYNAMIC_GRAPHS_COLLECTION)
        LOGGER.info(f'Successfully pushed {total_trips} trips to {total_routes} routes.')
        return True
