import json
import sys
from jsonschema import Draft7Validator


def run(args, data_path, schema_path):
    """
    Validate the consolidated cigar JSON against a provided JSON Schema,
    reporting errors with cigar context.
    """
    # Load cigar data
    try:
        with open(data_path, encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Could not find data file at: {data_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"JSON parse error in data file: {e}")
        sys.exit(1)

    # Load schema file
    try:
        with open(schema_path, encoding='utf-8') as f:
            schema = json.load(f)
    except FileNotFoundError:
        print(f"Could not find schema file at: {schema_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"JSON parse error in schema file: {e}")
        sys.exit(1)

    # Validate against schema
    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)

    if errors:
        print(f"✖ Schema validation failed ({len(errors)} errors):")
        for err in errors:
            # Build dotted path location
            loc = ".".join(str(p) for p in err.path) or '<root>'
            # Add cigar context if available
            context = ''
            if err.path and isinstance(err.path[0], int):
                idx = err.path[0]
                if 0 <= idx < len(data):
                    cigar = data[idx]
                    brand = cigar.get('Cigar Brand', '')
                    name = cigar.get('Cigar Name', '')
                    context = f" [{brand} - {name}]"
            # Print error message
            print(f"  • {loc}: {err.message}{context}")
        sys.exit(1)
    else:
        print("✔ Data is valid against schema.")
