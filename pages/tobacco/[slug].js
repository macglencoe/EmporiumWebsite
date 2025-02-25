import Head from "next/head"
import Layout from "../../components/layout"
import PageTitle1 from "../../components/pagetitle1";
import ProductPage, { StringBubbleList } from '../../components/productPage';
import { ProductImage, ProductSideContent } from '../../components/productPage';
import { ProductSizeChart, ProductBasicInfo } from '../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../components/productPage';
import { Disclaimer } from '../../components/productPage';


export const getStaticPaths = async () => {
    const tobacco = await import('../../public/data/tobacco.json');
    const data = await tobacco.default;
    const paths = data.map((tobacco) => ({
        params: { slug: tobacco.slug },
    }));
    return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
    const tobaccoData = await import('../../public/data/tobacco.json');
    const data = await tobaccoData.default;
    const tobacco = data.find((tobacco) => tobacco.slug === params.slug);
    return {
        props: {
            tobacco
        },
    };
}


const TobaccoPage = (props) => {

    const tobacco = props.tobacco;
    if (!tobacco) {
        return <Layout><PageTitle1>Tobacco not found</PageTitle1></Layout>
    }


    return (
        <>
            <Head>
                <title>{tobacco['Tobacco Name']}</title>
            </Head>
            <Layout>
                <PageTitle1>Tobacco Information</PageTitle1>
                <ProductPage
                    description = {tobacco.description}
                >
                    <ProductSideContent>
                        {tobacco.Components &&
                            <StringBubbleList
                                title="Components: "
                                data={tobacco.Components}
                            />}
                        <ProductCallOrVisitButtons />
                    </ProductSideContent>
                    <ProductMainContent>
                        <ProductTitle>{tobacco["Tobacco Name"]}</ProductTitle>
                        <ProductInfoFields
                            fields={[
                                {name: "Brand", value: tobacco['Tobacco Brand']},
                                {name: "Family", value: tobacco['Family']}
                            ]}
                        />
                    </ProductMainContent>
                </ProductPage>
            </Layout>
        </>
    )
}

export default TobaccoPage