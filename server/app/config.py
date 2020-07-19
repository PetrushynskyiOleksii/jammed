"""This module provides project environment configurations."""

import os


class BaseConfig:
    """Base application configurations."""
    DEBUG = False
    JSON_AS_ASCII = False

    CACHE_TYPE = "redis"
    CACHE_REDIS_URL = os.environ["REDIS_URI"]
    CACHE_KEY_PREFIX = "SERVER:"
    CACHE_DEFAULT_TIMEOUT = 300


class DevelopmentConfig(BaseConfig):
    """Development application configuration."""
    DEBUG = True


class ProductionConfig(BaseConfig):
    """Production application configuration."""
