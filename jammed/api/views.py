"""This module provides views API."""

from flask import Blueprint, jsonify, request

from mongo.worker import MONGER

JAMMED = Blueprint('jammed', __name__)


@JAMMED.route('/static', methods=['GET'])
def get_static_data():
    """Return json response with static data from easyway."""
    data_id = request.args.get('id')
    data_limit = request.args.get('limit', type=int, default=0)
    data_skip = request.args.get('skip', type=int, default=0)

    documents = MONGER.find(
        data_id,
        fields={'_id': 0},
        order_by=[('value', -1)],
        limit=data_limit,
        skip=data_skip
    )

    response = jsonify(list(documents))
    response.cache_control.public = True
    response.cache_control.max_age = 604800  # week in seconds
    return response


@JAMMED.route('/static/count', methods=['GET'])
def get_static_data_count():
    """Return count of documents in certain collection."""
    data_id = request.args.get('id')
    documents = MONGER.find(data_id)
    response = jsonify({"count": documents.count()})
    return response
