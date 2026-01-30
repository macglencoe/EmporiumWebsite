import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { PiPlusBold, PiPlusCircleBold } from "react-icons/pi";
import mergeData from "../utils/mergeData";


const SchemaCatalog = ({
    tempData = [],
    originData = [],
    mergedData = [],
    uiSchema,
}) => {
    if (!uiSchema) return null;

    const router = useRouter();
    const pageSize = 40;
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
            <div className="flex px-3 flex-row gap-2 justify-between w-full items-center">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
                <Link
                    href={router.pathname + "/add"}
                    className=""
                >
                    <a className="whitespace-nowrap px-3 py-2 flex items-center text-lg font-semibold bg-amber-900 hover:bg-amber-800 text-amber-200 rounded-md h-fit"
                        style={{fontFamily: 'Inter'}}
                    >
                        <PiPlusCircleBold  className="inline mr-1"/>
                        Add New
                    </a>
                </Link>
            </div>

            <table className="w-full border-separate border-spacing-y-2 border-spacing-x-0.5 overflow-hidden">
                <thead>
                    <tr>
                        {displayFields.map((f) => {
                            return (
                                <td className="bg-amber-900 p-2 font-semibold text-amber-200">{f.field?.ui?.label || 'unknown'}</td>
                            )
                        })}
                    </tr>
                </thead>
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
        <tr className={`hover:translate-x-1.5 transition-all duration-100` + ' ' +
            (  
                temp == null && origin ? `bg-red-500/50` :
                origin == null && temp ? `bg-green-500/50` :
                `bg-amber-50/30`
            )
            } style={{
                boxShadow: "-10px 0 0px rgba(0,0,0,0.4)"
             }}>
            {fields.map((f) => {
                const key = f.key;
                const field = f.field;
                const childTemp = temp ? temp[key] : null
                const childOrigin = origin ? origin[key] : null
                
                // link to product
                const href = `${router.pathname}/${
                    origin ? origin.slug : 'editnew/'+temp.slug
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
            {/* <dt className="font-semibold">{field.ui?.label}</dt> */}
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
            {/* <dt className="font-semibold">{field.ui?.label}</dt> */}
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
    if (!totalPages || totalPages <= 1) return null;

    const clampedCurrent = Math.min(Math.max(currentPage, 1), totalPages);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === clampedCurrent) return;
        handlePageChange(page);
    };

    const getPageList = () => {
        const pages = new Set([1, totalPages]);
        for (let i = clampedCurrent - 2; i <= clampedCurrent + 2; i++) {
            if (i > 1 && i < totalPages) pages.add(i);
        }
        const sorted = Array.from(pages).sort((a, b) => a - b);
        const output = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                output.push("ellipsis");
            }
            output.push(sorted[i]);
        }
        return output;
    };

    const buttonBase =
        "px-3 py-2 min-w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors";
    const buttonInactive = "bg-amber-200/70 hover:bg-amber-300 text-amber-900";
    const buttonActive = "bg-amber-400 text-amber-900";
    const buttonDisabled = "opacity-50 cursor-not-allowed";

    return (
        <nav
            className="py-2 px-5 min-w-64 my-4 bg-amber-100 flex flex-row flex-wrap justify-center items-center gap-1"
            style={{ fontFamily: 'Inter' }}
            aria-label="Pagination"
        >
            <span className="text-sm font-semibold whitespace-nowrap mr-2">
                Page {clampedCurrent} of {totalPages}
            </span>
            <button
                type="button"
                className={`${buttonBase} ${buttonInactive} ${clampedCurrent === 1 ? buttonDisabled : ""}`}
                onClick={() => goToPage(clampedCurrent - 1)}
                aria-label="Previous page"
                disabled={clampedCurrent === 1}
            >
                Prev
            </button>
            {getPageList().map((entry, index) => {
                if (entry === "ellipsis") {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-amber-900">
                            ...
                        </span>
                    );
                }
                const page = entry;
                const isActive = page === clampedCurrent;
                return (
                    <button
                        key={page}
                        id={`page-${page}`}
                        type="button"
                        className={`${buttonBase} ${isActive ? buttonActive : buttonInactive}`}
                        onClick={() => goToPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}
            <button
                type="button"
                className={`${buttonBase} ${buttonInactive} ${clampedCurrent === totalPages ? buttonDisabled : ""}`}
                onClick={() => goToPage(clampedCurrent + 1)}
                aria-label="Next page"
                disabled={clampedCurrent === totalPages}
            >
                Next
            </button>
        </nav>
    );
}

export default SchemaCatalog;
