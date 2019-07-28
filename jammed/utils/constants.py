"""This module provides helpers constants."""

import os


BASE_DIR = os.path.abspath('..')
PROJECT_DIR = os.path.abspath('.')
EASYWAY_STATIC_DIR = f'{PROJECT_DIR}/static/ew'
ROUTES_COLLECTION = 'routes'
VEHICLE_URL = 'http://track.ua-gis.com/gtfs/lviv/vehicle_position'