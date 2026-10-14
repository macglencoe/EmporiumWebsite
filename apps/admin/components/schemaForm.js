import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm, FormProvider, Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applySchemaDefaults, buildSchemaArtifacts, buildDefaultValue, normalizeType } from "../utils/schemaMapper";
import TabNav from "./tabNav";
import { useSlugPreview } from "../hooks/useSlugPreview";
import { PiArrowLeft, PiArrowUUpLeft, PiCheckCircle, PiPlus, PiX } from "react-icons/pi";
import ImageUpload from "./imageUpload";
import ImageDelete from "./imageDelete";
import Notice from "./notice";

const SchemaForm = ({
  uiSchema,
  onSubmit = () => {},
  children,
  renderField,
  initialValues = {},
  tabs: tabsProp,
  suggestions = {},
  mode = "edit",
  title,
  backHref,
  productId = null,
}) => {
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

  const properties = useMemo(() => uiSchema?.properties || {}, [uiSchema]);
  const tabs = useMemo(() => deriveTabs(properties, tabsProp), [properties, tabsProp]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "metadata");

  useEffect(() => {
    if (tabs.length && !tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id);
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    const firstInvalidField = Object.keys(errors)[0];
    if (!firstInvalidField || !properties[firstInvalidField]) return;
    const invalidSection = sectionOf(properties[firstInvalidField]);
    if (invalidSection !== activeTab) setActiveTab(invalidSection);
  }, [errors, properties, activeTab]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((values) => onSubmit(applySchemaDefaults(uiSchema, values)))}
        className="schema-form"
      >
        <header className="editor-heading">
          {backHref && <Link href={backHref}><a className="editor-back"><PiArrowLeft /> Products</a></Link>}
          <div className="editor-title-row">
            <div>
              <p className="editor-eyebrow">{mode === "add" ? `New ${uiSchema?.entityLabel || "product"}` : `Edit ${uiSchema?.entityLabel || "product"}`}</p>
              <h2>{title || (mode === "add" ? `Add ${uiSchema?.entityLabel || "product"}` : `Edit product`)}</h2>
            </div>
            <span className="draft-badge bg-white"><span /> Draft</span>
          </div>
          <p className="editor-intro">Changes are saved as a draft. Publish them from Manage Changes when they are ready.</p>
        </header>

        <div className="editor-surface">
          <TabNav tabs={tabs} initialTab={activeTab} onChange={setActiveTab} />

          <div className="tab-panels">
            {tabs.map((tab) => {
              const entries = Object.entries(properties).filter(([name, field]) => tab.filter(name, field));
              return (
                <section
                  key={tab.id}
                  className={`${activeTab === tab.id ? "block" : "hidden"} editor-section`}
                  role="tabpanel"
                >
                  <div className="section-heading">
                    <h3>{tab.label}</h3>
                    <p>{sectionDescription(tab.id)}</p>
                  </div>
                  {renderField
                    ? renderField({ control, register, errors, schema: uiSchema, tab: tab.id })
                    : entries.map(([name, field]) => (
                        <Field key={name} name={name} field={field} control={control} register={register} error={errors[name]} suggestions={suggestions} productId={productId} />
                      ))}
                  {!entries.length && <p>No fields in this section.</p>}
                </section>
              );
            })}
          </div>
        </div>

        {children}
        <style jsx>{`
          .schema-form { max-width: 980px; margin: 0 auto; padding: 2rem clamp(1rem, 3vw, 2.5rem) 7rem; font-family: Inter, sans-serif; }
          .editor-heading { margin-bottom: 1.75rem; }
          .editor-back { display: inline-flex; align-items: center; gap: .35rem; min-height: 44px; color: #685441; font-weight: 600; }
          .editor-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
          .editor-eyebrow { color: #766e66; font-size: .75rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
          h2 { color: #211a1b; font-family: Playfair, serif; font-size: clamp(1.9rem, 4vw, 2.6rem); line-height: 1.15; }
          .editor-intro { max-width: 650px; margin-top: .5rem; color: #6b6259; font-size: .9rem; font-weight: 400; }
          .draft-badge { display: inline-flex; align-items: center; gap: .45rem; margin-top: .35rem; padding: .35rem .65rem; border: 1px solid #d8d2ca; border-radius: 999px; color: #504942; font-size: .75rem; font-weight: 600; }
          .draft-badge span { width: .45rem; height: .45rem; border-radius: 50%; background: #e8a915; }
          .editor-surface { overflow: hidden; border: 1px solid #d8d2ca; border-radius: 10px; background: #fff; box-shadow: 0 8px 30px rgba(33, 26, 27, .05); }
          .editor-surface :global(.editor-tabs) { padding: 0 1.5rem; }
          .tab-panels { padding: clamp(1.25rem, 3vw, 2rem); }
          .editor-section { max-width: 760px; }
          .editor-section > :global(*) + :global(*) { margin-top: 1.5rem; }
          .editor-section :global(input:not([type="checkbox"]):not([type="range"])), .editor-section :global(select) { min-height: 44px; }
          .editor-section :global(label) { display: inline-block; }
          .editor-section :global(p.text-sm) { color: #766e66; font-size: .8rem; font-weight: 400; }
          .editor-section :global(p.text-red-600) { color: #b42318; }
          .section-heading { padding-bottom: 1rem; border-bottom: 1px solid #ece8e3; }
          .section-heading h3 { color: #211a1b; font-family: Inter, sans-serif; font-size: 1.15rem; font-weight: 700; }
          .section-heading p { margin-top: .25rem; color: #766e66; font-size: .85rem; font-weight: 400; }
          @media (max-width: 640px) {
            .schema-form { padding-top: 1.25rem; }
            .editor-title-row { align-items: center; }
            .editor-surface :global(.editor-tabs) { padding: 0 1rem; }
            .tab-panels { padding: 1rem; }
          }
        `}</style>
      </form>
    </FormProvider>
  );
};

