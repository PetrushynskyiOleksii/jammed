"""This module provides celery tasks."""

import logging
import pickle

from pymongo.errors import PyMongoError

from settings import STATIC_DIR, STATIC_URL, VEHICLE_URL, GTFS_ODOMETERS_KEY
from app import DATABASE, COLLECTOR_CELERY, REDIS
from app.utils import download_context, unzip
from app.easyway import (
    get_transport_counts,
    get_stops_per_routes,
    parse_traffic,
    parse_traffic_congestion,
)


LOG = logging.getLogger(__name__)
TRAFFIC_COLLECTION = DATABASE.traffic
TRAFFIC_CONGESTION_COLLECTION = DATABASE.traffic_congestion


@COLLECTOR_CELERY.task(
    bind=True,
    default_retry_delay=30,  # 30 seconds for retry delay
    retry_kwargs={"max_retries": 5})  # 5 maximum retry attempts
def collect_traffic(self):
    """
    Defines commands to download data about Lviv transport geolocation,
    compile it to the dictionary format and insert it to the database.
    """
    gtfs_content = download_context(VEHICLE_URL)
    if not gtfs_content:
        LOG.error("Failed to download file with GTFS data.")
        raise self.retry()

    try:
        prev_odometers = pickle.loads(REDIS.get(GTFS_ODOMETERS_KEY))
    except (TypeError, pickle.UnpicklingError):
        prev_odometers = {}

    traffic = parse_traffic(gtfs_content, prev_odometers)
    if not traffic:
        LOG.error("Failed to compile GTFS data to json format.")
        raise self.retry()

    traffic_congestion = parse_traffic_congestion(traffic)
    try:  # TODO: use transaction
        TRAFFIC_COLLECTION.insert_many(traffic)
        TRAFFIC_CONGESTION_COLLECTION.insert_many(traffic_congestion)
    except PyMongoError as err:
        LOG.error("Could not insert collected routes: %s", err)
        raise self.retry()

    traffic_odometers = {x["trip_vehicle_id"]: x["trip_odometer"] for x in traffic}
    REDIS.set(GTFS_ODOMETERS_KEY, pickle.dumps(traffic_odometers))

    LOG.info("Successfully collected %s trips.", len(traffic))


@COLLECTOR_CELERY.task
def prepare_static():
    """Download and unzip static files from easy way."""
    filepath = f"{STATIC_DIR}/static.zip"
    downloaded = download_context(STATIC_URL, filepath)
    if not downloaded:
        LOG.warning("Could not download static data.")
        return

    unzipped = unzip(filepath, STATIC_DIR)
    if not unzipped:
        LOG.warning("Could not unzip static data.")
        return

    LOG.info("Static data was downloaded and unzipped.")
    insert_static.delay()


@COLLECTOR_CELERY.task
def insert_static():
    """
    Calculate count transports per agency, transport type
    and certain route, count transport stops routes.
    Save calculated data to `transport` collection.
    """
    static_data = get_transport_counts()
    static_data.update({"stops_per_routes": get_stops_per_routes()})

    docs = [{"id": k, "data": v} for k, v in static_data.items()]
    try:  # TODO: add transaction
        DATABASE.transport.delete_many({})
        DATABASE.transport.insert_many(docs)
    except PyMongoError as err:
        LOG.error("Could not insert routes static data: %s", err)
        return

    LOG.info("Successfully inserted routes static data.")
