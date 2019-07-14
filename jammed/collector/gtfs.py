"""This module provides daemon to work with GTFS data."""

import os
import time
import argparse

from mongo.worker import MONGER
from utils.file_helpers import download_file
from utils.easyway_helpers import compile_gtfs
from utils.constants import ROUTES_COLLECTION


VEHICLE_URL = 'http://track.ua-gis.com/gtfs/lviv/vehicle_position'


class GTFSCollector:
    """Daemon class that provides collecting GTFS data from EasyWay."""

    def __init__(self, frequency):
        """Initializes the new daemon instance."""
        self.name = self.__class__.__name__
        self.frequency = frequency
        self.pid = None

    def start(self):
        """Executes before Daemon instance starts to process user-defined commands."""
        self.pid = os.getpid()
        message = f'{self.name} was successfully started with process id={self.pid}.'
        # TODO: add logging

    def run(self):
        """Implements permanent repetition for the execution of certain commands."""
        self.start()
        while True:
            self.execute()
            time.sleep(self.frequency)

    def execute(self):
        """
        Defines commands to download data about Lviv transport geolocation,
        compile to the loaded json format and insert it to the database.
        """
        gtfs_content = download_file(VEHICLE_URL)
        if not VEHICLE_URL:
            # TODO: add logging
            return False

        gtfs_json = compile_gtfs(gtfs_content)
        if not gtfs_json:
            # TODO: add logging
            return False

        for route_id, trips in gtfs_json.items():
            is_updated = MONGER.update(
                query_filter={'id': route_id},
                modifications={'$push': {'trips': {'$each': trips}}},
                collection=ROUTES_COLLECTION
            )
            # TODO: add logging if not updated

        return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('frequency', type=int)
    args = parser.parse_args()
    GTFS_COLLECTOR = GTFSCollector(args.frequency)
    GTFS_COLLECTOR.run()
