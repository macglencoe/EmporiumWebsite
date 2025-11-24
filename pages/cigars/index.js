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
import { PiCurrencyDollar, PiCurrencyDollarBold, PiCurrencyDollarFill, PiGauge, PiGaugeBold, PiGaugeFill, PiLeaf, PiLeafBold, PiLeafFill, PiRuler } from 'react-icons/pi'
import { type } from 'jquery'


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

  // All unique wrappers for filtering
  const uniqueWrappers = [...new Set((props.data).map(item => item['Wrapper'].trim()))];

  // All unique strengths for filtering
  const uniqueStrengths = [...new Set((props.data).map(item => item['Strength_Profile'].trim()))];

  // All unique sizes for filtering
  const uniqueSizes = [...new Set(props.data.flatMap(obj => obj.Sizes.map(size => size.Size)))].sort((a, b) => a.localeCompare(b));

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
      <Head>
        <title>Cigar Catalog</title>
      </Head>
      <Catalog
        data={props.data}

        title="Cigar Catalog"
        description="Our selection of cigars from a wide array of premium brands, available for purchase in-store."

        featuredStats={[
          {
            title: `${props.data.length} Cigars`,
            subtitle: "in our catalog",
            description: "We offer the largest selection of premium cigars in Berkeley County, carefully curated for enthusiasts and connoisseurs alike.",
          },
          {
            title: `${uniqueBrands.length} Brands`,
            subtitle: "to choose from",
            description: "Discover cigars from a diverse range of brands, each offering unique flavors and experiences.",
          },
          {
            title: `${uniqueSizes.length} Sizes`,
            subtitle: "available",
            description: "Find cigars in various sizes to suit your preferences, from robustos to churchills and more.",
          },
          
        ]}

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
            router.query['Display Price'] === 'true' && {
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
                item['Wrapper'] && 
                  {
                    icon: PiLeaf,
                    value: item['Wrapper'],
                    label: 'Wrapper',
                    type: 'hidden-label'
                  },
                item['Strength_Profile'] && 
                  {
                    icon: PiGauge,
                    value: item['Strength_Profile'],
                    label: 'Strength',
                    type: 'hidden-label strength-gauge'
                  },
                router.query['Display Price'] === 'true' &&
                item['Price'] &&
                  {
                    label: 'Price',
                    icon: PiCurrencyDollar,
                    value: item['Price'],
                    type: 'hidden-label'
                  },
                item['Sizes'] && item['Sizes'].length > 0 &&
                  {
                    label: 'Sizes',
                    type: 'tags hidden-label',
                    icon: PiRuler,
                    value:
                      item['Sizes']
                        .slice(0, 3)
                        .map(sizeObj => sizeObj.Size)
                        .join(', ')
                        +
                        (item['Sizes'].length > 3 ? ', +' + (item['Sizes'].length - 3) : '')
                },
                item['Flavor_Profile'] &&
                  {
                    label: 'Flavor Notes',
                    value: item['Flavor_Profile'],
                    type: 'tags'
                  },
                
              ]
            )
          },
          href: (item) => {
            return ('/cigars/' + item.slug)
          },
          barcode: (item) => {
            if (router.query['Display Barcode'] === 'true') {
              return (item['Barcode'])
            }
          },
          description: (item) => {
            return (
              item['description']
            )
          },
        }}

      />




    </>

  )
}

export default CigarCatalog

