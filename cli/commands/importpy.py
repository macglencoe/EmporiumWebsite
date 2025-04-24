import csv
import json
import os
import re
from collections import defaultdict

def generate_slug(brand, name):
    combined = f"{brand} {name}"
    slug = re.sub(r'[^a-z0-9\s]', '', combined.lower())  # remove all non-alphanum except space
    slug = re.sub(r'\s+', '-', slug)  # replace whitespace with hyphen
    return slug

def run(args, data_path):
    csv_path = input("Enter path to CSV file: ").strip()
    if not os.path.isfile(csv_path):
        print(f"❌ File not found: {csv_path}")
        return

    cigars = defaultdict(lambda: {
        "Cigar Brand": "",
        "Cigar Name": "",
        "Wrapper": "",
        "Binder": "",
        "Filler": "",
        "Flavor_Profile": "",
        "Strength_Profile": "",
        "Sizes": []
    })

    try:
        with open(csv_path, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                brand = row["Cigar Brand"].strip()
                name = row["Cigar Name"].strip()
                if not brand or not name:
                    continue

                key = (brand, name)

                if not cigars[key]["Cigar Brand"]:
                    cigars[key].update({
                        "Cigar Brand": brand,
                        "Cigar Name": name,
                        "Wrapper": row["Wrapper"].strip(),
                        "Binder": row["Binder"].strip(),
                        "Filler": row["Filler"].strip(),
                        "Flavor_Profile": row["Flavor_Profile"].strip(),
                        "Strength_Profile": row["Strength_Profile"].strip(),
                    })

                raw_price = row["Price"].strip()
                if raw_price.startswith("$\t"):
                    raw_price = raw_price[2:]

                size_entry = {
                    "Size": row["Size"].strip(),
                    "Barcode": int(row["Barcode"].strip()) if row["Barcode"].strip().isdigit() else row["Barcode"].strip(),
                    "In_Stock": row["In_Stock"].strip(),
                    "Price": raw_price
                }

                cigars[key]["Sizes"].append(size_entry)

        result = []
        for (brand, name), cigar in cigars.items():
            cigar["slug"] = generate_slug(brand, name)
            result.append(cigar)

        with open(data_path, "w", encoding="utf-8") as outfile:
            json.dump(result, outfile, indent=2)

        print(f"\n✅ Imported {len(result)} cigars from CSV and wrote to {data_path}")

    except Exception as e:
        print(f"❌ Failed to process CSV: {e}")