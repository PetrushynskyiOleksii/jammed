"""
This module provides project management and defines custom commands.
"""

import re
import logging

from flask import Flask
from flask_cors import CORS
from flask_script import Manager

from api.views import JAMMED
from mongo.worker import MONGER
from collector.gtfs import GTFS_COLLECTOR
from settings import EASYWAY_STATIC_DIR, STATIC_URL, ROOT_DIR
from utils.geo_helpers import geo_reverse
from utils.file_helpers import download_context, dump_csv, load_csv, unzip
from utils.easyway_helpers import (
    get_transport_counts,
    get_stops_per_routes,
    get_stops_per_regions,
    REGIONS)


app = Flask(__name__)
manager = Manager(app)

LOGGER = logging.getLogger('JAMMED')
LOGGER.setLevel(logging.DEBUG)

c_handler = logging.StreamHandler()
f_handler = logging.FileHandler(f'{ROOT_DIR}/var/logs/jammed.log')

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
c_handler.setFormatter(formatter)
f_handler.setFormatter(formatter)

LOGGER.addHandler(c_handler)
LOGGER.addHandler(f_handler)


@manager.command
def runserver(debug=False):
    """
    Create flask server with default params and run it.
    """
    CORS(app)
    app.config['JSON_AS_ASCII'] = False
    LOGGER.info('Flask server was created.')

    app.register_blueprint(JAMMED, url_prefix='/api/v1/')
    LOGGER.info('Flask endpoints was instantiated.')

    app.run(debug=debug)


@manager.command
def prepare_static():
    """
    Download and unzip static files from easy way.
    """
    filepath = f'{EASYWAY_STATIC_DIR}/static.zip'
    downloaded = download_context(STATIC_URL, filepath)
    if not downloaded:
        LOGGER.warning('Could not download static data.')
        return

    unzipped = unzip(filepath)
    if not unzipped:
        LOGGER.warning('Could not unzip static data.')
        return

    LOGGER.info('Static data was downloaded and unzipped.')


@manager.command
def prepare_regions():
    """
    Prepare csv file with data for stops regions.
    """
    ew_stops = {x["stop_id"]: x for x in load_csv(f'{EASYWAY_STATIC_DIR}/stops.txt')}
    existing_stops = {x["stop_id"]: x for x in load_csv(f'{EASYWAY_STATIC_DIR}/stops_regions.txt')}
    new_stops_ids = set(ew_stops.keys()) - set(existing_stops.keys())

    new_stops = existing_stops.copy()
    region_pattern = re.compile("|".join(REGIONS))
    for stop_id in new_stops_ids:
        stop = ew_stops[stop_id]
        address = geo_reverse((stop['stop_lat'], stop['stop_lon']))
        region = region_pattern.search(address)
        if region:
            stop["stop_region"] = region.group()
            new_stops[stop_id] = stop

    dump_csv(f'{EASYWAY_STATIC_DIR}/stops_regions.txt', list(new_stops.values()))
    LOGGER.info(f'Region was added to {len(new_stops.keys()) - len(existing_stops.keys())} stops.')


@manager.command
def populate_counts():
    """
    Calculate count transports per agency, transport type
    and certain route, count transport stops per regions, routes.
    Save calculated data to `static_graphs` collection.
    """
    static_data = get_transport_counts()
    static_data.update({
        'stops_per_routes': get_stops_per_routes(),
        'stops_per_regions': get_stops_per_regions()
    })
    for collection_id, documents in static_data.items():
        inserted_ids = MONGER.insert(documents, collection_id)
        LOGGER.info(f'Inserted {len(inserted_ids)} documents to `{collection_id}`.')


@manager.command
def collect(frequency=300):
    """
    Run collector with specified frequency.
    """
    GTFS_COLLECTOR.frequency = int(frequency)
    GTFS_COLLECTOR.run()


if __name__ == "__main__":
    manager.run()
