import cigarSizes from '../../../public/data/cigarsizes.json';
import Head from 'next/head';
import Layout from '../../../components/layout';
import ProductPage, {
  InteractionPanel,
  PodcastLink,
  StringBubbleList,
  ProductImage,
  ProductSideContent,
  ProductSizeChart,
  ProductMainContent,
  ProductTitle,
  ProductInfoFields,
  Disclaimer,
  Navigation,
} from '../../../components/productPage';
import { PiFactory, PiFactoryBold, PiFire, PiFireBold, PiGrainsBold, PiGrainsDuotone, PiLeaf, PiLeafBold, PiLeafDuotone, PiLeafFill } from 'react-icons/pi';

export const getStaticPaths = async () => {
  const { publicProductPaths } = await import('../../../lib/catalog/server.mjs');
  return publicProductPaths('cigar');
}

export const getStaticProps = async ({ params }) => {
  const { readPublicCatalog, PUBLIC_REVALIDATE_SECONDS } = await import('../../../lib/catalog/server.mjs');
  const data = await readPublicCatalog('cigar');
  const cigarIndex = data.findIndex((cigar) => cigar.slug === params.slug);
  const cigar = data[cigarIndex];

  const prevCigar = cigarIndex > 0 ? data[cigarIndex - 1] : null;
  const nextCigar = cigarIndex + 1 < data.length ? data[cigarIndex + 1] : null;
  if (!cigar) return { notFound: true, revalidate: PUBLIC_REVALIDATE_SECONDS };
  return { props: { cigar, next: nextCigar, prev: prevCigar }, revalidate: PUBLIC_REVALIDATE_SECONDS };
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
        <div className='bg-primary2 h-full'>
          <ProductPage description={cigar.description}>
            <ProductMainContent>
              <ProductTitle
                breadcrumbs={[
                  { label: 'Home', href: '/' },
                  { label: 'Cigars', href: '/cigars' },
                  { label: cigar.slug }
                ]}
                meta={"By " + cigar['Cigar Brand']}
                description={cigar.description}
              >
                {cigar['Cigar Name']}
              </ProductTitle>
              <InteractionPanel
                image={cigar.image}
                title={cigar['Cigar Name']}
                text={"Check out this cigar from King Street Emporium!"}
              />
              <ProductInfoFields
                fields={[
                  { name: "Brand", value: cigar['Cigar Brand'], icon: PiFactory },
                  { name: "Wrapper", value: cigar['Wrapper'], icon: PiLeaf },
                  { name: "Binder", value: cigar['Binder'], icon: PiLeafDuotone },
                  { name: "Filler", value: cigar['Filler'], icon: PiLeafFill },
                  { name: "Strength", value: cigar['Strength_Profile'], icon: PiFire },
                ]}
              />
  
            </ProductMainContent>
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
          </ProductPage>
          <Navigation
            prev={props.prev}
            next={props.next}
            href="/cigars"
            nameField="Cigar Name"
          />
  
          {cigar['Podcast_Link'] && <PodcastLink url={cigar['Podcast_Link']} />}
          
          <Disclaimer />
        </div>
      </Layout>
    </>
  );
};

export default CigarPage;
