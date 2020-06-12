"""This module provides project environment configurations."""


class BaseConfig:
    """Base application configurations."""
    DEBUG = False
    JSON_AS_ASCII = False


class DevelopmentConfig(BaseConfig):
    """Development application configuration."""
    DEBUG = True


class ProductionConfig(BaseConfig):
    """Production application configuration."""
