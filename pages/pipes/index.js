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
                            <p>Founded in 1876 by Achille Savinelli Sr., Savinelli is a family-owned company known for its quality pipes. Achille Jr. established the factory in 1948, helping cement Italy’s place in the pipe-making industry. Now led by great-grandson Giancarlo, the original Milan shop still operates. Producing around 100,000 pipes annually, Savinelli is known for its 6mm balsa filter, a mix of vulcanite and acrylic stems, and a variety of machine-made and handcrafted designs.</p>
                        </div>
                        <div id='peterson'>
                            <a href='/peterson-logo.png'>
                                <img alt='Peterson Logo' aria-label='Peterson'
                                    src='/peterson-logo.png'></img>
                            </a>
                            <p>Peterson, the world’s longest-running pipe maker, is known for its iconic designs. Featured in media for over a century, their pipes are beloved by many, including Mark Twain, who famously favored the System pipe. This lasting recognition comes from the brand’s key innovation: the practical and influential System Pipe.</p>
                        </div>
                        <div id='molina'>
                            <a href='/molina-logo.png'>
                                <img alt='Molina Logo' aria-label='Molina'
                                    src='/molina-logo.png'></img>
                            </a>
                            <p>Molina, meaning "mill" in Italian, is a fitting name for this esteemed pipe manufacturer with deep-rooted connections to the historic Rossi factory. Whether you're a novice pipe smoker or a seasoned aficionado, Molina pipes deliver craftsmanship and variety to suit every preference.</p>
                        </div>
                        <div id='rossi'>
                            <a href='/rossi-logo.png'>
                                <img alt='Rossi Logo' aria-label='Rossi'
                                    src='/rossi-logo.png'></img>
                            </a>
                            <p>Ferdinando Rossi helped establish briar pipe production in Italy alongside his contemporary, Achille Savinelli. Though competitors, they shared a close friendship. Nearly a century later, Savinelli took over the Rossi brand, aiming to revive it with quality, affordable Italian pipes through <i>Rossi by Savinelli</i>.</p>
                        </div>
                    </section>
                    <section id='corn-cob-pipes'>
                        <h2>Corn Cob Pipes</h2>
                        <div>
                            <a href='/corn-cob-pipes.png'>
                                <div className='photo'>
                                    <img alt='Corn Cob Pipes Display Case' aria-label='Corn Cob Pipes'
                                        src='/corn-cob-pipes.png' className='image'></img>
                                </div>
                            </a>
                            <p>Come check out our selection of Missouri Meerschaum Corn Cob pipes in various shapes and sizes!</p>
                        </div>
                    </section>
                    <section id='estate-pipes'>
                        <h2>Estate Pipes</h2>
                        <div>
                            <a href='/estate-pipes.png'>
                                <div className='photo'>
                                    <img alt='Estate Pipes Display Case' aria-label='Estate Pipes'
                                        src='/estate-pipes.png'></img>
                                </div>
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
                }
                section > div a {
                    display: flex;
                    flex-direction: row;
                }
                section > div a::after {
                    content: "";
                    display: block;
                    padding-left: 1em;
                    border-right: 3px solid var(--dl-color-theme-secondary2);
                    
                }
                .photo {
                    width: 100%;
                    height: 100%;
                    border: outset 5px var(--dl-color-theme-secondary2);
                    border-radius: 10px;
                    transition: transform 0.3s;
                    display: flex;
                }
                .photo:hover {
                    transform: scale(1.05);
                }
                
                section > div {
                    display: flex;
                    flex-direction: row;
                    gap: 1em;
                    align-items: center;

                }
                section p {
                    text-indent: 1em;
                    line-height: 1.5em;
                }
                @media (min-width: 681px) {
                    .photo:hover::before {
                    content: "Click to enlarge";
                    position: absolute;
                    top: -1px;
                    left: -1px;
                    background-color: var(--dl-color-theme-secondary2);
                    color: white;
                    font-weight: 500;
                    padding: 5px 10px;
                    border-radius: 0 0 10px 0;
                    font-size: 14px;
                    pointer-events: none;
                }
                }
                @media (max-width: 680px) {
                    section p{
                        font-size: 1em;
                    }
                    section > div img {
                        width: 15em;
                    }

                    section > div a {
                        flex-direction: column;
                    }

                    section > div a::after {
                        border-right: none;
                        border-bottom: solid 3px var(--dl-color-theme-secondary2);
                        padding-left: 0;
                        padding-top: 0.5em;
                    }
                    section div {
                        flex-direction: column;
                    }
                    .photo::after {
                        content: "Click to enlarge";
                        position: relative;
                        
                        background-color: var(--dl-color-theme-secondary2);
                        color: white;
                        font-weight: 500;
                        padding: 5px 10px;
                        
                        font-size: 14px;
                        pointer-events: none;
                    }
                `}
            </style>
        </>
    )
}
export default PipeCatalog