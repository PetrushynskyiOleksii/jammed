"""This module provides helper functionality to work with easy way data."""

import re
import collections

from google import protobuf
from google.transit import gtfs_realtime_pb2

from app.utils import load_csv
from settings import STATIC_DIR


ROUTE_TYPE_MAP = {
    "А": "Автобус",
    "Н-А": "Нічний Автобус",
    "Т": "Трамвай",
    "Тр": "Тролейбус"
}


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
        license_plate = vehicle.vehicle.license_plate.replace("-", "")

        gtfs_dict[route_id].append({
            "route_id": route_id,
            "timestamp": vehicle.timestamp,
            "trip_id": vehicle.trip.trip_id,
            "vehicle_id": vehicle.vehicle.id,
            "license_plate": license_plate,
            "latitude": position.latitude,
            "longitude": position.longitude,
            "odometer": position.odometer,
            "bearing": position.bearing,
            "speed": position.speed * 3.6,
        })

    return gtfs_dict


def parse_routes_names():
    """Return short name for each route id."""
    routes_csv = load_csv(f"{STATIC_DIR}/routes.txt")
    return {route["route_id"]: route["route_short_name"] for route in routes_csv}


def parse_routes():
    """Load csv file with static data for routes in Lviv."""
    agency_csv = load_csv(f"{STATIC_DIR}/agency.txt")
    routes_csv = load_csv(f"{STATIC_DIR}/routes.txt")

    agencies = {agency["agency_id"]: agency["agency_name"] for agency in agency_csv}
    routes = []
    for route in routes_csv:
        route_short_name = route["route_short_name"]
        route_type_short = re.sub(r"\d+", "", route_short_name)
        route_type = ROUTE_TYPE_MAP.get(route_type_short, "Інші")

        routes.append({
            "id": route["route_id"],
            "route_type": route_type,
            "short_name": route_short_name,
            "long_name": route["route_long_name"],
            "agency_id": route["agency_id"],
            "agency_name": agencies[route["agency_id"]],
            "trips": [],
        })

    return routes


def parse_trips():
    """Return list of trips for each route in Lviv."""
    trips_csv = load_csv(f"{STATIC_DIR}/trips.txt")

    trips = collections.defaultdict(set)
    for trip in trips_csv:
        route_id = trip["route_id"]
        trip_id = trip["block_id"]
        trips[route_id].add(trip_id)

    return trips


def get_stops_per_routes():
    """Return dict with data about count of stops per routes."""
    routes = parse_trips()
    routes_names = parse_routes_names()

    trips_map = {}
    for route, trips in routes.items():
        trips_map.update({trip: route for trip in trips})

    stops = set()
    stop_times = load_csv(f"{STATIC_DIR}/stop_times.txt")
    for stop_time in stop_times:
        trip_id = stop_time["trip_id"].split("_")[0]
        stop_id = stop_time["stop_id"]
        route_id = trips_map[trip_id]
        route_name = routes_names[route_id]
        stops.add((route_name, stop_id))

    routes = dict.fromkeys(routes_names.values(), 0)
    for route_name, stop_id in stops:
        routes[route_name] += 1

    stops_count = [{"id": k, "value": v} for k, v in routes.items()]
    return stops_count


def get_transport_counts():
    """Return transport counts per agency, transport type and certain route."""
    routes = parse_routes()
    trips = parse_trips()

    agencies_counter = collections.Counter([route["agency_name"] for route in routes])
    agencies_count = [{"id": k, "value": v} for k, v in agencies_counter.items()]

    routes_per_type = [route["route_type"] for route in routes]
    route_type_counter = collections.Counter(routes_per_type)
    route_type_count = [{"id": k, "value": v} for k, v in route_type_counter.items()]

    route_names = {route["id"]: route["short_name"] for route in routes}
    routes_count = [{"id": route_names[route_id], "value": len(set(trips_ids))}
                    for route_id, trips_ids in trips.items()]

    return {
        "transport_per_agencies": agencies_count,
        "transport_per_type": route_type_count,
        "transport_per_routes": routes_count,
    }
