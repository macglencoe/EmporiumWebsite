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
    return (
        <>
            <Layout>
                <PageTitle1>Cigars Without Barcodes</PageTitle1>
                <table>
                    <tr>
                        <th>Brand</th>
                    </tr>
                    {
                        [...new Set(props.data.map(cigar => cigar["Cigar Brand"]))].map(brand => {
                            const cigarsWithNoBarcodes = props.data
                                .filter(cigar => cigar["Cigar Brand"] === brand)
                                .flatMap(cigar => cigar.Sizes.filter(size => !size.Barcode || size.Barcode === ""))
                            if (cigarsWithNoBarcodes.length > 0) {
                                return (
                                    <details key={brand}>
                                        <summary>{brand}</summary>
                                        <table>
                                            <tr>
                                                <th>Name</th>
                                                <th>Size</th>
                                                <th>Price</th>
                                                <th>Page</th>
                                            </tr>
                                            {
                                                cigarsWithNoBarcodes.map((size, index) => {
                                                    const cigar = props.data.find(c => c.Sizes.find(s => s.Size === size.Size && s.Barcode === size.Barcode));
                                                    return (
                                                        <tr key={`${brand}-${index}`}>
                                                            <td>{cigar["Cigar Name"]}</td>
                                                            <td>{size.Size}</td>
                                                            <td className='price'>{size.Price ? `$ ${size.Price}` : "None"}</td>
                                                            <td><a href={`/cigars/${cigar.slug}`}>See More</a></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </table>
                                    </details>
                                )
                            }
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
                cursor: pointer;
                font-size: 1.3em;
                padding: 0.5em;
                border-bottom: 1px solid var(--dl-color-theme-primary1);
                margin: 5px;
                border-bottom-left-radius: 5px;
                border-left: 3px solid var(--dl-color-theme-primary1);
            }
            details:not([open]) summary {
            }
            details[open] summary {
                background-image: linear-gradient(to right, var(--dl-color-theme-primary1) -200%, transparent 100%);
                border-bottom: 1px solid transparent;
            }
            table {
                background-color: var(--dl-color-theme-primary2);
                width: 100%;
            }
            table th {
                text-align: left;
                border-bottom: 3px solid var(--dl-color-theme-secondary2);
            }
            table td {
                font-family: Inter;
                border-bottom: 1px solid var(--dl-color-theme-primary1);
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