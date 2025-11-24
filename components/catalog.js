

import React, { Fragment, use, useState, useEffect } from 'react'
//import Data from "../../public/data/consolidated_cigars.json"


import { useRouter } from 'next/router'
import CatalogCard from './catalogCard'
import CatalogContent from './catalogContent';
import PageTitle1 from './pagetitle1';
import Layout from './layout';
import Filters from './filters';
import { track } from '@vercel/analytics';
import { PiCaretDownBold, PiCaretDownFill, PiMagnifyingGlassBold, PiXCircleBold, PiXCircleFill } from 'react-icons/pi';
import Image from 'next/image';


export const getStaticProps = async () => {
    const data = await import('../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};



/**
 * Catalog component for displaying a catalog of items with sorting, filtering,
 * and searching functionalities. It utilizes a layout with sidebar options for
 * filtering and sorting items, as well as a header for searching. The component
 * manages various states such as sort options, search inputs, and filters to 
 * dynamically render a list of catalog items based on user input.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.data - The data to be displayed in the catalog.
 * @param {Array} props.filters - The filters available for refining the catalog.
 * @param {Array} props.sortOptions - The options available for sorting the catalog.
 * @param {Array} props.auxiliarySearchBars - Auxiliary search bars for additional searches.
 * @param {Object} props.cardSettings - Settings for rendering catalog cards.
 * @param {string} props.description - description for the catalog page.
 * @param {string} props.title - Title for the catalog page.
 * @param {Array} props.notices - Notices to be displayed on the catalog page.
 * @param {Array} [props.featuredStats] - Highlighted stats to display under the pagination.
 * @param {string} props.defaultSort - The default sort option.
 * 
 * Accessibility: 
 * - The component uses semantic HTML elements and aria attributes to improve accessibility.
*/

const Catalog = (props) => {

    const router = useRouter();
    const [sortOption, setSortOption] = useState(props.defaultSort);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const featuredStats = Array.isArray(props.featuredStats) ? props.featuredStats.filter(Boolean) : [];

    const isQueryValueEmpty = (value) => {
        if (value == null) {
            return true;
        }
        if (Array.isArray(value)) {
            return value.every((item) => isQueryValueEmpty(item));
        }
        return String(value).trim() === '';
    };
    const getFirstNonEmptyValue = (value) => {
        if (Array.isArray(value)) {
            const usableValue = value.find((item) => !isQueryValueEmpty(item));
            return usableValue !== undefined ? getFirstNonEmptyValue(usableValue) : '';
        }
        if (value == null) {
            return '';
        }
        return String(value).trim();
    };
    const searchQueryValue = router.query?.search;
    const onlySearchHasValue = !isQueryValueEmpty(searchQueryValue) &&
        Object.entries(router.query ?? {}).every(([key, value]) =>
            key === 'search' ||
            key === 'page' ||
            isQueryValueEmpty(value)
        );
    const emptyResultsMessage = onlySearchHasValue
        ? `Sorry, we couldn't find anything called "${getFirstNonEmptyValue(searchQueryValue)}"`
        : "Sorry, we couldn't find what you were looking for";

    // Set filters based on query parameters

    const handleOpenFilters = (event) => {
        setFiltersOpen((prev) => !prev)
        console.log(filtersOpen);
    }


    const handleFilterChange = (event) => {
        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                [event.target.name]: event.target.value,
                page: 1
            }
        });
        track("Used Filters", {
            filter: event.target.name,
            value: event.target.value
        });
    };

    useEffect(() => {
        setIsMobile(window.innerWidth < 680);
    })

    useEffect(() => {
        if (router.isReady) {
            props.filters.map(filter => {
                if (!router.query[filter.name]) {
                    router.query[filter.name] = '';
                }
            });
            if (router.query.search) {
                setSearchInput(router.query.search)
            }
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
            console.log(props.filters);

            return (
                !item.hidden &&
                props.filters.every(filter =>
                    router.query[filter.name] == '' ||
                    (Array.isArray(item[filter.name])
                        ? typeof item[filter.name][0] === 'string'
                            ? item[filter.name] != null && item[filter.name].includes(router.query[filter.name])
                            : item[filter.name] != null && item[filter.name].some(obj => Object.values(obj).some(val => String(val).toLowerCase().includes(router.query[filter.name].toLowerCase())))
                        : item[filter.name] != null && item[filter.name].toLowerCase() == (router.query[filter.name].toLowerCase()))
                )
            )

        }
    })



    const searchedItems = filteredItems.filter((item) => {
        if (router.isReady) {
            return Object.values(item).some(value =>
                Array.isArray(value) ?
                    value.some(val =>
                        typeof val === 'object' ?
                            Object.values(val).some(v => String(v).toLowerCase().includes(router.query.search ? router.query.search.toLowerCase() : ''))
                            : String(val).toLowerCase().includes(router.query.search ? router.query.search.toLowerCase() : '')
                    ) :
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
                            <label for="sort" className="catalog-sorty-by">Sort By:</label>
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
            >
                <PageTitle1 description={props.description}>
                    {props.title ?? "Catalog"}
                </PageTitle1>
                {props.notices}
                <div className='px-3 py-2 shadow-xl border-b-3 border-double border-secondary2/50 bg-primary2/30'>
                    {featuredStats.length > 0 && (
                                <div className="w-full grid gap-2 mb-1" aria-label="Catalog highlights" style={{
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
                                }}>
                                    {featuredStats.map((stat, index) => (
                                        <article
                                            key={`${stat?.title ?? 'stat'}-${index}`}
                                            className="text-primary2 p-3 m-1 w-fit border-8 border-double border-secondary2 relative h-70 flex flex-col justify-end overflow-hidden"
                                        >
                                            
                                            {stat.backdrop && 
                                                <div className='absolute inset-0 z-10'>
                                                    <Image layout='fill' className="object-cover" src={stat.backdrop} priority={index === 0} />
                                                    <div className='absolute inset-0 bg-gradient-to-b from-secondary2/40 via-secondary2/90 to-secondary2'  />
                                                    
                                                </div>
                                            }
                                            
                                            {stat?.title && (
                                                <h2 className="tracking-wider uppercase font-inter font-bold text-3xl z-[11]">{stat.title}</h2>
                                            )}
                                            {stat?.subtitle && (
                                                <span className="font-medium text-xl font-inter uppercase tracking-wide text-primary1 z-[11]">{stat.subtitle}</span>
                                            )}
                                            {stat?.description && (
                                                <p className="mt-2 z-[11]">{stat.description}</p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                </div>
                <div className="catalog-container31">



                    <div className="w-full space-y-4 py-4 px-2">

                        

                        <div className='mt-10' id='search'>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSearchChange({ target: { value: searchInput } });
                            }}
                                className='bg-primary2 flex flex-row items-center max-w-3xl mx-auto border-6 border-primary1/50 border-double'>
                                <input
                                    type="search"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search..."
                                    className="flex-1 p-3"
                                />
                                <button aria-label='Search' type="submit" className='cursor-pointer px-3'>
                                    <PiMagnifyingGlassBold size={30} />

                                </button>
                            </form>
                        </div>

                        <div className='max-w-3xl mx-auto border-6 border-primary1/50 border-double bg-primary2'>

                            <div className="group flex flex-row items-center justify-between px-3"
                                onClick={handleOpenFilters}
                                style={{
                                    borderBottom: filtersOpen ? 'solid var(--dl-color-theme-primary2)' : ''
                                }}
                            >
                                <span className='py-3' onClick={handleOpenFilters}>Filter & Sort</span>
                                <button
                                    name='Toggle Filters'
                                    aria-label='Toggle Filters'
                                    onClick={handleOpenFilters}
                                    style={{
                                        transform: filtersOpen ? 'scaleY(-100%)' : 'scaleY(100%)',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                    aria-expanded={filtersOpen}
                                    aria-controls="filter-sort-container"
                                    tabIndex={!isMobile ? -1 : 0}

                                >
                                    <PiCaretDownFill size={24} />
                                </button>
                            </div>

                            {filtersOpen && (

                                <div className="p-2 "
                                    style={{
                                        width: '100%',
                                        transform: filtersOpen ? 'scaleY(1)' : 'scaleY(0)',
                                        transition: 'transform 0.2s ease-in-out',
                                        height: filtersOpen ? 'auto' : '0',
                                        transformOrigin: 'top',
                                        flexDirection: 'column',
                                        borderTop: "solid var(--dl-color-theme-primary2)"
                                    }}>
                                    <div className='text-secondary1 p-2'>
                                        <label for="sort" className="tracking-wide uppercase font-semibold mr-2">Sort By:</label>
                                        <select
                                            id="sort"
                                            value={sortOption}
                                            onChange={handleSortChange}
                                            className="px-2 py-1 bg-primary1/40"
                                            tabIndex={!isMobile ? -1 : 0}
                                        >

                                            {
                                                props.sortOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >{option.label}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <Filters filters={props.filters} />
                                </div>
                            )}

                            {Object.keys(router.query).some(key => key !== 'page' && router.query[key] !== '') &&
                                <div className='font-inter p-2 flex flex-row flex-wrap gap-2 items-center'>
                                    {Object.entries(router.query).map(([filterKey, filterValue]) => (
                                        filterValue !== '' && filterKey !== 'page' && (
                                            <div className='bg-primary1/20 flex flex-row items-stretch gap-2 justify-between w-fit py-1 px-2 border border-primary1/50 rounded-2xl' key={filterKey}>
                                                <div className='flex flex-col'>
                                                    <span className='font-bold text-xs tracking-wide'>{String(filterKey).toUpperCase()}</span>
                                                    <span className='font-medium'>"{filterValue}" </span>
                                                </div>
                                                <button onClick={() => handleFilterChange({ target: { name: filterKey, value: '' } })}
                                                    className='group'
                                                    aria-label={'Clear ' + filterValue + 'Filter for ' + filterKey}
                                                >
                                                    <PiXCircleFill size={25} className='group-hover:scale-110 opacity-50 group-hover:opacity-100 text-[var(--negative)]'/>
                                                </button>
                                            </div>
                                        )
                                    ))}
                                    <span>Returned <b className='text-primary1'>{sortedItems.length}</b> results</span>
                                </div>
                            }
                        </div>

                        {sortedItems.length == 0 &&
                            <div className="flex-1 w-full flex flex-col items-center py-20">
                                <span className="text-3xl">{emptyResultsMessage}</span>
                            </div>
                        }


                        <CatalogContent
                            data={sortedItems}
                            cardSettings={props.cardSettings}
                            featuredStats={props.featuredStats}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            handleSearchChange={handleSearchChange}

                        ></CatalogContent>
                    </div>
                </div>
            </Layout>
            <style jsx>
                {
                    `

        .sort-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background-color: var(--dl-color-theme-secondary2);
        }
        .filter-header-container {
            flex-direction: row;
            background-color: var(--dl-color-theme-secondary2);
            width: 100%;
            padding: 10px;
            gap: 10px;
            align-items: center;
        }
        .filter-header-container span {
            color: var(--dl-color-theme-primary1);
            font-weight: 600;
        }
        .filter-header-container div {
            flex-grow: 1;
            height: 6px;
            border-top: 2px solid var(--dl-color-theme-primary2);
            border-bottom: 2px solid var(--dl-color-theme-primary2);
        }
        filter-sort-container {
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            width: 1000px;
        }
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
            .filter-header-container {
                display: flex;
            }
            .filter-sort-container {
                display: flex;
            }
        }
                `
                }
            </style>
        </>
    );
}

export default Catalog
