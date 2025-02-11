import React, { Fragment, use, useState, useEffect } from 'react'
import Data from "../../public/data/tobacco.json"
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'
import Head from 'next/head'

const TobaccoCuts = (props) => {

    return (
        <>
        <Head>
            <title>Tobacco by Cut</title>
        </Head>
            <Layout>
                <SearchBy 
                title="Search Pipe Tobacco by Cut" 
                field="Cut"
                data={Data}
                catalogPath="/tobacco"
                />
            </Layout>
        </>
    )
}

export default TobaccoCuts