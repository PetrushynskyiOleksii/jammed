"""
This module provides API views.
"""

import json

from flask import Blueprint, jsonify, request

from mongo.worker import MONGER
from settings import TIMESERIES_COLLECTION


JAMMED = Blueprint('jammed', __name__)


@JAMMED.route('/static', methods=['GET'])
def get_static_data():
    """
    Return json response with static data from easyway by data id.
    """
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
    """
    Return count of documents in certain collection.
    """
    data_id = request.args.get('id')
    response = MONGER.count(data_id)
    if not response:
        return "Bad Request.", 400

    response = jsonify({"count": response})
    return response


@JAMMED.route('/available_routes', methods=['GET'])
def get_available_routes():
    """
    Return json response with available routes from easyway for last period.
    """
    query = json.loads(request.args.get("query"))
    cursor = MONGER.aggregate(TIMESERIES_COLLECTION, pipeline=query)
    if cursor is None:
        return "Bad Request.", 400

    routes = []
    for route in cursor:
        route_names = sorted(route["route_names"])
        routes.append({"route_type": route["_id"], "route_names": route_names})

    response = sorted(routes, key=lambda x: -len(x["route_names"]))
    return jsonify(response)


@JAMMED.route('/timeseries', methods=['GET'])
def get_timeseries():
    """
    Return json response with timeseries from easyway by aggregation query.
    """
    query = json.loads(request.args.get("query"))
    cursor = MONGER.aggregate(TIMESERIES_COLLECTION, pipeline=query)
    if cursor is None:
        return "Bad Request.", 400

    response = [{"timestamp": x["_id"]["timestamp"], "value": x["value"]} for x in cursor]
    return jsonify(response)
