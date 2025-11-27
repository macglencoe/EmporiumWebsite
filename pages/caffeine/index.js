import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';
import Image from 'next/image';

export const getStaticProps = async () => {
    const data = await import('../../public/data/caffeine.json');
    return {
        props: {
            data: data.default
        },
    }
}

function CaffeineHero({ count }) {
    return (
        <div className='border-9 border-double border-primary1/30 bg-secondary2 relative text-primary2 py-5 m-3'>
            {/* Backdrop */}
            <div className='absolute inset-0 z-10 opacity-30'>
                <Image layout='fill' className="object-cover" src="https://images.unsplash.com/photo-1433891248364-3ce993ff0e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <div className='max-w-5xl mx-auto flex flex-row flex-wrap gap-5 z-20 relative'>
                {/* Left column */}
                <div className='flex-2'>
                    <p className='text-lg'>Browse our selection of coffee and tea at The King Street Emporium, available to be enjoyed fresh in-store, or purchased by weight</p>
                </div>
                {/* Right column */}
                <div className='flex-1 text-right'>
                    <p className='text-5xl font-black'>{count} options</p>
                </div>
            </div>
        </div>
    )
}

const CaffeineCatalog = (props) => {

    return (
        <>
        <Head>
            <title>Coffee & Tea Catalog</title>
        </Head>
        <Layout>
            <PageTitle1>Coffee & Tea</PageTitle1>
            <CaffeineHero count={
                props.data?.length
            } />

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
            
        </>
    )
}
export default CaffeineCatalog