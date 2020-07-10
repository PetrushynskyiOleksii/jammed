"""This module provides settings configurations for collector application."""

import os


STATIC_URL = "http://track.ua-gis.com/gtfs/lviv/static.zip"
VEHICLE_URL = "http://track.ua-gis.com/gtfs/lviv/vehicle_position"
GTFS_ODOMETERS_KEY = "GTFS_ODOMETERS"
GTFS_ROUTES_NAMES_KEY = "GTFS_ROUTES_NAMES"

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static", "ew")

MONGO_URI = os.environ["MONGO_URI"]
MONGO_SERVER_TIMEOUT = os.environ.get("MONGO_SERVER_TIMEOUT", 5000)
MONGO_PASSWORD = os.environ["MONGO_INITDB_ROOT_PASSWORD"]
MONGO_USERNAME = os.environ["MONGO_INITDB_ROOT_USERNAME"]

REDIS_PASSWORD = os.environ["REDIS_PASSWORD"]
REDIS_PORT = os.environ["REDIS_PORT"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_URI = os.environ["REDIS_URI"]
