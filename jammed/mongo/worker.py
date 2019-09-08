"""This module provides helper functionality for MongoDB interaction."""

import logging

from bson.errors import InvalidId
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from settings import (
    ROUTES_COLLECTION,
    DYNAMIC_GRAPHS_COLLECTION,
    STATIC_GRAPHS_COLLECTION,
    JAMMED_COLLECTION)


__all__ = ['MONGER']

MONGO_HOST = 'mongodb://mongodb:27017'
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
                DYNAMIC_GRAPHS_COLLECTION: cls.__database.dynamic_graphs,
                STATIC_GRAPHS_COLLECTION: cls.__database.static_graphs,
                JAMMED_COLLECTION: cls.__database.jammed
            }

        return cls.__instance

    def insert(self, documents, collection):
        """Insert document(s) to a certain collection."""
        collection = self.__collections.get(collection)

        documents = documents if isinstance(documents, list) else [documents]

        try:
            documents_ids = collection.insert_many(documents).inserted_ids
        except (PyMongoError, AttributeError) as err:
            LOGGER.error(f'Could not insert document(s): {err}')
            return []

        return [str(document_id) for document_id in documents_ids]

    def update(self, query_filter, modifications, collection):
        """Update document(s) matching the filter with certain modifications."""
        collection = self.__collections.get(collection)

        try:
            updated_docs = collection.update_many(
                filter=query_filter,
                update=modifications,
            ).modified_count
        except (PyMongoError, AttributeError, ValueError, TypeError) as err:
            LOGGER.error(f'Could not update document in `{collection.name}`: {err}. '
                         f'The following query was used: {query_filter}')
            return False

        return updated_docs

    def find(self, collection, query_filter=None, order_by=None, fields=None, limit=0):
        """
        Retrieve the documents from a certain collection by filter."""
        collection = self.__collections.get(collection)

        try:
            documents = collection.find(
                filter=query_filter,
                sort=order_by,
                projection=fields,
                limit=limit,
            )
        except (PyMongoError, InvalidId, AttributeError, TypeError) as err:
            LOGGER.error(f'Could not read data from collection {collection.name}'
                         f' by filer {query_filter}: {err}')
            return None

        return [document for document in documents]

    def remove(self, query_filter, collection):
        """Delete one or more documents matching the filter."""
        collection = self.__collections.get(collection)

        try:
            deleted_docs = collection.delete_many(query_filter).deleted_count
        except (PyMongoError, AttributeError) as err:
            LOGGER.error(f'Could not remove document(s) from collection {collection.name}'
                         f' by filer {query_filter}: {err}')
            return False

        return deleted_docs


MONGER = MongoWorker()
