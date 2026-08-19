import Head from "next/head"
import Layout from "../../../components/layout"
import PageTitle1 from "../../../components/pagetitle1";
import ProductPage, { Navigation, StringBubbleList } from '../../../components/productPage';
import { ProductImage, ProductSideContent } from '../../../components/productPage';
import { ProductMainContent, ProductTitle } from '../../../components/productPage';
import { ProductInfoFields, ProductCallOrVisitButtons } from '../../../components/productPage';
import { useRouter } from "next/router";
import { SchemaProductPage } from "../../../components/schemaProductPage";
import uiSchema from "../../../public/data/tobacco.ui.schema.json"
import { useEffect, useState } from "react";
import Toolbar from "../../../components/toolbar";
import { PiArrowUUpLeftBold, PiPencilSimpleBold, PiTrashSimpleBold } from "react-icons/pi";

export const getStaticPaths = async () => {
    const tobacco = await import('../../../public/data/tobacco.json');
    const data = await tobacco.default;
    const paths = data.map((tobacco) => ({
        params: { slug: tobacco.slug },
    }));
    return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
    const tobaccoData = await import('../../../public/data/tobacco.json');
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
    const router = useRouter();


    const tobacco = props.tobacco;
    if (!tobacco) {
        return <Layout><PageTitle1>Tobacco not found</PageTitle1></Layout>
    }

    const [tempData, setTempData] = useState(tobacco);
    const [originData, setOriginData] = useState(tobacco);

    const pullTempData = () => {
        const localTempData = JSON.parse(localStorage.getItem('tempData_tobacco'));
        const firstTobaccoWithSameSlug = localTempData.find((tobacco) => tobacco.slug === originData.slug);
        setTempData(firstTobaccoWithSameSlug)
    }

    const pullOriginData = () => {
        const localOriginData = JSON.parse(localStorage.getItem('originData_tobacco'));
        const firstTobaccoWithSameSlug = localOriginData.find((tobacco) => tobacco.slug === originData.slug);
        setOriginData(firstTobaccoWithSameSlug)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pullTempData();
            pullOriginData();
        }
    }, [])

    const restoreTobacco = () => {
        const localTempData = JSON.parse(localStorage.getItem('tempData_tobacco'));
        localStorage.setItem('tempData_tobacco',JSON.stringify(
            [...localTempData, originData],
            null, 4
        ));
        window.location.reload();
    }

    if (!tempData) {
        if (originData) return (
            <Layout>
                <p>This tobacco item has been deleted:</p>
                <pre>{JSON.stringify(originData, null, 4)}</pre>
                <button onClick={restoreTobacco}>Restore?</button>
            </Layout>
        )
        return (
            <Layout>
                <p>This tobacco item was empty for an unidentifiable reason.<br/>It is recommended to reset data to fix this</p>
            </Layout>
        )
    }

    return (
        <>
            <Head>
                <title>{tobacco['Tobacco Name']}</title>
            </Head>
            <Layout>
                <Toolbar
                    links={[
                        {
                            label: "Edit", href: router.asPath + '/edit',
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
                    data={tempData}
                    originalData={originData}
                    sections={[
                        {
                            id: "metadata",
                            label: "METADATA",
                            filter: (n, f) => sectionOf(f) === "metadata" || sectionOf(f) === "image"
                        },
                        {
                            id: "components",
                            label: "COMPONENTS",
                            filter: (n, f) => sectionOf(f) === "components"
                        }
                    ]}
                ></SchemaProductPage>
                {/* <PageTitle1
                    subtitle={tobacco['Tobacco Name']}
                    href="/tobacco"
                    prev={props.prev}
                    next={props.next}
                    nameField="Tobacco Name"
                >Tobacco Information</PageTitle1>
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
                </ProductPage> */}
            </Layout>
        </>
    )
}

const sectionOf = (field) => (field?.ui?.section || "")

export default TobaccoPage