"""This module provides views API."""

from flask import Blueprint, jsonify, request

from api.models import Route
from mongo.worker import MONGER


JAMMED = Blueprint('jammed', __name__)


@JAMMED.route('/static', methods=['GET'])
def get_static_data():
    """Return json response with static data from easyway."""
    collection_id = request.args.get('id')
    data_limit = request.args.get('limit', type=int, default=0)
    data_skip = request.args.get('skip', type=int, default=0)

    response = MONGER.find(
        collection_id,
        fields={'_id': 0},
        order_by=[('value', -1)],
        limit=data_limit,
        skip=data_skip
    )
    if not response:
        return "Bad Request.", 400

    response = jsonify(response)
    response.cache_control.public = True
    response.cache_control.max_age = 86400  # day in seconds
    return response


@JAMMED.route('/static/count', methods=['GET'])
def get_static_data_count():
    """Return count of documents in certain collection."""
    data_id = request.args.get('id')
    response = MONGER.find(data_id)
    if not response:
        return "Bad Request.", 400

    response = jsonify({"count": len(response)})
    return response


@JAMMED.route('/timeseries', methods=['GET'])
def get_timeseries():
    """Return json response with timeseries from easyway."""
    delta = request.args.get("delta", type=int, default=10800)
    route_name = request.args.get("route_name")
    units = request.args.get("units")

    response = Route.timeseries(route_name, units, delta)
    if response is None:
        return "Bad Request.", 400

    return jsonify(response)


@JAMMED.route('/timeseries/coordinates', methods=['GET'])
def get_coordinates():
    """Return coordinates for certain route from timeseries collection."""
    route_name = request.args.get("route_name")
    response = Route.coordinates(route_name)
    if response is None:
        return "Bad Request.", 400

    try:
        response = response[0]
    except IndexError:
        return jsonify({"timestamp": None, "coordinates": []})

    coordinates = [x["coordinates"] for x in response["route_trips"].values()]
    timestamp = response["timestamp"]
    return jsonify({"timestamp": timestamp, "coordinates": coordinates})


@JAMMED.route('/routes', methods=['GET'])
def get_routes():
    """Return json response with available routes from easyway."""
    cursor = Route.available_routes()
    if cursor is None:
        return "Bad Request.", 400

    routes = []
    for route in cursor:
        route_names = sorted(route["route_names"])
        routes.append({"route_type": route["_id"], "route_names": route_names})

    response = sorted(routes, key=lambda x: -len(x["route_names"]))
    return jsonify(response)
