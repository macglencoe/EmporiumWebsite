import json
import os

def add_material():
    current_dir = os.path.dirname(__file__)
    data_file = os.path.join(current_dir, '../data/pipes.json')

    with open(data_file, 'r+') as f:
        data = json.load(f)
        for pipe in data:
            pipe["Material"] = "Corn Cob"
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

add_material()