import json
import uuid
import os

def generate_slug(name):
    return name.lower().replace(' ', '-')

def add_tobacco_to_json(file_path):
    with open(file_path, 'r+') as file:
        data = json.load(file)
        while True:
            tobacco_name = input("Enter Tobacco Name (or press enter to exit): ")
            if not tobacco_name:
                break
            new_tobacco = {
                "Tobacco Name": tobacco_name,
                "Tobacco Brand": "King Street Emporium",
                "slug": generate_slug(tobacco_name)
            }
            data.append(new_tobacco)
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()

add_tobacco_to_json(os.path.join(os.path.dirname(__file__), '..', 'data', 'tobacco.json'))

