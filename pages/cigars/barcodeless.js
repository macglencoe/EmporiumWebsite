import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';


export const getStaticProps = async () => {
    const data = await import('../../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

export const Barcodeless = (props) => {
    const noBarcodeBrands = new Set(props.data.filter(cigar => cigar.Sizes.filter(size => size.Barcode === "").length > 0).map(cigar => cigar["Cigar Brand"]));
    return (
        <>
            <Layout>
                <PageTitle1>Cigars Without Barcodes</PageTitle1>
                <table>
                    <tr>
                        <th>Brand</th>
                    </tr>
                    {
                        [...noBarcodeBrands].map(brand => {
                            return (
                                <details key={brand}>
                                    <summary><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="24px"><path d="M480-360 280-560h400L480-360Z"/></svg>
                                    {brand}</summary>
                                    <table>
                                        <tr>
                                            <th>Name</th>
                                            <th>Size</th>
                                            <th>Price</th>
                                            <th>Page</th>
                                        </tr>
                                        {
                                            props.data.filter(cigar => cigar["Cigar Brand"] === brand).flatMap(cigar => cigar.Sizes.filter(size => size.Barcode === "")).map((size, index) => {
                                                const cigar = props.data.find(c => c["Cigar Brand"] === brand && c.Sizes.find(s => s.Size === size.Size && s.Barcode === size.Barcode));
                                                return (
                                                    <tr key={`${brand}-${index}`}>
                                                        <td>{cigar["Cigar Name"]}</td>
                                                        <td>{size.Size}</td>
                                                        <td className='price'>{size.Price}</td>
                                                        <td><a href={`/cigars/${cigar.slug}`}>See More</a></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>
                                </details>
                            )
                        })
                    }
                </table>
            </Layout>
            <style jsx>
                {`
            tr a {
                font-style: italic;
                color: var(--dl-color-theme-primary1);
            }
            tr a:hover {
                text-decoration: underline;
            }
            details summary {
                list-style: none;
                cursor: pointer;
                font-size: 1.3em;
                padding: 0.5em;
                border-bottom: 1px solid var(--dl-color-theme-primary1);
                margin: 5px;
                border-bottom-left-radius: 5px;
                border-left: 3px solid var(--dl-color-theme-primary1);
                display: flex;
                align-items: center;
            }
            details[open] summary {
                background-image: linear-gradient(to right, var(--dl-color-theme-primary1) -200%, transparent 100%);
                border-bottom: 1px solid transparent;
            }
            details summary svg {
                fill: var(--dl-color-theme-secondary2);
                transition: 0.3s;
                transform: rotate(-90deg);
                width: 25px;
                scale: 1.35;
                translate: -5px 0;
            }
            details[open] summary svg {
                transform: rotate(0deg);
            }
            table {
                background-color: var(--dl-color-theme-primary2);
                width: 100%;
                border-collapse: collapse;
            }
            table th {
                padding: 5px;
                text-align: left;
                border-bottom: 3px solid var(--dl-color-theme-secondary2);
            }
            table td {
                padding: 5px;
                font-family: Inter;
                border-bottom: 1px solid var(--dl-color-theme-primary1);
                border-right: 1px dashed var(--dl-color-theme-primary1);
            }
            table td.price {
                font-weight: bold;
                font-size: 1.3em;
            }
            `}
            </style>
        </>
    )
}

export default Barcodeless