import React, { Fragment, use, useState, useEffect} from 'react'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'
import Head from 'next/head'

const Wrappers = (props) => {
  return (
    <>
    <Head>
      <title>Cigars by Wrapper</title>
    </Head>
      <Layout>
        <SearchBy 
        title="Search by Wrapper" 
        field="Wrapper"
        data={props.data}
        catalogPath="/cigars"/>
      </Layout>
    </>
  )
}

export default Wrappers
export async function getStaticProps() { const { publicCatalogProps } = await import('../../lib/catalog/server.mjs'); return publicCatalogProps('cigar'); }
