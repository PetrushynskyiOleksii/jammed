"""This module provides helpers constants."""

import os


# Project stuff
BASE_DIR = os.path.abspath(os.curdir)
COLLECTED_DIR = f'{BASE_DIR}/var/collected'

# EasyWay stuff
EASYWAY_STATIC_DIR = f'{BASE_DIR}/jammed/static/ew'
VEHICLE_URL = 'http://track.ua-gis.com/gtfs/lviv/vehicle_position'

# Mongo stuff
ROUTES_COLLECTION = 'routes'
DYNAMIC_GRAPHS_COLLECTION = 'dynamic_graphs'
STATIC_GRAPHS_COLLECTION = 'static_graphs'
