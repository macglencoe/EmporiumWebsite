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

const PipeMaterials = (props) => {

    return (
        <>
        <Head>
            <title>Pipes by Material</title>
        </Head>
            <Layout>
                <SearchBy 
                title="Search by Material" 
                field="Material"
                data={props.data}
                catalogPath="/pipes"
                />
            </Layout>
        </>
    )
}

export default PipeMaterials
export async function getStaticProps() { const { publicCatalogProps } = await import('../../lib/catalog/server.mjs'); return publicCatalogProps('pipe'); }
