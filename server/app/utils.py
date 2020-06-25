"""This modules provides helper functionality for application."""

from flask import jsonify


def response(success, result, status_code):
    """Return prepared http json response."""
    json_result = jsonify({"success": success, "result": result})
    return json_result, status_code
