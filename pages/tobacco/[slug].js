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
    const tobaccoIndex = data.findIndex((tobacco) => tobacco.slug === params.slug);
    const tobacco = data[tobaccoIndex];

    const prevTobacco = tobaccoIndex > 0 ? data[tobaccoIndex - 1] : null;
    const nextTobacco = tobaccoIndex + 1 < data.length ? data[tobaccoIndex + 1] : null;
    console.warn(tobaccoIndex)
    return {
        props: {
            tobacco,
            prev: prevTobacco,
            next: nextTobacco
        },
    };
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
                        nameField="Tobacco Name"
                    />
                    <Disclaimer />
                </div>
            </Layout>
        </>
    )
}

export default TobaccoPage
