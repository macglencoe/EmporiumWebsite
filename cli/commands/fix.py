import json
import sys
import difflib


def run(args, data_path):
    """
    Mass-fix command:
      - --remove-empty FIELD  : delete FIELD keys with empty values
      - --to-string FIELD     : convert FIELD values to strings

    Example usage:
      fix --remove-empty Barcode
      fix --to-string Barcode
    """
    field_remove = getattr(args, 'remove_empty', None)
    field_string = getattr(args, 'to_string', None)
    if not field_remove and not field_string:
        print("⚠️  Specify --remove-empty or --to-string with a field name.")
        sys.exit(1)

    # Load original data
    try:
        with open(data_path, encoding='utf-8') as f:
            original_text = f.read()
            catalog = json.loads(original_text)
    except FileNotFoundError:
        print(f"❌ Data file not found: {data_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse JSON data: {e}")
        sys.exit(1)

    modified = False

    # Apply fixes
    for cigar in catalog:
        # Top-level
        if field_remove and field_remove in cigar and (cigar[field_remove] == "" or cigar[field_remove] is None):
            del cigar[field_remove]
            modified = True
        if field_string and field_string in cigar and not isinstance(cigar[field_string], str):
            cigar[field_string] = str(cigar[field_string])
            modified = True
        # Nested Sizes array
        for size in cigar.get('Sizes', []):
            if field_remove and field_remove in size and (size[field_remove] == "" or size[field_remove] is None):
                del size[field_remove]
                modified = True
            if field_string and field_string in size and not isinstance(size[field_string], str):
                size[field_string] = str(size[field_string])
                modified = True

    if not modified:
        op = ' and '.join([f'--remove-empty {field_remove}' if field_remove else '', 
                             f'--to-string {field_string}' if field_string else '']).strip(' and ')
        print(f"✔ No changes needed for {op}.")
        return

    # Show diff preview
    new_text = json.dumps(catalog, indent=2)
    original_lines = original_text.splitlines()
    new_lines = new_text.splitlines()
    diff = difflib.unified_diff(
        original_lines,
        new_lines,
        fromfile='original',
        tofile='modified',
        lineterm=''
    )
    print("🔍 Preview of changes:")
    for line in list(diff)[:200]:
        print(line)

    # Confirm and save
    confirm = input("💾 Save these changes? (y/N): ").strip().lower()
    if confirm == 'y':
        try:
            with open(data_path, 'w', encoding='utf-8') as f:
                f.write(new_text)
            ops = []
            if field_remove: ops.append(f"removed empty '{field_remove}'")
            if field_string: ops.append(f"converted '{field_string}' to string")
            print(f"✅ {', '.join(ops).capitalize()} and saved to {data_path}.")
        except Exception as e:
            print(f"❌ Failed to save changes: {e}")
    else:
        print("❌ Changes discarded.")
