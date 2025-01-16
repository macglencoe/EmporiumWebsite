import Layout from '../../components/layout';
import Catalog from '../../components/catalog';

export const getStaticProps = async () => {
    const data = await import('../../public/data/pipe-example.json');
    return {
        props: {
            data: data.default
        },
    }
}

const PipeCatalog = (props) => {

    const uniqueBrands = [...new Set(props.data.map(item => item['Pipe Brand'].trim()))];

    const uniqueMaterials = [...new Set(props.data.map(item => item['Material'].trim()))];

    return (
        <>
        <Layout>
            <Catalog
                data={props.data}

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
                    }
                ]}
                sortOptions={[
                    {value: "Pipe Name", label: "Name"}
                ]}
                defaultSort="Pipe Name"

                cardSettings={{
                    title: (item) => {
                        return (item['Pipe Brand']+' '+item['Pipe Name'])
                    },
                    data: (item) => {
                        return (
                            [item['Material'] && ['Material', item['Material']]]
                        )
                    },
                    href: (item) => {
                        return('/pipes')
                    },
                    buttonText: (item) => {return("See More")}

                }}
            
            />
        </Layout>
        </>
    )
}
export default PipeCatalog