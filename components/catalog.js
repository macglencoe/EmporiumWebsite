

import React, { Fragment, use, useState, useEffect } from 'react'
//import Data from "../../public/data/consolidated_cigars.json"


import { useRouter } from 'next/router'
import CatalogCard from './catalogCard'
import CatalogContent from './catalogContent';
import PageTitle1 from './pagetitle1';


export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

const CatalogFilter = (props) => {
    const [selectedFilter, setSelectedFilter] = useState('');

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
        props.handleFilterChange(event);
    }

    return (
        <>

            <div data-thq="accordion" className="catalog-accordion2">
                <details
                    name="brand"
                    data-thq="accordion-trigger"
                    className="catalog-trigger2"
                >
                    <summary
                        data-thq="accordion-summary"
                        className="catalog-summary2"
                    >
                        <span>
                            <span>{props.label}</span>
                            <br></br>
                        </span>
                        <div
                            data-thq="accordion-icon"
                            className="catalog-icon-container2"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24">
                                <path
                                    d="m12 14l-4-4h8z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                    </summary>
                </details>
                <div
                    data-thq="accordion-content"
                    className="catalog-content3"
                >
                    <select name={props.name} onChange={handleFilterChange} multiple>
                        <option value="">{props.defaultValue}</option>
                        {props.values.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}

                    </select>
                </div>
            </div>
            <style jsx>
                {
                    `
        .catalog-accordion2 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
            flex: 1;
          }
          .catalog-trigger2 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
        .catalog-summary2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container2 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content3 {
            background-color: var(--dl-color-theme-primary2);
          } 
                    `
                }
            </style>
        </>
    )
}

