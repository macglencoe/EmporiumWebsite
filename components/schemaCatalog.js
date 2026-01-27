import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";


const SchemaCatalog = ({
    tempData = [],
    originData = [],
    uiSchema,
}) => {
    if (!uiSchema) return null;

    const router = useRouter();
    const pageSize = 20;
    const totalPages = Math.ceil(
        tempData.length / pageSize
    )

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const pageQuery = router.query.page
        if (pageQuery) setCurrentPage(parseInt(pageQuery));
    }, [router.query.page])

    const currentPageData = tempData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.push({ query: { ...router.query, page } }, undefined, { shallow: true });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const buildMergedData = (tempData = [], originData = []) => {
        const byId = new Map()

        for (const origin of originData) {
            if (!origin?._clientId) continue;
            byId.set(origin._clientId, { temp: null, origin });
        }

        for (const temp of tempData) {
            if (!temp?._clientId) continue;
            const prev = byId.get(temp._clientId) || { temp: null, origin: null };
            byId.set(temp._clientId, { ...prev, temp });
        }

        return Array.from(byId.values())

    }

    const buildDisplayFields = (uiSchema) => {
        if (!uiSchema?.properties) return [];
        return Object.entries(uiSchema.properties).reduce((acc, [key, field]) => {
            if (field?.ui?.showInCatalog) {
                acc.push({ key, field });
            }

            return acc;
        }, []);
    }

    const mergedData = buildMergedData(tempData, originData)
    const displayFields = buildDisplayFields(uiSchema);

    return (
        <section className="w-full space-y-2">
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />

            <table className="w-full border-separate border-spacing-y-2 border-spacing-x-0.5 overflow-hidden">
                {displayFields.length > 0 && mergedData.map((item, idx) => {
    
                    // derive item name
                    const itemNameKey = displayFields.find((field) => {
                        field.field?.ui?.isTitle
                    })?.key || displayFields[0].key
                    const itemName = item.temp[itemNameKey] || item.origin[itemNameKey]
                    return (
                        <ProductRow
                            name={itemName}
                            fields={displayFields}
                            temp={item.temp}
                            origin={item.origin}
                        />
                    )
                })
    
                }
            </table>

        </section>
    )
}

const ProductRow = ({ name, fields, temp, origin }) => {
    const router = useRouter();
    return (
        <tr className="bg-amber-50/30
            hover:translate-x-1.5 transition-all duration-100" style={{
                boxShadow: "-10px 0 0px rgba(0,0,0,0.4)"
             }}>
            {fields.map((f) => {
                const key = f.key;
                const field = f.field;
                const childTemp = temp[key]
                const childOrigin = origin[key]
                
                // link to product
                const href = `${router.asPath}/${
                    origin.slug ?? 'editNew/'+temp.slug
                }`


                return (
                    <Field
                        name={key}
                        field={field}
                        temp={childTemp}
                        original={childOrigin}
                        href={href}
                    />
                )
            })

            }
        </tr>
    )
}

const Field = ({ name, field, temp, original, href }) => {
    const rendererKey = pickType(field);
    const Renderer = FIELD_RENDERERS[rendererKey] || TextField;

    if (href) return (
        <td className="flex-1 p-2">
            <Link href={href}>
                <a>
                    <Renderer
                        name={name}
                        field={field}
                        temp={temp}
                        original={original}
                    />
                </a>
            </Link>
        </td>
    )

    return (
        <td className="flex-1 p-2">
                <Renderer
                    name={name}
                    field={field}
                    temp={temp}
                    original={original}
                />
        </td>
    )

}

const FIELD_RENDERERS = {
    text: TextField,
    amount: AmountField
}

const pickType = (field) => {
    if (field?.type === "array") return "amount"
    return "text"
}

function TextField({ name, field, temp, original }) {
    return (
        <div>
            <dt className="font-semibold">{field.ui?.label}</dt>
            <dd>
                {
                    temp === original ? temp :
                    original ?
                    <>
                        <strike>{original}</strike><br/>
                        {temp}
                    </> :
                    <>
                        <PiPlusBold className="inline mr-1"/>
                        {temp}
                    </>
                }
            </dd>
        </div>
    )
}

function AmountField({ name, field, temp, original }) {
    if (Array.isArray(temp) || Array.isArray(original)) return (
        <div>
            <dt className="font-semibold">{field.ui?.label}</dt>
            <dd className="font-mono">
                {
                    temp?.length === original?.length ? temp?.length :
                    original ?
                    <>
                        <strike>{original?.length}</strike><br/>
                        {temp?.length}
                    </> :
                    <>
                        <PiPlusBold className="inline mr-1"/>
                        {temp?.length}
                    </>
                }
            </dd>
            
        </div>
    )
    return null
}


const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
    return (
        <nav>
            <span><b>Page:</b></span>
            {Array.from({ length: totalPages }, (_, i) => (
                <a>
                    <button
                        key={i + 1}
                        id={`page-${i + 1}`}
                        className={i + 1 === currentPage ? 'page-active' : ''}
                        onClick={() => handlePageChange(i + 1)}
                        aria-label={`Page ${i + 1}`}
                        aria-current={i + 1 === currentPage ? 'page' : undefined}
                    >
                        {i + 1}
                    </button>
                </a>
            )
            )}
        </nav>
    )
}

export default SchemaCatalog;
