"""This module provides project management."""

import sys

from mongo.worker import MONGER
from utils.constants import EASYWAY_STATIC_DIR, ROUTES_COLLECTION
from utils.file_helpers import load_csv


def load_routes():
    """
    Load csv file with static data about routes in Lviv,
    and insert formatted documents to `routes` mongo collection.
    """
    routes_csv = load_csv(f'{EASYWAY_STATIC_DIR}/routes.txt')
    agency_csv = load_csv(f'{EASYWAY_STATIC_DIR}/agency.txt')
    agencies = {agency['agency_id']: agency['agency_name'] for agency in agency_csv}

    routes_docs = []
    for route in routes_csv:
        routes_docs.append({
            'id': int(route['route_id']),
            'transport_type': int(route['route_type']),
            'short_name': route['route_short_name'],
            'long_name': route['route_long_name'],
            'agency_name': agencies[route['agency_id']],
            'trips': [],
        })

    return MONGER.insert_many(routes_docs, ROUTES_COLLECTION)


if __name__ == '__main__':
    commands = {
        'load_routes': load_routes,
    }

    if len(sys.argv) > 1:
        arg = sys.argv[1]
        command = commands.get(arg)
        if command:
            command()
        # todo: add logging
