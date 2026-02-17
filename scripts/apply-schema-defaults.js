#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const PRESETS = {
  cigar: {
    schema: "public/data/cigar.ui.schema.json",
    data: "public/data/consolidated_cigars.json",
  },
  tobacco: {
    schema: "public/data/tobacco.ui.schema.json",
    data: "public/data/tobacco.json",
  },
};

const isEmptyValue = (value) => value === "" || value === null || value === undefined;

const normalizeType = (type) => {
  const types = Array.isArray(type) ? type : [type];
  const allowNull = types.includes("null");
  const baseType = types.find((t) => t && t !== "null") || types[0] || "any";
  return { allowNull, baseType };
};

const buildDefaultsForProperties = (properties) =>
  Object.entries(properties || {}).reduce((acc, [key, field]) => {
    const value = buildDefaultValue(field);
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

const buildDefaultValue = (field = {}) => {
  if (Object.prototype.hasOwnProperty.call(field, "default")) {
    return field.default;
  }

  const { allowNull, baseType } = normalizeType(field.type);

  if (baseType === "object") {
    return buildDefaultsForProperties(field.properties || {});
  }

  if (baseType === "array") {
    return field.default ?? [];
  }

  if (allowNull) {
    return null;
  }

  if (baseType === "string") {
    return "";
  }

  if (baseType === "boolean") {
    return false;
  }

  return undefined;
};

const applyFieldDefaults = (field = {}, value) => {
  const { baseType } = normalizeType(field.type);

  if (baseType === "object") {
    if (isEmptyValue(value)) {
      return buildDefaultValue(field);
    }
    const raw =
      value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const props = field.properties || {};
    const next = { ...raw };
    Object.entries(props).forEach(([key, childField]) => {
      next[key] = applyFieldDefaults(childField, raw[key]);
    });
    return next;
  }

  if (baseType === "array") {
    if (!Array.isArray(value)) {
      return buildDefaultValue(field);
    }
    if (value.length === 0 && Object.prototype.hasOwnProperty.call(field, "default")) {
      return field.default;
    }
    const itemField = field.items || {};
    return value.map((item) => applyFieldDefaults(itemField, item));
  }

  if (isEmptyValue(value)) {
    return buildDefaultValue(field);
  }

  return value;
};

const applySchemaDefaults = (schema, value) => {
  if (!schema || typeof schema !== "object") return value;
  return applyFieldDefaults(schema, value);
};

const parseArgs = (argv) => {
  const args = {
    type: null,
    schema: null,
    data: null,
    out: null,
    write: false,
    dryRun: false,
    help: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (arg === "--write") {
      args.write = true;
      continue;
    }
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--type") {
      args.type = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--schema") {
      args.schema = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--data") {
      args.data = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--out") {
      args.out = argv[i + 1];
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
};

const printUsage = () => {
  console.log("Apply schema defaults to cigar or tobacco data.\n");
  console.log("Usage:");
  console.log("  node scripts/apply-schema-defaults.js --type cigar");
  console.log("  node scripts/apply-schema-defaults.js --type tobacco --write");
  console.log("  node scripts/apply-schema-defaults.js --schema <schema.json> --data <data.json> --out <out.json>");
  console.log("");
  console.log("Options:");
  console.log("  --type <cigar|tobacco>  Use built-in paths for schema and data.");
  console.log("  --schema <path>         Path to a UI schema file.");
  console.log("  --data <path>           Path to a data JSON file (array).");
  console.log("  --out <path>            Output path (default: *.defaults.json).");
  console.log("  --write                 Overwrite input data file.");
  console.log("  --dry-run               Do not write files; only print summary.");
  console.log("  --help, -h              Show this help.");
};

const ensurePath = (inputPath) => {
  if (!inputPath) return null;
  return path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
};

const defaultOutPath = (dataPath) => {
  const ext = path.extname(dataPath);
  if (!ext) return `${dataPath}.defaults.json`;
  return `${dataPath.slice(0, -ext.length)}.defaults${ext}`;
};

const main = () => {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exit(1);
  }

  if (args.help) {
    printUsage();
    return;
  }

  if (args.type && PRESETS[args.type]) {
    args.schema = args.schema || PRESETS[args.type].schema;
    args.data = args.data || PRESETS[args.type].data;
  }

  if (!args.schema || !args.data) {
    console.error("Missing required --schema/--data (or --type).");
    printUsage();
    process.exit(1);
  }

  if (args.write && args.out) {
    console.error("Use either --write or --out, not both.");
    process.exit(1);
  }

  const schemaPath = ensurePath(args.schema);
  const dataPath = ensurePath(args.data);
  const outPath = args.write ? dataPath : ensurePath(args.out || defaultOutPath(dataPath));

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  if (!Array.isArray(data)) {
    throw new Error("Data file must contain a JSON array.");
  }

  let changedCount = 0;
  const normalized = data.map((item) => {
    const next = applySchemaDefaults(schema, item);
    if (JSON.stringify(next) !== JSON.stringify(item)) {
      changedCount += 1;
    }
    return next;
  });

  console.log(`Schema: ${schemaPath}`);
  console.log(`Input:  ${dataPath}`);
  console.log(`Items:  ${data.length}`);
  console.log(`Changed items: ${changedCount}`);

  if (args.dryRun) {
    console.log("Dry run: no files written.");
    return;
  }

  fs.writeFileSync(outPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`Output: ${outPath}`);
};

main();
