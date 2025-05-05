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
import Layout from '../../components/layout'
import CatalogCard from '../../components/catalogCard'
import Catalog from '../../components/catalog'
import Filters from '../../components/filters'
import setLocalData from '../../utils/setLocalData'


export const getStaticProps = async () => {
  const data = await import('../../public/data/consolidated_cigars.json');
  return {
    props: {
      data: data.default
    },
  };
};

const CigarCatalog = (props) => {

  //CMS


  const [tempData, setTempData] = useState(props.data);
  const [originData, setOriginData] = useState(props.data);

  const pullTempData = () => {
    setTempData(JSON.parse(localStorage.getItem('tempData_cigars')));
  }

  useEffect(() => {
    // pull from localstorage on page load
    if (window !== 'undefined') {
      pullTempData();
      if (localStorage.getItem('originData_cigars')) {
        setOriginData(JSON.parse(localStorage.getItem('originData_cigars')));
      }
    }
  }, []);


  const router = useRouter();

  // All unique brands for filtering
  const uniqueBrands = [...new Set((tempData).map(item => item['Cigar Brand'].trim()))];

  // All unique wrappers for filtering
  const uniqueWrappers = [...new Set((tempData).map(item => item['Wrapper'].trim()))];

  // All unique strengths for filtering
  const uniqueStrengths = [...new Set((tempData).map(item => item['Strength_Profile'].trim()))];

  // All unique sizes for filtering
  const uniqueSizes = [...new Set(tempData.flatMap(obj => obj.Sizes.map(size => size.Size)))].sort((a, b) => a.localeCompare(b));

  const pageSize = 10;
  const totalPages = Math.ceil(tempData.length / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page));
    }
  }, [router.query.page]);

  const currentPageData = tempData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ^^ This all needs to go to Catalog.js :(

  return (
    <>
      <Head>
        <title>Cigar Catalog</title>
      </Head>
      <Catalog
        data={tempData}

        title="Cigar Catalog"
        subtitle="Our selection of cigars from a wide array of premium brands, available for purchase in-store."

        filters={[
          {
            name: "Cigar Brand",
            label: "Brand",
            values: uniqueBrands,
            defaultValue: "All Brands",
          },
          {
            name: "Wrapper",
            label: "Wrapper",
            values: uniqueWrappers,
            defaultValue: "Any Wrapper",
          },
          {
            name: "Strength_Profile",
            label: "Strength",
            values: uniqueStrengths,
            defaultValue: "Any Strength",
          },
          {
            name: "Sizes",
            label: "Size",
            values: uniqueSizes,
            defaultValue: "Any Size",
          }

        ]}
        sortOptions={
          [
            {
              value: "Date Added",
              label: "Newest First"
            },
            {
              value: "Cigar Name",
              label: "Name",
            },
            {
              value: "Sizes",
              label: "Size Options",
              quantity: true,
            },
            {
              value: "Cigar Brand",
              label: "Brand"
            },
            true && {
              value: "Price",
              label: "Price",
            },
          ].filter(Boolean)
        }
        defaultSort="Cigar Name"
        auxiliarySearchBars={[
          router.query['Display Barcode'] === 'true' && {
            label: "Barcode",
            query: "Barcode",
          }
        ]}

        cardSettings={{
          image: (item) => { return (item.image) },

          title: (item) => {
            return (
              item['Cigar Name']
            )
          },
          secondaryTitle: (item) => {
            return (
              item['Cigar Brand']
            )
          },
          data: (item) => {
            return (
              [
                item['Wrapper'] && ['Wrapper', item['Wrapper']],
                item['Strength_Profile'] && ['Strength', item['Strength_Profile']]
              ]
            )
          },
          href: (item) => {
            // Redirect to the "edit new" page for cigars added in this session.
            // This identifies cigars by query parameters because static paths are generated only during the build process.
            if (!originData.some(dataItem => dataItem.slug === item.slug)) {
              return ('/cigars/editnew?slug=' + item.slug)
            }
            return ('/cigars/' + item.slug)
          },
          list: (item) => {
            if (true) {
              return (
                item.Sizes.map(size => {
                  return (
                    <>
                      <li className='card-size'>
                        <div>
                          <span>{size.Size}</span>
                          <span>{size.Price}</span>
                        </div>
                        {size.Barcode && <canvas ref={(canvas) => {
                          if (canvas) {
                            JsBarcode(canvas, size.Barcode, {
                              format: "CODE128",
                              width: 1.5,
                              height: 20,
                              fontSize: 12,
                              background: "transparent",
                              lineColor: router.query['search'] 
                                ? router.query['search'] == size.Barcode 
                                  ? "#48c401" 
                                  : String(size.Barcode).includes(router.query['search']) 
                                    ? "#c4ad01" 
                                    : "#000"
                                : "#000"
                            });
                          }
                        }} />}
                      </li>
                      <style jsx>
                        {`
                        li.card-size {
                          padding: 10px;
                          background-image: linear-gradient(10deg, rgba(0, 0, 0, 0) 00.00%,var(--dl-color-theme-primary1) 300.00%);
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          gap: 10px;
                          list-style-type: none;
                        }
                        li.card-size > div {
                          display: flex;
                          justify-content: space-between;
                          flex-wrap: wrap;
                          gap: 10px;
                        }
                        li.card-size span {
                          font-family: Inter;
                        }
                        li.card-size span:last-child {
                          font-weight: 900;
                        }
                        li.card-size canvas {
                          width: 100%;
                        }
                        `}
                      </style>
                    </>
                  )
                })
              )
            }
          }

        
        }}

      />




    </>

  )
}

export default CigarCatalog

