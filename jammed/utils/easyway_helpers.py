"""This module provides functionality to work with data from EasyWay."""

import re
import json
import collections

from google import protobuf
from google.transit import gtfs_realtime_pb2

from utils.file_helpers import load_csv
from utils.constants import EASYWAY_STATIC_DIR


STREET_PREFIXES = ['вул. ', 'пр. ', 'просп. ', 'пл. ', 'площа ', 'вулиця ']


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


def parse_trips():
    """Return list of trips for every route."""
    trips_csv = load_csv(f'{EASYWAY_STATIC_DIR}/trips.txt')

    trips = collections.defaultdict(list)
    for trip in trips_csv:
        route_id = trip['route_id']
        trip_id = trip['block_id']
        trips[route_id].append(trip_id)

    return trips


def parse_stops_per_regions():
    """Return dict with data about number of stops per Lviv`s regions."""
    street_prefixes_pattern = r'|'.join(STREET_PREFIXES)
    stops_csv = load_csv(f'{EASYWAY_STATIC_DIR}/stops_clean.txt')

    with open(f'{EASYWAY_STATIC_DIR}/regions.json') as file:
        regions_map = json.load(file)

    regions = dict.fromkeys(regions_map.keys(), 0)
    for stop in stops_csv:
        stop_name = stop['stop_desc']
        if not stop_name:
            continue

        stop_name = re.sub(street_prefixes_pattern, '', stop_name)
        stop_name = re.split(r'(,|\()', stop_name)[0]
        stop_name = re.sub(r'\d+\w?', '', stop_name)
        stop_name = stop_name.strip()

        for region, streets in regions_map.items():
            if stop_name in streets:
                regions[region] += 1

    return regions


def parse_stops_per_routes():
    """Return dict with data about number of stops per routes."""
    routes_data = parse_trips()

    stops = set()
    stop_times = load_csv(f'{EASYWAY_STATIC_DIR}/stop_times.txt')
    for stop_time in stop_times:
        trip_id = stop_time['trip_id'].split('_')[0]
        stop_id = stop_time['stop_id']

        for route, trips in routes_data.items():
            if trip_id in trips:
                stops.add((route, stop_id))
                continue

    routes = dict.fromkeys(routes_data.keys(), 0)
    for route_id, stop_id in stops:
        routes[route_id] += 1

    return routes


def parse_transport_count():
    """Return transport count value per agency, transport type and certain route."""
    routes = parse_routes()
    trips = parse_trips()
    count_agencies = collections.Counter([route['agency_name'] for route in routes])
    count_transport_type = collections.Counter([route['transport_type'] for route in routes])
    count_routes = {route_id: len(set(trips_ids)) for route_id, trips_ids in trips.items()}

    return {
        'transport_per_agencies': count_agencies,
        'transport_per_transport_type': count_transport_type,
        'transport_per_routes': count_routes,
    }


def parse_graph_data():
    """Return dictionary with data for graphs."""
    graph_data = {}
    graph_data.update(parse_transport_count())
    graph_data.update({'stops_per_routes': parse_stops_per_routes()})
    graph_data.update({'stops_per_regions': parse_stops_per_regions()})

    return graph_data
