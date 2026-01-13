import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Notice from '../../components/notice';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';
import BrandCard from '../../components/brandCard';
import Image from 'next/image';
import { PiFactoryDuotone, PiStorefront, PiStorefrontDuotone } from 'react-icons/pi';
import Link from 'next/link';
import TitleCrest from '../../components/titleCrest';
import BasicSection from '../../components/basicSection';

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
                <PageTitle1 description="We have a large selection of premium tobacco pipes, available for purchase in-store">
                    Tobacco Pipes</PageTitle1>
                <div className='flex flex-col gap-3'>
                    <BasicSection backdropSrc='https://images.unsplash.com/photo-1545114687-ab1c9f9fc260?q=80&w=1547&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' title='Premium Brands' titleIcon={PiFactoryDuotone}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto bg-primary2/50 p-5 rounded-2xl'>
                            <BrandCard
                                name="Savinelli"
                                logoSrc="/savinelli-logo.webp"
                                category="Italian Pipes"
                                description="Founded in 1876 by Achille Savinelli Sr., Savinelli is a family-owned company known for its quality pipes. Achille Jr. established the factory in 1948, helping cement Italy’s place in the pipe-making industry. Now led by great-grandson Giancarlo, the original Milan shop still operates. Producing around 100,000 pipes annually, Savinelli is known for its 6mm balsa filter, a mix of vulcanite and acrylic stems, and a variety of machine-made and handcrafted designs."
                            />
                            <BrandCard
                                name="Peterson"
                                logoSrc="/peterson-logo.png"
                                category="Irish Pipes"
                                description="Peterson, the world's longest-running pipe maker, is known for its iconic designs. Featured in media for over a century, their pipes are beloved by many, including Mark Twain, who famously favored the System pipe. This lasting recognition comes from the brand's key innovation: the practical and influential System Pipe."
                            />
                            <BrandCard
                                name="Molina"
                                logoSrc="/molina-logo.png"
                                category="Italian Pipes"
                                description={`Molina, meaning "mill" in Italian, is a fitting name for this esteemed pipe manufacturer with deep-rooted connections to the historic Rossi factory. Whether you're a novice pipe smoker or a seasoned aficionado, Molina pipes deliver craftsmanship and variety to suit every preference.`}
                            />
                            <BrandCard
                                name="Rossi"
                                logoSrc="/rossi-logo.png"
                                category="Italian Pipes"
                                description={`Ferdinando Rossi helped establish briar pipe production in Italy alongside his contemporary, Achille Savinelli. Though competitors, they shared a close friendship. Nearly a century later, Savinelli took over the Rossi brand, aiming to revive it with quality, affordable Italian pipes through Rossi by Savinelli`}
                            />
                        </div>
                    </BasicSection>
                    <BasicSection backdropSrc='/corn-cob-pipes.png' title='Corn Cob Pipes' titleIcon={PiStorefrontDuotone} id='corn-cob-pipes'>
                        <div className='grid md:grid-cols-2 gap-6 items-center max-w-6xl mx-auto'>
                            <div className='space-y-3'>
                                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary1/30 text-secondary2 text-sm font-semibold w-fit'>
                                    Everyday good-smoke option
                                </div>
                                <p className='text-secondary1 text-lg leading-relaxed'>
                                    Missouri Meerschaum cobs in classic shapes, plus short-stem pocket pipes. Great for new smokers or a reliable knockaround pipe.
                                </p>
                                <ul className='space-y-2 text-secondary1 font-inter'>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 h-2 w-2 rounded-full bg-primary1'></span>
                                        <span>Filters and filterless options on hand</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 h-2 w-2 rounded-full bg-primary1'></span>
                                        <span>Replacement stems, pipe cleaners, and cob tools stocked nearby</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 h-2 w-2 rounded-full bg-primary1'></span>
                                        <span>Easy to pair with our bulk aromatics for a starter bundle</span>
                                    </li>
                                </ul>
                            </div>
                            <BasicImage src='/corn-cob-pipes.png' alt="Corn Cob Pipes Display Case" />
                        </div>
                    </BasicSection>
                    <BasicSection backdropSrc='/estate-pipes.png' title='Estate Pipes' titleIcon={PiStorefrontDuotone} id='estate-pipes'>
                        <div className='grid md:grid-cols-2 gap-6 items-center max-w-6xl mx-auto'>
                            <BasicImage src='/estate-pipes.png' alt="Estate Pipes Display Case" />
                            <div className='space-y-3'>
                                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary1 text-primary2 text-sm font-semibold w-fit'>
                                    Curated & cleaned in-house
                                </div>
                                <p className='text-secondary1 text-lg leading-relaxed'>
                                    Estate pipes are hand-selected, restored, sanitized, and ready to smoke.
                                </p>
                                <ul className='space-y-2 text-secondary1 font-inter'>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 h-2 w-2 rounded-full bg-primary1'></span>
                                        <span>Variety of shapes and sizes to choose from</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='mt-1 h-2 w-2 rounded-full bg-primary1'></span>
                                        <span>Priced to make collecting approachable</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BasicSection>
                </div>

            </Layout>
        </>
    )
}
export default PipeCatalog

function BasicImage({ src, alt }) {
    return (
        <a className='max-w-5xl mx-auto z-10 rounded-2xl overflow-hidden border-9 border-primary2/50' href={src} target='_blank'>
            <Image width={1800} height={1000} alt={alt}
                src={src} className='object-cover'></Image>
        </a>
    )
}
