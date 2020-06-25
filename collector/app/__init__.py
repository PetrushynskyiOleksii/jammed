"""This module provides initialization of required components."""

from pymongo import MongoClient
from settings import MONGO_URI, MONGO_SERVER_TIMEOUT

mongo = MongoClient(MONGO_URI, serverSelectionTimeoutMS=MONGO_SERVER_TIMEOUT)
database = mongo.jammed
