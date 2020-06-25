"""This module provides settings configurations for collector application."""

import os


STATIC_URL = "http://track.ua-gis.com/gtfs/lviv/static.zip"
VEHICLE_URL = "http://track.ua-gis.com/gtfs/lviv/vehicle_position"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static", "ew")
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_SERVER_TIMEOUT = os.environ.get("MONGO_SERVER_TIMEOUT", 5000)
