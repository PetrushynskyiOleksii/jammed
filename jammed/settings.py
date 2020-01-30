"""
This module provides project settings and constants.
"""

import os


# Project stuff
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = PROJECT_DIR[:PROJECT_DIR.rindex('/')]
COLLECTED_DIR = '/var/collected'
LOG_DIR = '/var/log'

# EasyWay stuff
EASYWAY_STATIC_DIR = f'{PROJECT_DIR}/static/ew'
VEHICLE_URL = 'http://track.ua-gis.com/gtfs/lviv/vehicle_position'
STATIC_URL = 'http://track.ua-gis.com/gtfs/lviv/static.zip'

# Mongo stuff
TIMESERIES_COLLECTION = 'timeseries'
TRANSPORT_PER_AGENCIES = 'transport_per_agencies'
TRANSPORT_PER_TYPE = 'transport_per_type'
TRANSPORT_PER_ROUTES = 'transport_per_routes'
STOPS_PER_ROUTES = 'stops_per_routes'
STOPS_PER_REGIONS = 'stops_per_regions'
