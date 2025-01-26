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


export const getStaticProps = async () => {
  const data = await import('../../public/data/consolidated_cigars.json');
  return {
    props: {
      data: data.default
    },
  };
};

const CigarCatalog = (props) => {


  const router = useRouter();

  // All unique brands for filtering
  const uniqueBrands = [...new Set((props.data).map(item => item['Cigar Brand'].trim()))];

  // All unique sizes for filtering
  const uniqueSizes = Array.from(new Set((props.data).flatMap(item => item['Sizes'])));

  const pageSize = 10;
  const totalPages = Math.ceil(props.data.length / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page));
    }
  }, [router.query.page]);

  const currentPageData = props.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ^^ This all needs to go to Catalog.js :(

  return (
    <>
      <Layout>
        <Catalog
          data={props.data}
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
              values: ["Maduro", "Natural", "Oscuro"],
              defaultValue: "Any Wrapper",
            },
            {
              name: "Strength_Profile",
              label: "Strength",
              values: ["Mild", "Mild-Medium", "Medium", "Medium-Full", "Full"],
              defaultValue: "Any Strength",
            },
            {
              name: "Size",
              label: "Size",
              values: uniqueSizes,
              defaultValue: "Any Size",
              flatmap: "Sizes",
            }

          ]}
          sortOptions={[
            {
              value: "Cigar Name",
              label: "Name",
            },
            {
              value: "Sizes",
              label: "Size Options",
              quantity: true,
            }
          ]}
          defaultSort="Cigar Name"
          auxiliarySearchBars={[
            router.query['Display Barcode'] === 'true' && {
              label: "Barcode",
              query: "Barcode",
            }
          ]}

          cardSettings={{
            image: (item) => { return ('/cigars-img/' + item.slug + '/img.png') },
            title: (item) => {
              return (item['Cigar Brand'] + ' ' + item['Cigar Name'])
            },
            data: (item) => {
              return (
                [
                  item['Wrapper'] && ['Wrapper', item['Wrapper']],
                  item['Strength_Profile'] && ['Strength', item['Strength_Profile']],
                  router.query['Display Price'] === 'true' &&
                  item['Price'] &&
                  ['Price', item['Price']]
                ]
              )
            },
            href: (item) => {
              return ('/cigars/' + item.slug)
            },
            buttonText: (item) => {
              return (
                item.Sizes.length > 1 ?
                  item.Sizes.length + ' Sizes Available' :
                  item.Sizes[0])
            },
            barcode: (item) => {
              if (router.query['Display Barcode'] === 'true') {
                return (item['Barcode'])
              }
            }
          }}

        />



      </Layout>

      
    </>

  )
}

export default CigarCatalog

