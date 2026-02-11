import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applySchemaDefaults, buildSchemaArtifacts, buildDefaultValue, normalizeType } from "../utils/schemaMapper";
import TabNav from "./tabNav";
import { useSlugPreview } from "../hooks/useSlugPreview";
import { PiArrowUUpLeftDuotone, PiCheckCircleDuotone, PiPlusCircleDuotone, PiPlusCircleFill, PiXCircleFill, PiXDuotone, PiXFill } from "react-icons/pi";
import ImageUpload from "./imageUpload";
import ImageDelete from "./imageDelete";
import Notice from "./notice";

const SchemaForm = ({ uiSchema, onSubmit = () => {}, children, renderField, initialValues = {}, tabs: tabsProp, suggestions = {} }) => {
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
        onSubmit={handleSubmit((values) => onSubmit(applySchemaDefaults(uiSchema, values)))}
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
                        suggestions={suggestions}
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

const Field = ({ name, field, control, register, error, suggestions }) => {
  const rendererKey = pickType(field);
  const Renderer = FIELD_RENDERERS[rendererKey] || TextField;
  return (
    <div className="border-t-4 border-amber-900">
      <Renderer
        name={name}
        field={field}
        control={control}
        register={register}
        error={error}
        suggestions={suggestions}
      />
    </div>
  );
};

const FIELD_RENDERERS = {
  boolean: BooleanField,
  textarea: TextareaField,
  range: RangeField,
  "array-object": ArrayObjectField,
  autosuggest: AutosuggestField,
  text: TextField,
  "array-string": ArrayStringField,
  select: SelectField,
  image: ImageField
};

const pickType = (field = {}) => {
  const { baseType } = normalizeType(field.type);
  const inputType = field?.ui?.input;

  if (field?.ui?.autosuggest) return "autosuggest";
  if (baseType === "boolean") return "boolean";
  if (baseType === "array" && field.items?.type === "object") return "array-object";
  else if (baseType === "array" && field.items?.type === "string") return "array-string";
  if (inputType === "image") return "image";
  if (inputType === "textarea") return "textarea";
  if (inputType === "select" && field.enum) return "select";
  if (inputType === "mapped-range" && Array.isArray(field?.ui?.options)) return "range";

  return "text";
};

function BooleanField({ name, field, register, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-lg font-medium ">
        <input type="checkbox" {...register(name)} className="h-4 w-4 text-amber-600 border-gray-300 rounded" />
        {label}
      </label>
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

function SelectField({ name, field, register, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const options = field?.enum || [];

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-lg font-semibold">{label}</label>
      <select
        id={name}
        {...register(name)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 text-gray-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

function TextareaField({ name, field, register, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const registerOptions = getRegisterOptions(field);

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-lg font-semibold">{label}</label>
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

function RangeField({ name, field, control, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const min = field?.ui?.range?.min ?? 0;
  const max = field?.ui?.range?.max ?? field.ui.options.length - 1;
  const step = field?.ui?.range?.step ?? 1;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-lg font-semibold text-gray-800">{label}</label>
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

function ImageField({ name, field, register, control, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const { setValue } = useFormContext();
  const imageUrl = useWatch({ control, name }) || null;
  const fileNameField = field?.ui?.fileNameField || "slug";
  const fileNameValue = useWatch({ control, name: fileNameField });
  const fallbackName = typeof label === "string"
    ? label.toLowerCase().replace(/\s+/g, "-")
    : name;
  const fileName = field?.ui?.fileName || fileNameValue || fallbackName || "image";

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [finalFileSize, setFinalFileSize] = useState(0);

  const getFinalFileSize = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileSizeInKB = (blob.size / 1024).toFixed(2);
      setFinalFileSize(fileSizeInKB);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      getFinalFileSize(imageUrl);
    } else {
      setFinalFileSize(0);
    }
  }, [imageUrl]);

  const onImageUploadSuccess = (url) => {
    setLoading(false);
    setValue(name, url, { shouldValidate: true, shouldTouch: true });
    getFinalFileSize(url);
  };

  const onImageDeleteSuccess = () => {
    setValue(name, null, { shouldValidate: true, shouldTouch: true });
    setFinalFileSize(0);
  };

  const handleDeleteImage = async (url) => {
    setLoadingDelete(true);
    if (!url) {
      alert("No URL to delete found. Please report this");
      setLoadingDelete(false);
      return;
    }

    const response = await fetch(`/api/images?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Image Deleted Successfully");
      onImageDeleteSuccess();
    } else {
      console.error("Deletion failed: ", data.message);
    }
    setLoadingDelete(false);
  };

  const onImageUpload = (fileSizeInKb = null) => {
    if (imageUrl) {
      alert("Former image will now be deleted");
      handleDeleteImage(imageUrl);
    }
    setLoading(true);
    setFileSize(fileSizeInKb);
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-semibold text-gray-800">{label}</label>
      <input type="hidden" {...register(name, getRegisterOptions(field))} />
      <div className="image-upload-container">
        <ImageUpload
          image={imageUrl}
          fileName={fileName}
          onImageUpload={onImageUpload}
          onImageUploadSuccess={onImageUploadSuccess}
        />
        {loading && <Notice type="loading">Uploading {fileSize} KB...</Notice>}
        {loadingDelete && <Notice type="loading">Deleting former image...</Notice>}
        {imageUrl && (
          <div className="url">
            {finalFileSize > 0 && <p>Final file size: {finalFileSize} KB</p>}
            <img src={imageUrl} alt={`${label} image`} />
            <p>URL: {imageUrl}</p>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>
            <ImageDelete url={imageUrl} handleDeleteImage={handleDeleteImage} />
          </div>
        )}
      </div>
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <style jsx>{`
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        .image-upload-container .url {
          padding: 0.5em 1em;
          background-color: var(--dl-color-theme-primary2);
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1em;
        }
        .image-upload-container .url p {
          padding: 0.5em;
        }
        .image-upload-container .url a {
          padding: 0.5em 1em;
          font-family: Inter;
          color: var(--dl-color-theme-secondary1);
          background-color: var(--dl-color-theme-primary1);
          border-radius: 5px;
          font-weight: bold;
        }
        .image-upload-container .url img {
          max-height: 300px;
        }
      `}</style>
    </div>
  );
}

function TextField({ name, field, register, error }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const registerOptions = getRegisterOptions(field);
  const typeAttr = field?.ui?.input === "date" || field?.format === "date" ? "date" : "text";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-lg font-semibold text-gray-800">{label}</label>
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
}

function AutosuggestField({ name, field, register, error, control, suggestions }) {
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const registerOptions = getRegisterOptions(field);
  const { setValue } = useFormContext();
  const value = useWatch({ control, name }) || "";
  const options = Array.isArray(suggestions?.[name]) ? suggestions[name].filter(Boolean) : [];

  const filtered = useMemo(() => {
    if (!value) return options;
    return options.filter((opt) => opt.toLowerCase().includes(String(value).toLowerCase()));
  }, [options, value]);

  const applyValue = (next) => {
    if (typeof next === "string") {
      setValue(name, next, { shouldValidate: true, shouldTouch: true });
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-lg font-semibold text-gray-800">{label}</label>
      <input
        id={name}
        type="text"
        {...register(name, registerOptions)}
        placeholder={field?.ui?.placeholder}
        autoComplete="off"
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 text-gray-900"
        onKeyDown={(e) => {
          if (e.key === "Enter" && filtered[0]) {
            e.preventDefault();
            applyValue(filtered[0]);
          }
        }}
      />
      {filtered.length > 0 && (
        <div className="autocomplete flex items-center gap-2 bg-amber-50 rounded px-2 py-1 border border-amber-200">
          <select
            className="flex-1 bg-transparent outline-none"
            onChange={(e) => applyValue(e.target.value)}
            value={filtered[0]}
          >
            {filtered.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="text-xs font-semibold text-amber-700"
            onClick={() => applyValue(filtered[0])}
          >
            Select (Enter)
          </button>
        </div>
      )}
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

function ArrayObjectField({ name, field, control, register, error }) {
  const itemProps = field.items?.properties || {};
  const label = field?.ui?.label || name;
  const description = field?.ui?.description;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addItem = () => append(buildDefaultValue(field.items || {}) ?? {});

  return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-lg font-semibold text-gray-800">{label}</label>
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
                <label className="text-lg font-medium text-gray-800">{childLabel}</label>
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
}

function ArrayStringField({name, field, control, register, error}) {
  const items = field.items || {}
  const label = field?.ui?.label || name;
  const itemLabel = items?.ui?.label || "Item"
  const description = field?.ui?.description;
  const placeholder = items?.ui?.placeholder;
  const registerOptions = getRegisterOptions(items);
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  const addItem = () => append(buildDefaultValue(items) ?? "");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-gray-800">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-sm"
        >
          <PiPlusCircleFill className="text-lg mr-1" />
          Add {itemLabel}
        </button>
      </div>
      {fields.map((item, idx) => {
        const itemError = error?.[idx];
        const defaultValue = typeof item === "string" ? item : item?.value ?? "";

        return (
          <div key={item.id} className="flex flex-row flex-wrap rounded-md overflow-hidden">
            <div className="space-y-1 flex-1">
              <input
                type="text"
                {...register(`${name}.${idx}`, registerOptions)}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full bg-white px-3 py-2 text-gray-900"
              />
              {itemError && <p className="text-sm text-red-600">{itemError.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
            >
              <PiXCircleFill className="text-lg mr-1"/>
              Delete {itemLabel}
            </button>
          </div>
        );
      })}
      {description && <p className="text-sm ">{description}</p>}
      {error && typeof error.message === "string" && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export const SlugPreview = ({ generateSlug, isSlugUnique, fallbackSlug, baseRoute }) => {
  const { slug, unique } = useSlugPreview({ generateSlug, isSlugUnique });
  const displaySlug = slug || fallbackSlug;

  return (
    <div className="bg-white/50 rounded-md border-2 border-amber-200 p-3">
      <p className="font-semibold text-lg">Preview URL slug:</p>
      <p>
        <strong className="font-inter" style={{ color: unique && displaySlug && displaySlug !== "-" ? "green" : "red" }}>
          {
            (displaySlug && displaySlug !== "-") 
            ? displaySlug : "(none yet)"
          }
        </strong>
      </p>
      {!unique && <p className="text-sm text-red-600">Slug already exists. Please choose a different name.</p>}
      {unique && displaySlug && displaySlug !== "-" && (
        <p className="text-sm">
          <b>Once committed:</b> {`${baseRoute}/${displaySlug}`}
        </p>
      )}
    </div>
  );
};

export const FormButtons = ({ onClickRevert }) => {
  return (
    <div className="flex flex-row space-x-3">
      <button id="submit" type="submit" className="bg-amber-900 text-amber-50 px-3 py-2 font-semibold rounded-md flex items-center">
        <PiCheckCircleDuotone className="inline mr-2 text-2xl" />
        Submit
      </button>
      <button id="revert" type="button" onClick={onClickRevert} className="bg-amber-50 text-amber-900 px-3 py-2 font-semibold rounded-md flex items-center">
        <PiArrowUUpLeftDuotone className="inline mr-2 text-2xl" />
        Revert
      </button>
    </div>
  )
}

function getRegisterOptions(field = {}) {
  const { baseType, allowNull } = normalizeType(field.type);
  const isDate = field?.format === "date" || field?.ui?.input === "date";

  if (isDate || (allowNull && baseType === "string")) {
    return {
      setValueAs: (v) => (v === "" ? undefined : v),
    };
  }

  return undefined;
}

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

export default SchemaForm;
