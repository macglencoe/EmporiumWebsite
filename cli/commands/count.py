import json
from collections import Counter

def run(args, data_path):
    try:
        with open(data_path, encoding="utf-8") as f:
            catalog = json.load(f)
    except FileNotFoundError:
        print(f"Could not find file at: {data_path}")
        return

    if not args.field:
        print(f"Total number of cigars: {len(catalog)}")
        return

    values = []

    if args.sizes:
        for cigar in catalog:
            for size in cigar.get("Sizes", []):
                values.append(size.get(args.field, ""))
    else:
        values = [c.get(args.field, "") for c in catalog]

    if args.missing:
        missing_count = sum(1 for v in values if not str(v).strip())
        print(f"Missing values for field '{args.field}': {missing_count}")
    else:
        counter = Counter(v if str(v).strip() else "N/A" for v in values)
        total = len(values)

        print(f"Counts for field: {args.field}" + (" (in Sizes)" if args.sizes else ""))
        print("-" * 50)
        items = counter.most_common()
        if args.reverse:
            items = sorted(items, key=lambda x: x[1])  # ascending
        for key, count in items:
            percent = (count / total) * 100
            print(f"{key}: {count} ({percent:.1f}%)")
