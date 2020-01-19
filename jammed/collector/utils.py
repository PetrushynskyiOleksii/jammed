"""This module provides additional functionality for collector."""

import json
import logging

from mongo.worker import MONGER
from settings import ROUTES_COLLECTION, COLLECTED_DIR

LOGGER = logging.getLogger('JAMMED')


def dump_route_trips(filename):
    """Dump collection data from database to file."""
    documents = MONGER.find(collection_name=ROUTES_COLLECTION, fields={'_id': 0})
    if not documents:
        LOGGER.warning(f'Could not find any document in collection {ROUTES_COLLECTION}')
        return

    MONGER.update(
        query_filter={},
        modifications={'$set': {'trips': []}},
        collection_name=ROUTES_COLLECTION)

    with open(f'{COLLECTED_DIR}/{filename}.json', 'w+') as f:
        json.dump(list(documents), f)

    return True