const Catalog = (props) => {

    const [sortOption, setSortOption] = useState(props.defaultSort);


    // Set filters based on query parameters
    const router = useRouter();



    useEffect(() => {
        if (router.isReady) {
            props.filters.map(filter => {
                if (!router.query[filter.name]) {
                    router.query[filter.name] = '';
                }
            })
        }
    }, [router.isReady]);

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const [auxSearchQueries, setAuxSearchQueries] = useState([]);

    const handleAuxSearchChange = (event) => {
        if (props.auxiliarySearchBars) {
            const updatedQueries = [...auxSearchQueries];
            props.auxiliarySearchBars.forEach(searchBar => {
                const index = updatedQueries.findIndex(query => query.name === searchBar.query);
                if (index >= 0) {
                    updatedQueries[index].value = event.target.value;
                } else {
                    updatedQueries.push({ name: searchBar.query, value: event.target.value });
                }
            });
            setAuxSearchQueries(updatedQueries);
        }
    }


    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };


    const handleFilterChange = (event) => {
        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                [event.target.name]: event.target.value,
                page: 1
            }
        });
    };




    const filteredItems = [...props.data].filter((item) => {
        if (router.isReady) {
            props.filters.map(filter => {
                if (!router.query[filter.name]) {
                    router.query[filter.name] = '';
                }
            });

            console.log(router.query)
            console.log(props.filters)

            return (
                props.filters.every(filter =>
                    router.query[filter.name] == '' ||
                    (filter.flatmap
                        ? item[filter.flatmap] != null && item[filter.flatmap].includes(router.query[filter.name])
                        : item[filter.name] != null && item[filter.name].toLowerCase() == (router.query[filter.name].toLowerCase()))
                )
            )
        }
    })



    const searchedItems = filteredItems.filter((item) => {

        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const auxSearchedItems = searchedItems.filter((item) => {
        if (props.auxiliarySearchBars) {
            return auxSearchQueries.every(query =>
                query.value === '' || String(item[query.name]).toLowerCase() === query.value.toLowerCase()
            );
        } else return searchedItems
    })

    // Testing for unique barcodes
    if (true) {
        const uniqueBarcodes = auxSearchedItems.filter((item, index, self) => self.findIndex((t) => t.Barcode === item.Barcode) === index);
        console.log('Unique Barcodes: ', uniqueBarcodes.map(item => item.Barcode));
    }


    const sortedItems = [...auxSearchedItems].sort((a, b) => {

        const sortOptionProp = props.sortOptions.find(option => option.value === sortOption);


        if (sortOptionProp.quantity) {
            return b[sortOption].length - a[sortOption].length
        } else
            return String(a[sortOption]).localeCompare(String(b[sortOption]));
    })


    return (
        <>
            <PageTitle1>Cigar Catalog</PageTitle1>
            <div className="catalog-container31">
                <div data-thq="accordion" className="catalog-accordion1">
                    <details
                        open
                        data-thq="accordion-trigger"
                        className="catalog-trigger1"
                    >
                        <summary
                            data-thq="accordion-summary"
                            className="catalog-summary1"
                        >
                            <span>Refine</span>
                            <div
                                data-thq="accordion-icon"
                                className="catalog-icon-container1"
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24">
                                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                                </svg>
                            </div>
                        </summary>
                    </details>
                    <div data-thq="accordion-content">
                        <div className="catalog-container32">

                            {props.filters &&
                                props.filters.map((filter) => (
                                    <CatalogFilter
                                        name={filter.name}
                                        label={filter.label}
                                        values={filter.values}
                                        defaultValue={filter.defaultValue}
                                        handleFilterChange={handleFilterChange}
                                    />
                                ))
                            }

                        </div>
                    </div>
                </div>
                <div className="catalog-container38">
                    <div className="catalog-container39">
                        <span className="catalog-sorty-by">Sort By:</span>
                        <select id="sort" value={sortOption} onChange={handleSortChange} className="catalog-select">

                            {
                                props.sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))
                            }
                        </select>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                        />
                        {
                            props.auxiliarySearchBars && props.auxiliarySearchBars.length > 0 && props.auxiliarySearchBars[0] !== false &&
                            props.auxiliarySearchBars.map((auxSearch) => (
                                <input
                                    type="search"
                                    name={auxSearch.query}
                                    value={auxSearchQueries[auxSearch.name]}
                                    onChange={handleAuxSearchChange}
                                    placeholder={auxSearch.label + '...'}
                                />
                            ))
                        }


                    </div>
                    <div className="filter-bubble-container">
                        {Object.entries(router.query).map(([filterKey, filterValue]) => (
                            filterValue !== '' && filterKey !== 'page' && (
                                <div className="filter-bubble" key={filterKey}>
                                    <span className="filter-bubble-name">{filterKey}: {filterValue}</span>
                                    <button onClick={() => handleFilterChange({ target: { name: filterKey, value: '' } })} className='filter-bubble-button'>
                                        <span className="filter-bubble-x">x</span>
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                    <CatalogContent
                        data={sortedItems}
                        cardSettings={props.cardSettings}

                    ></CatalogContent>
                </div>
            </div>
            <style jsx>
                {
                    `
        .catalog-container31 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            align-items: flex-start;
            padding-left: var(--dl-space-space-halfunit);
            padding-right: var(--dl-space-space-halfunit);
          }
        .catalog-accordion1 {
            width: auto;
            display: flex;
            flex-direction: column;
          }
        .catalog-trigger1 {
            cursor: pointer;
            display: none;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: #d9d9d9;
          }
        .catalog-summary1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        .catalog-icon-container1 {
            transition: transform 0.3s ease-in-out;
          }
        .catalog-container38 {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
        .catalog-container39 {
            flex: 1;
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-secondary2);
            gap: 10px;
            padding: 10px;
            flex-wrap: wrap;
            border-bottom: 3 px solid var(--dl-color-theme-primary1);
          }
        .catalog-container39 input {
            font-size: 20px;
            background-color: var(--dl-color-theme-primary2);

        }
        .catalog-container39 select {
            background-color: var(--dl-color-theme-primary2);
        }
        .catalog-container39 span {
            color: var(--dl-color-theme-primary2);
        }
       
        .catalog-sorty-by {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            font-style: normal;
            font-weight: 600;
            text-transform: uppercase;
          }
        .catalog-select {
            font-size: 25px;
            align-self: center;
            padding-left: var(--dl-space-space-halfunit);
            padding-right: var(--dl-space-space-halfunit);
          }
        .catalog-container40 {
            gap: var(--dl-space-space-unit);
            flex: 1;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        .filter-bubble-container {
            flex: 1;
            width: 100%;
            height: auto;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-secondary2);
            padding: 10px;
            gap: 5px;
            flex-wrap: wrap;
          }
        .filter-bubble {
            border-radius: 8px;
            padding: 5px;
            background-color: var(--dl-color-theme-primary2);
            display: flex;
            gap: 5px;
            align-items: center;
        }
          .filter-bubble-name {
            font-size: 18px;
            font-weight: 700;
          }
          .filter-bubble-button {
            background-color: var(--dl-color-theme-secondary2);
          }
          .filter-bubble-x {
            font-size: 20px;
            font-weight: bolder;
            color: var(--dl-color-theme-primary2);

          }
        .catalog-container32 {
            gap: 8px;
            width: auto;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
        .catalog-accordion2 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
          }
        @media (max-width: 1200px) {
            .catalog-container31 {
              flex-direction: column;
            }
            .catalog-container32 {
              flex-direction: row;
              flex-wrap: wrap;
            }
              .catalog-accordion1 {
              width: 100%;
            }
            .catalog-container39 {
                flex-wrap: wrap;
                height: auto;
            }
            .catalog-container39 input {
                margin: 10px;
            }
        }
        @media (max-width: 680px) {
            .catalog-container40 {
                grid-template-columns: 1;
            }
        }
                `
                }
            </style>
        </>
    );
}

export default Catalog