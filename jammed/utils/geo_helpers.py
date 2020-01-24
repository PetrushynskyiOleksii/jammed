"""
This module provides functionality to work with geolocations.
"""

import time
from geopy import geocoders, exc


def geo_reverse(coordinates):
    """
    Return decoded information for specified coordinates.
    """
    geolocator = geocoders.Nominatim(user_agent="jammed")
    while True:
        try:
            address = geolocator.reverse(coordinates).address
            return address
        except exc.GeopyError:
            time.sleep(2.5)
