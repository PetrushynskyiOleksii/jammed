"""This module provides entry point for server application."""

import os

from flask import Flask
from flask_cors import CORS

from app import CACHE
from app.traffic.views import traffic_app


def create_app():
    """Create the flask application and initialize it."""
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(traffic_app, url_prefix="/api/v1")
    app_settings = os.environ.get("SERVER_MODE", "app.config.DevelopmentConfig")
    app.config.from_object(app_settings)

    CACHE.init_app(app)

    return app
