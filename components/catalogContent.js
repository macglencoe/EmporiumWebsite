import CatalogCard from "./catalogCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
    }
    return (
        <div className="catalog-content-container">
            
            <div className='pagination'>
            <h3>Page:</h3>
                {Array.from({ length: totalPages }, (_, i) => (
                    <a>
                        <button
                            key={i + 1}
                            className={i + 1 === currentPage ? 'page-active' : ''}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </a>
                )
                )}
            </div>
            <h3>Results per page: {pageSize}</h3>
            <h3>Total results: {props.data.length}</h3>
            <div className="catalog-container40">
                {
                    currentPageData.map((item) => (
                        props.cardSettings.title(item) !== ' ' &&
                        <CatalogCard

                            image={props.cardSettings.image? props.cardSettings.image(item): null}
                            title={props.cardSettings.title(item)}

                            data={props.cardSettings.data(item)}
                            href={props.cardSettings.href(item)}

                            buttonText={props.cardSettings.buttonText(item)}
                            barcode={props.cardSettings.barcode? props.cardSettings.barcode(item) : null}
                        />
                    ))
                }
            </div>

            <div className='pagination'>
                <h3>Page:</h3>
                {Array.from({ length: totalPages }, (_, i) => (
                    <a>
                        <button
                            key={i + 1}
                            className={i + 1 === currentPage ? 'page-active' : ''}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </a>
                )
                )}
                
            </div>
            
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
        </div>
    )
}

export default CatalogContent