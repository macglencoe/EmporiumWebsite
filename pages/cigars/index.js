import React, { Fragment, use, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
//import Data from "../../public/data/consolidated_cigars.json"

import Footer32 from '../../components/footer32'
import Contact from '../../components/contact'
import Directory from '../../components/directory'
import Ksman from '../../components/ksman'
import { useRouter } from 'next/router'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils'

export const getStaticProps = async () => {
  const data = await import('../../public/data/consolidated_cigars.json');
  return {
    props: {
      data: data.default
    },
  };
};

const Catalog = (props) => {

  const [sortOption, setSortOption] = useState('Cigar Name');

  // Set filters based on query parameters
  const router = useRouter();



  useEffect(() => {
    if (router.isReady) {
      if (!router.query['Cigar Brand']) {
        router.query['Cigar Brand'] = '';
      }
      if (!router.query['Wrapper']) {
        router.query['Wrapper'] = '';
      }
      if (!router.query['Strength_Profile']) {
        router.query['Strength_Profile'] = '';
      }
      if (!router.query['Size']) {
        router.query['Size'] = '';
      }
    }
  }, [router.isReady]);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  const handleFilterChange = (event) => {
    router.replace({
      pathname: '/cigars',
      query: {
        ...router.query,
        [event.target.name]: event.target.value
      }
    });
  };



  const filteredItems = [...props.data].filter((item) => {
    if (router.isReady) {
      if (!router.query['Cigar Brand']) {
        router.query['Cigar Brand'] = '';
      }
      if (!router.query['Wrapper']) {
        router.query['Wrapper'] = '';
      }
      if (!router.query['Strength_Profile']) {
        router.query['Strength_Profile'] = '';
      }
      if (!router.query['Size']) {
        router.query['Size'] = '';
      }

      return (
        (router.query['Cigar Brand'] === '' || item['Cigar Brand'].toLowerCase() == (router.query['Cigar Brand'].toLowerCase())) &&
        (router.query['Wrapper'] === '' || item['Wrapper'].toLowerCase().includes(router.query['Wrapper'].toLowerCase())) &&
        (router.query['Strength_Profile'] === '' || item['Strength_Profile'].toLowerCase() == router.query['Strength_Profile'].toLowerCase()) &&
        (router.query['Size'] === '' || item['Sizes'].includes(router.query['Size']))
      )
    }
  })

  const searchedItems = filteredItems.filter((item) => {

    return (
      String(item['Cigar Brand']).toLowerCase().includes(searchQuery) ||
      String(item['Cigar Name']).toLowerCase().includes(searchQuery) ||
      String(item['Wrapper']).toLowerCase().includes(searchQuery) ||
      String(item['Strength_Profile']).toLowerCase().includes(searchQuery)
    );
  });

  const sortedItems = [...searchedItems].sort((a, b) => {
    switch (sortOption) {
      case 'Cigar Name':
        return a.name - b.name;
      case 'Sizes':
        return b.Sizes.length - a.Sizes.length;
    }
  })

  // All unique brands for filtering
  const uniqueBrands = [...new Set((props.data).map(item => item['Cigar Brand'].trim()))];

  // All unique sizes for filtering
  const uniqueSizes = Array.from(new Set((props.data).flatMap(item => item['Sizes'])));




  return (
    <>
      <div className="catalog-container10">
        <Head>
          <title>Cigar Catalog</title>
          <meta property="og:title" content="Cigar Catalog" />
          <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></Script>
          <Script src="https://cdn.rawgit.com/harvesthq/chosen/gh-pages/chosen.jquery.min.js"></Script>
          <Link href="https://cdn.rawgit.com/harvesthq/chosen/gh-pages/chosen.min.css" rel="stylesheet">Chosen</Link>
        </Head>

        <div id="fb-root"></div>
        <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0"></Script>

        <div className="catalog-container11 container">
          <div className="catalog-container73 sidebar">
            <div className="catalog-container74">
              <span className="catalog-text235">The King Street Emporium</span>
              <button
                id="closer"
                type="button"
                className="catalog-button7 button"
              >
                Button
              </button>
            </div>
            <Ksman></Ksman>
            <Contact></Contact>
            <div className="catalog-container94">
              <div className="catalog-container95">
                <div className="directoryCard">
                  <span className="catalog-text259">Cigar Catalogue</span>
                </div>
              </div>
              <div className="catalog-container97">
                <div className="directoryCard catalog-container98">
                  <span className="catalog-text260">Pipes &amp; Tobacco</span>
                </div>
              </div>
              <div className="catalog-container99">
                <div className="directoryCard">
                  <span className="catalog-text261">Coffee &amp; Tea</span>
                </div>
              </div>
              <div className="catalog-container101">
                <div className="directoryCard">
                  <span className="catalog-text262">Accessories</span>
                </div>
              </div>
            </div>
            <div className="fb-container">
              <div tabIndex={1} class="fb-page" data-href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/" data-tabs="timeline" data-width="280" data-height="" data-small-header="false" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="true"><blockquote cite="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/">King Street Coffee &amp; Tobacco Emporium</a></blockquote></div>
            </div>
          </div>
          <div className="catalog-content1 collapsed">
            <div className="catalog-title">
              <h1 className="catalog-text109">
                <span>The King Street Emporium</span>
                <br></br>
              </h1>
            </div>
            <div className="catalog-container21">
              <Directory></Directory>
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
                              <span>Brand</span>
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
                          <select name='Cigar Brand' onChange={handleFilterChange} multiple>
                            <option value="">All Brands</option>
                            {uniqueBrands.map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div data-thq="accordion" className="catalog-accordion3">
                        <details
                          name="wrapper"
                          data-thq="accordion-trigger"
                          className="catalog-trigger3"
                        >
                          <summary
                            data-thq="accordion-summary"
                            className="catalog-summary3"
                          >
                            <span>
                              <span>Wrapper</span>
                              <br></br>
                            </span>
                            <div
                              data-thq="accordion-icon"
                              className="catalog-icon-container3"
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
                          className="catalog-content4"
                        >
                          <select name="Wrapper" onChange={handleFilterChange} multiple>
                            <option></option>
                            <option>Maduro</option>
                            <option>Natural</option>
                            <option>Oscuro</option>
                          </select>
                        </div>
                      </div>
                      <div data-thq="accordion" className="catalog-accordion4">
                        <details
                          name="wrapper"
                          data-thq="accordion-trigger"
                          className="catalog-trigger4"
                        >
                          <summary
                            data-thq="accordion-summary"
                            className="catalog-summary4"
                          >
                            <span>
                              <span>Strength</span>
                              <br></br>
                            </span>
                            <div
                              data-thq="accordion-icon"
                              className="catalog-icon-container4"
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
                          className="catalog-content5"
                        >
                          <select name="Strength_Profile" onChange={handleFilterChange} multiple>
                            <option></option>
                            <option>Full</option>
                            <option>Medium</option>
                            <option>Medium-Full</option>
                            <option>Mild</option>
                            <option>Mild-Medium</option>
                          </select>
                        </div>
                      </div>
                      <div data-thq="accordion" className="catalog-accordion5">
                        <details
                          name="size"
                          open
                          data-thq="accordion-trigger"
                          className="catalog-trigger5"
                        >
                          <summary
                            data-thq="accordion-summary"
                            className="catalog-summary5"
                          >
                            <span>
                              <span>Size</span>
                              <br></br>
                            </span>
                            <div
                              data-thq="accordion-icon"
                              className="catalog-icon-container5"
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
                          <select name="Size" onChange={handleFilterChange} multiple>
                            <option value="">All Sizes</option>
                            {uniqueSizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="catalog-container38">
                  <div className="catalog-container39">
                    <span className="catalog-sorty-by">Sort By:</span>
                    <select id="sort" value={sortOption} onChange={handleSortChange} className="catalog-select">
                      <option value="Cigar Name">Name</option>
                      <option value="Sizes">Size Options</option>
                    </select>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                    />

                  </div>
                  <div className="filter-bubble-container">
                    {Object.entries(router.query).map(([filterKey, filterValue]) => (
                      filterValue !== '' && (
                        <div className="filter-bubble" key={filterKey}>
                          <span className="filter-bubble-name">{filterKey}: {filterValue}</span>
                          <button onClick={() => handleFilterChange({ target: { name: filterKey, value: '' } })} className='filter-bubble-button'>
                            <span className="filter-bubble-x">x</span>
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="catalog-container40">
                    {
                      sortedItems.map((item) => (
                        item['Cigar Name'] &&
                        <Link href={`/cigars/${item.slug}`}><a>
                        <div className="catalog-catalog-card2 catalogCard">

                          <div className="CatalogCardImage"></div>

                          <div className="catalog-container47 CatalogCardName">

                            <span className="card-name-text">{item['Cigar Brand'] + ' ' + item['Cigar Name']}</span>

                          </div>
                          {item.Wrapper &&
                            <div className="CatalogCardField">
                              <span className="catalog-text174">
                                Wrapper:
                                <br></br>
                              </span>
                              <span className="catalog-text177">
                                {item.Wrapper}
                                <br></br>
                              </span>
                            </div>}
                          {item.Strength_Profile &&
                            <div className="catalog-container49 CatalogCardField">
                              <span className="catalog-text180">
                                Strength:
                                <br></br>
                              </span>
                              <span className="catalog-text181">
                                {item.Strength_Profile}
                                <br></br>
                              </span>
                            </div>}
                          <div className="catalog-container50">

                            <button
                              type="button"
                              className="catalog-button2 button"
                            >
                              {
                                item.Sizes.length > 1 ?
                                  item.Sizes.length + " Sizes Available" :
                                  item.Sizes[0]
                              }
                            </button>

                          </div>
                          
                          
                        </div>
                        </a></Link>
                        
                      ))
                    }

                  </div>
                </div>
              </div>
              <div className="catalog-new-arrivals2">
                <div className="catalog-container67">
                  <span className="catalog-text218">
                    <span>New Arrivals</span>
                    <br></br>
                  </span>
                </div>
                <div className="catalog-container68">
                  <div className="catalog-container69">
                    <span className="catalog-text221">El Primero Reserva</span>
                  </div>
                  <div className="catalog-container70">
                    <span className="catalog-text222">Tobacco Ember</span>
                  </div>
                  <div className="catalog-container71">
                    <span className="catalog-text223">
                      <span>Don Solitario</span>
                      <br></br>
                    </span>
                  </div>
                  <div className="catalog-container72">
                    <span className="catalog-text226">La Noche Oscura</span>
                  </div>
                </div>
              </div>
              <Footer32
                link1={
                  <Fragment>
                    <span className="catalog-text227">About Us</span>
                  </Fragment>
                }
                link2={
                  <Fragment>
                    <span className="catalog-text228">Shop</span>
                  </Fragment>
                }
                link3={
                  <Fragment>
                    <span className="catalog-text229">Events</span>
                  </Fragment>
                }
                link4={
                  <Fragment>
                    <span className="catalog-text230">Contact Us</span>
                  </Fragment>
                }
                link5={
                  <Fragment>
                    <span className="catalog-text231">Visit Us</span>
                  </Fragment>
                }
                termsLink={
                  <Fragment>
                    <span className="catalog-text232">
                      Terms and Conditions
                    </span>
                  </Fragment>
                }
                cookiesLink={
                  <Fragment>
                    <span className="catalog-text233">Cookies Policy</span>
                  </Fragment>
                }
                privacyLink={
                  <Fragment>
                    <span className="catalog-text234">Privacy Policy</span>
                  </Fragment>
                }
                rootClassName="footer32root-class-name1"
              ></Footer32>
            </div>
          </div>

        </div>
      </div>
      <style jsx>
        {`

          .fb-container {
            background-color: var(--dl-color-theme-secondary2);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          
          .filter-bubble-container {
            flex: 1;
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-secondary2);
            padding: 10px;
            gap: 5px;
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




          .card-name-text {
            transition: text-decoration 0.3s ease-in-out;
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }

          .card-name-text:hover:focus {
            text-decoration: underline;
          }






          .catalog-container10 {
            width: 100%;
            display: flex;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .catalog-container11 {
            top: 0px;
            flex: 1;
            left: 0px;
            height: 100%;
            overflow: scroll;
            position: absolute;
            background-color: var(--dl-color-theme-primary1);
          }
          .catalog-container12 {
            height: 100%;
            align-self: flex-start;
          }
          .catalog-container13 {
            flex: 0 0 auto;
            width: 99%;
            display: flex;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-image1 {
            width: 100%;
            object-fit: cover;
          }
          .catalog-container14 {
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-new-arrivals1 {
            gap: 0;
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-container15 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            flex-wrap: wrap;
            align-items: center;
            border-radius: var(--dl-radius-radius-radius8);
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text100 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-container16 {
            gap: var(--dl-space-space-halfunit);
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-color: var(--dl-color-theme-secondary1);
            border-style: solid;
            border-width: 2px;
            border-radius: var(--dl-radius-radius-radius4);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-primary1gradient);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-radius8);
            border-bottom-right-radius: var(--dl-radius-radius-radius8);
          }
          .catalog-container17 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text103 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container18 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text104 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container19 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text105 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container20 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text108 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-content1 {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            align-self: flex-start;
          }
          .catalog-title {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
          }
          .catalog-text109 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            align-self: center;
            text-align: center;
          }
          .catalog-container21 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-image2 {
            top: 10px;
            left: 0px;
            right: 0px;
            filter: invert(32%) sepia(6%) saturate(2574%) hue-rotate(348deg)
              brightness(93%) contrast(81%);
            margin: auto;
            display: none;
            opacity: 50%;
            position: absolute;
            align-self: center;
            object-fit: contain;
          }
          .catalog-container22 {
            position: relative;
          }
          .catalog-image3 {
            top: 0px;
            left: 0px;
            right: 0px;
            width: 100%;
            filter: invert(32%) sepia(6%) saturate(2574%) hue-rotate(348deg)
              brightness(93%) contrast(81%);
            height: 100%;
            display: none;
            opacity: 50%;
            position: absolute;
            object-fit: cover;
          }
          .catalog-container23 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text112 {
            fill: var(--dl-color-theme-secondary1);
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .catalog-container25 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text113 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .catalog-container27 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text114 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .catalog-container29 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text115 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
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
          .catalog-container33 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            overflow-y: scroll;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-ul1 {
            gap: var(--dl-space-space-halfunit);
            height: 100%;
            display: flex;
            flex-direction: column;
            list-style-image: none;
          }
          .catalog-li10 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li11 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li12 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li13 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li14 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li15 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li16 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li17 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-accordion3 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
          }
          .catalog-trigger3 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
          .catalog-summary3 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container3 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content4 {
            background-color: var(--dl-color-theme-primary2);
          }
          .catalog-container34 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            overflow-y: scroll;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-ul2 {
            gap: var(--dl-space-space-halfunit);
            height: 100%;
            display: flex;
            flex-direction: column;
            list-style-image: none;
          }
          .catalog-li18 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li19 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li20 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-accordion4 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
          }
          .catalog-trigger4 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
          .catalog-summary4 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container4 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content5 {
            background-color: var(--dl-color-theme-primary2);
          }
          .catalog-container35 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            overflow-y: scroll;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-ul3 {
            gap: var(--dl-space-space-halfunit);
            height: 100%;
            display: flex;
            flex-direction: column;
            list-style-image: none;
          }
          .catalog-li21 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li22 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li23 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li24 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-li25 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
          }
          .catalog-accordion5 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
          }
          .catalog-trigger5 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
          .catalog-summary5 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container5 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content6 {
            background-color: var(--dl-color-theme-primary2);
          }
          .catalog-container36 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            flex-wrap: wrap;
            align-items: flex-start;
            flex-direction: row;
          }
          .catalog-text157 {
            font-style: normal;
            font-weight: 500;
          }
          .catalog-textinput1 {
            width: 100%;
            border-width: 0px;
          }
          .catalog-text160 {
            font-style: normal;
            font-weight: 500;
          }
          .catalog-textinput2 {
            width: 100%;
            border-width: 0px;
            background-color: var(--dl-color-theme-neutral-light);
          }
          .catalog-accordion6 {
            width: 170px;
            display: flex;
            max-height: 230px;
            flex-direction: column;
          }
          .catalog-trigger6 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
          .catalog-summary6 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container6 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content7 {
            background-color: var(--dl-color-theme-primary2);
          }
          .catalog-container37 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            flex-wrap: wrap;
            align-items: flex-start;
            flex-direction: row;
          }
          .catalog-text164 {
            font-style: normal;
            font-weight: 500;
          }
          .catalog-textinput3 {
            width: 100%;
            border-width: 0px;
          }
          .catalog-text167 {
            font-style: normal;
            font-weight: 500;
          }
          .catalog-textinput4 {
            width: 100%;
            border-width: 0px;
            background-color: var(--dl-color-theme-neutral-light);
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
          }
          .catalog-sorty-by {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            padding: var(--dl-space-space-unit);
            font-size: 25px;
            font-style: normal;
            font-weight: 600;
            text-transform: uppercase;
          }
          .catalog-select {
            margin: var(--dl-space-space-unit);
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
          .catalog-catalog-card1 {
            justify-content: space-between;
          }
          .catalog-container41 {
            align-self: center;
          }
          .catalog-text168 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text169 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-container43 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text172 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-container44 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: center;
            justify-content: center;
          }
          .catalog-container45 {
            flex: 0 0 auto;
            width: var(--dl-size-size-xsmall);
            height: 100%;
            display: block;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary1);
          }
          .catalog-button1 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            align-self: center;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            border-radius: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-container46 {
            flex: 0 0 auto;
            width: auto;
            height: 100%;
            display: block;
            align-items: flex-start;
            aspect-ratio: 1/1;
            border-radius: var(--dl-radius-radius-radius4);
            background-color: var(--dl-color-theme-secondary2);
            border-top-left-radius: 0;
            border-top-right-radius: var(--dl-radius-radius-round);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: var(--dl-radius-radius-round);
          }
          .catalog-catalog-card2 {
            justify-content: space-between;
          }

          .catalog-container47 {
            align-self: center;
            display: flex
          }
          .catalog-text173 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text174 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-text177 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
          }
          .catalog-container49 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text180 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-text181 {
            width: auto;
            font-size: 25px;
            text-align: right;
            aspect-ratio: auto;
          }
          .catalog-container50 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button2 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            align-self: flex-end;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
            box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.25);
          }

          .catalog-button2:hover, catalog-button2:focus {
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.25);
          }


          .catalog-container51 {
            align-self: center;
          }
          .catalog-text182 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text183 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-text186 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
          }
          .catalog-container53 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text189 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-text190 {
            width: auto;
            font-size: 25px;
            text-align: right;
            aspect-ratio: auto;
          }
          .catalog-container54 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button3 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-container55 {
            align-self: center;
          }
          .catalog-text191 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text192 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-text195 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
          }
          .catalog-container57 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text198 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-text199 {
            width: auto;
            font-size: 25px;
            text-align: right;
            aspect-ratio: auto;
          }
          .catalog-container58 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button4 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-container59 {
            align-self: center;
          }
          .catalog-text200 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text201 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-text204 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
          }
          .catalog-container61 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text207 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-text208 {
            width: auto;
            font-size: 25px;
            text-align: right;
            aspect-ratio: auto;
          }
          .catalog-container62 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button5 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-container63 {
            align-self: center;
          }
          .catalog-text209 {
            font-size: 30px;
            font-style: normal;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
          }
          .catalog-text210 {
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 600;
          }
          .catalog-text213 {
            font-size: 25px;
            align-self: flex-start;
            font-style: normal;
            text-align: right;
            font-weight: 400;
          }
          .catalog-container65 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-self: center;
            align-items: flex-start;
            justify-content: space-between;
          }
          .catalog-text216 {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-text217 {
            width: auto;
            font-size: 25px;
            text-align: right;
            aspect-ratio: auto;
          }
          .catalog-container66 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: center;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button6 {
            fill: var(--dl-color-theme-neutral-light);
            color: var(--dl-color-theme-neutral-light);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            border-width: 0px;
            text-transform: uppercase;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-new-arrivals2 {
            gap: 0;
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: none;
            align-items: flex-start;
            flex-direction: column;
          }
          .catalog-container67 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text218 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
          }
          .catalog-container68 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-color: var(--dl-color-theme-secondary1);
            border-style: solid;
            border-width: 2px;
            border-radius: var(--dl-radius-radius-radius4);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-primary1gradient);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-radius8);
            border-bottom-right-radius: var(--dl-radius-radius-radius8);
          }
          .catalog-container69 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text221 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container70 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text222 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container71 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text223 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-container72 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .catalog-text226 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .catalog-text227 {
            display: inline-block;
          }
          .catalog-text228 {
            display: inline-block;
          }
          .catalog-text229 {
            display: inline-block;
          }
          .catalog-text230 {
            display: inline-block;
          }
          .catalog-text231 {
            display: inline-block;
          }
          .catalog-text232 {
            display: inline-block;
          }
          .catalog-text233 {
            display: inline-block;
          }
          .catalog-text234 {
            display: inline-block;
          }
          .catalog-container73 {
            height: 100%;
          }
          .catalog-container74 {
            flex: 1;
            width: 100%;
            height: 100px;
            display: none;
            align-items: flex-start;
            justify-content: center;
          }
          .catalog-button7 {
            display: none;
          }
          .catalog-contact {
            flex: initial;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
          
          .catalog-container94 {
            flex: 1;
            width: 100%;
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .catalog-container95 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text259 {
            fill: var(--dl-color-theme-secondary1);
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .catalog-container97 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text260 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .catalog-container99 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text261 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .catalog-container101 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .catalog-text262 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .catalog-updates {
            gap: var(--dl-space-space-halfunit);
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
          .catalog-update-header-container1 {
            flex: 0 0 auto;
            width: 100%;
            height: fit-content;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: flex-start;
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text266 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .catalog-text269 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          .catalog-update-card2 {
            width: 100%;
            height: 104px;
            display: flex;
            position: relative;
            align-self: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--dl-color-theme-secondary1);
          }
          .catalog-update-header-container2 {
            flex: 0 0 auto;
            width: 100%;
            height: fit-content;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: flex-start;
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text270 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .catalog-text273 {
            color: var(--dl-color-theme-primary1);
          }
          .catalog-update-card3 {
            width: 100%;
            height: 104px;
            display: flex;
            position: relative;
            align-self: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--dl-color-theme-secondary1);
          }
          .catalog-update-header-container3 {
            flex: 0 0 auto;
            width: 100%;
            height: fit-content;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: flex-start;
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text274 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .catalog-text277 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          .catalog-update-card4 {
            width: 100%;
            height: 104px;
            display: flex;
            position: relative;
            align-self: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--dl-color-theme-secondary1);
          }
          .catalog-update-header-container4 {
            flex: 0 0 auto;
            width: 100%;
            height: fit-content;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-self: flex-start;
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .catalog-text280 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .catalog-text283 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          @media (max-width: 1600px) {
            .catalog-container13 {
              width: 100%;
            }
            .catalog-container14 {
              width: 100%;
              height: 100%;
              border-color: var(--dl-color-theme-secondary2);
              border-width: 0px;
              background-color: var(--dl-color-theme-secondary2);
            }
            .catalog-container25 {
              height: auto;
            }
            .catalog-container27 {
              height: auto;
            }
            .catalog-container29 {
              height: auto;
            }
            .catalog-container94 {
              height: auto;
            }
            .catalog-container98 {
              width: 100%;
            }
            .catalog-container101 {
              height: auto;
            }
          }
          @media (max-width: 1200px) {
            .catalog-container11 {
              top: 0px;
              left: 0px;
              align-self: center;
            }
            .catalog-image2 {
              display: none;
            }
            .catalog-image3 {
              display: flex;
            }
            .catalog-container31 {
              flex-direction: column;
            }
            .catalog-accordion1 {
              width: 100%;
            }
            .catalog-trigger1 {
              display: flex;
            }
            .catalog-accordion2 {
              width: 100%;
              margin: 0px;
            }
            .catalog-accordion3 {
              width: 100%;
              margin: 0px;
            }
            .catalog-summary3 {
              width: 100%;
            }
            .catalog-accordion4 {
              width: 100%;
              margin: 0px;
            }
            .catalog-accordion5 {
              width: 100%;
              margin: 0px;
            }
            .catalog-accordion6 {
              width: 100%;
              margin: 0px;
            }
            .catalog-container94 {
              grid-template-rows: auto;
            }
          }
          @media (max-width: 991px) {
            .catalog-container11 {
              top: 0px;
              left: 0px;
            }
            .catalog-container12 {
              display: none;
            }
            .catalog-text109 {
              color: var(--dl-color-theme-primary2);
            }
            .catalog-text114 {
              text-align: left;
            }
            .catalog-text115 {
              text-align: left;
            }
            .catalog-new-arrivals2 {
              display: flex;
            }
            .catalog-container68 {
              flex: 1;
            }
            .catalog-text259 {
              color: var(--dl-color-theme-secondary1);
              font-size: 30px;
              font-style: normal;
              text-align: left;
              font-weight: 700;
            }
            .catalog-text261 {
              text-align: left;
            }
            .catalog-text262 {
              text-align: left;
            }
            .catalog-text266 {
              height: auto;
              text-align: left;
            }
            .catalog-text270 {
              height: auto;
              text-align: left;
            }
            .catalog-text274 {
              height: auto;
              text-align: left;
            }
            .catalog-text280 {
              height: auto;
              text-align: left;
            }
          }
          @media (max-width: 767px) {
            .catalog-container12 {
              display: none;
            }
            .catalog-updates {
              height: 100%;
            }
            .catalog-text266 {
              height: auto;
            }
            .catalog-text270 {
              height: auto;
            }
            .catalog-text274 {
              height: auto;
            }
            .catalog-text280 {
              height: auto;
            }
          }
          @media (max-width: 479px) {
            .catalog-container11 {
              display: block;
              position: relative;
            }
            .catalog-content1 {
              top: 0px;
              left: 0px;
              width: 271px;
              height: 100%;
              margin: 0px;
              display: none;
              z-index: 100;
              overflow: auto;
              position: absolute;
              background-color: var(--dl-color-theme-primary1);
            }
            .catalog-title {
              display: none;
              flex-direction: column;
            }
            .catalog-container23 {
              float: left;
              flex-direction: row;
            }
            .catalog-container25 {
              float: left;
              flex-direction: row;
            }
            .catalog-container27 {
              float: left;
              flex-direction: row;
            }
            .catalog-container29 {
              float: left;
              flex-direction: row;
            }
            .catalog-container73 {
              width: 100%;
              overflow: auto;
              margin-right: var(--dl-space-space-halfunit);
            }
            .catalog-container74 {
              height: 75px;
              display: flex;
              padding: var(--dl-space-space-unit);
              align-items: center;
              justify-content: space-between;
            }
            .catalog-text235 {
              fill: var(--dl-color-theme-primary2);
              color: var(--dl-color-theme-primary2);
              font-size: 25px;
              font-style: normal;
              font-weight: 700;
            }
            .catalog-button7 {
              float: right;
              width: 30px;
              height: 30px;
              display: block;
              padding: 0px;
              font-size: 1px;
              font-style: normal;
              font-weight: 300;
              border-width: 0px;
              border-radius: 50%;
              background-color: var(--dl-color-theme-primary2);
            }
            .catalog-container94 {
              display: grid;
              background-color: var(--dl-color-theme-primary1);
              grid-template-columns: 50% 50%;
            }
            .catalog-container95 {
              float: left;
              width: 100%;
              flex-direction: row;
            }
            .catalog-text259 {
              font-size: 20px;
            }
            .catalog-container97 {
              float: left;
              flex-direction: row;
            }
            .catalog-text260 {
              font-size: 20px;
            }
            .catalog-container99 {
              float: left;
              flex-direction: row;
            }
            .catalog-text261 {
              font-size: 20px;
            }
            .catalog-container101 {
              float: left;
              flex-direction: row;
            }
            .catalog-text262 {
              font-size: 20px;
            }
            .catalog-updates {
              height: 100%;
            }
          }
        `}
      </style>
    </>

  )
}

export default Catalog

