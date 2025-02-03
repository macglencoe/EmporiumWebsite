import Layout from '../../components/layout';
import Catalog from '../../components/catalog';

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

                
            
            />
        </>
    )
}
export default PipeCatalog