import json
import difflib

def run(args, data_path):
    try:
        with open(data_path, encoding="utf-8") as f:
            catalog = json.load(f)
    except FileNotFoundError:
        print(f"Could not find file at: {data_path}")
        return

    results = []
    modified = False

    # SIZES MODE
    if args.sizes:
        for cigar in catalog:
            # cigar-level filters
            if args.brand and cigar.get("Cigar Brand", "").lower() != args.brand.lower():
                continue
            if args.name and args.name.lower() not in cigar.get("Cigar Name", "").lower():
                continue
            if args.wrapper and cigar.get("Wrapper", "").lower() != args.wrapper.lower():
                continue
            if args.binder and cigar.get("Binder", "").lower() != args.binder.lower():
                continue
            if args.filler and cigar.get("Filler", "").lower() != args.filler.lower():
                continue
            if args.flavor and args.flavor.lower() not in cigar.get("Flavor_Profile", "").lower():
                continue
            if args.has and not cigar.get(args.has):
                continue

            for size in cigar.get("Sizes", []):
                match = True

                price_str = size.get("Price", "")
                try:
                    price_val = float(price_str)
                except (ValueError, TypeError):
                    price_val = None

                if args.price is not None and price_val != args.price:
                    match = False
                if args.min_price is not None and (price_val is None or price_val < args.min_price):
                    match = False
                if args.max_price is not None and (price_val is None or price_val > args.max_price):
                    match = False

                if args.size:
                    size_name = size.get("Size", "")
                    if size_name.lower() != args.size.lower():
                        match = False

                if args.in_stock is not None:
                    stock_val = size.get("In_Stock")
                    if isinstance(stock_val, str):
                        stock_val = stock_val.strip().lower() == "true"
                    match = match and (stock_val is True if args.in_stock == "true" else stock_val is False)

                if args.barcode:
                    barcode = str(size.get("Barcode", "")).strip()
                    if args.barcode not in barcode:
                        match = False

                if args.missing == "price":
                    if price_str.strip() != "":
                        try:
                            _ = float(price_str)
                            match = False
                        except:
                            pass
                elif args.missing == "barcode":
                    if str(size.get("Barcode", "")).strip():
                        match = False
                elif args.missing == "in_stock":
                    stock = size.get("In_Stock")
                    if stock is not None and stock != "" and stock != "FALSE" and stock is not False:
                        match = False

                if match:
                    results.append((cigar, size))

        # Field existence warning for edit
        if args.edit_field:
            field_exists = any(
                args.edit_field.lower() in (k.lower() for k in size.keys())
                for _, size in results
            )
            if not field_exists:
                print(f'⚠️  Warning: Field "{args.edit_field}" not found in data. When you enter a value, a new "{args.edit_field}" key will be created in each edited entry.\n')

        for cigar, size in results:
            display = (
                f"{cigar.get('Cigar Brand')} - {cigar.get('Cigar Name')} | "
                f"Size: {size.get('Size')} | Price: {size.get('Price')} | "
                f"In Stock: {size.get('In_Stock')} | Barcode: {str(size.get('Barcode', '')).strip() or 'N/A'}"
            )
            print(display)

            if args.edit_field:
                user_input = input(f"Input {args.edit_field.title()} (Enter to skip): ").strip()
                if user_input:
                    actual_key = next((k for k in size.keys() if k.lower() == args.edit_field.lower()), args.edit_field)
                    size[actual_key] = user_input
                    modified = True

    # CIGAR MODE
    else:
        matches = catalog

        if args.brand:
            matches = [c for c in matches if c.get("Cigar Brand", "").lower() == args.brand.lower()]
        if args.name:
            matches = [c for c in matches if args.name.lower() in c.get("Cigar Name", "").lower()]
        if args.wrapper:
            matches = [c for c in matches if c.get("Wrapper", "").lower() == args.wrapper.lower()]
        if args.binder:
            matches = [c for c in matches if c.get("Binder", "").lower() == args.binder.lower()]
        if args.filler:
            matches = [c for c in matches if c.get("Filler", "").lower() == args.filler.lower()]
        if args.flavor:
            matches = [c for c in matches if args.flavor.lower() in c.get("Flavor_Profile", "").lower()]

        if args.missing:
            matches = [c for c in matches if not str(c.get(args.missing, "")).strip()]

        if args.has:
            matches = [c for c in matches if c.get(args.has)]

        if args.edit_field:
            field_exists = any(
                args.edit_field.lower() in (k.lower() for k in cigar.keys())
                for cigar in matches
            )
            if not field_exists:
                print(f'⚠️  Warning: Field "{args.edit_field}" not found in data. When you enter a value, a new "{args.edit_field}" key will be created in each edited entry.\n')

        for cigar in matches:
            output = f"- {cigar.get('Cigar Name')} ({cigar.get('Cigar Brand')})"
            if args.display:
                extras = [f"{field}: {cigar.get(field, 'N/A')}" for field in args.display]
                output += " | " + " | ".join(extras)
            print(output)

            if args.edit_field:
                user_input = input(f"Input {args.edit_field.title()} (Enter to skip): ").strip()
                if user_input:
                    actual_key = next((k for k in cigar.keys() if k.lower() == args.edit_field.lower()), args.edit_field)
                    cigar[actual_key] = user_input
                    modified = True

    # Save if modified with diff confirmation
    if modified:
        try:
            with open(data_path, encoding="utf-8") as f:
                original_lines = f.read().splitlines()

            new_json_str = json.dumps(catalog, indent=2)
            new_lines = new_json_str.splitlines()

            diff = list(difflib.unified_diff(original_lines, new_lines, fromfile="original", tofile="modified", lineterm=""))
            print("\n🔍 Diff preview:\n" + "-" * 50)
            print("\n".join(diff[:200]))

            confirm = input("\n💾 Save these changes? (y/N): ").strip().lower()
            if confirm == 'y':
                with open(data_path, "w", encoding="utf-8") as f:
                    f.write(new_json_str)
                print(f"\n✅ Changes saved to {data_path}")
            else:
                print("\n❌ Changes discarded.")

        except Exception as e:
            print(f"❌ Failed to show or save changes: {e}")
    elif args.edit_field:
        print("\nNo changes made.")
