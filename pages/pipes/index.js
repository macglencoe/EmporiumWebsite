import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Notice from '../../components/notice';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';
import BrandCard from '../../components/brandCard';
import Image from 'next/image';
import { PiFactoryDuotone, PiStorefront, PiStorefrontDuotone } from 'react-icons/pi';
import Link from 'next/link';

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
                        <p className='text-center text-xl'>Come check out our selection of Missouri Meerschaum Corn Cob pipes in various shapes and sizes!</p>
                        <BasicImage src='/corn-cob-pipes.png' alt="Corn Cob Pipes Display Case" />
                    </BasicSection>
                    <BasicSection backdropSrc='/estate-pipes.png' title='Estate Pipes' titleIcon={PiStorefrontDuotone} id='estate-pipes'>
                        <p className='text-center text-xl'>We have a large collection of restored estate pipes. Come find your perfect match!</p>
                        <BasicImage src='/estate-pipes.png' alt="Estate Pipes Display Case" />
                    </BasicSection>
                </div>

            </Layout>
        </>
    )
}
export default PipeCatalog

function TitleCrest({ icon, children, ...props }) {
    const IconComponent = icon;
    return (
        <div className='relative my-5 flex flex-col gap-3 items-center' {...props}>
            <div className='relative rounded-full border-9 border-double border-secondary2 h-20 w-20 flex items-center justify-center opacity-30 p-2 bg-primary2'
            >
                <IconComponent className='h-full w-full'
                />
            </div>
            <h2 className='text-center text-3xl md:text-5xl font-bold text-secondary2 tracking-wider'>{children}</h2>
        </div>
    )
}

function BasicSection({ backdropSrc, title, titleIcon, children, ...props }) {
    return (
        <section className='relative bg-primary2/50 py-8 flex flex-col gap-5' {...props}>
            {/* backdrop */}
            <div className='absolute inset-0'>
                <Image layout='fill' className="object-cover opacity-15" src={backdropSrc} />
                <div className='absolute inset-0' style={{
                    boxShadow: "inset 0 0 400px -300px black"
                }} />
            </div>
            <TitleCrest icon={titleIcon}>{title}</TitleCrest>
            {children}
        </section>
    )
}

function BasicImage({ src, alt }) {
    return (
        <a className='max-w-5xl mx-auto z-10 rounded-2xl overflow-hidden border-9 border-primary2/50' href={src} target='_blank'>
            <Image width={1800} height={1000} alt={alt}
                src={src} className='object-cover'></Image>
        </a>
    )
}