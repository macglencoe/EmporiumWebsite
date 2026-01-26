import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import PageTitle1 from "../../../components/pagetitle1";



export const getStaticPaths = async () => {
    const tobaccos = await import("../../../public/data/tobacco.json");
    const data = await tobaccos.default;
    const paths = data.map((tobacco) => ({
        params: { slug: tobacco.slug },
    }));
    return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
    const tobaccosData = await import("../../../public/data/tobacco.json");
    const data = await tobaccosData.default;
    const tobaccoIndex = data.findIndex((tobacco) => tobacco.slug === params.slug);
    const tobacco = data[tobaccoIndex];
    const prevTobacco = tobaccoIndex > 0 ? data[tobaccoIndex - 1] : null;
    const nextTobacco = tobaccoIndex + 1 < data.length ? data[tobaccoIndex + 1] : null;
    return { props: {tobacco, next: nextTobacco, prev: prevTobacco, allTobacco: data } };
}

const DeleteTobaccoPage = (props) => {
    const router = useRouter();
    const [tobaccoLocalData, setTobaccoLocalData] = useState(props.tobacco);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pullTempData();
        }
    }, [router.asPath])

    const pullTempData = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_tobacco'));
        const firstTobaccoWithSameSlug = tempData.find((tobacco) => tobacco?.slug === tobaccoLocalData.slug);
        setTobaccoLocalData(firstTobaccoWithSameSlug);
    }

    const deleteTobacco = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_tobacco'));
        const index = tempData.findIndex(item => item.slug === tobaccoLocalData.slug);
        if (index !== -1) {
            tempData.splice(index, 1);
            localStorage.setItem('tempData_tobacco', JSON.stringify(tempData));
            alert('Tobacco deleted');
            router.push('/tobacco')
        }
    }

    return (
        <>
            <Layout>
                <PageTitle1>Delete Tobacco</PageTitle1>
                <section>
                    <h2>Understand the ramifications</h2>
                    <p>Deleting this tobacco will remove it from the temporary data for this session.
                        <br></br>
                    Upon submitting all changes to GitHub, this change will be permanent.
                    </p>
                    <div className="confirmation">
                        <h2>Confirm deletion of the following data:</h2>
                        <pre>{JSON.stringify(tobaccoLocalData, null, 2)}</pre>
                        <button onClick={deleteTobacco}>Delete Tobacco</button>
                    </div>
                </section>
    
            </Layout>
            <style jsx>
                {`
section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}
.confirmation {
    background-color: var(--dl-color-theme-primary2);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.confirmation h2 {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary2);
    padding: 10px;
}
.confirmation pre {
    padding: 10px;
}
.confirmation button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    padding: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}
.confirmation button:hover {
    background-color: red;
    color: var(--dl-color-theme-primary2);
}
                `}
            </style>
        </>
    )
}

export default DeleteTobaccoPage;