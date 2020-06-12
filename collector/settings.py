"""This module provides settings configurations for collector application."""

import os


VEHICLE_URL = "http://track.ua-gis.com/gtfs/lviv/vehicle_position"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static", "ew")
