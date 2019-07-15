"""This module provides daemon to work with GTFS data."""

import os
import time
import logging

from mongo.worker import MONGER
from utils.file_helpers import download_file
from utils.easyway_helpers import compile_gtfs
from utils.constants import ROUTES_COLLECTION, VEHICLE_URL


MAX_COLLECTION_TRIES = 10
LOGGER = logging.getLogger('JAMMED')


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    def __init__(self, frequency):
        """Initializes the new daemon instance."""
        self.name = self.__class__.__name__
        self.frequency = frequency
        self.is_processed = False
        self.pid = None
        self.attempts = 1

    def start(self):
        """Executes before Daemon instance starts to process user-defined commands."""
        self.pid = os.getpid()
        self.is_processed = True
        LOGGER.info(f'{self.name} was successfully started with process id={self.pid}.')

    def stop(self):
        """Executes after Daemon instance has finished processing user-defined commands."""
        self.is_processed = False
        LOGGER.info(f'{self.name} with process id={self.pid} was stopped.')

    def run(self):
        """Implements permanent repetition for the execution of certain commands."""
        self.start()
        while self.is_processed:
            executed = self.execute()
            if executed:
                self.attempts = 1
                time.sleep(self.frequency)
            elif self.attempts >= 10:
                LOGGER.critical(f'Stopping {self.name}. '
                                f'The maximum number of collecting attempts has been exhausted')
                self.stop()
            else:
                self.attempts += 1
                LOGGER.warning(f'Could not execute collecting. Attempt #{self.attempts}')

    def execute(self):
        """
        Defines commands to download data about Lviv transport geolocation,
        compile it to the dictionary format and insert it to the database.
        """
        gtfs_content = download_file(VEHICLE_URL)
        if not VEHICLE_URL:
            LOGGER.error('Failed to download file with GTFS data.')
            return False

        gtfs_dict = compile_gtfs(gtfs_content)
        if not gtfs_dict:
            LOGGER.error('Failed to compile GTFS data to json format.')
            return False

        total_routes = total_trips = 0
        for route_id, trips in gtfs_dict.items():
            is_updated = MONGER.update(
                query_filter={'id': route_id},
                modifications={'$push': {'trips': {'$each': trips}}},
                collection=ROUTES_COLLECTION
            )
            if not is_updated:
                LOGGER.error(f'Failed to update trips for route - {route_id}')
                continue

            total_routes += 1
            total_trips += len(trips)

        LOGGER.info(f'Successfully pushed {total_trips} trips to {total_routes} routes.')
        return True
