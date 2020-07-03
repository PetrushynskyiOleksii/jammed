"""This module provides entry point for server application."""

import os

from flask import Flask
from flask_cors import CORS

from app.traffic.views import traffic_app


def create_app():
    """Create the flask application and initialize it."""
    app = Flask(__name__)
    CORS(app)

    # TODO: figure out about bcrypt
    app.register_blueprint(traffic_app, url_prefix="/api/v1/")
    app_settings = os.getenv("APP_MODE", "app.config.DevelopmentConfig")
    app.config.from_object(app_settings)

    return app
