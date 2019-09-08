"""This module provides views API."""

import itertools

from flask import Blueprint, jsonify, request

from mongo.worker import MONGER

JAMMED = Blueprint('jammed', __name__)


@JAMMED.route('/graphs/static', methods=['GET'])
def get_static_graphs():
    """Return json response with data for static graphs"""
    data_limit = request.args.get('data_limit', type=int)

    graphs_data = MONGER.find('static_graphs', fields={'_id': 0})
    for graph in graphs_data:
        graph_data = dict(sorted(graph['data'].items(), key=lambda x: x[1]))
        limit = data_limit or len(graph_data)
        start_limit = (len(graph_data) - limit) if (len(graph_data) - limit) > 0 else 0
        graph_data = dict(itertools.islice(graph_data.items(), start_limit, None))
        graph['data'] = [{'name': name, 'value': value} for name, value in graph_data.items()]

    response = jsonify(graphs_data)
    response.cache_control.public = True
    response.cache_control.max_age = 604800  # week in seconds
    return response
