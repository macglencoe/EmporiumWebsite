import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Data from '../../public/data/consolidated_cigars.json';
import cigarSizes from '../../public/data/cigarsizes.json';

import Head from 'next/head'

import Footer32 from '../../components/footer32'
import Contact from '../../components/contact'
import Directory from '../../components/directory';
import Ksman from '../../components/ksman'
import Link from 'next/link';
import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';

export const getStaticPaths = async () => {
  const cigars = await import('../../public/data/consolidated_cigars.json');
  const data = await cigars.default;
  const paths = data.map((cigar) => ({
    params: { slug: cigar.slug },
  }));
  return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
  const cigarsData = await import('../../public/data/consolidated_cigars.json');
  const data = await cigarsData.default;
  const cigar = data.find((cigar) => cigar.slug === params.slug);

  return { props: { cigar } };
}

const CigarPage = (props) => {
  //const cigar = Data.find((cigar) => cigar.slug === slug);
  const cigar = props.cigar;

  if (!cigar) {
    return <div>Cigar not found</div>;
  }

  // Phone

  let phoneNumber = "3042649130"

  const handlePhoneClick = () => {
    const telUrl = `tel:${phoneNumber.replace(/\D/g, '')}`; // Remove non-digits
    window.location.href = telUrl; // Use window.location.href for direct call
  };

  useEffect(() => {
    // Add cursor pointer for better UX
    const element = document.querySelector('.call-button');
    if (element) {
      element.style.cursor = 'pointer';
    }
  }, []);

  // Location

  let address = "320 W King Street";
  let city = "Martinsburg";
  let state = "West Virginia";

  const handleLocationClick = () => {
    const encodedAddress = encodeURIComponent(`${address}, ${city}, ${state}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let mapUrl;
    if (isMobile) {
      // Use platform-specific maps app links
      if (navigator.userAgent.match(/Android/i)) {
        mapUrl = `geo:0,0?q=${encodedAddress}`; // Android
      } else if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
        mapUrl = `http://maps.apple.com/?q=${encodedAddress}`; // iOS
      } else {
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      }
    } else {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Add cursor pointer for better UX
    const element = document.querySelector('.visit-button');
    if (element) {
      element.style.cursor = 'pointer';
    }
  }, []);

  // cursor pointer for home



  return (
    <>

      <Layout>

        <PageTitle1>Cigar Information</PageTitle1>

        <div className="cigar-page-container33">

          <div className="cigar-page-image-and-size-container">
            <div className="cigar-page-container34">
              {cigar.slug ? (
                <img
                  alt="image"
                  src={`/cigars-img/${cigar.slug}/img.png`}
                  className="cigar-page-image4"
                  onError={(e) => {
                    const brand = encodeURIComponent(cigar["Cigar Brand"]);
                    const name = encodeURIComponent(cigar["Cigar Name"]);
                    e.currentTarget.outerHTML = `<span>No image available</span><a href="https://www.google.com/search?tbm=isch&q=${brand}+${name}" target="_blank" rel="noopener noreferrer">Search Google for images of this cigar</a>`;
                  }}
                />
              ) : (
                <span>No image available</span>
              )}
            </div>
            <div className='cigar-page-available-sizes-container'>
              <span className="cigar-page-available-sizes">Sizes</span>
              {cigar.Sizes.map((size) => (
                <div key={size} className="cigar-page-size-container">
                  <div className='cigar-size-cigar'>
                    <span className="cigar-page-size">{size} </span>
                    {cigarSizes[size] && <span className="cigar-page-size" style={{ opacity: '70%' }}>{cigarSizes[size].join(' x ')} *</span>}
                  </div>
                  <div className='cigar-size-cigar-end'></div>
                </div>
              ))}
              * Size Estimate
            </div>
            <div className='cigar-page-divider'></div>
            {cigar['Flavor_Profile'] && (
              <div className='cigar-flavor-container'>
                <span className="cigar-flavor-label">Flavor</span>
                <span className="cigar-flavor">{cigar['Flavor_Profile']}</span>
              </div>
            )}

          </div>
          <div className="cigar-page-container35">
            <span className="cigar-page-text117">{cigar['Cigar Brand'] + ' ' + cigar['Cigar Name']}</span>
            <div className='cigar-page-divider'></div>
            <div className="cigar-info-container">
              {cigar['Cigar Brand'] && (
                <div className="cigar-page-container37">
                  <span className="cigar-page-text118">Brand</span>
                  <span className="cigar-page-text119">{cigar['Cigar Brand']}</span>
                </div>
              )}
              {cigar['Wrapper'] && (
                <div className="cigar-page-container37">
                  <span className="cigar-page-text118">Wrapper</span>
                  <span className="cigar-page-text119">{cigar['Wrapper']}</span>
                </div>
              )}
              {cigar['Binder'] && (
                <div className="cigar-page-container37">
                  <span className="cigar-page-text118">Binder</span>
                  <span className="cigar-page-text119">{cigar['Binder']}</span>
                </div>
              )}
              {cigar['Filler'] && (
                <div className="cigar-page-container37">
                  <span className="cigar-page-text118">Filler</span>
                  <span className="cigar-page-text119">{cigar['Filler']}</span>
                </div>
              )}
              {cigar['Strength_Profile'] && (
                <div className="cigar-page-container37">
                  <span className="cigar-page-text118">Strength</span>
                  <span className="cigar-page-text119">{cigar['Strength_Profile']}</span>
                </div>
              )}


            </div>
            <div className='call-or-visit-container'>
              <button className='call-button' onClick={() => handlePhoneClick()}><span>Call for availability</span></button>
              <button className='visit-button' onClick={() => handleLocationClick()}><span>Visit the store</span></button>
            </div>
          </div>
        </div>
        <p style={{ width: '100%', textAlign: 'center' }}>Disclaimer: Availability is subject to change. Please call during open hours to confirm availability. No online sales</p>
        <div className="cigar-page-container43">
          <div className="cigar-page-divider"></div>
          {cigar['Description'] && (
            <span className="cigar-page-text152">{cigar['Description']}</span>
          )}

        </div>
        
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
          .call-or-visit-container {
            display: flex;
            flex-direction: column;
            align-items: end;
            justify-content: center;
            width: 100%;
            height: 100%;
            gap: 15px;
            padding: 10px;
          }
          
          .call-or-visit-container > button {
            background-color: var(--dl-color-theme-secondary2);
            padding: 10px;
             -moz-transition: all .2s ease-in;
            -o-transition: all .2s ease-in;
            -webkit-transition: all .2s ease-in;
            
          }
          
          .call-or-visit-container > button:hover {
            background: var(--dl-color-theme-primary2);
          }
          
          .call-or-visit-container > button > span {
            color: var(--dl-color-theme-primary1);
            font-weight: bold;
            font-size: 20px;
          }

          .cigar-page-image-and-size-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: 100%;
          }
          
          .cigar-page-available-sizes-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            border-left: 5px solid var(--dl-color-theme-secondary2);
            
            border-bottom: 3px solid var(--dl-color-theme-secondary2);
            
            border-bottom-left-radius: 10px;
            padding-top: 6px;
            padding-bottom: 10px;
          }

          .cigar-page-available-sizes {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
            padding-left: 10px;
          }

          .cigar-page-size-container {
            display: flex;
            flex-direction: row;
          }

          .cigar-size-cigar {
            padding: 5px;
            background: var(--dl-color-theme-secondary2);
          }

          .cigar-page-size {
            font-size: 18px;
            font-weight: 500;
            color: var(--dl-color-theme-primary2);
          }

          .cigar-size-cigar-end {
            background: var(--dl-color-theme-secondary2);
            width: 20px;
            border-bottom-right-radius: 50%;
            border-top-right-radius: 50%;
          }


          .cigar-page-divider {
            background-color: var(--dl-color-theme-secondary2);
            width: 100%;
            height: 10px;
            min-height: 10px;
          }

          .cigar-info-container {
            gap: var(--dl-space-space-unit);
            flex: 1;
            width: 100%;
            height: auto;
            display: grid;
            padding: var(--dl-space-space-halfunit);
            place-items: start;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            border-top: 3px solid var(--dl-color-theme-secondary2);
            border-left: 5px solid var(--dl-color-theme-secondary2);
            border-top-left-radius: 10px;
          }

          .cigar-flavor-container {
            display: flex;
            flex-direction: column;
            border-top: 3px solid var(--dl-color-theme-secondary2);
            border-left: 5px solid var(--dl-color-theme-secondary2);
            border-top-left-radius: 10px;
            height: 100%;
            padding-top: 6px;
            max-width: 240px;
            
          }

          .cigar-flavor-label {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
            padding-left: 10px;
          }

          .cigar-flavor {
            font-size: 18px;
            font-weight: 500;
            padding-left: 10px;
            text-transform: uppercase;
            width: auto;
          }


          .cigar-page-container10 {
            width: 100%;
            display: flex;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .cigar-page-container11 {
            top: 0px;
            flex: 1;
            left: 0px;
            height: 100%;
            overflow: scroll;
            position: absolute;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-container12 {
            height: 100%;
            align-self: flex-start;
          }
          .cigar-page-container13 {
            flex: 0 0 auto;
            width: 99%;
            display: flex;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary2);
          }
          .cigar-page-image1 {
            width: 100%;
            object-fit: cover;
          }
          .cigar-page-container14 {
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
          .cigar-page-new-arrivals1 {
            gap: 0;
            flex: 1;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-container15 {
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
          .cigar-page-text100 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container16 {
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
          .cigar-page-container17 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text103 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container18 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text104 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container19 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text105 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container20 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text108 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-content {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            align-self: flex-start;
          }
          .cigar-page-title {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-secondary1);
          }
          .cigar-page-text109 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            align-self: center;
            text-align: center;
          }
          .cigar-page-container21 {
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-image2 {
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
          .cigar-page-container22 {
            position: relative;
          }
          .cigar-page-image3 {
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
          .cigar-page-container23 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text112 {
            fill: var(--dl-color-theme-secondary1);
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .cigar-page-container25 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text113 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .cigar-page-container27 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text114 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .cigar-page-container29 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text115 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-end;
            font-style: normal;
            text-align: right;
            font-weight: 700;
          }
          .cigar-page-container31 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            height: 64px;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: center;
            background-color: var(--dl-color-theme-secondary2);
          }
          .cigar-page-text116 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container32 {
            flex: 1;
            width: 100%;
            height: 10px;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-container33 {
            gap: var(--dl-space-space-unit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: flex-start;
          }
          .cigar-page-container34 {
            flex: 0 0 auto;
            width: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            justify-content: center;
            border-color: var(--dl-color-theme-secondary2);
            border-width: 1px;
            border-radius: var(--dl-radius-radius-radius4);
            background-image: var(--dl-gradient-gradients-secondary2gradient);
            max-width: 240px;
            display:flex;
            flex-direction: column;
          }
          .cigar-page-container34 a {
            font-size: 20px;
            text-decoration: underline;
            }
          .cigar-page-image4 {
            width: 200px;
            object-fit: cover;
          }
          .cigar-page-container35 {
            gap: var(--dl-space-space-halfunit);
            flex: 1;
            width: auto;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: flex-start;
            flex-direction: column;
            height: 100%;
          }
          .cigar-page-text117 {
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-select {
            font-size: 30px;
          }
          .cigar-page-container36 {
            gap: var(--dl-space-space-unit);
            flex: 1;
            width: 100%;
            height: auto;
            display: grid;
            padding: var(--dl-space-space-halfunit);
            place-items: start;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          .cigar-page-container37 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text118 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text119 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container38 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text122 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text125 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container39 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text128 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text131 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container40 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text134 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text137 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container41 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text140 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text143 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container42 {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-text146 {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cigar-page-text149 {
            font-size: 25px;
            text-transform: uppercase;
          }
          .cigar-page-container43 {
            gap: var(--dl-space-space-twounits);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-twounits);
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-container44 {
            flex: 0 0 auto;
            width: 100%;
            height: 10px;
            display: flex;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary2);
          }
          .cigar-page-text152 {
            margin: var(--dl-space-space-halfunit);
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 1.5;
          }
          .cigar-page-new-arrivals2 {
            gap: 0;
            flex: 0 0 auto;
            width: 100%;
            height: 100%;
            display: none;
            align-items: flex-start;
            flex-direction: column;
          }
          .cigar-page-container45 {
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
          .cigar-page-text153 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container46 {
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
          .cigar-page-container47 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text156 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container48 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text157 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container49 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text158 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-container50 {
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-image: var(--dl-gradient-gradients-secondary2gradient);
          }
          .cigar-page-text161 {
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
          }
          .cigar-page-text162 {
            display: inline-block;
          }
          .cigar-page-text163 {
            display: inline-block;
          }
          .cigar-page-text164 {
            display: inline-block;
          }
          .cigar-page-text165 {
            display: inline-block;
          }
          .cigar-page-text166 {
            display: inline-block;
          }
          .cigar-page-text167 {
            display: inline-block;
          }
          .cigar-page-text168 {
            display: inline-block;
          }
          .cigar-page-text169 {
            display: inline-block;
          }
          .cigar-page-container51 {
            height: 100%;
          }
          .cigar-page-container52 {
            flex: 1;
            width: 100%;
            height: 100px;
            display: none;
            align-items: flex-start;
            justify-content: center;
          }
          .cigar-page-button {
            display: none;
          }
          .cigar-page-contact {
            flex: initial;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
          .cigar-page-container53 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            flex-direction: column;
            background-color: #836653;
          }
          .cigar-page-container54 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            height: var(--dl-size-size-small);
            display: flex;
            position: relative;
            align-items: center;
            border-color: var(--dl-color-theme-primary1);
            border-style: solid;
            border-width: px;
            border-radius: var(--dl-radius-radius-radius8);
            background-color: var(--dl-color-theme-secondary1);
          }
          .cigar-page-container55 {
            flex: 0 0 auto;
            width: var(--dl-size-size-small);
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: var(--dl-radius-radius-radius4);
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
            border-top-left-radius: var(--dl-radius-radius-radius8);
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-radius8);
            border-bottom-right-radius: 0;
          }
          .cigar-page-icon1 {
            width: 75%;
            height: 75%;
          }
          .cigar-page-container56 {
            width: 100%;
            height: auto;
            display: flex;
            align-items: center;
            padding-top: var(--dl-space-space-halfunit);
            padding-right: var(--dl-space-space-halfunit);
            padding-bottom: var(--dl-space-space-halfunit);
            justify-content: flex-end;
          }
          .cigar-page-text171 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            width: auto;
            height: 100%;
            font-size: 15px;
            font-style: normal;
            text-align: right;
            font-weight: 500;
          }
          .cigar-page-hours {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            border-radius: var(--dl-radius-radius-radius8);
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary1);
          }
          .cigar-page-container57 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: grid;
            grid-gap: 2px;
            border-color: var(--dl-color-theme-secondary1);
            border-width: 2px;
            background-color: var(--dl-color-theme-secondary1);
            grid-template-columns: auto auto auto auto auto auto auto;
          }
          .cigar-page-container58 {
            grid-column: 1;
          }
          .cigar-page-text176 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container59 {
            grid-column: 2;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text177 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container60 {
            flex: initial;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text178 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container61 {
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text179 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container62 {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text180 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container63 {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text181 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container64 {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
          }
          .cigar-page-text182 {
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container65 {
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            padding-left: var(--dl-space-space-unit);
            padding-right: var(--dl-space-space-unit);
            justify-content: space-between;
          }
          .cigar-page-text183 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-text184 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-text187 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-container66 {
            gap: var(--dl-space-space-halfunit);
            flex: 0 0 auto;
            width: 100%;
            height: auto;
            display: flex;
            align-self: flex-start;
            align-items: flex-start;
            justify-content: flex-start;
          }
          .cigar-page-container67 {
            flex: 1;
            width: auto;
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: var(--dl-radius-radius-radius4);
            justify-content: center;
            background-image: linear-gradient(
              270deg,
              rgba(232, 168, 21, 0) 0%,
              rgb(232, 168, 21) 98%
            );
          }
          .cigar-page-text188 {
            color: var(--dl-color-theme-primary2);
            font-style: normal;
            font-weight: 700;
          }
          .cigar-page-text189 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            font-size: 25px;
            font-style: normal;
            text-align: center;
            font-weight: 700;
          }
          .cigar-page-container68 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            height: var(--dl-size-size-small);
            display: flex;
            position: relative;
            align-items: center;
            border-color: var(--dl-color-theme-primary1);
            border-style: solid;
            border-width: px;
            border-radius: var(--dl-radius-radius-radius8);
            background-color: var(--dl-color-theme-secondary1);
          }
          .cigar-page-container69 {
            flex: 0 0 auto;
            width: var(--dl-size-size-small);
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: var(--dl-radius-radius-radius4);
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
            border-top-left-radius: var(--dl-radius-radius-radius8);
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-radius8);
            border-bottom-right-radius: 0;
          }
          .cigar-page-icon3 {
            width: 75%;
            height: 75%;
          }
          .cigar-page-text192 {
            color: var(--dl-color-theme-primary2);
            width: auto;
            font-size: 20px;
            font-style: normal;
            text-align: left;
            font-weight: 500;
          }
          .cigar-page-container70 {
            gap: var(--dl-space-space-unit);
            width: 100%;
            height: var(--dl-size-size-small);
            display: flex;
            position: relative;
            align-items: center;
            border-color: var(--dl-color-theme-primary1);
            border-style: solid;
            border-width: px;
            border-radius: var(--dl-radius-radius-radius8);
            background-color: var(--dl-color-theme-secondary1);
          }
          .cigar-page-container71 {
            flex: 0 0 auto;
            width: var(--dl-size-size-small);
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: var(--dl-radius-radius-radius4);
            justify-content: center;
            background-color: var(--dl-color-theme-primary1);
            border-top-left-radius: var(--dl-radius-radius-radius8);
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-radius8);
            border-bottom-right-radius: 0;
          }
          .cigar-page-icon5 {
            width: 75%;
            height: 75%;
          }
          .cigar-page-text193 {
            color: var(--dl-color-theme-primary2);
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          .cigar-page-container72 {
            flex: 1;
            width: 100%;
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .cigar-page-container73 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text194 {
            fill: var(--dl-color-theme-secondary1);
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .cigar-page-container75 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text195 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .cigar-page-container77 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text196 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .cigar-page-container79 {
            width: auto;
            padding: var(--dl-space-space-halfunit);
            position: relative;
            border-width: 0px;
          }
          .cigar-page-text197 {
            color: var(--dl-color-theme-secondary1);
            font-size: 30px;
            align-self: flex-start;
            font-style: normal;
            text-align: left;
            font-weight: 700;
          }
          .cigar-page-updates {
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
          .cigar-page-update-header-container1 {
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
          .cigar-page-text201 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .cigar-page-text204 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          .cigar-page-update-card2 {
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
          .cigar-page-update-header-container2 {
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
          .cigar-page-text205 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .cigar-page-text208 {
            color: var(--dl-color-theme-primary1);
          }
          .cigar-page-update-card3 {
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
          .cigar-page-update-header-container3 {
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
          .cigar-page-text209 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .cigar-page-text212 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          .cigar-page-update-card4 {
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
          .cigar-page-update-header-container4 {
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
          .cigar-page-text215 {
            fill: var(--dl-color-theme-primary2);
            color: var(--dl-color-theme-primary2);
            height: auto;
            font-size: 1.2em;
            line-height: 1;
          }
          .cigar-page-text218 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
          }
          @media (max-width: 1600px) {
            .cigar-page-container13 {
              width: 100%;
            }
            .cigar-page-container14 {
              width: 100%;
              height: 100%;
              border-color: var(--dl-color-theme-secondary2);
              border-width: 0px;
              background-color: var(--dl-color-theme-secondary2);
            }
            .cigar-page-container25 {
              height: auto;
            }
            .cigar-page-container27 {
              height: auto;
            }
            .cigar-page-container29 {
              height: auto;
            }
            .cigar-page-container72 {
              height: auto;
            }
            .cigar-page-container76 {
              width: 100%;
            }
            .cigar-page-container79 {
              height: auto;
            }
          }
          @media (max-width: 1200px) {
            .cigar-page-container11 {
              top: 0px;
              left: 0px;
              align-self: center;
            }
            .cigar-page-image2 {
              display: none;
            }
            .cigar-page-image3 {
              display: flex;
            }
            .cigar-page-container72 {
              grid-template-rows: auto;
            }
          }
          @media (max-width: 991px) {
            .cigar-page-container11 {
              top: 0px;
              left: 0px;
            }
            .cigar-page-container12 {
              display: none;
            }
            .cigar-page-text109 {
              color: var(--dl-color-theme-primary2);
            }
            .cigar-page-text114 {
              text-align: left;
            }
            .cigar-page-text115 {
              text-align: left;
            }
            .cigar-page-new-arrivals2 {
              display: flex;
            }
            .cigar-page-container46 {
              flex: 1;
            }
            .cigar-page-text194 {
              color: var(--dl-color-theme-secondary1);
              font-size: 30px;
              font-style: normal;
              text-align: left;
              font-weight: 700;
            }
            .cigar-page-text196 {
              text-align: left;
            }
            .cigar-page-text197 {
              text-align: left;
            }
            .cigar-page-text201 {
              height: auto;
              text-align: left;
            }
            .cigar-page-text205 {
              height: auto;
              text-align: left;
            }
            .cigar-page-text209 {
              height: auto;
              text-align: left;
            }
            .cigar-page-text215 {
              height: auto;
              text-align: left;
            }
          }
          @media (max-width: 767px) {
            .cigar-page-container12 {
              display: none;
            }
            .cigar-page-updates {
              height: 100%;
            }
            .cigar-page-text201 {
              height: auto;
            }
            .cigar-page-text205 {
              height: auto;
            }
            .cigar-page-text209 {
              height: auto;
            }
            .cigar-page-text215 {
              height: auto;
            }
          }
          @media (max-width: 680px) {
            .cigar-page-image4 {
              width: 130px;
            }
            .cigar-page-container34 {
              padding: 5px;

            }
            .cigar-page-text117 {
              font-size: 30px;
            }
          }
          @media (max-width: 479px) {
            .cigar-page-container11 {
              display: block;
              position: relative;
            }
            .cigar-page-content {
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
            .cigar-page-title {
              display: none;
              flex-direction: column;
            }
            .cigar-page-container23 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-container25 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-container27 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-container29 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-container51 {
              width: 100%;
              overflow: auto;
              margin-right: var(--dl-space-space-halfunit);
            }
            .cigar-page-container52 {
              height: 75px;
              display: flex;
              padding: var(--dl-space-space-unit);
              align-items: center;
              justify-content: space-between;
            }
            .cigar-page-text170 {
              fill: var(--dl-color-theme-primary2);
              color: var(--dl-color-theme-primary2);
              font-size: 25px;
              font-style: normal;
              font-weight: 700;
            }
            .cigar-page-button {
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
            .cigar-page-container72 {
              display: grid;
              background-color: var(--dl-color-theme-primary1);
              grid-template-columns: 50% 50%;
            }
            .cigar-page-container73 {
              float: left;
              width: 100%;
              flex-direction: row;
            }
            .cigar-page-text194 {
              font-size: 20px;
            }
            .cigar-page-container75 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-text195 {
              font-size: 20px;
            }
            .cigar-page-container77 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-text196 {
              font-size: 20px;
            }
            .cigar-page-container79 {
              float: left;
              flex-direction: row;
            }
            .cigar-page-text197 {
              font-size: 20px;
            }
            .cigar-page-updates {
              height: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default CigarPage;

