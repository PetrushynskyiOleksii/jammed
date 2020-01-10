"""This module provides helper functionality for MongoDB interaction."""

import logging

from bson.errors import InvalidId
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from settings import (
    ROUTES_COLLECTION,
    TIMESERIES_COLLECTION,
    JAMMED_COLLECTION,
    TRANSPORT_PER_AGENCIES,
    TRANSPORT_PER_TYPE,
    TRANSPORT_PER_ROUTES,
    STOPS_PER_ROUTES,
    STOPS_PER_REGIONS)


__all__ = ['MONGER']

# MONGO_HOST = 'mongodb://mongodb:27017'
MONGO_HOST = 'localhost:27017'

MONGO_SERVER_TIMEOUT = 5 * 1000
LOGGER = logging.getLogger('JAMMED')


class MongoWorker:
    """Provide functionality for MongoDB interaction."""

    __client = MongoClient(MONGO_HOST, serverSelectionTimeoutMS=MONGO_SERVER_TIMEOUT)
    __instance = None

    def __new__(cls):
        """
        Creates a new instance if not exist, otherwise
        returns reference to already created instance.
        """
        if cls.__instance is None:
            cls.__instance = super(MongoWorker, cls).__new__(cls)

            try:
                cls.__client.admin.command('ismaster')
            except PyMongoError:
                LOGGER.critical('Could not connect to MONGO.')
                return None

            cls.__database = cls.__client.jammed
            cls.__collections = {
                ROUTES_COLLECTION: cls.__database.routes,
                TIMESERIES_COLLECTION: cls.__database.timeseries,
                JAMMED_COLLECTION: cls.__database.jammed,
                TRANSPORT_PER_AGENCIES: cls.__database.transport_per_agencies,
                TRANSPORT_PER_TYPE: cls.__database.transport_per_type,
                TRANSPORT_PER_ROUTES: cls.__database.transport_per_routes,
                STOPS_PER_ROUTES: cls.__database.stops_per_routes,
                STOPS_PER_REGIONS: cls.__database.stops_per_regions
            }

        return cls.__instance

    def insert(self, documents, collection_name):
        """Insert document(s) to a certain collection."""
        collection = self.__collections.get(collection_name)

        documents = documents if isinstance(documents, list) else [documents]

        try:
            documents_ids = collection.insert_many(documents).inserted_ids
        except (PyMongoError, AttributeError) as err:
            LOGGER.error(f'Could not insert document(s) to {collection_name}: {err}')
            return []

        return [str(document_id) for document_id in documents_ids]

    def update(self, query_filter, modifications, collection_name):
        """Update document(s) matching the filter with certain modifications."""
        collection = self.__collections.get(collection_name)

        try:
            updated_docs = collection.update_many(
                filter=query_filter,
                update=modifications,
            ).modified_count
        except (PyMongoError, AttributeError, ValueError, TypeError) as err:
            LOGGER.error(f'Could not update document in `{collection_name}`: {err}. '
                         f'The following query was used: {query_filter}')
            return False

        return updated_docs

    def find(self, collection_name, query_filter=None, order_by=None, fields=None, limit=0, skip=0):
        """
        Retrieve the documents from a certain collection by filter."""
        collection = self.__collections.get(collection_name)

        try:
            documents = collection.find(
                filter=query_filter,
                sort=order_by,
                projection=fields,
                limit=limit,
                skip=skip,
            )
        except (PyMongoError, InvalidId, AttributeError, TypeError) as err:
            LOGGER.error(f'Could not read data from collection {collection_name}'
                         f' by filter {query_filter}: {err}')
            return None

        return documents

    def remove(self, query_filter, collection_name):
        """Delete one or more documents matching the filter."""
        collection = self.__collections.get(collection_name)

        try:
            deleted_docs = collection.delete_many(query_filter).deleted_count
        except (PyMongoError, AttributeError) as err:
            LOGGER.error(f'Could not remove document(s) from collection {collection_name}'
                         f' by filter {query_filter}: {err}')
            return False

        return deleted_docs


MONGER = MongoWorker()
