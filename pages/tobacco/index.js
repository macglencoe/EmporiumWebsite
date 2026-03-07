import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Head from 'next/head';
import { PiApproximateEquals, PiDiamondsFour, PiDiamondsFourFill, PiFactory, PiFactoryFill, PiPackage, PiTreeStructure, PiTreeStructureFill } from 'react-icons/pi';

export const getStaticProps = async () => {
    const data = await import('../../public/data/tobacco.json');
    return {
        props: {
            data: data.default
        },
    }
}

const TobaccoCatalog = (props) => {

    const uniqueBrands = [...new Set(props.data
        .map(item => item['Tobacco Brand'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];


    const uniqueComponents = [...new Set((props.data)
        .flatMap(item => item['Components'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];


    const uniqueFamilies = [...new Set(props.data
        .map(item => item['Family'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    return (
        <>
        <Head>
            <title>Tobacco Catalog</title>
        </Head>
            <Catalog
                data={props.data}

                title="Tobacco"
                description='Our collection of pipe tobacco blends, available for purchase and sampling in-store'

                filters={[
                    {
                        name:"Tobacco Brand",
                        label: "Brand",
                        values: uniqueBrands,
                        defaultValue: "All Brands",
                        icon: PiFactoryFill
                    },
                    {
                        name: "Components",
                        label: "Components",
                        values: uniqueComponents,
                        defaultValue: "Any Components",
                        icon: PiDiamondsFourFill
                    },
                    {
                        name: "Family",
                        label: "Family",
                        values: uniqueFamilies,
                        defaultValue: "All Families",
                        icon: PiTreeStructureFill
                    }
                ]}
                sortOptions={[
                    {value: "Tobacco Name", label: "Name"}
                ]}
                defaultSort="Tobacco Name"

                cardSettings={{
                    title: (item) => {
                        return (item['Tobacco Name'])
                    },
                    data: (item) => {
                        return ( [
                            item['Tobacco Brand'] &&
                                {
                                    value: item['Tobacco Brand'],
                                    label: 'Brand',
                                    type: 'hidden-label',
                                    icon: PiFactory
                                },
                            item['Family'] &&
                                {
                                    value: item['Family'],
                                    label: 'Family',
                                    type: 'hidden-label',
                                    icon: PiTreeStructure
                                },
                            item['Sale Form'] &&
                                {
                                    value: item['Sale Form'],
                                    label: 'Sale Form',
                                    type: 'hidden-label',
                                    icon: PiPackage
                                }, 
                            item['Components'] && Array.isArray(item['Components']) &&
                                {
                                    value: item['Components'].join(', '),
                                    label: 'Components',
                                    type: 'tags hidden-label',
                                    icon: PiDiamondsFour
                                }
                            ]
                        )
                    },
                    href: (item) => {
                        return('/tobacco/'+item.slug)
                    },

                    description: (item) => {
                        return (
                            item['description']
                        )
                    }

                }}
                featuredStats={[
                    {
                        title: `${props.data?.length} Blends`,
                        subtitle: "To browse",
                        description: "Love pipe tobacco? We have plenty! Look through our collection online, or try them out in-person!",
                        backdrop: "/tobacco-jars.jpg"
                    },
                    {
                        title: 'Your favorite brands',
                        subtitle: 'And our own blends',
                        description: "While we mostly sell our own blends made in-house, we are proud to sell Cornell & Diehl, Lane, and more!",
                        backdrop: "/tobacco-tins.jpg"
                    }
                ]}

                
            
            />
        </>
    )
}
export default TobaccoCatalog