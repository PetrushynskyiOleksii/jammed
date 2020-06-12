"""This module provides helper functionality to work with easy way data."""

import collections

from google import protobuf
from google.transit import gtfs_realtime_pb2

from app.utils import load_csv
from settings import STATIC_DIR


def compile_gtfs(gtfs):
    """Compile GTFS data using protobuf to dictionary format."""
    feed = gtfs_realtime_pb2.FeedMessage()

    try:
        feed.ParseFromString(gtfs)
    except protobuf.message.DecodeError:
        return None

    gtfs_dict = collections.defaultdict(list)
    for entity in feed.entity:
        vehicle = entity.vehicle
        position = vehicle.position
        route_id = vehicle.trip.route_id
        license_plate = vehicle.vehicle.license_plate.replace('-', '')

        gtfs_dict[route_id].append({
            'route_id': route_id,
            'timestamp': vehicle.timestamp,
            'trip_id': vehicle.trip.trip_id,
            'vehicle_id': vehicle.vehicle.id,
            'license_plate': license_plate,
            'latitude': position.latitude,
            'longitude': position.longitude,
            'odometer': position.odometer,
            'bearing': position.bearing,
            'speed': position.speed * 3.6,
        })

    return gtfs_dict


def parse_routes_names():
    """
    Load csv file with static data for routes in Lviv.
    """
    routes_csv = load_csv(f"{STATIC_DIR}/routes.txt")
    return {route["route_id"]: route["route_short_name"] for route in routes_csv}
