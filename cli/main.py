import argparse
import os
from commands import search, count, audit, importpy, fields, schema, fix

def main():
    

    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.abspath(os.path.join(script_dir, "../public/data/consolidated_cigars.json"))

    parser = argparse.ArgumentParser(description="Cigar Catalog CLI Utility")
    subparsers = parser.add_subparsers(dest="command")

    # Search command
    search_parser = subparsers.add_parser("search", help="Search cigars by brand, name, etc.")
    search_parser.add_argument("--brand", help="Filter by brand")
    search_parser.add_argument("--name", help="Filter by cigar name")
    search_parser.add_argument("--wrapper", help="Filter by wrapper type")
    search_parser.add_argument("--binder", help="Filter by binder type")
    search_parser.add_argument("--filler", help="Filter by filler type")
    search_parser.add_argument("--flavor", help="Filter by flavor profile")
    search_parser.add_argument("--display", nargs="+", help="Additional fields to display (e.g. --display Wrapper Filler)")
    search_parser.add_argument("--missing", help="Filter cigars missing this field")
    search_parser.add_argument("--edit-field", help="Field to update interactively for each result")
    search_parser.add_argument("--has", help="Filter cigars with this field. Opposite of --missing")

    search_parser.add_argument("--sizes", action="store_true", help="Search within the Sizes array")

    search_parser.add_argument("--price", type=float, help="Filter sizes by price")
    search_parser.add_argument("--size", help="Filter sizes by name (e.g. Toro, Robusto)")
    search_parser.add_argument("--in-stock", choices=["true", "false"], help="Filter by in-stock status")
    search_parser.add_argument("--barcode", help="Filter sizes by partial barcode match")
    search_parser.add_argument("--min-price", type=float, help="Filter sizes with price greater than or equal to this")
    search_parser.add_argument("--max-price", type=float, help="Filter sizes with price less than or equal to this")

    # Count command
    count_parser = subparsers.add_parser("count", help="Show basic inventory stats")
    count_parser.add_argument("--field", help="Field to count values for (e.g. Wrapper, Strength_Profile)")
    count_parser.add_argument("--missing", action="store_true", help="Count how many entries are missing the specified field")
    count_parser.add_argument("--sizes", action="store_true", help="Count fields inside cigar Sizes arrays")
    count_parser.add_argument("--reverse", action="store_true", help="Reverse sort order")

    # Audit command
    audit_parser = subparsers.add_parser("audit", help="Show diagnostic information about the data")

    # Import command
    import_parser = subparsers.add_parser("import", help="Import cigars from a CSV file")

    # Fields command
    fields_parser = subparsers.add_parser("fields", help="List available fields")

    # Schema
    schema_path = os.path.abspath(os.path.join(script_dir, "../public/data/cigar.schema.json"))
    schema_parser = subparsers.add_parser("schema", help="Validate the consolidated cigar JSON against a provided JSON Schema")

    # Fix command
    fix_parser = subparsers.add_parser("fix", help="Options for mass-fixing data")
    fix_parser.add_argument("--remove-empty", help="Remove keys with empty values for the specified field")
    fix_parser.add_argument("--to-string", help="Convert the specified field to a string")

    





    args = parser.parse_args()

    if args.command == "search":
        search.run(args, data_path)
    elif args.command == "count":
        count.run(args, data_path)
    elif args.command == "audit":
        audit.run(args, data_path)
    elif args.command == "import":
        importpy.run(args, data_path)
    elif args.command == "fields":
        fields.run(args, data_path)
    elif args.command == "schema":
        schema.run(args, data_path, schema_path)
    elif args.command == "fix":
        fix.run(args, data_path)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
