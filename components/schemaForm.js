import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchemaArtifacts } from "../utils/schemaMapper";
import TabNav from "./tabNav";

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="schema-form p-6 space-y-6"
      >
        <TabNav
          tabs={tabs}
          initialTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="tab-panels">
          {tabs.map((tab) => {
            const entries = Object.entries(properties).filter(([name, field]) => tab.filter(name, field));
            return (
              <section
                key={tab.id}
                className={`${activeTab === tab.id ? "block" : "hidden"} space-y-4`}
              >
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
  const registerOptions = getRegisterOptions(field);

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
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-sm font-medium ">
          <input type="checkbox" {...register(name)} className="h-4 w-4 text-amber-600 border-gray-300 rounded" />
          {label}
        </label>
        {description && <p className="text-sm ">{description}</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }

  if (inputType === "textarea") {
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-semibold">{label}</label>
        <textarea
          id={name}
          rows={field?.ui?.rows || 3}
          {...register(name, registerOptions)}
          placeholder={field?.ui?.placeholder}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 text-gray-900"
        />
        {description && <p className="text-sm ">{description}</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }

  if (inputType === "mapped-range" && Array.isArray(field?.ui?.options)) {
    const min = field?.ui?.range?.min ?? 0;
    const max = field?.ui?.range?.max ?? field.ui.options.length - 1;
    const step = field?.ui?.range?.step ?? 1;

    return (
      <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-semibold text-gray-800">{label}</label>
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
                  className="w-full accent-amber-600"
                  onChange={(event) => {
                    const pos = Number(event.target.value);
                    const match = field.ui.options.find((opt) => opt.pos === pos);
                    controllerField.onChange(match ? match.value : null);
                  }}
                />
                <div className="range-labels flex justify-between text-xs text-gray-600">
                  {field.ui.options.map((opt) => (
                    <span key={opt.pos}>{opt.label}</span>
                  ))}
                </div>
              </>
            );
          }}
        />
        {description && <p className="text-sm ">{description}</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }

  // Fallback: text/date/price/etc. all use a basic input element
  const typeAttr = inputType === "date" || field?.format === "date" ? "date" : "text";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-semibold text-gray-800">{label}</label>
      <input
        id={name}
        type={typeAttr}
        {...register(name, registerOptions)}
        placeholder={field?.ui?.placeholder}
        autoComplete="off"
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 text-gray-900"
      />
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

const normalizeType = (type) => {
  const types = Array.isArray(type) ? type : [type];
  const allowNull = types.includes("null");
  const baseType = types.find((t) => t && t !== "null") || "any";
  return { baseType, allowNull };
};

const getRegisterOptions = (field = {}) => {
  const { baseType, allowNull } = normalizeType(field.type);
  const isDate = field?.format === "date" || field?.ui?.input === "date";

  if (isDate || (allowNull && baseType === "string")) {
    return {
      setValueAs: (v) => (v === "" ? undefined : v),
    };
  }

  return undefined;
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-sm"
          >
            Add Entry
          </button>
        </div>
      {fields.map((item, idx) => (
        <div key={item.id} className="array-item rounded-md border border-gray-200 bg-gray-50 p-3 space-y-2 shadow-sm">
          {Object.entries(itemProps).map(([childName, childField]) => {
            const childLabel = childField?.ui?.label || childName;
            const childType = normalizeType(childField.type).baseType;
            const inputType =
              childField?.ui?.input === "date" || childField?.format === "date" ? "date" : "text";
            const childError = error?.[idx]?.[childName];
            const childRegisterOptions = getRegisterOptions(childField);

            return (
              <div key={childName} className="array-field-row space-y-1">
                <label className="text-sm font-medium text-gray-800">{childLabel}</label>
                {childType === "boolean" ? (
                  <input
                    type="checkbox"
                    {...register(`${name}.${idx}.${childName}`)}
                    defaultChecked={!!item[childName]}
                    className="h-4 w-4 text-amber-600 border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type={inputType}
                    {...register(`${name}.${idx}.${childName}`, childRegisterOptions)}
                    defaultValue={item[childName] ?? ""}
                    placeholder={childField?.ui?.placeholder}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 text-gray-900"
                  />
                )}
                {childError && <p className="text-sm text-red-600">{childError.message}</p>}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
          >
            Delete Entry
          </button>
        </div>
      ))}
      {description && <p className="text-sm ">{description}</p>}
      {error && typeof error.message === "string" && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default SchemaForm;
