"""This module provides helper functions."""

from datetime import datetime


def get_time_range(delta):
    """Return time period by delta."""
    end = int(datetime.now().timestamp())
    start = end - delta
    return start, end
