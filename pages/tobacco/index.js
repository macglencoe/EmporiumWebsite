import Layout from '../../components/layout';
import Catalog from '../../components/catalog';

export const getStaticProps = async () => {
    const data = await import('../../public/data/tobacco.json');
    return {
        props: {
            data: data.default
        },
    }
}

const TobaccoCatalog = (props) => {

    const uniqueBrands = [...new Set(props.data.map(item => item['Tobacco Brand'].trim()))];

    return (
        <>
        <Layout>
            <Catalog
                data={props.data}

                filters={[
                    {
                        name:"Tobacco Brand",
                        label: "Brand",
                        values: uniqueBrands,
                        defaultValue: "All Brands"
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
                    buttonText: (item) => {return("See More")}

                }}

                
            
            />
        </Layout>
        </>
    )
}
export default TobaccoCatalog