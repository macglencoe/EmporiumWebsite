import json

def add_type_to_objects(json_file):
    with open(json_file, 'r+') as f:
        data = json.load(f)
        for obj in data:
            if 'Roast' in obj:
                obj['Type'] = 'Coffee'
            else:
                obj['Type'] = 'Tea'
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
import os

add_type_to_objects(os.path.join(os.path.dirname(__file__), '..', 'data', 'caffeine.json'))
