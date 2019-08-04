"""
The module which provides functionality for loading regions
and appropriate streets in Lviv city.
"""

import json
import requests
import collections

from bs4 import BeautifulSoup


REGIONS_FILE = '../jammed/static/ew/regions.json'
ALPHABET = ['А', 'Б', 'В', 'Г', 'Ґ', 'Д', 'Е', 'Є', 'Ж', 'З', 'І', 'Й', 'К', 'Л', 'М',
            'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ю', 'Я']
REGIONS_MAPPING = {
    'Галицький': ['Галицький', 'Галицький район'],
    'Залізничний': ['Залізничний', 'Залізничиний', 'Залізничний район'],
    'Личаківський': ['Личаківський', 'Личаківського'],
    'Сихівський': ['Сихівський', 'Сихівський район'],
    'Франківський': ['Франківський', 'Франківський район'],
    'Шевченківський': ['Шевченківський'],

}


def get_page_url(letter):
    """Return a url for a page with streets which start with letter."""
    return f'https://uk.wikipedia.org/wiki/Список_вулиць_Львова_({letter})'


def dump_regions(regions):
    """Dump regions with appropriate streets to the csv file."""
    with open(REGIONS_FILE, mode='w') as file:
        json.dump(regions, file, indent=4, ensure_ascii=False)


def load_regions():
    """Load and parse regions from every page with appropriate streets."""
    regions = collections.defaultdict(list)

    for letter in ALPHABET:
        url = get_page_url(letter)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find('table', attrs={'class': 'wide'})
        table_body = table.find('tbody')

        rows = table_body.find_all('tr')
        for counter, row in enumerate(rows):
            if not counter:
                continue

            columns = row.find_all('td')
            street = columns[0].text.strip()
            for region in columns[3].text.strip().split(', '):
                for clear_region, alternatives in REGIONS_MAPPING.items():
                    if region in alternatives:
                        region = clear_region
                        break

                regions[region].append(street)

    dump_regions(regions)


if __name__ == '__main__':
    load_regions()
