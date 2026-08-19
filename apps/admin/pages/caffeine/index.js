import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';

export const getStaticProps = async () => {
    const data = await import('../../public/data/caffeine.json');
    return {
        props: {
            data: data.default
        },
    }
}

const CaffeineCatalog = (props) => {

    
    const uniqueRoasts = [...new Set(props.data
        .map(item => item['Roast'])
        .filter(roast => roast != null)
        .map(roast => roast.trim())
    )];

    const uniqueOrigins = [...new Set(props.data
        .map(item => item['Origin'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    return (
        <>
        <Head>
            <title>Coffee & Tea Catalog</title>
        </Head>
        <Layout>
            <PageTitle1>Coffee & Tea</PageTitle1>

            <div className='content-container'>
                <section id='coffee'>
                    <h2>Coffee</h2>
                    <div>
                        <p>Our coffee is available to be enjoyed fresh in-store or for purchase, whole or ground.</p>
                    </div>
                    <h3>Our collection:</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Roast</th>
                        </tr>
                        {props.data
                            .filter(item => item['Type'] === 'Coffee')
                            .map(item => 
                        <tr id={item['slug']}>
                            <td>{item['Product Name']}</td>
                            <td>{item['Roast']}</td>
                        </tr>
                        )}
                    </table>
                </section>
                <section id='tea'>
                    <h2>Tea</h2>
                    <div><p>Enjoy our tea made fresh in-store, or take some home, available by weight.</p></div>
                    <h3>Our collection:</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Origin</th>
                        </tr>
                        {props.data
                            .filter(item => item['Type'] === 'Tea')
                            .map(item =>
                        <tr id={item['slug']}>
                            <td>{item['Product Name']}</td>
                            <td>{item['Origin']}</td>
                        </tr>
                            )}
                    </table>
                </section>
            </div>

        </Layout>
        <style jsx>
                {`
                .content-container {
                    padding: 1em;
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                }
                section {
                    padding: 1em;
                    background-color: var(--dl-color-theme-primary2);
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                }
                section > div img {
                    width: 20vmax;
                    border-right: solid 3px var(--dl-color-theme-secondary2);
                    padding: 1em;
                }

                section > div {
                    display: flex;
                    flex-direction: row;
                    gap: 1em;
                    align-items: center;
                    max-width: 850px;

                }
                section p {
                    font-size: 1.2em;
                }
                section th {
                    font-size: 1.2em;
                    font-variant: small-caps;
                    text-align: left;
                    border-bottom: solid 3px var(--dl-color-theme-secondary2);
                }
                section table {
                    border-spacing: 3px 1em
                }
                section td {
                    font-size: 1.2em;
                    font-weight: bold;
                    border-bottom: dashed 1px var(--dl-color-theme-primary1);
                }
                @media (max-width: 680px) {
                    section p{
                        font-size: 1em;
                    }
                    section > div img {
                        width: 15em;
                        border-right: none;
                        border-bottom: solid 3px var(--dl-color-theme-secondary2);
                    }
                    section div {
                        flex-direction: column;
                    }
                `}
            </style>
            {/* <Catalog
                data={props.data}

                title="Coffee & Tea"
                subtitle="We have a wide selection of coffee and loose-leaf tea, available for purchase in-store"

                filters={[
                    {
                        name:"Roast",
                        label: "Roast",
                        values: uniqueRoasts,
                        defaultValue: "All Roasts"
                    },
                    {
                        name: "Origin",
                        label: "Origin",
                        values: uniqueOrigins,
                        defaultValue: "Any Origin"
                    }
                ]}
                sortOptions={[
                    {value: "Product Name", label: "Name"}
                ]}
                defaultSort="Product Name"

                cardSettings={{
                    title: (item) => {
                        return (item['Product Name'])
                    },

                    data: (item) => {
                        return (
                            [
                            item['Type'] && ['Type', item['Type']],
                            item['Roast'] && ['Roast', item['Roast']],
                            item['Origin'] && ['Origin', item['Origin']]]
                        )
                    },
                    href: (item) => {
                        return('/caffeine/'+item.slug)
                    },
                    buttonText: (item) => {return("See More")}

                }}
            
            /> */}
        </>
    )
}
export default CaffeineCatalog