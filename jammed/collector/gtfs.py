"""This module provides daemon to work with GTFS data."""

import os
import time
import json
import logging
from datetime import datetime

from mongo.worker import MONGER
from utils.file_helpers import download_file
from utils.easyway_helpers import compile_gtfs, parse_routes
from settings import (
    ROUTES_COLLECTION,
    TIMESERIES_COLLECTION,
    JAMMED_COLLECTION,
    VEHICLE_URL,
    COLLECTED_DIR)


DEFAULT_SLEEP_TIME = 10
LOGGER = logging.getLogger('JAMMED')


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    pid = None
    name = 'GTFSCollector'

    def __init__(self, frequency=300):
        """Initializes the new daemon instance."""
        self.collect_date = datetime.now()
        self.frequency = frequency
        self.attempts = 1
        self.prev_odometers = {}

        routes = parse_routes()
        self.route_types = {x['id']: x['transport_type'] for x in routes}
        self.route_names = {x['id']: x['short_name'] for x in routes}

    def dump_data(self):
        """Dump collection data from database to file."""
        documents = MONGER.find(collection_name=ROUTES_COLLECTION, fields={'_id': 0})
        if not documents:
            LOGGER.warning(f'Could not find any document in collection {ROUTES_COLLECTION}')
            return

        modifications = {'$set': {'trips': []}}
        routes_updated = MONGER.update(
            query_filter={},
            modifications=modifications,
            collection_name=ROUTES_COLLECTION)
        LOGGER.info(f'Flushed trips for {routes_updated} routes.')

        filename = self.collect_date.strftime('%Y%m%d')
        with open(f'{COLLECTED_DIR}/{filename}.json', 'w+') as f:
            try:
                json.dump(list(documents), f)
            except (TypeError, AttributeError) as err:
                LOGGER.error(f'Could not deserialize documents: {err}')
                return

        LOGGER.info(f'Successfully dumped documents to `{filename}.json`')

    @classmethod
    def start(cls):
        """Executes before daemon instance starts to process commands."""
        exists = MONGER.find(JAMMED_COLLECTION, query_filter={'id': cls.name})
        if exists.count():
            LOGGER.warning(f'{cls.name} is already exist with pid={exists.next().get("pid")}.')
            return

        cls.pid = os.getpid()
        MONGER.insert({'id': cls.name, 'pid': cls.pid}, JAMMED_COLLECTION)
        LOGGER.info(f'{cls.name} was started with pid={cls.pid}.')

        return cls.pid

    @classmethod
    def stop(cls):
        """Executes after daemon instance has finished processing commands."""
        MONGER.remove({'id': cls.name}, JAMMED_COLLECTION)
        LOGGER.info(f'{cls.name} was stopped with pid={cls.pid}.')
        cls.pid = None

    def run(self):
        """Implements permanent repetition for the execution of certain commands."""
        started = self.start()
        if not started:
            return

        try:
            self.repeat()
        except KeyboardInterrupt:
            self.stop()

    def repeat(self):
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
                'route_type': self.route_types.get(route_id),
                'avg_speed': route_avg_speed,
                'avg_distance': route_avg_distance,
                'trips_count': len(trips),
                'route_trips': route_trips,
                'timestamp': timestamp
            })

        inserted_count = MONGER.insert(graphs_data, TIMESERIES_COLLECTION)
        LOGGER.info(f'Successfully pushed {len(inserted_count)} routes.')
        return True


GTFS_COLLECTOR = GTFSCollector()
