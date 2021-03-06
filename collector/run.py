"""This module provides entry point for collector application."""

import os
import logging

from app import COLLECTOR_CELERY
from app.tasks import prepare_static


LOG = logging.getLogger("")
LOG_FILEPATH = "jammed/collector.log"
LOG_FORMAT = "%(asctime)s - %(levelname)s: %(name)s: %(message)s"


def init_logging():
    """
    Initialize logging stream with debug level to console and
    create file logger with info level if permission to file allowed.
    """
    logging.basicConfig(format=LOG_FORMAT, level=logging.DEBUG)

    log_dir = os.environ.get("LOG_DIR")
    if log_dir and os.path.isfile(LOG_FILEPATH) and os.access(LOG_FILEPATH, os.W_OK):
        formatter = logging.Formatter(LOG_FORMAT)
        file_handler = logging.FileHandler(LOG_FILEPATH)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logging.getLogger("").addHandler(file_handler)


if __name__ == '__main__':
    init_logging()
    prepare_static()
    COLLECTOR_CELERY.start()
