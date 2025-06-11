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
import ProductPage, { InteractionPanel, Navigation, PodcastLink, ShareButton, StringBubbleList } from '../../../components/productPage';
import { ProductImage, ProductSideContent } from '../../../components/productPage';
import { ProductSizeChart, ProductBasicInfo } from '../../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../../components/productPage';
import { Disclaimer } from '../../../components/productPage';
import setLocalData from '../../../utils/setLocalData';
import Toolbar from '../../../components/toolbar';
import { PiArrowUUpLeft, PiArrowUUpLeftBold, PiPencilSimpleBold, PiTrashSimpleBold } from 'react-icons/pi';

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
  const [cigarOriginData, setCigarOriginData] = useState(cigar);

  const revertToOriginal = () => {
    setCigarLocalData(cigar);
  };

  const pullTempData = () => {
    const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
    const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === cigarLocalData.slug);
    setCigarLocalData(firstCigarWithSameSlug);
  }
  const pullOriginData = () => {
    const tempData = JSON.parse(localStorage.getItem('originData_cigars'));
    const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === cigarLocalData.slug);
    return firstCigarWithSameSlug;
  }

  useEffect(() => {

    setLocalData(props.allCigars);
    if (typeof window !== 'undefined') {
      pullTempData();
      pullOriginData();
    }

  }, []);
  console.log(cigarLocalData);

  return (
    <>
      <Head>
        <title>{cigarOriginData['Cigar Brand']} {cigarOriginData['Cigar Name']}</title>
      </Head>
      <Layout>
        <Toolbar
          links={[
            {
              label: 'Edit', href: router.asPath + '/edit',
              icon: <PiPencilSimpleBold size={26} />
            },
            {
              label: 'Delete', href: router.asPath + '/delete',
              icon: <PiTrashSimpleBold size={26} />
            },
            {
              label: 'Revert', href: router.asPath + '/edit?tab=submit-section#revert',
              icon: <PiArrowUUpLeftBold size={26} />
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
              src={cigarLocalData.image}
              fallbackSearch={encodeURIComponent(cigarOriginData['Cigar Brand'] + ' ' + cigarOriginData['Cigar Name'])}
            />
            <ProductSizeChart
              sizes={cigarLocalData.Sizes}
              allCigarSizes={cigarSizes}
            />
            {cigarOriginData['Flavor_Profile'] && <StringBubbleList title="Flavor"
              data={cigarOriginData['Flavor_Profile'].split(', ')}
            >

            </StringBubbleList>
            }
          </ProductSideContent>
          <ProductMainContent>
            <ProductInfoFields
              fields={[
                { name: "Brand", value: cigarLocalData['Cigar Brand'], markout: cigarOriginData['Cigar Brand'] },
                { name: "Wrapper", value: cigarLocalData['Wrapper'], markout: cigarOriginData['Wrapper'] },
                { name: "Binder", value: cigarLocalData['Binder'], markout: cigarOriginData['Binder'] },
                { name: "Filler", value: cigarLocalData['Filler'], markout: cigarOriginData['Filler'] },
                { name: "Strength", value: cigarLocalData['Strength_Profile'], markout: cigarOriginData['Strength_Profile'] },
              ]}
            />
            <InteractionPanel
                image={cigarLocalData.image}
                title={cigarLocalData['Cigar Name']}
                description={"Check out this cigar from King Street Emporium!"}
            />

          </ProductMainContent>
        </ProductPage>
        { cigarLocalData['Podcast_Link'] &&
          <PodcastLink url={cigarLocalData['Podcast_Link']}></PodcastLink>
        }
        <Disclaimer />
      </Layout>

    </>
  );
};

export default CigarPage;

