import RenderResult from "next/dist/server/render-result"
import Layout from "../../components/layout"
import PageTitle1 from "../../components/pagetitle1"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Barcodeless } from "../../components/barcodeless"


export const getStaticProps = async () => {
    const data = await import('../../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
}

export const BarcodeSearch = (props) => {

    const router = useRouter();

    const [data, setData] = useState(props.data);

    const [results, setResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
        const search = e.target.value;
        router.push({
            pathname: router.pathname,
            query: { search: search }
        },
            undefined,
            { shallow: true }
        );
    }

    useEffect(() => {
        if (router.query.search) {
            const search = router.query.search;
            const results = data.filter((cigar) => cigar.Sizes.some((size) => size.Barcode?.toString().includes(search)));
            setResults(results);
        }
    }, [router.query.search]);

    useEffect(() => {
        if (localStorage.getItem('tempData_cigars')) {
            setData(JSON.parse(localStorage.getItem('tempData_cigars')));   
        }
    }, []);

    /* const result =
    {
        "Cigar Brand": "Aganorsa",
        "Cigar Name": "New Cuba Superior",
        "Wrapper": "",
        "Binder": "",
        "Filler": "",
        "Flavor_Profile": "",
        "Strength_Profile": "",
        "Sizes": [
            {
                "Size": "Robusto",
                "Barcode": 7427025680216,
                "In_Stock": "TRUE",
                "Price": "$\t7.95"
            },
            {
                "Size": "Toro",
                "Barcode": 7427025680223,
                "In_Stock": "TRUE",
                "Price": "$\t8.50"
            }
        ],
        "slug": "aganorsa-new-cuba-superior"
    } */


    return (
        <>
            <Layout>
                <PageTitle1>Barcode Search - Beta</PageTitle1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const trimmedValue = searchInput.replace(/^0+(?=\d)/, '');
                        handleSearch({ target: { value: trimmedValue } });
                        setSearchInput("");
                    }}>
                    <div className="scanner-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-120q-60 0-95.5-46.5T124-270l72-272q-33-21-54.5-57T120-680q0-66 47-113t113-47h320q45 0 68 38t3 78l-80 160q-11 20-29.5 32T520-520h-81l-11 40h12q17 0 28.5 11.5T480-440v80q0 17-11.5 28.5T440-320h-54l-30 112q-11 39-43 63.5T240-120Zm0-80q14 0 24-8t14-21l78-291h-83l-72 270q-5 19 7 34.5t32 15.5Zm40-400h240l80-160H280q-33 0-56.5 23.5T200-680q0 33 23.5 56.5T280-600Zm480-160-25-54 145-66 24 55-144 65Zm120 280-145-65 25-55 144 66-24 54ZM760-650v-60h160v60H760Zm-360-30Zm-85 160Z" /></svg>
                    </div>
                    <input type="search" placeholder="Click here, then scan!" onChange={(e) => setSearchInput(e.target.value)} value={searchInput}></input>
                    <button type="submit" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M790.67-89.33 525-354.33q-29 21.95-68.14 34.64Q417.72-307 372-307q-116.11 0-196.89-80.83-80.78-80.84-80.78-195.5 0-114.67 80.84-195.5Q256-859.67 371-859.67q115 0 195.5 80.84Q647-698 647-583.23q0 45.23-12.33 83.4-12.34 38.16-35.67 70.16L865.67-164l-75 74.67Zm-419.1-322.34q71.93 0 121.35-50 49.41-50 49.41-121.66 0-71.67-49.51-121.67-49.52-50-121.25-50-72.29 0-122.43 50T199-583.33q0 71.66 50.04 121.66t122.53 50Z" />
                        </svg>
                    </button>
                </form>


                {
                    results.length > 0 &&
                    <>
                        <h1>{results.length} Result{results.length > 1 && "s"}</h1>
                        {results.map((result) => {
                            return (
                                <div className="result">
                                    <div className="cigar-info">
                                        {result["Cigar Name"] && <h2>{result["Cigar Name"]}</h2>}
                                        {result["Cigar Brand"] && <b>{result["Cigar Brand"]}</b>}
                                        <a href={`/cigars/${result["slug"]}`}><button>View Product</button></a>
                                    </div>
                                    <div className="cigar-sizes">
                                        {result["Sizes"] && result["Sizes"].map((size) => (
                                            <div
                                                key={size["Size"]}
                                                className={`
                                                    size
                                                    ${size.Barcode.toString() === router.query.search ? "match" : ""}
                                                    ${size.Barcode.toString().includes(router.query.search) ? "include" : ""}
                                                `}
                                            >
                                                <b>{size["Size"]}</b>
                                                <span className="price">{size["Price"]}</span>
                                                <pre>{size["Barcode"]}</pre>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                }

                <div className="help">
                    <h1>Help</h1>
                    <p>Results are color-coded, based on how well the search matches any particular size's barcode</p>
                    <ul>
                        <li>
                            <div style={{
                                border: "solid var(--positive)",
                                borderWidth: "10px 0 10px 0",
                                backgroundColor: "var(--dl-color-theme-primary2)",
                                width: "fit-content",
                                padding: "3px"
                            }}>
                                <p style={{
                                    textDecoration: "underline",
                                    textDecorationColor: "var(--positive)"
                                }}>$5.00</p>
                            </div>
                            <p>= Exact match</p>
                        </li>
                        <li>
                            <div style={{
                                border: "solid var(--neutral)",
                                borderWidth: "10px 0 10px 0",
                                backgroundColor: "var(--dl-color-theme-primary2)",
                                width: "fit-content",
                                padding: "3px"
                            }}>
                                <p style={{
                                    textDecoration: "underline",
                                    textDecorationColor: "var(--neutral)"
                                }}>$5.00</p>
                            </div>
                            <p>= Partial match</p>
                        </li>
                        <li>
                            <div style={{
                                backgroundColor: "var(--dl-color-theme-primary2)",
                                width: "fit-content",
                                padding: "13px 3px 13px 3px"
                            }}>
                                <p>$5.00</p>
                            </div>
                            <p> = No match</p>
                        </li>
                    </ul>
                </div>
                <Barcodeless data={[...data]} />

            </Layout >
            <style jsx>
                {`
                .help {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .help ul {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 10px;
                }
                .help li {
                    display: flex;
                    flex-direction: row;
                    gap: 12px;
                    align-items: center;
                }
                h1 {
                    font-family: Inter;
                    padding: 0.25em;
                    margin: 0.25em;
                    border-bottom: 9px double var(--dl-color-theme-secondary2);
                }
                .result {
                    display: flex;
                    flex-direction: row;
                    gap: 12px;
                }
                .cigar-info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                    border-right: 3px solid var(--dl-color-theme-secondary2);
                    justify-content: space-between;
                }
                .cigar-info button {
                    background-color: var(--dl-color-theme-secondary2);
                    padding: 10px;
                    color: var(--dl-color-theme-primary1);
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .cigar-sizes {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 12px;
                }
                .size {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                    justify-content: space-evenly;
                    background-color: var(--dl-color-theme-primary2);
                }
                .size.match {
                    border-top: 10px solid var(--positive);
                    border-bottom: 10px solid var(--positive);
                }
                .size.match .price {
                    text-decoration: underline;
                    text-decoration-color: var(--positive);
                }
                .size.include:not(.match) {
                    border-top: 10px solid var(--neutral);
                    border-bottom: 10px solid var(--neutral);
                }
                .size.include:not(.match) .price {
                    text-decoration: underline;
                    text-decoration-color: var(--neutral);
                }
                .price {
                    font-size: 2em;
                    font-family: Inter;
                }
                form {
                    font-family: Inter;
                    font-size: 1.4em;
                    display: flex;
                    flex-direction: row;
                    align-self: center;
                    margin: 0.5em;
                    overflow: hidden;
                    border-radius: 12px;
                }
                form:focus-within div.scanner-icon {
                    background-color: var(--positive);
                }
                form:not(:focus-within) div.scanner-icon {
                    background-color: var(--negative);
                }
                
                form div.scanner-icon {
                    background-color: var(--dl-color-theme-primary2);
                    padding: 0.2em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 5px solid var(--dl-color-theme-primary1);
                }
                form div.scanner-icon svg {
                    width: 1.5em;
                    height: 1.5em;
                    fill: var(--dl-color-theme-primary2);
                }
                form input {
                    background-color: var(--dl-color-theme-primary2);
                    padding: 0.5em;
                    outline: none;
                }
                form input:focus::placeholder {
                    color: transparent;
                }
                form button {
                    border-left: 5px solid var(--dl-color-theme-primary1);
                    background-color: var(--dl-color-theme-primary2);
                    color: var(--dl-color-theme-primary1);
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    padding: 0.2em;
                    align-items: center;
                }
                form button svg {
                    width: 1.5em;
                    height: 1.5em;
                    fill: var(--dl-color-theme-secondary2);
                }
                `}
            </style>
        </>
    )
}

export default BarcodeSearch