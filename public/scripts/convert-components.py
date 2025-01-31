"""
This script converts the 'Components' field in tobacco.json from a string
into a list, where each component is separated by a comma.
"""

import json


def convert_components(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)

    for obj in data:
        if 'Components' in obj:
            if isinstance(obj['Components'], str):
                obj['Components'] = [component.strip() for component in obj['Components'].split(',')]

    with open(json_file, 'w') as f:
        json.dump(data, f, indent=4)

# Example usage:
import os

current_dir = os.path.dirname(__file__)
json_file_path = os.path.join(current_dir, '../data/tobacco.json')
convert_components(json_file_path)
