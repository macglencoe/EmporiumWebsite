import Head from "next/head";
import Layout from "../../components/layout";
import ProductPage, {
    InteractionPanel,
    StringBubbleList,
    ProductSideContent,
    ProductMainContent,
    ProductTitle,
    ProductInfoFields,
    Disclaimer,
    Navigation,
    ProductImage,
} from '../../components/productPage';


export const getStaticPaths = async () => {
    const { publicProductPaths } = await import('../../lib/catalog/server.mjs');
    return publicProductPaths('tobacco');
}

export const getStaticProps = async ({ params }) => {
    const { readPublicProductPage, PUBLIC_REVALIDATE_SECONDS } = await import('../../lib/catalog/server.mjs');
    const result = await readPublicProductPage('tobacco', params.slug);
    if (!result) return { notFound: true, revalidate: PUBLIC_REVALIDATE_SECONDS };
    const { product: tobacco, prev, next } = result;
    return { props: { tobacco, prev, next }, revalidate: PUBLIC_REVALIDATE_SECONDS };
}


const TobaccoPage = (props) => {

    const tobacco = props.tobacco;
    if (!tobacco) {
        return <Layout><h1 className="px-4 py-6 text-2xl font-bold text-secondary1">Tobacco not found</h1></Layout>
    }


    return (
        <>
            <Head>
                <title>{tobacco['Tobacco Name']}</title>
            </Head>
            <Layout>
                <div className="bg-primary2 h-full">
                    <ProductPage description={tobacco.description}>
                        <ProductMainContent>
                            <ProductTitle
                                breadcrumbs={[
                                    { label: 'Home', href: '/' },
                                    { label: 'Tobacco', href: '/tobacco' },
                                    { label: tobacco['Tobacco Brand'] }
                                ]}
                                meta={tobacco['Family']}
                                description={tobacco.description}
                            >
                                {tobacco["Tobacco Name"]}
                            </ProductTitle>
                            <ProductInfoFields
                                fields={[
                                    { name: "Brand", value: tobacco['Tobacco Brand'] },
                                    { name: "Family", value: tobacco['Family'] },
                                    { name: "Sale Form", value: tobacco['Sale Form'] },
                                ]}
                            />
                        </ProductMainContent>
                        <ProductSideContent>
                            <ProductImage
                                src={tobacco.image}
                                fallbackSearch={encodeURIComponent(tobacco['Tobacco Brand'] + ' ' + tobacco['Tobacco Name'])}
                            />
                            {tobacco.Components &&
                                <StringBubbleList
                                    title="Components"
                                    data={tobacco.Components}
                                />}
                            <InteractionPanel
                                title={tobacco["Tobacco Name"]}
                                text={"Check out this pipe tobacco from King Street Emporium!"}
                            />
                        </ProductSideContent>
                    </ProductPage>
                    <Navigation
                        prev={props.prev}
                        next={props.next}
                        href="/tobacco"
                    />
                    <Disclaimer />
                </div>
            </Layout>
        </>
    )
}

export default TobaccoPage
