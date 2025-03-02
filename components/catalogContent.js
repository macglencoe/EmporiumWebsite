import CatalogCard from "./catalogCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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

            <nav className='pagination'>
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

                            buttonText={props.cardSettings.buttonText(item)}
                            barcode={props.cardSettings.barcode ? props.cardSettings.barcode(item) : null}

                            description={props.cardSettings.description ? props.cardSettings.description(item) : null}

                            list = {props.cardSettings.list ? props.cardSettings.list(item) : null}
                        />
                    ))
                }
            </div>

            <nav className='pagination'>
                <span><b>Page:</b></span>
                {Array.from({ length: totalPages }, (_, i) => (
                    <a>
                        <button
                            key={i + 1}
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