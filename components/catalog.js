

import React, { Fragment, use, useState, useEffect } from 'react'
//import Data from "../../public/data/consolidated_cigars.json"


import { useRouter } from 'next/router'
import CatalogCard from './catalogCard'
import CatalogContent from './catalogContent';
import PageTitle1 from './pagetitle1';
import Layout from './layout';
import Filters from './filters';


export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};



const Catalog = (props) => {

    const [sortOption, setSortOption] = useState(props.defaultSort);


    // Set filters based on query parameters
    const router = useRouter();


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



    useEffect(() => {
        if (router.isReady) {
            props.filters.map(filter => {
                if (!router.query[filter.name]) {
                    router.query[filter.name] = '';
                }
            });
        }
    }, [router.isReady]);

    const [searchInput, setSearchInput] = useState('');
    const handleSearchChange = (event) => {
        router.push({ query: { ...router.query, search: event.target.value } }, undefined, { shallow: true });
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







    const filteredItems = [...props.data].filter((item) => {
        if (router.isReady) {
            props.filters.map(filter => {
                if (!router.query[filter.name]) {
                    router.query[filter.name] = '';
                }
            });


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
        if (router.isReady) {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(router.query.search ? router.query.search.toLowerCase() : '')
            );
        }
    });

    const auxSearchedItems = searchedItems.filter((item) => {
        if (props.auxiliarySearchBars) {
            return auxSearchQueries.every(query =>
                query.value === '' || String(item[query.name]).toLowerCase() === query.value.toLowerCase()
            );
        } else return searchedItems
    })

    // Testing for unique barcodes
    if (false) {
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
            <Layout
                sidebarChildren={

                    <>
                        <div className="catalog-container39">
                            <span className="catalog-sorty-by">Sort By:</span>
                            <select id="sort" value={sortOption} onChange={handleSortChange} className="catalog-select">

                                {
                                    props.sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {
                            props.auxiliarySearchBars && props.auxiliarySearchBars.length > 0 && props.auxiliarySearchBars[0] !== false &&
                            props.auxiliarySearchBars.map((auxSearch) => (
                                <input
                                    type="search"
                                    name={auxSearch.query}
                                    value={auxSearchQueries[auxSearch.name]}
                                    onChange={handleAuxSearchChange}
                                    placeholder={auxSearch.label + '...'}
                                    style={{
                                        margin: '10px',
                                    }}
                                />
                            ))
                        }

                        <Filters filters={props.filters} />
                    </>

                }

                headerChildren={
                    <>
                        <div className='searchbar-container' id='header-search'>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSearchChange({ target: { value: searchInput } });
                                setSearchInput('');
                            }}
                                className='searchbar'>
                                <input
                                    type="search"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search..."
                                />
                                <button type="submit" className='search-button'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="32px" fill="var(--dl-color-theme-secondary1)">
                                        <path d="M790.67-89.33 525-354.33q-29 21.95-68.14 34.64Q417.72-307 372-307q-116.11 0-196.89-80.83-80.78-80.84-80.78-195.5 0-114.67 80.84-195.5Q256-859.67 371-859.67q115 0 195.5 80.84Q647-698 647-583.23q0 45.23-12.33 83.4-12.34 38.16-35.67 70.16L865.67-164l-75 74.67Zm-419.1-322.34q71.93 0 121.35-50 49.41-50 49.41-121.66 0-71.67-49.51-121.67-49.52-50-121.25-50-72.29 0-122.43 50T199-583.33q0 71.66 50.04 121.66t122.53 50Z" />
                                    </svg>

                                </button>
                            </form>
                        </div>
                    </>
                }
            >
                <PageTitle1 subtitle={props.subtitle}>
                    {props.title ?? "Catalog"}
                </PageTitle1>
                {props.notices}
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

                    </div>
                    <div className="catalog-container38">

                        { Object.keys(router.query).some(key=> key !== 'page' && router.query[key] !== '') &&
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
                                <span>Returned <b style={{ color: 'var(--dl-color-theme-primary1)' }}>{sortedItems.length}</b> results</span>
                            </div>
                        }
                        

                        <CatalogContent
                            data={sortedItems}
                            cardSettings={props.cardSettings}

                        ></CatalogContent>
                    </div>
                </div>
            </Layout>
            <style jsx>
                {
                    `
        .search-button {
            background-color: var(--dl-color-theme-primary2);
        }
        .searchbar {
            display: flex;
            align-items: stretch;
        }
        .search-button {
            padding: 0px;
            border-left: 4px solid var(--dl-color-theme-primary1);
        }
        .search-button:hover svg {
            fill: var(--dl-color-theme-primary2);
        }
        .search-button:hover {
            background-color: var(--dl-color-theme-secondary2);}
        .result-info-container {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 1em;
            font-size: 1.2em;
            font-weight: 500;
        }
        .searchbar-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            background-color: var(--dl-color-theme-secondary2);
            padding: 10px;
        }
        .searchbar-container input {
            width: 18em;
            height: 2em;
            border: none;
            background-color: var(--dl-color-theme-primary2);
            font-size: 1.2em;
            padding: 1em;
            font-weight: 500;
        }
        #header-search {
            background-color: var(--dl-color-theme-secondary1);
            width: auto;
            margin-right: 20px
        }
        #header-search input {
            width: 14em;
            height: 1.5em;
            font-size: 1em;
        }
        .catalog-container31 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            align-items: flex-start;
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
            width: 100%;
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
        
        .catalog-container39 span {
            color: var(--dl-color-theme-primary2);
        }
       
        .catalog-sorty-by {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 1em;
            font-style: normal;
            font-weight: 600;
            text-transform: uppercase;
          }
        .catalog-select {
            font-size: 1em;
            align-self: center;
            padding-left: var(--dl-space-space-halfunit);
            padding-right: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
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
        .filter-bubble-container > span {
            color: var(--dl-color-theme-primary2);
            padding: 10px;
            font-weight: 700;
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
            cursor: pointer;
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
            #header-search input {
                width: 100%;
            }
        }
                `
                }
            </style>
        </>
    );
}

export default Catalog