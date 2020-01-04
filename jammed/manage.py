"""This module provides project management."""

import sys
import logging

from mongo.worker import MONGER
from collector.gtfs import GTFS_COLLECTOR
from settings import ROUTES_COLLECTION, ROOT_DIR
from utils.easyway_helpers import parse_routes, parse_static_data


LOGGER = logging.getLogger('JAMMED')
LOGGER.setLevel(logging.DEBUG)

c_handler = logging.StreamHandler()
f_handler = logging.FileHandler(f'{ROOT_DIR}/var/logs/jammed.log')

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
c_handler.setFormatter(formatter)
f_handler.setFormatter(formatter)

LOGGER.addHandler(c_handler)
LOGGER.addHandler(f_handler)


def populate_db(args):
    """
    1.  Load csv file with static data about routes in Lviv,
        and insert formatted documents to `routes` mongo collection.
    2.  Calculate count transports per agency, transport type and
        certain route, count transport stops per regions, routes
        from the static EasyWay data and insert it to `static_graphs`
        mongo collection.
    """
    routes = parse_routes()
    inserted_cnt = MONGER.insert(routes, ROUTES_COLLECTION)
    LOGGER.info(f'Successfully inserted {len(inserted_cnt)} routes.')

    static_data = parse_static_data()
    for collection_id, documents in static_data.items():
        inserted = MONGER.insert(documents, collection_id)
        LOGGER.info(f'Successfully inserted {len(inserted)} documents to `{collection_id}``.')


def run_collector(args):
    try:
        frequency = int(args[2])
    except (IndexError, ValueError):
        LOGGER.error('Invalid frequency. Please provide integer number as frequency.')
        return

    GTFS_COLLECTOR.frequency = frequency
    GTFS_COLLECTOR.run()


def runserver(args):
    """Create Flask server and run it."""
    from api.app import create_app
    app = create_app()
    app.run(debug=True)


if __name__ == '__main__':
    commands = {
        'populate': populate_db,
        'collect': run_collector,
        'runserver': runserver,
    }

    try:
        command = sys.argv[1]
        command = commands[command]
        command(sys.argv)
    except (IndexError, KeyError):
        LOGGER.error(f"No such command. "
                     f"Please provide one of existing command: {', '.join(commands.keys())}")
