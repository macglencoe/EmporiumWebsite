import React, { Fragment, use, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Data from "../../public/data/pipes.json"

import Footer32 from '../../components/footer32'
import Contact from '../../components/contact'
import Directory from '../../components/directory'
import Ksman from '../../components/ksman'
import { useRouter } from 'next/router'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'

const PipeBrands = (props) => {

    return (
        <>
        <Head>
            <title>Our Pipe Brands</title>
        </Head>
            <Layout>
                <SearchBy 
                title="Our Pipe Brands" 
                field="Pipe Brand"
                data={Data}
                catalogPath="/pipes"
                />
            </Layout>
        </>
    )
}

export default PipeBrands
