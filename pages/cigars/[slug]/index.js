import React, { Fragment, useState, useEffect, use } from 'react'
import { useRouter } from 'next/router';

import Head from 'next/head'
import Layout from '../../../components/layout';
import setLocalData from '../../../utils/setLocalData';
import Toolbar from '../../../components/toolbar';
import { PiArrowUUpLeft, PiArrowUUpLeftBold, PiPencilSimpleBold, PiTrashSimpleBold } from 'react-icons/pi';
import { SchemaProductPage } from '../../../components/schemaProductPage';
import uiSchema from '../../../public/data/cigar.ui.schema.json'

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
        <SchemaProductPage
          uiSchema={uiSchema}
          data={cigarLocalData}
          originalData={cigarOriginData}
          sections={[
            {
              id: "metadata",
              label: "METADATA",
              filter: (n, f) => sectionOf(f) === "metadata"
            },
            {
              id: "sizes",
              label: "SIZES / PRICES",
              filter: (n, f) => sectionOf(f) === "sizes"
            }
          ]}
        />
      </Layout>

    </>
  );
};

const sectionOf = (field) => (field?.ui?.section || "")

export default CigarPage;

