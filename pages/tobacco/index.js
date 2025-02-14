import Layout from '../../components/layout';
import Catalog from '../../components/catalog';
import Head from 'next/head';

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

                filters={[
                    {
                        name:"Tobacco Brand",
                        label: "Brand",
                        values: uniqueBrands,
                        defaultValue: "All Brands"
                    },
                    {
                        name: "Components",
                        label: "Components",
                        values: uniqueComponents,
                        defaultValue: "Any Components",
                    },
                    {
                        name: "Family",
                        label: "Family",
                        values: uniqueFamilies,
                        defaultValue: "All Families"
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
                        return (
                            [item['Family'] && ['Family', item['Family']],
                            item['Cut'] && ['Cut', item['Cut']],
                            item['Tobacco Brand'] && ['Brand', item['Tobacco Brand']]]
                        )
                    },
                    href: (item) => {
                        return('/tobacco/'+item.slug)
                    },
                    buttonText: (item) => {
                        return(
                            item["Components"] && item["Components"].length > 1 ?
                                item["Components"].length + ' Components' :
                                item["Components"]
                        )
                    }

                }}

                
            
            />
        </>
    )
}
export default TobaccoCatalog