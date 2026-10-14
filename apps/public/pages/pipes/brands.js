import React, { Fragment, use, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
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
                data={props.data}
                catalogPath="/pipes"
                />
            </Layout>
        </>
    )
}

export default PipeBrands
export async function getStaticProps() { const { publicCatalogProps } = await import('../../lib/catalog/server.mjs'); return publicCatalogProps('pipe'); }
