"""This module provides views API."""

from collections import defaultdict
from datetime import datetime

from flask import Blueprint, jsonify, request

from settings import TIMESERIES_COLLECTION
from mongo.worker import MONGER


JAMMED = Blueprint('jammed', __name__)


def get_time_range(delta):
    end = int(datetime.now().timestamp())
    start = end - delta
    return start, end


@JAMMED.route('/static', methods=['GET'])
def get_static_data():
    """Return json response with static data from easyway."""
    data_id = request.args.get('id')
    data_limit = request.args.get('limit', type=int, default=0)
    data_skip = request.args.get('skip', type=int, default=0)

    try:
        documents = MONGER.find(
            data_id,
            fields={'_id': 0},
            order_by=[('value', -1)],
            limit=data_limit,
            skip=data_skip
        )
    except AttributeError:
        message = "Could not connect to database."
        return jsonify({"error": message}), 400

    response = jsonify(list(documents))
    response.cache_control.public = True
    response.cache_control.max_age = 86400  # day in seconds
    return response


@JAMMED.route('/static/count', methods=['GET'])
def get_static_data_count():
    """Return count of documents in certain collection."""
    data_id = request.args.get('id')
    try:
        documents = MONGER.find(data_id)
    except AttributeError:
        message = "Could not connect to database."
        return jsonify({"error": message}), 400

    response = jsonify({"count": documents.count()})
    return response


@JAMMED.route('/timeseries', methods=['GET'])
def get_timeseries():
    """Return json response with timeseries from easyway."""
    delta = request.args.get("delta", type=int, default=10800)
    route_name = request.args.get("route_name")
    units = request.args.get("units")

    start, end = get_time_range(delta)
    try:
        documents = MONGER.find(
            TIMESERIES_COLLECTION,
            query_filter={
                "route_name": route_name,
                "timestamp": {"$gte": start, "$lte": end}
            },
            fields={"_id": 0, "timestamp": 1, units: 1}
        )
    except AttributeError:
        message = "Could not connect to database."
        return jsonify({"error": message}), 400

    return jsonify(list(documents))


@JAMMED.route('/timeseries/coordinates', methods=['GET'])
def get_timeseries_coordinates():
    """Return coordinates for certain route from timeseries collection."""
    route_name = request.args.get("route_name")
    try:
        documents = MONGER.find(
            TIMESERIES_COLLECTION,
            query_filter={"route_name": route_name},
            fields={"_id": 0, "timestamp": 1, "route_trips": 1},
            order_by=[("timestamp", 1)],
            limit=1
        )
    except AttributeError:
        message = "Could not connect to database."
        return jsonify({"error": message}), 400

    document = documents.next()
    coordinates = [x["coordinates"] for x in document["route_trips"].values()]
    return jsonify({
        "timestamp": document["timestamp"],
        "coordinates": coordinates
    })


@JAMMED.route('/routes', methods=['GET'])
def get_routes():
    """Return json response with available routes from easyway."""
    start, end = get_time_range(10800)
    try:
        documents = MONGER.find(
            TIMESERIES_COLLECTION,
            query_filter={
                "timestamp": {"$gte": start, "$lte": end}
            },
            fields={"_id": 0, "route_name": 1, "route_type": 1},
            order_by=[("route_name", 1)]
        )
    except AttributeError:
        message = "Could not connect to database."
        return jsonify({"error": message}), 400

    response = defaultdict(list)
    for document in list(documents):
        route_name = document["route_name"]
        route_type = document["route_type"]
        if route_name and route_type:
            if route_name not in response[route_type]:
                response[route_type].append(route_name)

    return jsonify(response)
