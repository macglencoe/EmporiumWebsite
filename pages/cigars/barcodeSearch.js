import RenderResult from "next/dist/server/render-result"
import Layout from "../../components/layout"
import PageTitle1 from "../../components/pagetitle1"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"


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
            const results = props.data.filter((cigar) => cigar.Sizes.some((size) => size.Barcode.toString().includes(search)));
            setResults(results);
        }
    }, [router.query.search]);

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
                    <input type="search" placeholder="Click here, then scan!" onChange={(e) => setSearchInput(e.target.value)} value={searchInput}></input>
                    <button type="submit">Search</button>
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
                                        <div key={size["Size"]} className={"size" + " " + (size.Barcode.toString().includes(router.query.search) ? "highlight" : "")}>
                                            <b>{size["Size"]}</b> <span className="price">{size["Price"]}</span>
                                            <pre>{size["Barcode"]}</pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                    </>
                }

            </Layout >
            <style jsx>
                {`
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
                    padding: 5px;
                    color: var(--dl-color-theme-primary1);
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .cigar-sizes {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    padding: 12px;
                }
                .size {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                    justify-content: space-evenly;
                    height: 100%;
                    background-color: var(--dl-color-theme-primary2);
                }
                .size.highlight {
                    border-top: 10px solid green;
                    border-bottom: 10px solid green;
                }
                .size.highlight .price {
                    text-decoration: underline;
                    text-decoration-color: green;
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
                }
                form input {
                    background-color: var(--dl-color-theme-primary2);
                }
                form button {
                    border-left: 3px solid var(--dl-color-theme-primary1);
                    background-color: var(--dl-color-theme-primary2);
                }
                `}
            </style>
        </>
    )
}

export default BarcodeSearch