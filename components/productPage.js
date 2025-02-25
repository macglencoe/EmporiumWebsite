import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Data from '../public/data/consolidated_cigars.json';
import cigarSizes from '../public/data/cigarsizes.json';

import Head from 'next/head'

import Footer32 from '/components/footer32'
import Contact from '/components/contact'
import Directory from '/components/directory';
import Ksman from '/components/ksman'
import Link from 'next/link';
import Layout from '/components/layout';
import PageTitle1 from '/components/pagetitle1';
import { handleLocationClick } from '../utils/location';
import { handlePhoneClick } from '../utils/phone';

export const StringBubbleList = (props) => {
    return (
        <>
            <div className='main-container'>
                <h2>{props.title}</h2>
                <div className='bbl-container'>

                    {props.data.map(item =>
                        <span key={item}>{item}</span>
                    )}
                </div>
            </div>
            <style jsx>
                {`
                .main-container {
                    padding: 0.5em;
                    border-left: 5px solid var(--dl-color-theme-secondary2);
                    border-bottom: 3px solid var(--dl-color-theme-secondary2);
                    border-bottom-left-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5em;
                    max-width: min-content;
                }
                .bbl-container {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    gap: 0.5em;
                }
                .bbl-container span {
                    background-color: var(--dl-color-theme-secondary2);
                    color: var(--dl-color-theme-primary2);
                    padding: 0.5em;
                    border-radius: 0.3em;
                    font-weight: 600;
                }
                h2 {
                    text-transform: uppercase;
                }
                `}
            </style>
        </>
    )
}
export const ProductImage = (props) => {
    return (
        <>
            <div>
                {props.hasImage ? (
                    <img
                        alt="image"
                        src={props.src}
                        className="cigar-page-image4"
                        onError={(e) => {
                            e.currentTarget.outerHTML = `<span>No image available</span><a href="https://www.google.com/search?tbm=isch&q=${props.fallbackSearch}" target="_blank" rel="noopener noreferrer">Search Google for images of this product</a>`;
                        }}
                    />
                ) : (
                    <span>No image available</span>
                )}
            </div>
            <style jsx>
                {`
        div {
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
        div a {
            font-size: 20px;
            text-decoration: underline;
            }
        img {
            width: 200px;
        }
        @media (max-width: 680px) {
            div {
              padding: 5px;
            }
            img {
              width: 130px;
            }
            
          }
                `}
            </style>
        </>
    )
}

export const ProductSideContent = (props) => {
    const childrenArray = React.Children.toArray(props.children);
    return (
        <>
            <div>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        {index < props.children.length - 1 &&
                            index > 0 &&
                            <Divider />}
                    </React.Fragment>
                ))}
            </div>
            <style jsx>
                {`
                div {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    height: 100%;
                }
                `}
            </style>
        </>
    )
}

export const ProductBasicInfo = (props) => {
    return (
        <>
            {props.value &&
                <div className='cigar-flavor-container'>
                    <span className="cigar-flavor-label">{props.label}</span>
                    <span className="cigar-flavor">{props.value}</span>
                </div>
            }
            <style jsx>
                {`
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
                `}
            </style>
        </>
    )
}

export const ProductSizeChart = (props) => {
    return (
        <>
            <div className='cigar-page-available-sizes-container'>
                <span className="cigar-page-available-sizes">Sizes</span>
                {props.sizes.map((size) => (
                    <div key={size} className="cigar-page-size-container">
                        <div className='cigar-size-cigar'>
                            <span className="cigar-page-size">{size} </span>
                            {props.allCigarSizes && props.allCigarSizes[size] && <span className="cigar-page-size" style={{ opacity: '70%' }}>{props.allCigarSizes[size].join(' x ')} *</span>}
                        </div>
                        <div className='cigar-size-cigar-end'></div>
                    </div>
                ))}
                * Size Estimate
            </div>
            <style jsx>
                {`
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
        @media (max-width: 680px) {
            .cigar-page-size {
              font-size: 13px;
            }
        }
                `}
            </style>
        </>
    )
}