const Field = ({ name, field, control, register, error, suggestions, productId }) => {
  const rendererKey = pickType(field);
  const Renderer = FIELD_RENDERERS[rendererKey] || TextField;
  return (
    <div className="editor-field">
      <Renderer
        name={name}
        field={field}
        control={control}
        register={register}
        error={error}
        suggestions={suggestions}
        productId={productId}
      />
      <style jsx>{`
        .editor-field + .editor-field { padding-top: 1.25rem; border-top: 1px solid #ece8e3; }
      `}</style>
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
    <div className="space-y-1 rounded-md bg-stone-50 p-3">
      <div className="flex items-center gap-3 text-sm font-semibold text-stone-800">
        <input type="checkbox" {...register(name)} className="h-5 w-5 text-amber-600 border-gray-300 rounded" />
        <label>{label}{isRequired(field) && <RequiredMark />}</label>
      </div>
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
      <label htmlFor={name} className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
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
      <label htmlFor={name} className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
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
      <label htmlFor={name} className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
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

function ImageField({ name, field, register, control, error, productId }) {
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

  const onImageUploadSuccess = async (url) => {
    const formerImage = imageUrl;
    setLoading(false);
    setValue(name, url, { shouldValidate: true, shouldTouch: true });
    getFinalFileSize(url);
    if (formerImage && formerImage !== url) await requestImageCleanup(formerImage);
  };

  const onImageDeleteSuccess = () => {
    setValue(name, null, { shouldValidate: true, shouldTouch: true });
    setFinalFileSize(0);
  };

  const requestImageCleanup = async (url) => {
    if (!url) return;
    try { await fetch(`/api/images?url=${encodeURIComponent(url)}`, { method: "DELETE" }); }
    catch (error) { console.error("Image cleanup will be retried after publication:", error); }
  };

  const handleDeleteImage = async (url) => {
    setLoadingDelete(true);
    await requestImageCleanup(url);
    onImageDeleteSuccess();
    setLoadingDelete(false);
  };

  const onImageUpload = (fileSizeInKb = null) => {
    setLoading(true);
    setFileSize(fileSizeInKb);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
      <input type="hidden" {...register(name, getRegisterOptions(field))} />
      <div className="image-upload-container">
        <ImageUpload
          image={imageUrl}
          fileName={fileName}
          productId={productId}
          onImageUpload={onImageUpload}
          onImageUploadSuccess={onImageUploadSuccess}
          onImageUploadError={() => setLoading(false)}
        />
        {loading && <Notice type="loading">Uploading {fileSize} KB...</Notice>}
        {loadingDelete && <Notice type="loading">Removing image from draft...</Notice>}
        {imageUrl && (
          <div className="current-image">
            <img src={imageUrl} alt={`${label} preview`} />
            <div className="image-details">
              <p className="image-status">Current product image</p>
              {finalFileSize > 0 && <p>{finalFileSize} KB</p>}
              <div className="image-actions">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">Open full size</a>
                <ImageDelete url={imageUrl} handleDeleteImage={handleDeleteImage} />
              </div>
            </div>
          </div>
        )}
      </div>
      {description && <p className="text-sm ">{description}</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <style jsx>{`
        .image-upload-container { display: flex; flex-direction: column; gap: 1em; }
        .current-image { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #d8d2ca; border-radius: 8px; background: #faf9f7; }
        .current-image img { width: 120px; height: 120px; border-radius: 6px; background: white; object-fit: contain; }
        .image-details { display: flex; flex-direction: column; align-items: flex-start; gap: .35rem; color: #6b6259; font-size: .8rem; }
        .image-status { color: #211a1b; font-weight: 700; }
        .image-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem; margin-top: .35rem; }
        .image-actions a { min-height: 44px; display: inline-flex; align-items: center; color: #685441; font-family: Inter; font-weight: 700; }
        @media (max-width: 520px) { .current-image { align-items: flex-start; flex-direction: column; } }
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
      <label htmlFor={name} className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
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
  const options = useMemo(
    () => Array.isArray(suggestions?.[name]) ? suggestions[name].filter(Boolean) : [],
    [suggestions, name]
  );

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
      <label htmlFor={name} className="text-sm font-semibold text-stone-800">{label}{isRequired(field) && <RequiredMark />}</label>
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
          <label className="text-sm font-semibold text-stone-800">{label}</label>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex min-h-[44px] items-center px-3 py-2 text-sm font-semibold text-amber-900 border border-amber-700 hover:bg-amber-50 rounded-md"
          >
            <PiPlus className="mr-1" /> Add size
          </button>
        </div>
      {fields.map((item, idx) => (
        <div key={item.id} className="array-item rounded-md border border-stone-200 bg-stone-50 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          {Object.entries(itemProps).map(([childName, childField]) => {
            const childLabel = childField?.ui?.label || childName;
            const childType = normalizeType(childField.type).baseType;
            const inputType =
              childField?.ui?.input === "date" || childField?.format === "date" ? "date" : "text";
            const childError = error?.[idx]?.[childName];
            const childRegisterOptions = getRegisterOptions(childField);

            return (
              <div key={childName} className={`array-field-row space-y-1 ${childType === "boolean" ? "flex items-center gap-2 self-start" : ""}`}>
                <label className="text-xs font-semibold text-stone-600">{childLabel}{isRequired(childField) && <RequiredMark />}</label>
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
            aria-label={`Remove ${label} entry ${idx + 1}`}
            className="inline-flex min-h-[44px] items-center justify-center px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-md md:col-span-4 md:justify-self-end"
          >
            <PiX className="mr-1" /> Remove
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
          <label className="text-sm font-semibold text-stone-800">{label}</label>
        <button
          type="button"
          onClick={addItem}
            className="inline-flex min-h-[44px] items-center px-3 py-2 text-sm font-semibold text-amber-900 border border-amber-700 hover:bg-amber-50 rounded-md"
        >
          <PiPlus className="text-lg mr-1" />
          Add {itemLabel}
        </button>
      </div>
      {fields.map((item, idx) => {
        const itemError = error?.[idx];
        const defaultValue = typeof item === "string" ? item : item?.value ?? "";

        return (
          <div key={item.id} className="flex flex-row flex-wrap rounded-md border border-stone-200 overflow-hidden">
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
              className="inline-flex min-h-[44px] items-center px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <PiX className="text-lg mr-1"/>
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
    <aside className="url-preview" aria-live="polite">
      <p className="url-label">Public URL</p>
      <p className="url-value">
        <strong style={{ color: unique && displaySlug && displaySlug !== "-" ? "#2f6b3b" : "#b42318" }}>
          {
            (displaySlug && displaySlug !== "-") 
            ? displaySlug : "(none yet)"
          }
        </strong>
      </p>
      {!unique && <p className="url-error">This URL is already in use. Choose a different name.</p>}
      {unique && displaySlug && displaySlug !== "-" && (
        <p className="url-path">{`${baseRoute}/${displaySlug}`} <span aria-label="Available">✓</span></p>
      )}
      <style jsx>{`
        .url-preview { margin-top: 1rem; padding: 1rem 1.15rem; border: 1px solid #d8d2ca; border-radius: 8px; background: #faf9f7; font-family: Inter, sans-serif; }
        .url-label { color: #6b6259; font-size: .75rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .url-value { margin-top: .3rem; overflow-wrap: anywhere; font-size: .9rem; }
        .url-path { margin-top: .3rem; color: #504942; font-size: .8rem; font-weight: 400; overflow-wrap: anywhere; }
        .url-path span { color: #2f6b3b; font-weight: 700; }
        .url-error { margin-top: .35rem; color: #b42318; font-size: .8rem; font-weight: 400; }
      `}</style>
    </aside>
  );
};

export const FormButtons = ({ onClickRevert, mode = "edit" }) => {
  const { formState: { errors, isDirty, isSubmitting }, reset } = useFormContext();
  const errorCount = Object.keys(errors).length;
  const handleDiscard = () => {
    if (isDirty && !window.confirm(mode === "add" ? "Clear everything entered in this form?" : "Discard your unsaved changes?")) return;
    onClickRevert?.();
    reset();
  };
  return (
    <div className="editor-actions">
      <p className={`save-state ${errorCount ? "has-errors" : ""}`} aria-live="polite">
        {errorCount ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention` : isSubmitting ? "Saving…" : isDirty ? "Unsaved changes" : "No unsaved changes"}
      </p>
      <div className="action-buttons">
        <button id="revert" type="button" onClick={handleDiscard} disabled={!isDirty || isSubmitting} className="secondary-action">
          <PiArrowUUpLeft /> {mode === "add" ? "Clear form" : "Discard changes"}
        </button>
        <button id="submit" type="submit" disabled={isSubmitting} className="primary-action">
          <PiCheckCircle /> {isSubmitting ? "Saving…" : "Save draft"}
        </button>
      </div>
      <style jsx>{`
        .editor-actions { position: sticky; bottom: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding: .8rem 1rem; border: 1px solid #d8d2ca; border-radius: 8px; background: rgba(251, 250, 249, .96); box-shadow: 0 -8px 24px rgba(33, 26, 27, .08); backdrop-filter: blur(8px); font-family: Inter, sans-serif; }
        .save-state { color: #6b6259; font-size: .8rem; font-weight: 400; }
        .save-state.has-errors { color: #b42318; font-weight: 600; }
        .action-buttons { display: flex; gap: .65rem; }
        button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: .4rem; padding: .6rem 1rem; border-radius: 6px; font-size: .875rem; font-weight: 700; }
        .secondary-action { color: #685441; }
        .secondary-action:hover:not(:disabled) { background: #f1ece6; }
        .primary-action { background: #4d3b2c; color: #fffdf5; }
        .primary-action:hover:not(:disabled) { background: #211a1b; }
        button:disabled { cursor: not-allowed; opacity: .5; }
        @media (max-width: 600px) {
          .editor-actions { align-items: stretch; flex-direction: column; }
          .save-state { text-align: center; }
          .action-buttons { display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}

const RequiredMark = () => <span className="ml-1 text-amber-800" aria-label="required">*</span>;
const isRequired = (field = {}) => field?.validation?.required === true;

const sectionDescription = (id) => ({
  details: "The information customers use to identify and understand this product.",
  sizes: "Manage the sizes, prices, stock state, and barcodes sold in store.",
  components: "List the tobacco components in this blend.",
  image: "Upload the image shown in product listings and on the product page.",
  visibility: "Control publication details and optional featured placements.",
  metadata: "Update the primary product information.",
}[id] || "Update this part of the product listing.");

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

const capitalize = (str = "") => ({ sizes: "Pricing & sizes", image: "Media" }[str] || (str.charAt(0).toUpperCase() + str.slice(1)));

export default SchemaForm;
