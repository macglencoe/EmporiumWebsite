import React, { Fragment, use, useState, useEffect} from 'react'
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'

const Wrappers = (props) => {
  return (
    <>
      <Layout>
        <SearchBy 
        title="Search by Wrapper" 
        field="Wrapper"/>
      </Layout>
    </>
  )
}

export default Wrappers