export const ProductMainContent = (props) => {
    const childrenArray = React.Children.toArray(props.children);
    return (
        <>
            <div>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        {index < props.children.length - 2 &&
                            <Divider />}
                    </React.Fragment>
                ))}
            </div>
            <style jsx>
                {`
                div {
                    gap: var(--dl-space-space-halfunit);
                    flex: 1;
                    width: auto;
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    height: 100%;
                }
                
                `}
            </style>
        </>
    )
}

export const ProductTitle = (props) => {
    return (
        <>
            <span>{props.children}</span>
            <style jsx>
                {`
        span {
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
        @media (max-width: 680px) {
            span {
                font-size: 20px;
            }
        }
            `}
            </style>
        </>
    )
}

export const ProductInfoFields = (props) => {
    return (
        <>
            <div className='cigar-info-container'>
                {props.fields && props.fields.map((field) => (
                    (field.value &&
                        <div key={field.name} className='field-container'>
                            <span className='field-name'>{field.name}</span>
                            <span className='field-value'>{field.value}</span>
                        </div>
                    )
                ))}
            </div>
            <style jsx>
                {`
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
        .field-container {
            flex: 0 0 auto;
            width: auto;
            height: auto;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
          .field-name {
            font-size: 30px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
          }
          .field-value {
            font-size: 25px;
            text-transform: uppercase;
          }
          @media (max-width: 680px) {
              .field-name {
                  font-size: 20px;
              }
              .field-value {
                  font-size: 15px;
              }
              .cigar-info-container {
                  grid-template-columns: auto;
              }
          }
            `}
            </style>
        </>
    )
}

export const ProductCallOrVisitButtons = (props) => {



    return (
        <>
            <div className='call-or-visit-container'>
                <button className='call-button' onClick={() => handlePhoneClick()}><span>Call for availability</span></button>
                <button className='visit-button' onClick={() => handleLocationClick()}><span>Visit the store</span></button>
            </div>
            <style jsx>
                {`
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
            cursor: pointer;
            
          }
          
          .call-or-visit-container > button:hover {
            background: var(--dl-color-theme-primary2);
          }
          
          .call-or-visit-container > button > span {
            color: var(--dl-color-theme-primary1);
            font-weight: bold;
            font-size: 20px;
          }
                `}
            </style>
        </>
    )
}

export const Divider = (props) => {
    return (
        <>
            <div />
            <style jsx>
                {`
            div {
            background-color: var(--dl-color-theme-secondary2);
            width: 100%;
            height: 10px;
            min-height: 10px;
          }
            `}
            </style>
        </>
    )
}

export const Disclaimer = (props) => {
    return (
        <>
            <p style={{ width: '100%', textAlign: 'center' }}>Disclaimer: Availability is subject to change. Please call during open hours to confirm availability. No online sales</p>
        </>
    )
}

const ProductPage = (props) => {
    return (
        <>
            <div className='content-dashboard-container'>
                {props.children}
            </div>
            <Divider />
            {props.description &&
                <div className='description-container' aria-label='product description'>
                    <div aria-hidden><span>i</span></div>
                    <p>{props.description}</p>
                </div>}

            <style jsx>
                {`
        .content-dashboard-container {
            gap: var(--dl-space-space-unit);
            flex: 0 0 auto;
            width: 100%;
            display: flex;
            padding: var(--dl-space-space-unit);
            align-items: flex-start;
          }
        .description-container {
            padding: 5px;
            margin: 10px;
            background-color: var(--dl-color-theme-primary2);
            border-radius: 10px;
            position: relative;
            overflow: hidden;
        }
        .description-container > p {
            margin: 10px;
            font-size: 1.2em;
            line-height: 2em;
            text-indent: 2em;
          }
        .description-container > div:first-child {
            position: absolute;
            top: 0;
            left: 0;
            width: 2em;
            background-color: var(--dl-color-theme-secondary2);
            height: 2em;
            border-bottom-right-radius: 50%;
            align-items: center;
            justify-content: center;
            display: flex;
        }
        .description-container > div:first-child > span {
            color: var(--dl-color-theme-primary1);
            font-family: monospace;
            font-weight: bold;
        }
        @media (max-width: 680px) {
            .description-container > p {
                font-size: 1em;
                line-height: 1.8em;
              }
        }
        `}
            </style>
        </>
    );
};

export default ProductPage;

