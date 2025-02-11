import Head from 'next/head';
import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';
import ProductPage from '../../components/productPage';
import {ProductImage, ProductSideContent} from '../../components/productPage';
import {ProductSizeChart, ProductBasicInfo} from '../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../components/productPage';
import { Disclaimer } from '../../components/productPage';

export const getStaticPaths = async () => {
    const pipes = await import('../../public/data/pipes.json');
    const data = await pipes.default;
    const paths = data.map((pipe) => ({
      params: { slug: pipe.slug },
    }));
    return { paths, fallback: false };
  }
  
  export const getStaticProps = async ({ params }) => {
    const pipesData = await import('../../public/data/pipes.json');
    const data = await pipesData.default;
    const pipe = data.find((pipe) => pipe.slug === params.slug);
  
    return { props: { pipe } };
  }

const PipePage = (props) => {

    const pipe = props.pipe;
    if(!pipe) {
        return <div>Pipe not found</div>;
    }

    return (
        <>
        <Head>
            <title>{pipe['Pipe Brand']} {pipe['Pipe Name']}</title>
        </Head>
        <Layout>
            <PageTitle1>Pipe Information</PageTitle1>
            <ProductPage>
                <ProductSideContent>
                    <ProductImage
                        hasImage={true}
                        src={`/pipes-img/${pipe.slug}/img.png`}
                        fallbackSearch={encodeURIComponent(pipe['Pipe Brand']+' '+pipe['Pipe Name'])}
                    />
                    <ProductCallOrVisitButtons/>
                </ProductSideContent>
                <ProductMainContent>
                    <ProductTitle>{pipe['Pipe Brand']} {pipe['Pipe Name']}</ProductTitle>
                    <ProductInfoFields
                        fields={[
                            {name: "Brand", value: pipe['Pipe Brand']},
                            {name: "Type", value: pipe['type']},
                            {name: "Material", value: pipe['Material']},

                        ]}
                    />
                    
                </ProductMainContent>
            </ProductPage>
            <Disclaimer/>
        </Layout>
        </>
    )


}

export default PipePage