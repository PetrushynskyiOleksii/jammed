"""This module provides functionality to work with data from EasyWay."""

import re

from google import protobuf
from google.transit import gtfs_realtime_pb2

from utils.file_helpers import load_csv
from utils.constants import EASYWAY_STATIC_DIR


def compile_gtfs(gtfs):
    """Compile GTFS data to dictionary format."""
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(gtfs)

    gtfs_dict = {}
    for entity in feed.entity:
        vehicle = entity.vehicle
        position = vehicle.position
        route_id = int(vehicle.trip.route_id)

        if not gtfs_dict.get(route_id):
            gtfs_dict[route_id] = []

        gtfs_dict[route_id].append({
            'route_id': route_id,
            'timestamp': vehicle.timestamp,
            'trip_id': vehicle.trip.trip_id,
            'vehicle_id': vehicle.vehicle.id,
            'license_plate': vehicle.vehicle.license_plate,
            'latitude': position.latitude,
            'longitude': position.longitude,
            'odometer': position.odometer,
            'bearing': position.bearing,
            'speed': position.speed * 3.6,
        })

    return gtfs_dict


def parse_routes():
    """Load csv file with static data about routes in Lviv."""
    agency_csv = load_csv(f'{EASYWAY_STATIC_DIR}/agency.txt')
    agencies = {agency['agency_id']: agency['agency_name'] for agency in agency_csv}

    routes_csv = load_csv(f'{EASYWAY_STATIC_DIR}/routes.txt')
    routes = []
    for route in routes_csv:
        routes.append({
            'id': int(route['route_id']),
            'transport_type': re.sub(r'\d+', '', route['route_short_name']),
            'short_name': route['route_short_name'],
            'long_name': route['route_long_name'],
            'agency_id': route['agency_id'],
            'agency_name': agencies[route['agency_id']],
            'trips': [],
        })

    return routes
