import React, { Fragment, useState, useEffect, use } from 'react'
import { useRouter } from 'next/router';
import Data from '../../../public/data/consolidated_cigars.json';
import cigarSizes from '../../../public/data/cigarsizes.json';

import Head from 'next/head'

import Footer32 from '../../../components/footer32'
import Contact from '../../../components/contact'
import Directory from '../../../components/directory';
import Ksman from '../../../components/ksman'
import Link from 'next/link';
import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';
import ProductPage, { Navigation, StringBubbleList } from '../../../components/productPage';
import { ProductImage, ProductSideContent } from '../../../components/productPage';
import { ProductSizeChart, ProductBasicInfo } from '../../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../../components/productPage';
import { Disclaimer } from '../../../components/productPage';
import setLocalData from '../../../utils/setLocalData';

export const getStaticPaths = async () => {
  const cigars = await import('../../../public/data/consolidated_cigars.json');
  const data = await cigars.default;
  const paths = data.map((cigar) => ({
    params: { slug: cigar.slug },
  }));
  return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
  const cigarsData = await import('../../../public/data/consolidated_cigars.json');
  const data = await cigarsData.default;
  const cigarIndex = data.findIndex((cigar) => cigar.slug === params.slug);
  const cigar = data[cigarIndex];

  const prevCigar = cigarIndex > 0 ? data[cigarIndex - 1] : null;
  const nextCigar = cigarIndex + 1 < data.length ? data[cigarIndex + 1] : null;
  return { props: { cigar, next: nextCigar, prev: prevCigar, allCigars: data } };
}



const CigarPage = (props) => {
  const router = useRouter();
  const cigar = props.cigar;
  if (!cigar) {
    return <div>Cigar not found</div>;
  }

  const [cigarLocalData, setCigarLocalData] = useState(cigar);

  const revertToOriginal = () => {
    setCigarLocalData(cigar);
  };

  const pullTempData = () => {
    const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
    const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === cigarLocalData.slug);
    setCigarLocalData(firstCigarWithSameSlug);
  }

  useEffect(() => {

    setLocalData(props.allCigars);
    if (typeof window !== 'undefined') {
      pullTempData();
    }

  }, []);

  return (
    <>
      <Head>
        <title>{cigar['Cigar Brand']} {cigar['Cigar Name']}</title>
      </Head>
      <Layout>
        <div className='toolbar'>
          <a href='./edit'>Edit</a>
        </div>
        <PageTitle1
          subtitle={cigarLocalData ? cigarLocalData['Cigar Name'] : "Data not found"}
          next={props.next}
          prev={props.prev}
          href="/cigars"
          nameField="Cigar Name"
        >Cigar Information</PageTitle1>
        <ProductPage
          description={cigarLocalData.description}
        >
          <ProductSideContent>
            <ProductImage
              hasImage={true}
              src={`/cigars-img/${cigarLocalData.slug}/img.png`}
              fallbackSearch={encodeURIComponent(cigar['Cigar Brand'] + ' ' + cigar['Cigar Name'])}
            />
            <ProductSizeChart
              sizes={cigarLocalData.Sizes.map(size => size.Size)}
              allCigarSizes={cigarSizes}
            />
            {cigar['Flavor_Profile'] && <StringBubbleList title="Flavor"
              data={cigar['Flavor_Profile'].split(', ')}
            >

            </StringBubbleList>
            }
          </ProductSideContent>
          <ProductMainContent>
            <ProductInfoFields
              fields={[
                { name: "Brand", value: cigarLocalData['Cigar Brand'], markout: props.cigar['Cigar Brand'] },
                { name: "Wrapper", value: cigarLocalData['Wrapper'], markout: props.cigar['Wrapper'] },
                { name: "Binder", value: cigarLocalData['Binder'], markout: props.cigar['Binder'] },
                { name: "Filler", value: cigarLocalData['Filler'], markout: props.cigar['Filler'] },
                { name: "Strength", value: cigarLocalData['Strength_Profile'], markout: props.cigar['Strength_Profile'] },
              ]}
            />
            <ProductCallOrVisitButtons />

          </ProductMainContent>
        </ProductPage>

        <Disclaimer />
      </Layout>
      <style jsx>
        {`
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px;
}
.toolbar a {
  font-family: Inter;
  font-weight: 500;
  background-color: var(--dl-color-theme-secondary2);
  color: var(--dl-color-theme-primary1);
  padding: 10px;
}
.toolbar a:hover {
  color: var(--dl-color-theme-primary2);
}
        `}
      </style>
    </>
  );
};

export default CigarPage;

