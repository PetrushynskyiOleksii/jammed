"""This module provides daemon to work with GTFS data."""

import re
import os
import time
import psutil
import logging
from datetime import datetime

from mongo.worker import MONGER
from api.route import get_routes_by_date
from utils.file_helpers import download_context, dump_csv
from utils.easyway_helpers import compile_gtfs, parse_routes
from settings import TIMESERIES_COLLECTION, VEHICLE_URL, COLLECTED_DIR


DEFAULT_SLEEP_TIME = 10
LOGGER = logging.getLogger('JAMMED')


class GTFSCollector:
    """
    Daemon class that provides collecting GTFS data from EasyWay.
    """

    def __init__(self):
        """
        Initializes the new daemon instance with default parameters.
        """
        self.pid = None
        self.name = 'GTFSCollector'
        self.collect_date = datetime.now()
        self.frequency = 300
        self.attempts = 1
        self.prev_odometers = {}
        self.routes_infos = {x['id']: x for x in parse_routes()}

    def is_running(self):
        """
        Check if daemon is already running.
        """
        # TODO: improve look up
        current_pid = os.getpid()
        pattern = re.compile(r"python .*manage\.py collect \d*")
        for process in psutil.process_iter(attrs=["pid", "cmdline"]):
            process_id, cmdline = process.info.values()
            if type(cmdline) != list: continue
            if pattern.search(" ".join(cmdline)) and current_pid != process_id:
                LOGGER.warning(f'{self.name} is already exist with pid={process_id}.')
                return True

        return False

    def run(self):
        """
        Provides permanent repetition for the execution of specified commands.
        """
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
        """
        Define commands to repeat its per frequency.
        """
        while True:
            current_date = datetime.now()
            if self.collect_date.day != current_date.day:
                collected_routes = get_routes_by_date(self.collect_date)
                filename = f'{self.collect_date.strftime("%Y%m%d")}.json'
                dumped = dump_csv(f'{COLLECTED_DIR}/{filename}', collected_routes)
                if not dumped:
                    LOGGER.error(f"Could not dump trips to `{filename}`")

                LOGGER.info(f'Dumped route trips to `{filename}`')
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
        gtfs_content = download_context(VEHICLE_URL)
        if not gtfs_content:
            LOGGER.error('Failed to download file with GTFS data.')
            return False

        gtfs_dict = compile_gtfs(gtfs_content)
        if not gtfs_dict:
            LOGGER.error('Failed to compile GTFS data to json format.')
            return False

        routes = []
        timestamp = int(time.time())
        for route_id, trips in gtfs_dict.items():
            route_info = self.routes_infos.get(route_id, {})
            for trip in trips:
                vehicle_id = trip['vehicle_id']
                curr_odometer = trip['odometer']
                prev_odometer = self.prev_odometers.get(vehicle_id, curr_odometer)
                self.prev_odometers[vehicle_id] = curr_odometer

                routes.append({
                    'route_id': route_id,
                    'route_short_name': route_info.get('short_name'),
                    'route_long_name': route_info.get('long_name'),
                    'route_type': route_info.get('route_type'),

                    'agency_name': route_info.get('agency_name'),
                    'agency_id': route_info.get('agency_id'),

                    'trip_latitude': trip.get('latitude'),
                    'trip_longitude': trip.get('longitude'),
                    'trip_vehicle_id': trip.get('vehicle_id'),
                    'trip_bearing': trip.get('bearing'),
                    'trip_speed': trip.get('speed'),
                    'trip_odometer': curr_odometer,
                    'trip_distance': curr_odometer - prev_odometer,

                    'timestamp': timestamp
                })

        inserted_ids = MONGER.insert(routes, TIMESERIES_COLLECTION)
        LOGGER.info(f'Successfully pushed {len(inserted_ids)} trips.')
        return True


GTFS_COLLECTOR = GTFSCollector()
