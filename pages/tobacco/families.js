import React, { Fragment, use, useState, useEffect } from 'react'
import Data from "../../public/data/tobacco.json"
import Layout from '../../components/layout'
import SearchBy from '../../components/searchby'

const TobaccoFamilies = (props) => {

    return (
        <>
            <Layout>
                <SearchBy 
                title="Search Pipe Tobacco by Family" 
                field="Family"
                data={Data}
                catalogPath="/tobacco"
                />
            </Layout>
        </>
    )
}

export default TobaccoFamilies