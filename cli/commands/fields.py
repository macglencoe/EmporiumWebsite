import json
import os

def run(args, data_path):
    if not os.path.isfile(data_path):
        print(f"❌ Data file not found: {data_path}")
        return

    try:
        with open(data_path, encoding="utf-8") as f:
            catalog = json.load(f)

        cigar_fields = set()
        size_fields = set()

        for cigar in catalog:
            cigar_fields.update(cigar.keys())
            for size in cigar.get("Sizes", []):
                size_fields.update(size.keys())

        print("\n📋 Fields in Catalog")
        print("=" * 40)
        print("\nTop-Level Cigar Fields:")
        for field in sorted(cigar_fields):
            print(f"- {field}")

        print("\nNested Size Fields:")
        for field in sorted(size_fields):
            print(f"- {field}")

    except Exception as e:
        print(f"❌ Failed to read catalog: {e}")
