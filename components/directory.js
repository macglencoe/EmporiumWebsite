import React, { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import PropTypes from 'prop-types'

const Directory = (props) => {
    const router = useRouter();
    return (
        <nav className="catalog-container1 directory">
            <ul className='directory'>
                <li>
                    <Link href={router.query["Display Price"] == "true" || router.query["Display Barcode"] == "true" ? "/cigars?Display+Price=true&Display+Barcode=true" : "/cigars"}>
                        <a tabIndex={0}>
                            <div className="container2">
                                <div className="directoryCard">
                                    <span className="catalog-text112">Cigars</span>
                                </div>
                            </div>
                        </a>
                    </Link>
                </li>

                <li>
                    <Link href="/pipes">
                        <a tabIndex={0}>
                            <div className="container2">
                                <div className="directoryCard">
                                    <span className="catalog-text113">Pipes</span>
                                </div>
                            </div>
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/caffeine">
                        <a tabIndex={0}>
                            <div className="container2">
                                <div className="directoryCard">
                                    <span className="catalog-text114">Coffee &amp; Tea</span>
                                </div>
                            </div>
                        </a>
                    </Link>
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
                    <Link href="/tobacco">
                        <a tabIndex={0}>
                            <div className="container2">
                                <div className="directoryCard">
                                    <span className="catalog-text115">Tobacco</span>
                                </div>
                            </div>
                        </a>
                    </Link>
                </li>
            </ul>
            <style jsx>
                {`
                .directory ul {
                list-style-type: none;}
            
            .container1 {
                position: relative;
            }
            .directory {
                background-color: var(--dl-color-theme-primary1);

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