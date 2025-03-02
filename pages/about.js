import React, { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../public/data/consolidated_cigars.json"

import Footer32 from '../components/footer32'
import Contact from '../components/contact'
import Directory from '../components/directory'
import Ksman from '../components/ksman'
import Layout from '../components/layout'
import PageTitle1 from '../components/pagetitle1'

const About = (props) => {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            <Layout>
                <PageTitle1>About</PageTitle1>
                <section>
                    <h2>Our store</h2>
                    <p>The King Street Coffee & Tobacco Emporium opened its doors for business in 1993. Owned and operated by life long resident of Martinsburg, WV, Edward Trout makes his customers feel at home. With an Old World feel, the Emporium offers premium cigars, pipe tobaccos, coffee beans, loose and bag teas. Enjoy a cappuccino or piping hot cup of fresh brewed coffee and relax with your premium cigar – the regulars are sure to provide conversation and always make you feel welcome.</p>
                    <p>
                        We are located in Martinsburg, WV, conveniently nestled in the Shenandoah Valley of the Blue Ridge Mountains off of Interstate 81.
                    </p>
                    <p>
                        Regular updates about closings, events, offers, and more can be found on our <a href='https://www.facebook.com/people/King-Street-Coffee-Tobacco-Emporium/100063496593967/?ref=embed_page'>Facebook page</a>.
                    </p>
                </section>
                <section>
                    <h2>What is this website?</h2>
                    <p>This website is your go-to platform for information about King Street Coffee & Tobacco Emporium.</p>
                    <p>The online catalog allows you to browse our selection anytime, anywhere. With regularly updated offerings, our catalog will help you find what you need!</p>
                </section>
                <section>
                    <h2>Who made this website?</h2>
                    <p>As part of an internship and a college capstone project, this website was created  independently by <a href='https://www.linkedin.com/in/liam-mcdonald-5a451b251/'>Liam McDonald</a> (<a href='https://github.com/macglencoe'>macglencoe</a>), a software engineer from Inwood, WV, and patron of the Emporium.
                    </p>
                    <p>Liam is a student of the local <a href='https://www.blueridgectc.edu'>Blue Ridge CTC</a> pursuing a degree in Software Development & Engineering</p>
                    {/* <table className='tech-stack'>
                        <tr>
                            <th>Designed with</th>
                            <th>Built with</th>
                            <th>Hosted with</th>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <a href='https://www.figma.com'>
                                        <img src='/Figma-logo.svg' alt='Figma'></img>
                                    </a>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <a href='https://nextjs.org'>
                                        <img src='https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg'  alt='Next.js'></img>
                                    </a>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <a href='https://vercel.com'>
                                    <img src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg'  alt='Vercel'></img>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </table> */}
                    <h2 className='tech-stack-header'>Technologies</h2>
                    <ul className='tech-stack'>
                        <li aria-label='Designed in'>
                            <div>
                                <a href='https://www.figma.com' tabIndex={0}>
                                    <img src='/Figma-logo.svg' alt='Figma'></img>
                                </a>
                                <span>Designed in</span>
                            </div>
                        </li>
                        <li aria-label='Built With'>
                            <div>
                                <a href='https://nextjs.org' tabIndex={0}>
                                    <img src='https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' alt='Next.js'></img>
                                </a>
                                <span>Built With</span>
                            </div>
                        </li>
                        <li aria-label='Hosted With'>
                            <div>
                                <a href='https://vercel.com' tabIndex={0}>
                                    <img src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg' alt='Vercel'></img>
                                </a>
                                <span>Hosted With</span>
                            </div>
                        </li>
                    </ul>
                </section>
                <section className='content-container'>
                    <h2>This website is a work in progress</h2>
                    <p>It may be prone to errors, as any brand new website is.</p>
                    <h4>Submit an issue on Github:</h4>
                    <a href="https://github.com/macglencoe/EmporiumWebsite/issues/new">GitHub</a>
                    <h4>Report an issue via email:</h4>
                    <p>Developer: <a href="mailto:mcpaul1694@gmail.com">mcpaul1694@gmail.com</a></p>
                    <p>Storefront: <a href='mailto:kingstreetemporium@gmail.com'>kingstreetemporium@gmail.com</a></p>


                </section>
            </Layout>
            <style jsx>{
                `
section {
    background-color: var(--dl-color-theme-primary2);
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 10px;
}

section p {
    color: var(--dl-color-theme-neutral-dark);
    line-height: 2em;
}

section a {
    color: var(--dl-color-theme-primary1);
    font-family: 'Playfair';
    font-style: italic;
    font-weight: 500;
    display: inline-block;
}

section a:hover {
    text-decoration: underline;
}

section h2, section h4 {
    color: var(--dl-color-theme-secondary2);
}

section div.tech-stack-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
section div.tech-stack-header h2 {
    font-family: Inter;
    text-transform: uppercase;
}
section div.tech-stack-header svg {
    fill: var(--dl-color-theme-secondary2);
}

section table.tech-stack {
    border-collapse: collapse;
}

section table.tech-stack th {
    color: var(--dl-color-theme-secondary2);
    font-family: Inter;
    text-transform: uppercase;
}

section table.tech-stack td div {
    display: flex;
    justify-content: center;
    padding: 20px 10px;
}

section table.tech-stack img {
    width: 100%;
    max-width: 150px
}


section ul.tech-stack {
    list-style: none;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column-reverse;
}

section ul.tech-stack li {
    display: flex;
    justify-content: center;
    position: relative;
    height:50px;
}

section ul.tech-stack li div {
    position: absolute;
    background-color: var(--dl-color-theme-primary2);
    background-image: linear-gradient( 0deg, var(--dl-color-theme-primary2) 0%, var(--dl-color-theme-primary1) 400%);
    border: 10px solid var(--dl-color-theme-secondary2);
    border-top: 3px solid var(--dl-color-theme-secondary2);
    border-right: 3px solid var(--dl-color-theme-secondary2);
    border-radius: 10px;
    border-top-right-radius: 3px;
    width: 150px;
    height: 150px;
    transform: rotateX(45deg) rotateZ(-45deg);
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    align-content: space-between;
    align-items: center;
    padding: 15px 5px;

}

section ul.tech-stack li:not(:last-child) div:hover, section ul.tech-stack li:not(:last-child) div:focus-within
 {
    transform:  rotateX(45deg) rotateZ(-45deg) translate3d(0px, 50%, 0px);
}

section ul.tech-stack li:not(:first-child):not(:last-child) div {
    view-timeline-name: --teck-stack-scatter-middle;
    view-timeline-axis: block;
    animation: ease tech-stack-scatter-middle both;
    animation-timeline: --teck-stack-scatter-middle;
    animation-range: cover 30% cover 50%
}

section ul.tech-stack li:first-child div {
    view-timeline-name: --teck-stack-scatter;
    view-timeline-axis: block;
    animation: ease tech-stack-scatter both;
    animation-timeline: --teck-stack-scatter;
    animation-range: cover 30% cover 50%;
}

section ul.tech-stack li:last-child div  {
    view-timeline-name: --teck-stack-scatter-top;
    view-timeline-axis: block;
    animation: ease tech-stack-scatter-top both;
    animation-timeline: --teck-stack-scatter-top;
    animation-range: cover 30% cover 50%;
}

@keyframes tech-stack-scatter {
    from {
        transform: rotateX(45deg) rotateZ(-45deg);
    }
    to {
        transform:  rotateX(45deg) rotateZ(-45deg) translate3d(0px, 50%, 0px);
    }
}

@keyframes tech-stack-scatter-middle {
    from {
        transform: rotateX(45deg) rotateZ(-45deg);
    }
    to {
        transform:  rotateX(45deg) rotateZ(-45deg) translate3d(-50%, -20%, 0px);
    }
}

@keyframes tech-stack-scatter-top {
    from {
        transform: rotateX(45deg) rotateZ(-45deg);
    }
    to {
        transform:  rotateX(45deg) rotateZ(-45deg) translate3d(20%, 10%, 0px);
    }
}


section ul.tech-stack li div a {
    outline: none;
    width: 100%;
    height: 100%;
}

section ul.tech-stack li div img {
    width: 100%;
    height: 50%;
}

section ul.tech-stack li div span {
    color: var(--dl-color-theme-secondary2);
    font-family: Inter;
    text-transform: uppercase;
    font-weight: bold;
}

section h2.tech-stack-header {
    font-family: Inter;
    text-transform: uppercase;
    text-align: center;
}




section table.tech-stack th, section table.tech-stack td {
    border-left: 1px dashed var(--dl-color-theme-primary1);
    border-right: 1px dashed var(--dl-color-theme-primary1);
}

section table.tech-stack th:first-child, section table.tech-stack td:first-child {
    border-left: none;
}

section table.tech-stack th:last-child, section table.tech-stack td:last-child {
    border-right: none;
}

section table.tech-stack a {
    align-self: center;
}



.title-container {
    background-color: var(--dl-color-theme-secondary2);
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.title-container h1 {
    color: var(--dl-color-theme-primary1);
    font-size: 25px;
}
.title-container div {
    height: 10px;
    width: 100%;
    background-color: var(--dl-color-theme-primary1);
}
                `
            }</style>
        </>
    )
}


export default About
