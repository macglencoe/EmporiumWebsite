import React, { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import PropTypes from 'prop-types'

const DirectoryItem = (props) => {
    const router = useRouter();
    return (
        <>
            <Link href={props.href}>
                <a tabIndex={0} className={router.pathname == props.href ? "active-page" : ""}>
                    <div>
                        <span>{props.children}</span>
                        <div className='background-gradient'></div>
                    </div>
                </a>
            </Link>
            <style jsx>
                {`
                a span {
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    color: var(--dl-color-theme-primary2);
                    white-space: nowrap;
                    transition: 0.3s;
                    position: relative;
                    z-index: 1;
                }
                a > div {
                    position: relative;
                    display: flex;
                    padding: 0.5em;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    overflow: hidden;
                }
                a .background-gradient {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform: translateY(100%);
                    background-image: var(--directory-gradient);
                    transition: 0.3s ease-in;
                }
                a {
                    width: 100%;
                }
                a:hover span, a:focus span {
                    text-decoration: var(--dl-color-theme-primary1) underline;
                }
                a:hover .background-gradient, a:focus .background-gradient {
                    transform: translateY(0);
                }
                a.active-page span {
                    
                        color: var(--dl-color-theme-primary1);
                    
                    
                }
                @media(max-width: 680px) {
                    a span {
                        font-size: 16px;
                    }
                }

                
                

                `}
            </style>
        </>
    )
}

const Directory = (props) => {
    const router = useRouter();
    return (
        <nav className="catalog-container1 directory">
            <ul>
                <li>
                    <DirectoryItem href={router.query["Display Price"] == "true" || router.query["Display Barcode"] == "true" ? "/cigars?Display+Price=true&Display+Barcode=true" : "/cigars"}>Cigars</DirectoryItem>
                </li>

                <li>
                    <DirectoryItem href="/pipes">Pipes</DirectoryItem>
                </li>
                <li>
                    <DirectoryItem href="/caffeine">Coffee & Tea</DirectoryItem>
                </li>
                {/* <li>
            <Link href="/accessories">
                <a>
                    <div className="container2">
                        <div className="directoryCard">
                            <span className="catalog-text115">Accessories</span>
                        </div>
                    </div>
                </a>
            </Link>
            </li> */}
                <li>
                    <DirectoryItem href="/tobacco">Tobacco</DirectoryItem>
                </li>
                {
                    window.innerWidth >= 680 &&
                    <li>
                        <DirectoryItem href="/about">About</DirectoryItem>
                    </li>
                }
            </ul>
            <style jsx>
                {`
                .directory ul {
                list-style-type: none;
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-evenly;
                background-color: var(--dl-color-theme-secondary1);
                padding: 0 1em;
                }
                .directory li {
                flex: 1;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                }
                
                
            
            .container1 {
                position: relative;
            }
            .background-image {
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
            .container2 {
                width: auto;
                padding: 0.3em;
                position: relative;
                border-width: 0px;
            }
            .directoryCard {
                flex: 0 0 auto;
                width: 100%;
                border: 2px dashed rgba(120, 120, 120, 0.4);
                height: auto;
                display: flex;
                padding: 0.5em;
                align-items: flex-end;
                border-width: 0px;
                border-radius: var(--dl-radius-radius-radius8);
                flex-direction: column;
                justify-content: flex-end;
                background-color: transparent;
                background-image: var(--dl-gradient-gradients-secondary2gradient);
                transition: transform 0.3s;
            }
            
            .directoryCard:hover {
                background-image: var(--dl-gradient-gradients-secondary3gradient);
                transform: scale(1.05);
            }

            .directoryCard > span {
                fill: var(--dl-color-theme-secondary1);
                color: var(--dl-color-theme-secondary1);
                font-size: 2em;
                align-self: flex-end;
                font-style: normal;
                text-align: right;
                font-weight: 700;
                white-space: nowrap;
            }
            
            @media(max-width: 680px) {
                .directoryCard > span {
                    font-size: 1.5em;
                }
            }
            
            `}
            </style>
        </nav>
    )
}

export default Directory