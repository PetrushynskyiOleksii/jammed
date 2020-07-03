"""This module provides helper functionality to work with easy way data."""

import re
import collections

from google import protobuf
from google.transit import gtfs_realtime_pb2
from shapely.geometry import Polygon

from app.utils import load_csv
from settings import STATIC_DIR


ROUTE_TYPE_MAP = {
    "А": "Автобус",
    "Н-А": "Нічний Автобус",
    "Т": "Трамвай",
    "Тр": "Тролейбус"
}
# TODO: move to static file
REGIONS_BOUNDS = {
    "Сихівський": Polygon((
        (49.818516, 24.020271),
        (49.805817, 24.018770),
        (49.798282, 24.016435),
        (49.783532, 24.013433),
        (49.768894, 24.013853),
        (49.767457, 24.032474),
        (49.768478, 24.107122),
        (49.813906, 24.078240),
        (49.816072, 24.069229),
        (49.816186, 24.062691),
        (49.821083, 24.055831),
        (49.819754, 24.053600),
        (49.818259, 24.054243),
        (49.816486, 24.046261),
        (49.822882, 24.038622),
        (49.821747, 24.028537),
    )),
    "Франківський": Polygon((
        (49.769389, 24.012534),
        (49.769389, 24.012534),
        (49.809137, 23.981672),
        (49.822635, 23.988836),
        (49.832106, 23.975684),
        (49.837235, 24.003977),
        (49.834670, 24.021105),
        (49.783152, 24.013000)
    )),
    "Залізничний": Polygon((
        (49.800744, 23.977826),
        (49.822701, 23.987872),
        (49.832212, 23.975558),
        (49.839945, 24.012338),
        (49.844229, 24.011366),
    )),
    "Шевченківський": Polygon((
        (49.863942, 23.913322),
        (49.859158, 23.972690),
        (49.843664, 24.018276),
        (49.851867, 24.019690),
        (49.852095, 24.041600),
        (49.875821, 24.064549),
        (49.898125, 24.057433),
        (49.882557, 23.914288),
    )),
    "Галицький": Polygon((
        (49.818811, 24.019992),
        (49.835113, 24.020892),
        (49.837021, 24.004495),
        (49.841512, 24.016022),
        (49.842831, 24.016022),
        (49.843242, 24.020068),
        (49.851686, 24.019659),
        (49.852213, 24.042484),
        (49.847757, 24.050168),
        (49.839559, 24.039318),
        (49.839509, 24.036260),
        (49.830607, 24.035495),
        (49.826488, 24.044594),
        (49.821055, 24.054842),
        (49.817307, 24.046289),
        (49.824710, 24.038458),
        (49.823174, 24.026910)

    )),
    "Личаківський": Polygon((
        (49.876340, 24.068559),
        (49.852397, 24.046569),
        (49.846840, 24.051026),
        (49.838504, 24.037803),
        (49.831604, 24.035871),
        (49.827195, 24.046717),
        (49.816843, 24.064398),
        (49.814446, 24.078662),
        (49.809748, 24.080742),
        (49.810323, 24.091588),
        (49.842625, 24.120264)
    ))
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
