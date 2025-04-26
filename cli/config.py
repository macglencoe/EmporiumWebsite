import json
import os

def get_data_path(config_override=None):
    # Path to config.json in same folder as main.py
    base_dir = os.path.dirname(__file__)
    config_path = config_override or os.path.join(base_dir, "config.json")
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
            # Resolve relative data path based on config location
            return os.path.abspath(os.path.join(base_dir, config["dataPath"]))
    except Exception as e:
        print(f"❌ Failed to read config file: {e}")
        return None
def set_data_path(new_path, config_path=None):
    base_dir = os.path.dirname(__file__)
    config_file = config_path or os.path.join(base_dir, "config.json")
    try:
        with open(config_file, "r", encoding="utf-8") as f:
            config = json.load(f)

        config["dataPath"] = new_path

        with open(config_file, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)

        print(f"✅ dataPath updated to: {new_path}")
    except Exception as e:
        print(f"❌ Failed to update config: {e}")
