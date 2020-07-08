"""This module provides helper functionality for collector application."""

import csv
import zipfile
import json

import requests


def download_context(url, save_to=None):
    """Download context from specified url and write data to file if needed."""
    try:
        response = requests.get(url)
    except requests.exceptions.RequestException:
        return None

    if not response.status_code == 200:
        return None

    if save_to:
        with open(save_to, 'wb') as file:
            file.write(response.content)

    return response.content


def load_csv(filepath, delimiter=','):
    """Return parsed csv file where every row is dictionary."""
    with open(filepath) as csv_file:
        try:
            csv_data = csv.DictReader(csv_file, delimiter=delimiter)
        except csv.Error:
            return None

        output = [dict(row) for row in csv_data]

    return output


def load_json(filepath):
    """Return parsed json file as dictionary."""
    with open(filepath) as json_file:
        try:
            json_data = json.load(json_file)
        except json.JSONDecodeError:
            return None

    return json_data


def unzip(zippath, dirpath):
    """Unzip files from archive to specified directory."""
    try:
        with zipfile.ZipFile(zippath, 'r') as zip_file:
            zip_file.extractall(dirpath)
    except zipfile.BadZipFile:
        return False

    return True
