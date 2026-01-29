import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import mergeData from "../utils/mergeData";


const SchemaCatalog = ({
    tempData = [],
    originData = [],
    mergedData = [],
    uiSchema,
}) => {
    if (!uiSchema) return null;

    const router = useRouter();
    const pageSize = 20;
    const totalPages = Math.ceil(
        mergedData.length / pageSize
    )

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const pageQuery = router.query.page
        if (pageQuery) setCurrentPage(parseInt(pageQuery));
    }, [router.query.page])

    const currentPageData = mergedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.push({ query: { ...router.query, page } }, undefined, { shallow: true });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
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

    const displayFields = buildDisplayFields(uiSchema);

    return (
        <section className="w-full space-y-2">
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />

            <table className="w-full border-separate border-spacing-y-2 border-spacing-x-0.5 overflow-hidden">
                {displayFields.length > 0 && currentPageData.map((item, idx) => {
    
                    // derive item name
                    const itemNameKey = displayFields.find((field) => {
                        field.field?.ui?.isTitle
                    })?.key || displayFields[0].key
                    const itemName = item.temp ? item.temp[itemNameKey] : item.origin[itemNameKey]
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
                const childTemp = temp ? temp[key] : null
                const childOrigin = origin[key]
                
                // link to product
                const href = `${router.pathname}/${
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
            <nav className="mx-auto py-2 px-5 min-w-64 my-4 bg-amber-100 flex flex-row flex-wrap justify-center items-center gap-1" style={{
                fontFamily: 'Inter'
            }}>
                <span><b>Page:</b></span>
                {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            id={`page-${i + 1}`}
                            className={'p-2 min-w-10 flex-1 h-full rounded-full flex items-center justify-center'+' '+(i + 1 === currentPage ? 'bg-amber-400' : '')}
                            onClick={() => handlePageChange(i + 1)}
                            aria-label={`Page ${i + 1}`}
                            aria-current={i + 1 === currentPage ? 'page' : undefined}
                        >
                            {i + 1}
                        </button>
                )
                )}
            </nav>
    )
}

export default SchemaCatalog;
