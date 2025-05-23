import React, { Fragment, useState, useEffect, useRef } from 'react'
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

export const PodcastLink = ({ url }) => {
    return (
        <>
            <div>
                <h2>The Stick Figures</h2>
                <b>This cigar was featured on an episode of our podcast!</b>
                {url.includes('<iframe') && <iframe src={url.match(/src="([^"]*)"/)[1]} frameBorder="0" height="200px" width="100%"></iframe>}
                {!url.includes('<iframe') && <>
                    <p>Listen to the episode: </p>
                    <a href={url} target="_blank" rel="noreferrer">The Stick Figures Podcast</a>
                </>}
            </div>
            <style jsx>
                {`
div {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
    align-items: center;
}
b {
    font-family: Inter;
    text-align: center;
}
iframe {
    max-width: 600px;
}
a {
    font-style: italic;
    font-size: 2em;
    text-decoration: underline;
}
a:hover {
    translate: 0px -5px;
    scale: 1.2;
}
                `}
            </style>
        </>
    )
}

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
    const router = useRouter();

    return (
        <>
            <div className={props.src ? "" : "no-image"}>
                {props.src ? (
                    <img
                        alt="image"
                        src={props.src}
                    />
                ) : (
                    <span>No image available.<br></br><a href={"https://www.google.com/search?tbm=isch&q=" + props.fallbackSearch} target="_blank" rel="noopener noreferrer">Click to earch Google for images of this product</a></span>
                )}
            </div>
            <style jsx>
                {`
        div {
            flex: 0 0 auto;
            width: min-content;
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
        div.no-image {
            align-items: center;
            text-align: center;
            width: auto;
        }
        div.no-image span {
            color: var(--dl-color-theme-secondary1);
            font-weight: 500;
            font-size: 0.9em;
        }
        div.no-image a {
            font-weight: bold;
        }
        div a {
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
                    width: min-content;
                    align-items: stretch;
                }
                `}
            </style>
        </>
    )
}

export const Navigation = (props) => {
    return (
        <>
            <nav>
                <ul>
                    {props.prev && props.prev[props.nameField] &&
                        <li>
                            <Link href={".." + props.href + "/" + props.prev.slug} >
                                <a className="prev" aria-label='Previous' tabIndex={0}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="33px" viewBox="0 -960 960 960" width="33px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
                                        <span>{props.prev[props.nameField]}</span>
                                    </div>
                                </a>
                            </Link>
                        </li>
                    }

                    {props.next && props.next[props.nameField] &&
                        <li>
                            <Link href={".." + props.href + "/" + props.next.slug} >
                                <a className="next" aria-label='Next' tabIndex={0}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            height="33px"
                                            viewBox="0 -960 960 960"
                                            width="33px"
                                        ><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
                                        <span>{props.next[props.nameField]}</span>

                                    </div>
                                </a>
                            </Link>
                        </li>}
                </ul>
            </nav>


            <style jsx>
                {`
                nav {
                    width: 100%;
                    justify-content: center;
                    gap: 20px;
                    padding: 20px 0px;
                }
                ul {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: stretch;
                    justify-content: center;
                    gap: 20px;
                    list-style-type: none;
                }
                a div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 10px;
                    padding: 10px;
                    background-color: var(--dl-color-theme-primary2);
                    background-image: linear-gradient(45deg, rgba(0, 0, 0, 0) 0.00%,var(--dl-color-theme-primary1) 200.00%);
                    border-radius: 10px;
                    width: 100px;
                    height: 100%;
                    transition: all 0.3s ease-out;
                }
                a div span {
                    text-align: center;
                    width: min-content;
                }
                a div svg {
                    fill: var(--dl-color-theme-secondary1);
                    transition: transform 0.1s ease-out;
                }
                a.next:hover div, a.next:focus div {
                    box-shadow: -5px 0px 5px -2px rgba(0, 0, 0, 0.5);
                    transform:perspective(600px) rotate3d(0, 1, 0, 30deg);
                }
                a.prev:hover div, a.prev:focus div {
                    box-shadow: 5px 0px 5px -2px rgba(0, 0, 0, 0.5);
                    transform:perspective(600px) rotate3d(0, 1, 0, -30deg);
                }
                a:hover span, a:focus span {
                    text-decoration: underline;
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
                            <span className="cigar-page-size">{size.Size} </span>
                            {size["In_Stock"] && <span className="in stock" style={{ fontSize: '10px' }}>{"In Stock"}</span>}
                            {!size["In_Stock"] && <span className="out stock" style={{ fontSize: '10px' }}>{"Out of Stock"}</span>}
                            {props.allCigarSizes && props.allCigarSizes[size.Size] && <span className="cigar-page-size" style={{ opacity: '70%', fontSize: '10px' }}>{props.allCigarSizes[size.Size].join(' x ')} *</span>}
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
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
          }

          .cigar-page-size {
            font-size: 18px;
            font-weight: 500;
            font-family: 'Inter';
            color: var(--dl-color-theme-primary2);
            white-space: nowrap;
          }
          .stock {
            font-size: 18px;
            font-weight: 700;
            font-family: Inter;
            color: var(--dl-color-theme-secondary2);
            white-space: nowrap;
            background-color: var(--dl-color-theme-primary2);
            padding: 0.1em 0.4em;
            border-radius: 5px;
          }
          .in.stock {
            border-left: 5px solid var(--positive);
          }
          .stock.out {
            border-left: 5px solid var(--negative);
          }

          .cigar-size-cigar-end {
            background: var(--dl-color-theme-secondary2);
            width: 30px;
            min-width: 30px;
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
                            {
                                field.markout !== field.value &&
                                <strike className='field-markout'>{field.markout}</strike>
                            }
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
            white-space: nowrap;
            
          }
          
          .call-or-visit-container > button:hover {
            background: var(--dl-color-theme-primary2);
          }
          
          .call-or-visit-container > button > span {
            color: var(--dl-color-theme-primary1);
            font-weight: bold;
            font-size: 20px;
          }
          
          @media (max-width: 680px) {
            .call-or-visit-container > button > span {
              font-size: 15px;
            }
          }
                `}
            </style>
        </>
    )
}

