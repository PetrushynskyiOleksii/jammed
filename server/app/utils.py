"""This modules provides helper functionality for application."""

from flask import jsonify, make_response


def response(success, result, status_code):
    """Return prepared http json response."""
    json_result = jsonify({"success": success, "result": result})
    return make_response(json_result), status_code
