"""This module implements helpers functions for work with files."""

import csv
import requests


def download_file(url):
    """Download file from `url` to directory with path `save_to`."""
    response = requests.get(url)
    if not response.status_code == 200:
        return None

    return response.content


def load_csv(path_to_file):
    """Provide csv file parsing with the required fields."""
    with open(path_to_file) as csv_file:
        try:
            csv_data = csv.DictReader(csv_file, delimiter=',')
        except csv.Error:
            return None

        output = [dict(row) for row in csv_data]

    return output
