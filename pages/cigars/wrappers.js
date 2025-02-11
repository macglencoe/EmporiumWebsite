import React, { Fragment, use, useState, useEffect} from 'react'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'
import Data from "../../public/data/consolidated_cigars.json"
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
        data={Data}
        catalogPath="/cigars"/>
      </Layout>
    </>
  )
}

export default Wrappers
