import clsx from "clsx";
import CatalogCard from "./catalogCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PiArrowLeftBold, PiArrowRightBold, PiArrowUpBold } from "react-icons/pi";

function Pagination({ totalPages, currentPage, handlePageChange, showReturnTop = false }) {
    return (
        <nav
            className="flex flex-wrap justify-center my-4 mx-auto w-fit p-4 gap-4"
            aria-label="Pagination Navigation"
        >
            <div className="flex justify-center gap-4 p-4 bg-secondary1 border-double border-8 border-primary1 items-center">
                {/* Return to Top Button */}
                {showReturnTop && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="border-2 transition-all duration-200 flex items-center justify-center p-1 cursor-pointer rounded-full h-8 aspect-square font-bold bg-primary2 hover:bg-primary1 border-transparent text-secondary2"
                        aria-label="Return to Top"
                    >
                        <PiArrowUpBold className="text-xl" />
                    </button>
                )}

                <span className="font-[Inter] text-primary2 font-semibold">Page:</span>

                <ol className="flex flex-row flex-wrap gap-3 items-center">
                    {/* Prev Button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`border-2 transition-all duration-200 flex items-center justify-center p-1 cursor-pointer rounded-full h-8 aspect-square font-bold
            ${currentPage === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary2 hover:bg-primary1 border-transparent text-secondary2'
                                }`}
                            aria-label="Previous Page"
                        >
                            <PiArrowLeftBold className="text-xl" />
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 2
                            );
                        })
                        .reduce((acc, page, idx, arr) => {
                            const prev = arr[idx - 1];
                            if (prev && page - prev > 1) {
                                acc.push('ellipsis');
                            }
                            acc.push(page);
                            return acc;
                        }, [])
                        .map((item, index) => {
                            if (item === 'ellipsis') {
                                return (
                                    <li key={`ellipsis-${index}`}>
                                        <span className="text-primary1 font-bold px-2">…</span>
                                    </li>
                                );
                            }

                            return (
                                <li key={item}>
                                    <button
                                        className={`border-2 transition-all duration-200 flex items-center justify-center p-1 cursor-pointer rounded-full aspect-square h-8 font-bold ${item === currentPage
                                            ? 'bg-primary1 border-primary2 text-secondary1'
                                            : 'bg-primary2 border-transparent text-secondary2 hover:bg-primary1'
                                            }`}
                                        onClick={() => handlePageChange(item)}
                                        aria-label={`Page ${item}`}
                                        aria-current={item === currentPage ? 'page' : undefined}
                                    >
                                        {item}
                                    </button>
                                </li>
                            );
                        })}

                    {/* Next Button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`border-2 transition-all duration-200 flex items-center justify-center p-1 cursor-pointer rounded-full h-8 aspect-square font-bold
            ${currentPage === totalPages
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary2 hover:bg-primary1 border-transparent text-secondary2'
                                }`}
                            aria-label="Next Page"
                        >
                            <PiArrowRightBold className="text-xl" />
                        </button>
                    </li>

                </ol>
            </div>
        </nav>

    );
}

/**
 * A component for displaying a list of items in a catalog, with pagination.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.data - The data to be displayed in the catalog.
 * @param {Object} props.cardSettings - Settings for rendering catalog cards.
 * @param {string} [props.cardSettings.title] - A function to generate the title of the card.
 * @param {string} [props.cardSettings.secondaryTitle] - A function to generate the secondary title of the card.
 * @param {string} [props.cardSettings.image] - A function to generate the image URL for the card.
 * @param {string} [props.cardSettings.buttonText] - A function to generate the button text for the card.
 * @param {string} [props.cardSettings.href] - A function to generate the link URL for the card.
 * @param {string} [props.cardSettings.barcode] - A function to generate the barcode for the card.
 * @param {Array} [props.cardSettings.data] - The data to be displayed on the card.
 * @param {string} [props.cardSettings.data.title] - The title of the data.
 * @param {string} [props.cardSettings.data.value] - The value of the data.
 */
const CatalogContent = (props) => {
    const router = useRouter();
    const pageSize = 20;
    const totalPages = Math.ceil(props.data.length / pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (router.query.page) {
            setCurrentPage(parseInt(router.query.page));
        }
    }, [router.query.page]);

    const currentPageData = props.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.push({ query: { ...router.query, page } }, undefined, { shallow: true });
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
    return (
        <section className="catalog-content-container">
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />

            <div className="catalog-container40">
                {
                    currentPageData.map((item) => (
                        props.cardSettings.title(item) !== '' &&
                        <CatalogCard

                            image={props.cardSettings.image ? props.cardSettings.image(item) : null}
                            secondaryTitle={props.cardSettings.secondaryTitle ? props.cardSettings.secondaryTitle(item) : null}
                            title={props.cardSettings.title(item)}

                            data={props.cardSettings.data(item)}
                            href={props.cardSettings.href(item)}

                            buttonText={props.cardSettings.buttonText ? props.cardSettings.buttonText(item) : null}
                            sizes={props.cardSettings.sizes ? props.cardSettings.sizes(item) : null}
                            barcode={props.cardSettings.barcode ? props.cardSettings.barcode(item) : null}

                            description={props.cardSettings.description ? props.cardSettings.description(item) : null}
                        />
                    ))
                }
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                showReturnTop={true}
            />

            <style jsx>
                {`
        
        .pagination {
            display: flex;
            justify-content: center;
            margin: 20px;
            flex-wrap: wrap;
        }
        .pagination button {
            margin: 0 5px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
        }
        .pagination button.page-active {
            font-weight: 900;
            color: var(--dl-color-theme-neutral-light);
        }
        .pagination button:hover {
            text-decoration: underline;
            font-weight: 900;
        }
        .pagination button:focus {
            background-color: var(--dl-color-theme-primary2);
        }
        .catalog-content-container {
            width: 100%;
        }
        .catalog-container40 {
            gap: var(--dl-space-space-unit);
            flex: 1;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        @media (max-width: 680px) {
            .catalog-container40 {
                grid-template-columns: 1;
            }
        }
                `}
            </style>
        </section>
    )
}

export default CatalogContent