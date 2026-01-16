import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchemaArtifacts } from "../utils/schemaMapper";
import TabNav from "./tabNav";

/**
 * Basic react-hook-form wrapper that consumes the UI schema and Zod mapper.
 * Renders simple inputs for common field types; extend as needed.
 */
const SchemaForm = ({ uiSchema, onSubmit = () => {}, children, renderField, initialValues = {}, tabs: tabsProp }) => {
  const { zodSchema, defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), [uiSchema]);

  const mergedDefaults = useMemo(
    () => ({ ...defaults, ...(initialValues || {}) }),
    [defaults, initialValues]
  );

  const methods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: mergedDefaults,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = methods;

  // Reset form when incoming initial values change (e.g., after async load).
  useEffect(() => {
    methods.reset(mergedDefaults);
  }, [mergedDefaults, methods]);

  const properties = uiSchema?.properties || {};
  const tabs = useMemo(() => deriveTabs(properties, tabsProp), [properties, tabsProp]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "metadata");

  useEffect(() => {
    if (tabs.length && !tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id);
    }
  }, [tabs, activeTab]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="schema-form">
        <TabNav
          tabs={tabs}
          initialTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="tab-panels">
          {tabs.map((tab) => {
            const entries = Object.entries(properties).filter(([name, field]) => tab.filter(name, field));
            return (
              <section key={tab.id} style={{
                display: activeTab == tab.id ? "block" : "none"
              }}>
                {renderField
                  ? renderField({ control, register, errors, schema: uiSchema, tab: tab.id })
                  : entries.map(([name, field]) => (
                      <Field
                        key={name}
                        name={name}
                        field={field}
                        control={control}
                        register={register}
                        error={errors[name]}
                      />
                    ))}
                {!entries.length && <p>No fields in this tab.</p>}
              </section>
            );
          })}
        </div>

        {children}
      </form>
    </FormProvider>
  );
};

const Field = ({ name, field, control, register, error }) => {
  const { baseType } = normalizeType(field.type);
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const inputType = field?.ui?.input || "text";

  if (baseType === "array" && field.items?.type === "object") {
    return (
      <ArrayFieldset
        name={name}
        field={field}
        control={control}
        register={register}
        error={error}
      />
    );
  }

  if (baseType === "boolean") {
    return (
      <label className="form-field">
        <input type="checkbox" {...register(name)} />
        <span>{label}</span>
        {description && <small>{description}</small>}
        {error && <span className="error">{error.message}</span>}
      </label>
    );
  }

  if (inputType === "textarea") {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <textarea id={name} rows={field?.ui?.rows || 3} {...register(name)} placeholder={field?.ui?.placeholder} />
        {description && <small>{description}</small>}
        {error && <span className="error">{error.message}</span>}
      </div>
    );
  }

  if (inputType === "mapped-range" && Array.isArray(field?.ui?.options)) {
    const min = field?.ui?.range?.min ?? 0;
    const max = field?.ui?.range?.max ?? field.ui.options.length - 1;
    const step = field?.ui?.range?.step ?? 1;

    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <Controller
          name={name}
          control={control}
          render={({ field: controllerField }) => {
            const activePos =
              field.ui.options.find((opt) => opt.value === controllerField.value)?.pos ?? field.ui.options[0]?.pos ?? 0;
            return (
              <>
                <input
                  id={name}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={activePos}
                  onChange={(event) => {
                    const pos = Number(event.target.value);
                    const match = field.ui.options.find((opt) => opt.pos === pos);
                    controllerField.onChange(match ? match.value : null);
                  }}
                />
                <div className="range-labels">
                  {field.ui.options.map((opt) => (
                    <span key={opt.pos}>{opt.label}</span>
                  ))}
                </div>
              </>
            );
          }}
        />
        {description && <small>{description}</small>}
        {error && <span className="error">{error.message}</span>}
      </div>
    );
  }

  // Fallback: text/date/price/etc. all use a basic input element
  const typeAttr = inputType === "date" || field?.format === "date" ? "date" : "text";

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={typeAttr}
        {...register(name)}
        placeholder={field?.ui?.placeholder}
        autoComplete="off"
      />
      {description && <small>{description}</small>}
      {error && <span className="error">{error.message}</span>}
    </div>
  );
};

const normalizeType = (type) => {
  const types = Array.isArray(type) ? type : [type];
  const baseType = types.find((t) => t && t !== "null") || "any";
  return { baseType };
};

const deriveTabs = (properties, tabsProp) => {
  if (Array.isArray(tabsProp) && tabsProp.length > 0) {
    return tabsProp;
  }

  const sectionMap = new Map();
  Object.entries(properties).forEach(([name, field]) => {
    const section = sectionOf(field);
    if (!sectionMap.has(section)) {
      sectionMap.set(section, {
        id: section,
        label: capitalize(section),
        filter: (n, f) => sectionOf(f) === section,
      });
    }
  });

  return Array.from(sectionMap.values());
};

const sectionOf = (field) =>
  field?.ui?.section || (normalizeType(field.type).baseType === "array" ? "sizes" : "metadata");

const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

const buildDefaultsForItem = (properties = {}) =>
  Object.entries(properties).reduce((acc, [key, field]) => {
    if (Object.prototype.hasOwnProperty.call(field, "default")) {
      acc[key] = field.default;
      return acc;
    }
    const { baseType } = normalizeType(field.type);
    if (baseType === "boolean") {
      acc[key] = false;
    } else if (baseType === "array") {
      acc[key] = [];
    } else {
      acc[key] = "";
    }
    return acc;
  }, {});

const ArrayFieldset = ({ name, field, control, register, error }) => {
  const itemProps = field.items?.properties || {};
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addItem = () => append(buildDefaultsForItem(itemProps));

  return (
    <div className="form-field array-field">
      <label>{label}</label>
      {fields.map((item, idx) => (
        <div key={item.id} className="array-item">
          {Object.entries(itemProps).map(([childName, childField]) => {
            const childLabel = childField?.ui?.label || childName;
            const childType = normalizeType(childField.type).baseType;
            const inputType =
              childField?.ui?.input === "date" || childField?.format === "date" ? "date" : "text";
            const childError = error?.[idx]?.[childName];

            return (
              <div key={childName} className="array-field-row">
                <label>{childLabel}</label>
                {childType === "boolean" ? (
                  <input
                    type="checkbox"
                    {...register(`${name}.${idx}.${childName}`)}
                    defaultChecked={!!item[childName]}
                  />
                ) : (
                  <input
                    type={inputType}
                    {...register(`${name}.${idx}.${childName}`)}
                    defaultValue={item[childName] ?? ""}
                    placeholder={childField?.ui?.placeholder}
                  />
                )}
                {childError && <span className="error">{childError.message}</span>}
              </div>
            );
          })}
          <button type="button" onClick={() => remove(idx)} className="standard-button">
            Delete Entry
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="standard-button">
        Add Entry
      </button>
      {description && <small>{description}</small>}
      {error && typeof error.message === "string" && <span className="error">{error.message}</span>}
    </div>
  );
};

export default SchemaForm;
