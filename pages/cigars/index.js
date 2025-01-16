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

  


  // All unique brands for filtering
  const uniqueBrands = [...new Set((props.data).map(item => item['Cigar Brand'].trim()))];

  // All unique sizes for filtering
  const uniqueSizes = Array.from(new Set((props.data).flatMap(item => item['Sizes'])));




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

          cardSettings={{
            title: (item) => {
              return (item['Cigar Brand'] + ' ' + item['Cigar Name'])
            },
            data: (item) => {
              return (
                [item['Wrapper'] && ['Wrapper', item['Wrapper']],
                item['Strength_Profile'] && ['Strength', item['Strength_Profile']]]
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
            }
          }}

        />
        
      </Layout>

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

export default CigarCatalog

