"""This module provides helper functionality for MongoDB interaction."""

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from utils.constants import ROUTES_COLLECTION


__all__ = ['MONGER']

MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_SERVER_TIMEOUT = 5 * 1000


class MongoWorker:
    """Provide functionality for MongoDB interaction."""

    __client = MongoClient(
        host=MONGO_HOST,
        port=MONGO_PORT,
        serverSelectionTimeoutMS=MONGO_SERVER_TIMEOUT
    )
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
                return None

            cls.__database = cls.__client.jammed
            cls.__collections = {
                ROUTES_COLLECTION: cls.__database.routes,
            }

        return cls.__instance

    def insert_many(self, documents, collection):
        """Insert an iterable of documents to a certain collection."""
        collection = self.__collections.get(collection)

        try:
            documents_ids = collection.insert_many(documents).inserted_ids
        except (PyMongoError, AttributeError):
            # TODO: add logger
            return []

        return [str(document_id) for document_id in documents_ids]

    def update(self, query_filter, modifications, collection):
        """Update a single document matching the filter."""
        collection = self.__collections.get(collection)

        try:
            is_updated = collection.update_one(
                filter=query_filter,
                update=modifications,
            ).modified_count
        except (PyMongoError, AttributeError, ValueError, TypeError):
            # TODO: add logger
            return False

        return bool(is_updated)


MONGER = MongoWorker()
