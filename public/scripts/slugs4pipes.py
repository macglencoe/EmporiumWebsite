import json
import os
from slugify import slugify

def add_slugs():
    current_dir = os.path.dirname(__file__)
    data_file = os.path.join(current_dir, '../data/pipes.json')

    with open(data_file, 'r+') as f:
        data = json.load(f)
        for pipe in data:
            pipe["slug"] = slugify(pipe["Pipe Name"])
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

add_slugs()