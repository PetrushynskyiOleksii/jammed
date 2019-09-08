"""This module provides project settings."""

import os


# Project stuff
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = PROJECT_DIR[:PROJECT_DIR.rindex('/')]
COLLECTED_DIR = f'{ROOT_DIR}/var/collected'

# EasyWay stuff
EASYWAY_STATIC_DIR = f'{PROJECT_DIR}/static/ew'
VEHICLE_URL = 'http://track.ua-gis.com/gtfs/lviv/vehicle_position'

# Mongo stuff
ROUTES_COLLECTION = 'routes'
DYNAMIC_GRAPHS_COLLECTION = 'dynamic_graphs'
STATIC_GRAPHS_COLLECTION = 'static_graphs'
JAMMED_COLLECTION = 'jammed'
