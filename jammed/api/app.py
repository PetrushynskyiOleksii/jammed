"""This module provides starting Flask app."""

import logging

from flask import Flask
from flask_cors import CORS


logger = logging.getLogger('JAMMED')


def create_app():
    flask_app = Flask(__name__)
    CORS(flask_app)
    logger.info('Flask server was successfully created.')

    from mongo.worker import MONGER
    if not MONGER:
        logger.error('Connection to the Mongo DB failed. Is it running?.')
    logger.info('Connection to the Mongo DB was successfully instantiated.')

    from api.views import JAMMED
    flask_app.register_blueprint(JAMMED, url_prefix='/api/v1/')
    logger.info('Flask routes was successfully instantiated.')

    return flask_app
