import json
import os

def add_pipe():
    pipe_name = input("Enter Pipe Name (or press Enter to quit): ")
    if pipe_name.strip() == "":
        return

    current_dir = os.path.dirname(__file__)
    data_file = os.path.join(current_dir, '../data/pipes.json')

    with open(data_file, 'r+') as f:
        data = json.load(f)
        new_pipe = {"Pipe Name": pipe_name}
        data.append(new_pipe)
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

while True:
    add_pipe()