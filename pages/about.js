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

const About = (props) => {
    return (
        <>
        <Head>
            <title>About</title>
        </Head>
            <Layout>
                <div className="title-container">
                    <h1 className="title">About</h1>
                    <div></div>
                </div>
                <div className='content-container'>
                    <h2>This website is a work in progress</h2>
                    <p>It may be prone to errors, as any brand new website is.</p>
                    <h4>Submit an issue on Github:</h4>
                    <a href="https://github.com/macglencoe/EmporiumWebsite/issues/new">GitHub</a>
                    <h4>Report an issue via email:</h4>
                    <p>Developer: <a href="mailto:mcpaul1694@gmail.com">mcpaul1694@gmail.com</a></p>
                    <p style={{paddingLeft: "10px"}}>If you find an issue, please send me an email ^ and tell me what went wrong. I'd be happy to fix it.</p>
                    

                </div>
            </Layout>
            <style jsx>{
                `
.content-container {
    background-color: var(--dl-color-theme-secondary2);
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.content-container p {
    color: var(--dl-color-theme-neutral-light);
}

.content-container a {
    color: var(--dl-color-theme-primary1);
}

.content-container h2, .content-container h4 {
    color: var(--dl-color-theme-primary1);
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
