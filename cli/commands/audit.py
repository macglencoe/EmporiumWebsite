import json
from collections import Counter

def run(args, data_path):
    try:
        with open(data_path, encoding="utf-8") as f:
            catalog = json.load(f)
    except FileNotFoundError:
        print(f"Could not find file at: {data_path}")
        return

    print("\nAudit Results")
    print("=" * 40)

    # --- CRITICAL ---
    print("\nCRITICAL (Must Fix)")
    print("-" * 40)

    issues_found = False

    missing_slugs = [c for c in catalog if not str(c.get("slug", "")).strip()]
    if missing_slugs:
        print(f"[!] {len(missing_slugs)} cigars missing slug")
        issues_found = True
    else:
        print("[✓] All cigars have a slug")
    
    slugs = [c.get("slug") for c in catalog if c.get("slug")]
    slug_counts = Counter(slugs)
    duplicates = [slug for slug, count in slug_counts.items() if count > 1]
    if duplicates:
        print(f"[!] {len(duplicates)} duplicated slugs found")
        issues_found = True
    else:
        print("[✓] No duplicated slugs")

    missing_sizes_key = [c for c in catalog if "Sizes" not in c]
    if missing_sizes_key:
        print(f"[!] {len(missing_sizes_key)} cigars missing Sizes key")
        issues_found = True
    else:
        print("[✓] All cigars include a Sizes key")

    

    empty_sizes = [c for c in catalog if c.get("Sizes") == []]
    if empty_sizes:
        print(f"[!] {len(empty_sizes)} cigars have an empty Sizes array")
        issues_found = True
    else:
        print("[✓] No cigars with empty Sizes arrays")

    # --- WARNINGS ---
    print("\nNON-CRITICAL (Warning)")
    print("-" * 40)

    def print_check(label, items):
        nonlocal issues_found
        if items:
            print(f"[!] {len(items)} cigars missing {label}")
            issues_found = True
        else:
            print(f"[✓] All cigars have {label}")

    for field in ["Wrapper", "Binder", "Filler", "Strength_Profile", "Flavor_Profile"]:
        missing_field = [c for c in catalog if c.get(field) in [None, ""]]
        print_check(field, missing_field)


    missing_brand = [c for c in catalog if c.get("Cigar Brand") in [None, ""]]
    missing_name = [c for c in catalog if c.get("Cigar Name") in [None, ""]]
    print_check("Cigar Brand", missing_brand)
    print_check("Cigar Name", missing_name)

    # --- SIZE-LEVEL ---
    print("\nSIZE-LEVEL ISSUES")
    print("-" * 40)

    missing_price = 0
    non_bool_instock = 0
    missing_instock = 0
    duplicate_barcodes = Counter()

    seen_barcodes = set()
    for cigar in catalog:
        for size in cigar.get("Sizes", []):
            price = str(size.get("Price", "")).strip()
            if price == "" or price is None:
                missing_price += 1

            barcode = str(size.get("Barcode", "")).strip()
            if barcode:
                if barcode in seen_barcodes:
                    duplicate_barcodes[barcode] += 1
                seen_barcodes.add(barcode)

            if "In_Stock" not in size:
                missing_instock += 1
            else:
                val = size["In_Stock"]
                if isinstance(val, str):
                    val = val.strip().lower()
                    if val not in ["true", "false"]:
                        non_bool_instock += 1
                elif not isinstance(val, bool):
                    non_bool_instock += 1

    if missing_price:
        print(f"[!] {missing_price} sizes missing Price")
        issues_found = True
    else:
        print("[✓] All sizes have a Price")

    if missing_instock:
        print(f"[!] {missing_instock} sizes missing In_Stock field")
        issues_found = True
    else:
        print("[✓] All sizes have In_Stock field")

    if non_bool_instock:
        print(f"[!] {non_bool_instock} sizes have non-boolean In_Stock values")
        issues_found = True
    else:
        print("[✓] All In_Stock values are boolean or valid strings")

    if duplicate_barcodes:
        print(f"[!] {len(duplicate_barcodes)} duplicate barcodes found in sizes")
        issues_found = True
    else:
        print("[✓] No duplicate barcodes found")

    print("\nAUDIT COMPLETE")
    if not issues_found:
        print("[✓] No critical or warning issues found!")