export const InteractionPanel = (props) => {
    const router = useRouter();
    return (
        <>
            <div className='interaction-panel'>
                <button className='call-button' onClick={() => handlePhoneClick()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M777.12-99q-133.22-9-252.17-63.5Q406-217 311-311q-95-94-148.5-213.78T99-777.24q-2-35.9 20.93-60.33T179-862h149q40.39 0 65.19 19Q418-824 428-787l25 96q5 27-2 50.5T425-601l-106 94q15 26 35 52t46.97 52.98Q426-378 449-360q23 18 44 29l113-104q18-18 38.31-23 20.32-5 46.69 1l96 24q37.13 11 56.06 34Q862-376 862-338v158q0 36.57-25 59.79Q812-97 777.12-99ZM258-624l66-58-14.16-52H231q3 32 9.96 57.94Q247.91-650.12 258-624Zm356 359q28.1 11.24 58.05 18.12Q702-240 734-232v-82l-55-15-65 64ZM258-624Zm356 359Z"/></svg><span>Call for availability</span></button>
                <button className='visit-button' onClick={() => handleLocationClick()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M871-511v308q0 50.94-35.03 85.97T750-82H211q-50.94 0-85.97-35.03T90-203v-303q-25.5-27-33.75-65.75T60-651l41-133q10.89-35.13 40.13-59.07Q170.36-867 208-867h545.03q37.47 0 66.97 22.75t40.24 60.17L901-651q12 38.5 3.25 76T871-511Zm-304-58q22 0 32.75-14t7.75-32L587-746h-57v135q0 17.81 10.79 29.9Q551.58-569 567-569Zm-177.04 0q17.46 0 29.25-12.1Q431-593.19 431-611v-135h-57l-20.5 131q-2.5 16.5 7.25 31.25T389.96-569ZM215-569q15 0 25-11.28 10-11.29 12-25.72l20.5-140h-58L177-622q-6 20.5 3.75 36.75T215-569Zm531 0q24 0 34-15.75t4-37.25l-38.5-124h-57l20.44 140Q711-592 721-580.5t25 11.5ZM211-203h539v-245.5q-.5-.5-2 0t-2 .5q-19.6 0-41.8-6.5Q682-461 659.79-477q-19.29 14-42.06 21.5-22.77 7.5-46.5 7.5-24.73 0-47.48-7.5Q501-463 481-477q-19 14-41.5 21.5t-45.55 7.5Q369-448 345-455q-24-7-44-22-26 18-48.25 23.5T215-448q-.57 0-1.79-.5-1.21-.5-2.21 0V-203Zm539 0H211h539Z"/></svg><span>Visit the store</span></button>
                <button className='share-button' onClick={() => {
                    if (navigator.canShare) {
                        navigator.share({
                            title: props.title,
                            text: props.text,
                            url: router.asPath
                        });
                    } else {
                        navigator.clipboard.writeText(router.asPath).then(() => {
                            alert('Link copied to clipboard!');
                        });
                    }
                }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M683.94-46Q621-46 577-89.75T533-196q0-5 2-19L288-358q-19 14-41.91 22-22.91 8-49.09 8-62.92 0-106.96-44.26Q46-416.53 46-479.76 46-543 90.04-587.5 134.08-632 197-632q26 0 50 8.5t44 23.5l243-141q-1-5-1-11v-11q0-62.92 44.06-106.96 44.06-44.04 107-44.04T791-869.94q44 44.06 44 107T790.96-656Q746.92-612 684-612q-28.36 0-53.18-9.5T586-648L347-511q2 8.05 2.5 15.52.5 7.48.5 15.98t-1 17q-1 8.5-3 16.5l238 137q20-18 45.45-28.5Q654.91-348 684-348q62.92 0 106.96 44.26Q835-259.47 835-196.24 835-133 790.94-89.5 746.88-46 683.94-46Zm-.55-116q14.61 0 25.11-10.09t10.5-25Q719-212 708.65-222T683-232q-14.45 0-24.22 10.5Q649-211 649-197t9.89 24.5q9.88 10.5 24.5 10.5Zm-486.3-282Q212-444 223-454.29t11-25.5q0-15.21-11-25.71T197.09-516q-14.91 0-25 10.29T162-480.21q0 15.21 10.09 25.71t25 10.5ZM684-728q14 0 24-9.89 10-9.88 10-24.5 0-14.61-9.89-25.11-9.88-10.5-24.5-10.5-14.61 0-25.11 10.35T648-762q0 14.45 11 24.22 11 9.78 25 9.78Zm1 531ZM198-480Zm486-283Z" /></svg>
                    <span>Share</span></button>
            </div>
            <style jsx>
                {`
.interaction-panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
}
button {
    background-color: var(--dl-color-theme-secondary2);
    padding: 0.5em 1em;
    margin: 5px;
    cursor: pointer;
    white-space: nowrap;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    font-size: 20px;
    transition: all .2s ease-in;
    display: flex;
    gap: 0.7em;
    align-items: center;
}
button:hover {
    color: var(--dl-color-theme-primary2);
}
button > svg {
    fill: var(--dl-color-theme-primary1);
    transition: all .2s ease-in;
}
button:hover > svg {
    scale: 1.25;
    fill: var(--dl-color-theme-primary2);
}
@media (max-width: 680px) {
    button {
        font-size: 16px;
    }
}
            `}
            </style>
        </>
    )
}

export const ShareButton = (props) => {
    const router = useRouter();
    return (
        <>
            <button onClick={() => {
                if (navigator.canShare) {
                    navigator.share({
                        title: props.title,
                        text: props.text,
                        url: router.asPath
                    });
                } else {
                    navigator.clipboard.writeText(router.asPath).then(() => {
                        alert('Link copied to clipboard!');
                    });
                }
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M683.94-46Q621-46 577-89.75T533-196q0-5 2-19L288-358q-19 14-41.91 22-22.91 8-49.09 8-62.92 0-106.96-44.26Q46-416.53 46-479.76 46-543 90.04-587.5 134.08-632 197-632q26 0 50 8.5t44 23.5l243-141q-1-5-1-11v-11q0-62.92 44.06-106.96 44.06-44.04 107-44.04T791-869.94q44 44.06 44 107T790.96-656Q746.92-612 684-612q-28.36 0-53.18-9.5T586-648L347-511q2 8.05 2.5 15.52.5 7.48.5 15.98t-1 17q-1 8.5-3 16.5l238 137q20-18 45.45-28.5Q654.91-348 684-348q62.92 0 106.96 44.26Q835-259.47 835-196.24 835-133 790.94-89.5 746.88-46 683.94-46Zm-.55-116q14.61 0 25.11-10.09t10.5-25Q719-212 708.65-222T683-232q-14.45 0-24.22 10.5Q649-211 649-197t9.89 24.5q9.88 10.5 24.5 10.5Zm-486.3-282Q212-444 223-454.29t11-25.5q0-15.21-11-25.71T197.09-516q-14.91 0-25 10.29T162-480.21q0 15.21 10.09 25.71t25 10.5ZM684-728q14 0 24-9.89 10-9.88 10-24.5 0-14.61-9.89-25.11-9.88-10.5-24.5-10.5-14.61 0-25.11 10.35T648-762q0 14.45 11 24.22 11 9.78 25 9.78Zm1 531ZM198-480Zm486-283Z" /></svg>
                <span>Share</span>
            </button>


            <style jsx>
                {`
            button {
                align-self: flex-end;
                padding: 10px;
                margin: 10px;
                background-color: var(--dl-color-theme-secondary2);
                cursor: pointer;
                white-space: nowrap;
                color: var(--dl-color-theme-primary1);
                font-weight: bold;
                font-size: 20px;
                transition: background-color 0.3s ease-in-out;
                display: flex;
                gap: 5px;
                align-items: center;
            }

            button:hover {
                background: var(--dl-color-theme-primary2);
            }

            button svg {
                fill: var(--dl-color-theme-primary1);
            }

            @media (max-width: 680px) {
                button {
                    font-size: 15px;
                }
                button svg {
                    height: 20px;
                    width: 20px;
                }
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

