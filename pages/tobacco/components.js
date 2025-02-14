import React, { Fragment, use, useState, useEffect } from 'react'
import Data from "../../public/data/tobacco.json"
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
                flatmap="Components"
                field="Components"
                data={Data}
                catalogPath="/tobacco"
                />
            </Layout>
        </>
    )
}

export default TobaccoComponents