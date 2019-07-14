"""This module provides functionality to work with data from EasyWay."""

from google import protobuf
from google.transit import gtfs_realtime_pb2


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
