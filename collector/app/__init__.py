"""This module provides initialization of required components."""

import redis
from celery import Celery
from celery.schedules import crontab
from pymongo import MongoClient

from settings import (
    REDIS_URI,
    REDIS_PORT,
    REDIS_HOST,
    REDIS_PASSWORD,
    MONGO_URI,
    MONGO_SERVER_TIMEOUT,
    MONGO_USERNAME,
    MONGO_PASSWORD
)


COLLECTOR_CELERY = Celery("COLLECTOR", broker=REDIS_URI)
COLLECTOR_CELERY.conf.beat_schedule = {
    "collect_gtfs": {
        "task": "app.tasks.collect_traffic",
        "schedule": crontab(minute="*/5"),
    },
    "prepare_static": {
        "task": "app.tasks.prepare_static",
        "schedule": crontab(minute=1, hour=3),
    },
}
COLLECTOR_CELERY.conf.timezone = "Europe/Kiev"
COLLECTOR_CELERY.conf.imports = ["app.tasks"]

MONGO = MongoClient(
    MONGO_URI,
    password=MONGO_PASSWORD,
    username=MONGO_USERNAME,
    serverSelectionTimeoutMS=MONGO_SERVER_TIMEOUT
)
DATABASE = MONGO.jammed

REDIS = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
