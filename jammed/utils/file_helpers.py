"""
This module provides functionality to work with files.
"""

import csv
import zipfile
import requests


def download_context(url, save_to=None):
    """
    Download context from specified url and write data to file if needed.
    """
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


def unzip(filepath, save_to=None):
    """
    Unzip files from archive to specified directory
    """
    if not save_to:
        path = filepath.split('/')[:-1]
        save_to = "/".join(path)
    try:
        with zipfile.ZipFile(filepath, 'r') as zip_file:
            zip_file.extractall(save_to)
    except zipfile.BadZipFile:
        return False

    return True


def load_csv(filepath, delimiter=','):
    """
    Return parsed csv file where every row is dictionary.
    """
    with open(filepath) as csv_file:
        try:
            csv_data = csv.DictReader(csv_file, delimiter=delimiter)
        except csv.Error:
            return None

        output = [dict(row) for row in csv_data]

    return output


def dump_csv(filepath, dictionaries):
    """
    Dump list of dictionaries to csv file.
    """
    with open(filepath, 'w') as csv_file:
        try:
            fields = dictionaries[0].keys()
            writer = csv.DictWriter(csv_file, fieldnames=fields)
            writer.writeheader()
            writer.writerows(dictionaries)
        except csv.Error:
            return False

    return True
