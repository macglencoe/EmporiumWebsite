import cigarSizes from '../../../public/data/cigarsizes.json';
import Head from 'next/head'
import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';
import ProductPage, { InteractionPanel, Navigation, PodcastLink, ShareButton, StringBubbleList } from '../../../components/productPage';
import { ProductImage, ProductSideContent } from '../../../components/productPage';
import { ProductSizeChart, ProductBasicInfo } from '../../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../../components/productPage';
import { Disclaimer } from '../../../components/productPage';

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
          description={cigar.description}
          next={props.next}
          prev={props.prev}
          href="/cigars"
          nameField="Cigar Name"
          subtitle={"by " + cigar['Cigar Brand']}
        >{cigar ? cigar['Cigar Name'] : "Data not found"}</PageTitle1>
        <ProductPage
        >
          <ProductSideContent>
            <ProductImage
              src={cigar.image}
              fallbackSearch={encodeURIComponent(cigar['Cigar Brand'] + ' ' + cigar['Cigar Name'])}
            />
            <ProductSizeChart
              sizes={cigar.Sizes}
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
            <InteractionPanel
                image={cigar.image}
                title={cigar['Cigar Name']}
                description={"Check out this cigar from King Street Emporium!"}
            />

          </ProductMainContent>
        </ProductPage>

        {cigar['Podcast_Link'] && <PodcastLink url={cigar['Podcast_Link']} />}
        
        <Disclaimer />
      </Layout>
    </>
  );
};

export default CigarPage;

