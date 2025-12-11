import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Head from 'next/head';
import PageTitle1 from '../../components/pagetitle1';
import Image from 'next/image';
import BasicSection from '../../components/basicSection';
import { PiCoffeeBeanDuotone, PiGlobeHemisphereEastDuotone, PiLeaf, PiLeafDuotone, PiOven } from 'react-icons/pi';
import { BsKeyFill } from 'react-icons/bs';
import clsx from 'clsx';

export const getStaticProps = async () => {
    const data = await import('../../public/data/caffeine.json');
    return {
        props: {
            data: data.default
        },
    }
}

const cardColors = {
    light: { 
        fg: 'text-amber-950', 
        from: 'from-amber-100', 
        to: 'to-amber-200',
        flagBg: 'bg-amber-200',
        border: 'border-amber-100'

    },
    medium: {
        fg: 'text-amber-50',  
        from: 'from-amber-500', 
        to: 'to-amber-700',
        flagBg: 'bg-amber-700',
        border: 'border-amber-500'
    },
    dark:  { 
        fg: 'text-amber-50',  
        from: 'from-amber-900', 
        to: 'to-stone-800',
        flagBg: 'bg-stone-800',
        border: 'border-amber-900'
    },
    tea: {
        fg: 'text-green-900',
        from: 'from-green-50',
        to: 'to-green-200',
        flagBg: 'bg-green-200',
        border: 'border-green-100'
    }
};

function CaffeineHero({ count }) {
    return (
        <div className='border-9 border-double border-primary1/30 bg-secondary2 relative text-primary2 py-5 m-3'>
            {/* Backdrop */}
            <div className='absolute inset-0 z-[0] opacity-30'>
                <Image layout='fill' className="object-cover" src="https://images.unsplash.com/photo-1433891248364-3ce993ff0e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <div className='max-w-5xl mx-auto flex flex-row flex-wrap gap-5 z-[2] relative'>
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

function CaffeineCard({
        title, data, flag, icon, className,
        colors = {
            "fg": "",
            "from": "",
            "to": "",
            "flagBg": "",
            "border": ""
        },
        ...props
    }) {
    const IconComponent = icon;
    return (
        <article className={
                clsx(
                    `bg-primary2 max-w-md flex flex-col gap-1 p-3 rounded-xl relative`+' '+className+' '+
                    `bg-linear-to-br ${colors.from} ${colors.to} ${colors.fg} ${colors.border} border-2`
                )}
                {...props}>
            <IconComponent className="w-6 h-6 ml-2" />
            <h3 className={
                clsx(
                    `text-left mx-3 mt-3 mb-1 text-lg font-bold uppercase tracking-wide`+' '+
                    `${colors.fg}`
                )}
            >{title}</h3>
            {flag &&
                <span className={
                    clsx(
                        `absolute right-2 top-2 font-inter text-xs font-semibold tracking-tight py-1 px-1.5 rounded-lg border-2`+' '+
                        `${colors.flagBg} ${colors.fg} ${colors.border}`
                    )}
                >{flag}</span>
            }
            {
                Array.isArray(data) &&              // data is array
                data.length > 0 &&                  // array is not empty
                data.some((item) => item.value) &&  // each item has a value

                <dl>
                    {data?.map((item, index) => (
                        <div className='flex flex-row justify-left gap-2 py-2 px-2 font-inter' id={index}>
                            <dt className='flex flex-row items-center gap-2 font-bold'>
                                {item.icon && <item.icon className="w-4.5 h-4.5 text-secondary1/70"/>}
                                <span className='sr-only'>{item.key}</span>
                            </dt>
                            <dd>{item.value}</dd>
                        </div>
                    ))}
                </dl>
            }
        </article>
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

                <div className='flex flex-col gap-2'>
                    <BasicSection
                        backdropSrc="https://images.unsplash.com/photo-1606486544554-164d98da4889?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Coffee"
                        titleIcon={PiCoffeeBeanDuotone}
                    >
                        <div className='grid gap-3 px-3' style={{
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
                        }}>
                            {props.data
                                .filter(item => item['Type'] === 'Coffee')
                                .map(item =>
                                    <CaffeineCard
                                        title={item['Product Name']}
                                        icon={PiCoffeeBeanDuotone}
                                        flag={item.Roast && item.Roast + " Roast"}
                                        colors={
                                            item.Roast == "Light" ? cardColors.light :
                                            item.Roast == "Medium" ? cardColors.medium :
                                            item.Roast == "Dark" || item.Roast == "Extra-Dark" ? cardColors.dark :
                                            cardColors.medium
                                        }
                                    />
                                )
        
                            }
                        </div>
                    </BasicSection>
    
                    <BasicSection
                        backdropSrc="https://images.unsplash.com/photo-1543060895-03f57478a710?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Tea"
                        titleIcon={PiLeafDuotone}
                    >
                        <div className='grid gap-3 px-3' style={{
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
                        }}>
                            { props.data
                                .filter(item => item['Type'] === 'Tea')
                                .map(item =>
                                    <CaffeineCard
                                        title={item['Product Name']}
                                        icon={PiLeafDuotone}
                                        data={[
                                            item['Origin'] != null &&
                                            {
                                                key: "Origin",
                                                value: item['Origin'],
                                                icon: PiGlobeHemisphereEastDuotone
                                            }
                                        ]}
                                        colors={cardColors.tea}
                                    />
                                )
    
                            }
                        </div>
                    </BasicSection>
                </div>
            </Layout>
        </>
    )
}
export default CaffeineCatalog