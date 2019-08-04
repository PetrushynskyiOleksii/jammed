"""This module provides project management."""

import sys
import logging

from mongo.worker import MONGER
from collector.gtfs import GTFSCollector
from utils.constants import ROUTES_COLLECTION, BASE_DIR
from utils.easyway_helpers import parse_routes


LOGGER = logging.getLogger('JAMMED')
LOGGER.setLevel(logging.DEBUG)

c_handler = logging.StreamHandler()
f_handler = logging.FileHandler(f'{BASE_DIR}/var/logs/jammed.log')

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
c_handler.setFormatter(formatter)
f_handler.setFormatter(formatter)

LOGGER.addHandler(c_handler)
LOGGER.addHandler(f_handler)


def load_routes():
    """
    Load csv file with static data about routes in Lviv,
    and insert formatted documents to `routes` mongo collection.
    """
    routes = parse_routes()
    inserted_cnt = MONGER.insert_many(routes, ROUTES_COLLECTION)
    LOGGER.info(f'Successfully inserted {len(inserted_cnt)} routes.')

    return inserted_cnt


def run_collector():
    try:
        frequency = int(sys.argv[2])
    except (IndexError, ValueError):
        LOGGER.error('Invalid frequency. Please provide integer number as frequency.')
        return

    collector = GTFSCollector(frequency)
    collector.run()


if __name__ == '__main__':
    commands = {
        'load_routes': load_routes,
        'collect': run_collector,
    }

    if len(sys.argv) > 1:
        arg = sys.argv[1]
        command = commands.get(arg)
        if command:
            command()
        else:
            LOGGER.error(f"No such command. "
                         f"Please provide one of existing command: {', '.join(commands.keys())}")
