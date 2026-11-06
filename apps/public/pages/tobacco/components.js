import React, { Fragment, use, useState, useEffect } from 'react'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'
import Head from 'next/head'

const TobaccoComponents = (props) => {

    return (
        <>
        <Head>
            <title>Tobacco by Component</title>
        </Head>
            <Layout>
                <SearchBy 
                title="Search Pipe Tobacco by Component"
                method="list"
                field="Components"
                data={props.data}
                catalogPath="/tobacco"
                />
            </Layout>
        </>
    )
}

export default TobaccoComponents
export async function getStaticProps() { const { publicCatalogProps } = await import('../../lib/catalog/server.mjs'); return publicCatalogProps('tobacco'); }
