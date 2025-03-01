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
                    <p>The website was designed with the help of <a href='https://www.figma.com'>Figma</a>, and built with <a href='https://nextjs.org'>Next.js</a>.</p>
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
}

section a:hover {
    text-decoration: underline;
}

section h2, section h4 {
    color: var(--dl-color-theme-secondary2);
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
