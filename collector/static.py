"""This module provides populating routes static information."""

import logging

from pymongo.errors import PyMongoError

from run import init_logging
from settings import STATIC_DIR, STATIC_URL
from app import DATABASE as db
from app.utils import download_context, unzip
from app.easyway import get_transport_counts, get_stops_per_routes


LOGGER = logging.getLogger("CRONJOBS")


def prepare_static():
    """
    Download and unzip static files from easy way.
    """
    filepath = f"{STATIC_DIR}/static.zip"
    downloaded = download_context(STATIC_URL, filepath)
    if not downloaded:
        LOGGER.warning("Could not download static data.")
        return

    unzipped = unzip(filepath, STATIC_DIR)
    if not unzipped:
        LOGGER.warning("Could not unzip static data.")
        return

    LOGGER.info("Static data was downloaded and unzipped.")


def insert_static():
    """
    Calculate count transports per agency, transport type
    and certain route, count transport stops routes.
    Save calculated data to `static_graphs` collection.
    """
    static_data = get_transport_counts()
    static_data.update({"stops_per_routes": get_stops_per_routes()})

    try:
        db.transport.delete_many({})
    except PyMongoError as err:
        LOGGER.error("Could not flush routes collection: %s", err)
        return

    docs = [{"id": k, "data": v} for k, v in static_data.items()]
    try:
        db.transport.insert_many(docs)
    except PyMongoError as err:
        LOGGER.error("Could not insert routes static data: %s", err)
        return

    LOGGER.info("Successfully inserted routes static data.")


if __name__ == "__main__":
    init_logging()
    prepare_static()
    insert_static()
