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
        <div className='bg-primary2'>
          <ProductPage description={cigar.description}>
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
