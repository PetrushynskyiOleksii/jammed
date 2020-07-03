"""This module provides API views for timeseries data."""

from urllib import parse

from flask import Blueprint, request

from app.utils import response
from app.routes.routes import RoutesTimeseries, Routes


routes_app = Blueprint('jammed', __name__)


@routes_app.route("timeseries/<route>/avg_speed", methods=["GET"])
def get_route_avg_speed(route):
    """Return aggregated routes timeseries by avg speed."""
    route = parse.unquote(route, encoding="utf-8")
    delta = request.args.get("delta", type=float, default=3600)
    timeseries = RoutesTimeseries.route_avg_speed(route, delta)
    if timeseries is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    return response(True, timeseries, 200)


@routes_app.route("timeseries/<route>/trips_count", methods=["GET"])
def get_route_trips_count(route):
    """Return aggregated routes timeseries by trips count."""
    route = parse.unquote(route, encoding="utf-8")
    delta = request.args.get("delta", type=float, default=3600)
    timeseries = RoutesTimeseries.route_trips_count(route, delta)
    if timeseries is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    return response(True, timeseries, 200)


@routes_app.route("timeseries/<route>/avg_distance", methods=["GET"])
def get_route_avg_distance(route):
    """Return aggregated routes timeseries by avg_distance."""
    route = parse.unquote(route, encoding="utf-8")
    delta = request.args.get("delta", type=float, default=3600)
    timeseries = RoutesTimeseries.route_avg_distance(route, delta)
    if timeseries is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    return response(True, timeseries, 200)


@routes_app.route("timeseries/<route>/coordinates", methods=["GET"])
def get_route_coordinates(route):
    """Return route coordinates for the last collected time."""
    route = parse.unquote(route, encoding="utf-8")
    timeseries = RoutesTimeseries.route_coordinates(route)
    if timeseries is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    coordinates = timeseries[0] if timeseries else None
    return response(True, coordinates, 200)


@routes_app.route("timeseries/routes", methods=['GET'])
def get_routes_names():
    """Return json response with available routes from easyway for last period."""
    delta = request.args.get("delta", type=float, default=3600)
    result = RoutesTimeseries.routes_names(delta)
    if result is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    routes = []
    for route in result:
        route_names = sorted(route["route_names"])
        routes.append({"route_type": route["_id"], "route_names": route_names})

    routes = sorted(routes, key=lambda x: -len(x["route_names"]))
    return response(True, routes, 200)


@routes_app.route("routes/<info_id>", methods=['GET'])
def get_routes_static_info(info_id):
    """Return routes static information by id."""
    result = Routes.static_info(info_id)
    if result is None:
        message = "Couldn't retrieve data from database. Try again, please."
        return response(False, message, 503)

    info = sorted(result, key=lambda x: -x["value"])
    return response(True, info, 200)
