import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Notice from '../../components/notice';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';

export const getStaticProps = async () => {
    const data = await import('../../public/data/pipes.json');
    return {
        props: {
            data: data.default
        },
    }
}

const PipeCatalog = (props) => {

    
    const uniqueBrands = [...new Set(props.data
        .map(item => item['Pipe Brand'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    const uniqueMaterials = [...new Set(props.data
        .map(item => item['Material'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    const uniqueTypes = [...new Set(props.data
        .map(item => item['Type'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    return (
        <>
            <Head>
                <title>Tobacco Pipe Catalog</title>
            </Head>
            <Layout>
                    <PageTitle1 subtitle="We have a large selection of premium tobacco pipes, available for purchase in-store">
                        Tobacco Pipes</PageTitle1>
                <div className='content-container'>
                    <section className='section-container'>
                        <h2>Premium Brands</h2>
                        <div id='savinelli'>
                            <a href='/savinelli-logo.webp'>
                                <img alt='Savinelli Logo' aria-label='Savinelli'
                                src='/savinelli-logo.webp'></img>
                            </a>
                            <p>Celebrated for their expert craftsmanship and timeless elegance, we offer a curated selection of premium Savinelli tobacco pipes</p>
                        </div>
                        <div id='peterson'>
                            <a href='/peterson-logo.png'>
                                <img alt='Peterson Logo' aria-label='Peterson'
                                src='/peterson-logo.png'></img>
                            </a>
                            <p>Renowned for their distinctive style and exceptional craftsmanship, we present a curated selection of premium Peterson tobacco pipes.</p>
                        </div>
                    </section>
                    <section id='corn-cob-pipes'>
                        <h2>Corn Cob Pipes</h2>
                        <div>
                            <a href='/corn-cob-pipes.png'>
                                <img alt='Corn Cob Pipes Display Case' aria-label='Corn Cob Pipes'
                                src='/corn-cob-pipes.png'></img>
                            </a>
                            <p>Come check out our selection of Missouri Meerschaum Corn Cob pipes in various shapes and sizes!</p>
                        </div>
                    </section>
                    <section id='estate-pipes'>
                        <h2>Estate Pipes</h2>
                        <div>
                            <a href='/estate-pipes.png'>
                                <img alt='Estate Pipes Display Case' aria-label='Estate Pipes'
                                src='/estate-pipes.png'></img>
                            </a>
                            <p>We have a large collection of restored estate pipes. Come find your perfect match!</p>
                        </div>
                    </section>
                </div>

            </Layout>
            {/* <Catalog
                data={props.data}

                title="Tobacco Pipes"

                notices={
                    <Notice>
                        This catalog is not up-to-date. We will update it as soon as possible.
                    </Notice>
                }

                filters={[
                    {
                        name:"Pipe Brand",
                        label: "Brand",
                        values: uniqueBrands,
                        defaultValue: "All Brands"
                    },
                    {
                        name: "Material",
                        label: "Material",
                        values: uniqueMaterials,
                        defaultValue: "All Materials"
                    },
                    {
                        name: "type",
                        label: "Type",
                        values: uniqueTypes,
                        defaultValue: "All Types"
                    }
                ]}
                sortOptions={[
                    {value: "Pipe Name", label: "Name"}
                ]}
                defaultSort="Pipe Name"

                cardSettings={{
                    title: (item) => {
                        return (item['Pipe Name'])
                    },
                    secondaryTitle: (item) => {
                        return(item['Pipe Brand'])
                    },
                    data: (item) => {
                        return (
                            [item['Material'] && ['Material', item['Material']],
                            item['Type'] && ['Type', item['Type']]]
                        )
                    },
                    href: (item) => {
                        return('/pipes/'+item.slug)
                    },
                    buttonText: (item) => {return("See More")}

                }}

                
            
            /> */}
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
export default PipeCatalog