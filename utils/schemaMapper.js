import { z } from "zod";

/**
 * Builds a Zod schema and default values from the UI schema.
 * Keeps UI metadata untouched so renderers can use it directly.
 *
 * @param {object} uiSchema - The JSON UI schema (root object with properties).
 * @returns {{ zodSchema: import("zod").ZodTypeAny, defaults: Record<string, any> }}
 */
export const buildSchemaArtifacts = (uiSchema) => {
  if (!uiSchema || uiSchema.type !== "object" || !uiSchema.properties) {
    throw new Error("Invalid UI schema: expected a root object with properties");
  }

  const zodShape = mapPropertiesToZod(uiSchema.properties);
  const zodSchema = z.object(zodShape);
  const defaults = buildDefaultsForProperties(uiSchema.properties);

  return { zodSchema, defaults };
};

const mapPropertiesToZod = (properties) =>
  Object.entries(properties).reduce((shape, [key, field]) => {
    shape[key] = buildFieldSchema(field);
    return shape;
  }, {});

const buildFieldSchema = (field = {}) => {
  const { allowNull, baseType } = normalizeType(field.type);
  const isRequired = field.validation?.required === true;
  let schema;

  switch (baseType) {
    case "string":
      schema = buildStringSchema(field);
      break;
    case "number":
      schema = z.number();
      break;
    case "boolean":
      schema = z.boolean();
      break;
    case "array":
      schema = z.array(buildFieldSchema(field.items || {}));
      schema = applyArrayValidation(schema, field.validation);
      break;
    case "object":
      schema = z.object(mapPropertiesToZod(field.properties || {}));
      break;
    default:
      schema = z.any();
  }

  if (allowNull) {
    schema = schema.nullable();
  }

  if (!isRequired) {
    schema = schema.optional();
  }

  return schema;
};

const buildStringSchema = (field) => {
  const { enum: enumValues, format, validation } = field;
  let schema;

  if (Array.isArray(enumValues) && enumValues.length > 0) {
    const stringOptions = enumValues.filter((v) => v !== null && v !== undefined);
    if (stringOptions.length > 0) {
      schema = z.enum([...new Set(stringOptions)]);
    } else {
      schema = z.string();
    }
  } else {
    schema = z.string();
  }

  if (format === "date") {
    schema = schema.regex(/^\d{4}-\d{2}-\d{2}$/);
  }

  if (validation?.minLength) {
    schema = schema.min(validation.minLength);
  }

  if (validation?.maxLength) {
    schema = schema.max(validation.maxLength);
  }

  if (validation?.pattern) {
    schema = schema.regex(new RegExp(validation.pattern));
  }

  return schema;
};

const applyArrayValidation = (schema, validation = {}) => {
  let next = schema;
  if (validation?.minItems) {
    next = next.min(validation.minItems);
  }
  if (validation?.maxItems) {
    next = next.max(validation.maxItems);
  }
  return next;
};

const normalizeType = (type) => {
  const types = Array.isArray(type) ? type : [type];
  const allowNull = types.includes("null");
  const baseType = types.find((t) => t && t !== "null") || types[0] || "any";
  return { allowNull, baseType };
};

const buildDefaultsForProperties = (properties) =>
  Object.entries(properties).reduce((acc, [key, field]) => {
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
