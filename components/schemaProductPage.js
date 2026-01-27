import { useMemo } from "react";
import { normalizeType } from "../utils/schemaMapper"
import { PiPlusBold } from "react-icons/pi";

export const SchemaProductPage = ({
    uiSchema,
    children,
    data,
    originalData = {},
    sections: sectionsProp
}) => {
    const properties = uiSchema?.properties || {};
    const sections = useMemo(() => sectionsProp, [properties, sectionsProp]);

    return (
        <>
            <div className="flex flex-row flex-wrap gap-2">
                {sections.map((section) => {
                    const entries = Object.entries(properties).filter(([name, field]) => section.filter(name, field))
                    return (
                        <section
                            key={section.id}
                            className="space-y-4 py-3 px-2 border-2 border-amber-900 rounded-lg shadow-lg bg-amber-50/30 min-w-96 flex-1"
                        >
                            <h1 className="tracking-wider font-semibold text-2xl">{section.label || section.id}</h1>
                            {entries.map(([name, field]) => {
                                const value = data[name] || null;
                                const original = originalData[name] || null;
    
                                if (value || original) return (
                                    <Display
                                        name={name}
                                        field={field}
                                        original={original}
                                        value={value}
                                    />
                                )
                            })
    
                            }
                        </section>
                    )
                })}
            </div>
            {data._clientId &&
                <SmallTextDisplay
                    name="ID"
                    original={data._clientId}
                    value={data._clientId}
                />
            }
        </>
    )
}

const Display = ({
    name,
    field,
    value,
    original
}) => {
    const rendererKey = pickType(field);
    const Renderer = DISPLAY_RENDERERS[rendererKey] || TextDisplay;
    return <Renderer
        name={name}
        field={field}
        value={value}
        original={original}
    />
}

const DISPLAY_RENDERERS = {
    text: TextDisplay,
    title: TitleDisplay,
    "text-large": LargeTextDisplay,
    "array-string": ArrayStringDisplay,
    "array-object": ArrayObjectDisplay,
    "boolean": BooleanDisplay
}

const pickType = (field = {}) => {
    const { baseType } = normalizeType(field.type);
    const inputType = field?.ui?.input;

    if (baseType === "boolean") return "boolean";
    if (baseType === "array" && field.items?.type === "object") return "array-object";
    else if (baseType === "array" && field.items?.type === "string") return "array-string";

    if (inputType === "textarea") return "text-large"
    if (inputType === "mapped-range" && Array.isArray(field?.ui?.options)) return "range"
    if (inputType === "text" && field?.ui?.isTitle) return "title"

    return "text";
}

function TextDisplay({ name, field, value, original }) {
    const label = field?.ui?.label || name;

    return (
        <div className="space-y-1">
            <dt className="text-lg font-semibold">{label}</dt>
            <dd>
                {
                    original === value ? value :
                        original === null ?
                            <div className="flex items-center">
                                <PiPlusBold className="text-green-600 mr-1 inline-block" />{value}
                            </div> :
                            <>
                                <strike aria-hidden>{original}</strike><br />{value}
                            </>
                }
            </dd>

        </div>
    )
}

function LargeTextDisplay({ name, field, value, original }) {
    const label = field?.ui?.label || name;

    return (
        <div className="space-y-1">
            <dt className="text-lg font-semibold">{label}</dt>
            <dd className="indent-4">
                {
                    original === value ? value :
                        original === null ?
                            <div className="flex items-center">
                                <PiPlusBold className="text-green-600 mr-1 inline-block" />{value}
                            </div> :
                            <>
                                <strike aria-hidden>{original}</strike><br />{value}
                            </>
                }
            </dd>
        </div>
    )
}

function TitleDisplay({ name, field, value, original }) {
    return <h2 className="text-2xl font-bold tracking-wider mt-2 mb-4">
        {
            original === value ? value :
                <>
                    <strike aria-hidden>{original}</strike><br />
                    {value}
                </>
        }
    </h2>
}

function SmallTextDisplay({ name, field, value, original }) {
    const label = field?.ui?.label || name;

    return (
        <div className="space-y-0.5 my-2">
            <p className="flex flex-row flex-wrap items-center gap-1">
                <dt className="text-xs font-semibold">{label}:</dt>
                <dd className="text-xs">
                    {
                        original === value ? value :
                            original === null ?
                                <div className="flex items-center">
                                    <PiPlusBold className="text-green-600 mr-1 inline-block" />{value}
                                </div> :
                                <>
                                    <strike aria-hidden>{original}</strike><br />{value}
                                </>
                    }
                </dd>
            </p>

        </div>
    )
}

function BooleanDisplay({ name, field, value, original }) {
    const label = field?.ui?.label || name;

    const readBool = (boolean) => {
        return boolean ? "Yes" : "No"
    }
    return (
        <div className="space-y-1">
            <dt className="text-lg font-semibold">{label}</dt>
            <dd>
                {
                    original === value ? readBool(value) :
                        original === null ?
                            <div className="flex items-center">
                                <PiPlusBold className="text-green-600 mr-1 inline-block" />{readBool(value)}
                            </div> :
                            <>
                                <strike aria-hidden>{readBool(original)}</strike><br />{readBool(value)}
                            </>
                }
            </dd>

        </div>
    )
}

function ArrayStringDisplay({ name, field, value, original }) {
    const itemsSchema = field.items || {}
    const label = field?.ui?.label || name;
    const items = Array.isArray(value) ? value : [];
    const originalItems = Array.isArray(original) ? original : [];
    const mergedItems = [...new Set([...originalItems, ...items])]

    return (
        <div className="space-y-2">
            <dt className="text-lg font-semibold">{label}</dt>
            <dd>
                <ul className="flex flex-row gap-2 flex-wrap">
                    {mergedItems.map((item) => {
                        const isNew = !originalItems.includes(item);
                        const isRemoved = originalItems.includes(item) && !items.includes(item)

                        return (
                            <li className={`
                                py-0.5 px-2 rounded-md flex items-center border border-amber-900/20 shadow-md
                                ${isNew ? 'bg-green-600/40' :
                                    isRemoved ? 'bg-red-600/40 line-through' :
                                        'bg-amber-900/30'
                                }
                                `
                            }>
                                {isNew ?
                                    <PiPlusBold className="text-green-700 mr-1" /> :
                                    null}
                                {String(item)}
                            </li>
                        )
                    })
                    }
                </ul>
            </dd>
        </div>
    )
}

function ArrayObjectDisplay({ name, field, value, original }) {
    const itemProps = field.items?.properties || {};
    const label = field?.ui?.label || name;
    const items = Array.isArray(value) ? value : []
    const originalItems = Array.isArray(original) ? original : [];

    return (
        <div className="space-y-2">
            <label className="text-lg font-semibold">{label}</label>
            {items.map((item, idx) => {
                const originalItem = originalItems[idx] || item;
                return (
                    <div key={idx} className="rounded-md border border-amber-900/30 bg-amber-100/30 p-3 space-y-2 shadow-sm flex flex-row gap-2 flex-wrap justify-between">
                        {Object.entries(itemProps).map(([childName, childField]) => {
                            const childLabel = childField?.ui?.label || childName;
                            const childType = normalizeType(childField.type).baseType;
                            const childValue = item[childName] || null;
                            const childOriginal = originalItem[childName] || null;

                            return (
                                <div className="!m-0">
                                    <Display
                                        name={childName}
                                        field={childField}
                                        value={childValue}
                                        original={childOriginal}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )
            })

            }
        </div>
    )
}