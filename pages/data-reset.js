import { Router, useRouter } from "next/router"
import Layout from "../components/layout"
import PageTitle1 from "../components/pagetitle1"
import resetData from "../utils/resetData"


export async function getServerSideProps() {
    return {
        props: {
            commitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'Unknown',
        },
    }
}

export const DataReset = (props) => {
    const router = useRouter();
    const handleReset = async () => {
        await resetData({commitSha: props.commitSha, force: true});
        router.push('/');
    }
    return (
        <>
            <Layout>
                <PageTitle1>Reset Data</PageTitle1>
                <div>
                    <p>This is used to reset the data stored on the browser, for pulling fresh data from the database</p>
                    <b>This will discard any unsubmitted changes</b>
                    <div className="confirmation">
                        <h2>Are you sure?</h2>
                        <img src="/areyousure.jpg" />
                        <button onClick={handleReset}>Reset Data</button>
                    </div>
                </div>
            </Layout>
            <style jsx>
                {`
div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}
div b {
    font-family: Inter;
}
div.confirmation {
    display: flex;
    flex-direction: column;
    gap: 0px;
    margin: 20px;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
    justify-content: center;
    align-items: stretch;
    overflow: hidden;
    width: min-content;
}
div.confirmation h2 {
    padding: 10px;
    color: var(--dl-color-theme-primary2);
    background-color: var(--dl-color-theme-secondary2);
    font-family: Inter;
    white-space: nowrap;
}
div.confirmation img {
    width: 100%;
}
div.confirmation button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-tertiary1);
    padding: 10px;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
}
div.confirmation button:hover {
    color: var(--dl-color-theme-primary2);
}
                `}
            </style>
        </>
    )
}

export default DataReset