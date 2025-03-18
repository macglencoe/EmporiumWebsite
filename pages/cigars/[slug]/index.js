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
import Toolbar from '../../../components/toolbar';

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
        <Toolbar
          links={[
            { label: 'Edit', href: router.asPath + '/edit',
              icon: <path xmlns="http://www.w3.org/2000/svg" d="M211-212h58l323-323-56-57-325 325v55ZM86-86v-234l526-526q14-14 31.5-21t36.5-7q18 0 36 7t33 21l98 96q14 14 21 32.5t7 37.5q0 19-7 37t-21 32L322-86H86Zm652-594-57-58 57 58ZM564-564l-28-28 56 57-28-29Z"/>
             },
             {
              label: 'Delete', href: router.asPath + '/delete',
              icon: <path xmlns="http://www.w3.org/2000/svg" d="M269-86q-53 0-89.5-36.5T143-212v-497H80v-126h257v-63h284v63h259v126h-63v497q0 53-36.5 89.5T691-86H269Zm422-623H269v497h422v-497ZM342-281h103v-360H342v360Zm173 0h103v-360H515v360ZM269-709v497-497Z"/>
             },
             {
              label: 'Revert', href: router.asPath + '/edit#revert',
              icon: <path xmlns="http://www.w3.org/2000/svg" d="M292-166v-126h293q51 0 87-35.5t36-86.5q0-51-36-87t-87-36H366l83 83-88 88-235-234 235-234 88 88-83 83h219q103 0 176 72.5T834-415q0 103-73 176t-176 73H292Z"/>
             }
          ]}
        />
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
      
    </>
  );
};

export default CigarPage;

