import Layout from "../components/layout"
import PageTitle1 from "../components/pagetitle1"


export const DataReset = () => {
    return (
        <>
            <Layout>
                <PageTitle1>Reset Data</PageTitle1>
                <div>
                    <b>This is used to reset the data stored on the browser, to pull fresh data from the database</b>
                    <h2>Are you sure you want to reset the data?</h2>
                    <button onClick={() => localStorage.removeItem("tempData_cigars")}>Reset Data</button>
                </div>
            </Layout>
            <style jsx>
                {`
div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}
button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-tertiary1);
    border-radius: 5px;
    padding: 10px 20px;
    color: var(--dl-color-theme-primary1);
    font-weight: bold;
    cursor: pointer;
}
button:hover {
    color: var(--dl-color-theme-primary2);
}
                `}
            </style>
        </>
    )
}

export default DataReset