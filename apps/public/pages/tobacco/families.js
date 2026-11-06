import React, { Fragment, use, useState, useEffect } from 'react'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'
import Head from 'next/head'

const TobaccoFamilies = (props) => {

    return (
        <>
        <Head>
            <title>Tobacco by Family</title>
        </Head>
            <Layout>
                <SearchBy 
                title="Search Pipe Tobacco by Family" 
                field="Family"
                data={props.data}
                catalogPath="/tobacco"
                />
            </Layout>
        </>
    )
}

export default TobaccoFamilies
export async function getStaticProps() { const { publicCatalogProps } = await import('../../lib/catalog/server.mjs'); return publicCatalogProps('tobacco'); }
