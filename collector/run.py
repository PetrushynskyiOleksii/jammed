"""This module provides entry point for collector application."""

import os
import argparse
import logging

from pymongo import MongoClient

from app.collector import GTFSCollector


LOG = logging.getLogger("")
LOG_FILEPATH = "jammed/collector.log"
LOG_FORMAT = "%(asctime)s - %(levelname)s: %(name)s: %(message)s"
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_SERVER_TIMEOUT = os.environ.get("MONGO_SERVER_TIMEOUT", 5000)


def init_logging():
    """
    Initialize logging stream with debug level to console and
    create file logger with info level if permission to file allowed.
    """
    logging.basicConfig(format=LOG_FORMAT, level=logging.DEBUG)

    log_dir = os.environ.get("LOG_DIR")
    if log_dir and os.path.isfile(LOG_FILEPATH) and os.access(LOG_FILEPATH, os.W_OK):
        formatter = logging.Formatter(LOG_FORMAT)
        file_handler = logging.FileHandler(LOG_FILEPATH)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logging.getLogger("").addHandler(file_handler)


def main():
    """Initialize application for collection GTFS data."""
    init_logging()
    mongo = MongoClient(MONGO_URI, serverSelectionTimeoutMS=MONGO_SERVER_TIMEOUT)
    database = mongo.jammed

    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--frequency", type=int, default=300, help="Interval between collector executing.")
    args = parser.parse_args()

    collector = GTFSCollector(database, args.frequency)
    collector.run()


if __name__ == '__main__':
    main()