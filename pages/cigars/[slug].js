import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Data from '../../public/data/consolidated_cigars.json';
import cigarSizes from '../../public/data/cigarsizes.json';

import Head from 'next/head'

import Footer32 from '../../components/footer32'
import Contact from '../../components/contact'
import Directory from '../../components/directory';
import Ksman from '../../components/ksman'
import Link from 'next/link';
import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';
import ProductPage, { Navigation, ShareButton, StringBubbleList } from '../../components/productPage';
import { ProductImage, ProductSideContent } from '../../components/productPage';
import { ProductSizeChart, ProductBasicInfo } from '../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../components/productPage';
import { Disclaimer } from '../../components/productPage';

export const getStaticPaths = async () => {
  const cigars = await import('../../public/data/consolidated_cigars.json');
  const data = await cigars.default;
  const paths = data.map((cigar) => ({
    params: { slug: cigar.slug },
  }));
  return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
  const cigarsData = await import('../../public/data/consolidated_cigars.json');
  const data = await cigarsData.default;
  const cigarIndex = data.findIndex((cigar) => cigar.slug === params.slug);
  const cigar = data[cigarIndex];

  const prevCigar = cigarIndex > 0 ? data[cigarIndex - 1] : null;
  const nextCigar = cigarIndex + 1 < data.length ? data[cigarIndex + 1] : null;
  return { props: { cigar, next: nextCigar, prev: prevCigar } };
}

const CigarPage = (props) => {

  const cigar = props.cigar;
  if (!cigar) {
    return <div>Cigar not found</div>;
  }


  return (
    <>
      <Head>
        <title>{cigar['Cigar Brand']} {cigar['Cigar Name']}</title>
      </Head>
      <Layout>
        <PageTitle1
          subtitle={cigar['Cigar Name']}
          next={props.next}
          prev={props.prev}
          href="/cigars"
          nameField="Cigar Name"
        >Cigar Information</PageTitle1>
        <ProductPage
          description={cigar.description}
        >
          <ProductSideContent>
            <ProductImage
              hasImage={true}
              src={`/cigars-img/${cigar.slug}/img.png`}
              fallbackSearch={encodeURIComponent(cigar['Cigar Brand'] + ' ' + cigar['Cigar Name'])}
            />
            <ProductSizeChart
              sizes={cigar.Sizes.map(size => size.Size)}
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
                { name: "Brand", value: cigar['Cigar Brand'] },
                { name: "Wrapper", value: cigar['Wrapper'] },
                { name: "Binder", value: cigar['Binder'] },
                { name: "Filler", value: cigar['Filler'] },
                { name: "Strength", value: cigar['Strength_Profile'] },
              ]}
            />
            <ProductCallOrVisitButtons />
            <ShareButton
              title={cigar['Cigar Brand'] + ' ' + cigar['Cigar Name']}
              text="Check out this cigar on King Street Emporium's online catalog!"
              
            />

          </ProductMainContent>
        </ProductPage>
        
        <Disclaimer />
      </Layout>
    </>
  );
};

export default CigarPage;

