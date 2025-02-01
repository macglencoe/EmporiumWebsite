import Layout from '../../components/layout';
import Catalog from '../../components/catalog';

export const getStaticProps = async () => {
    const data = await import('../../public/data/caffeine.json');
    return {
        props: {
            data: data.default
        },
    }
}

const CaffeineCatalog = (props) => {

    
    const uniqueRoasts = [...new Set(props.data
        .map(item => item['Roast'])
        .filter(roast => roast != null)
        .map(roast => roast.trim())
    )];

    const uniqueOrigins = [...new Set(props.data
        .map(item => item['Origin'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    return (
        <>
            <Catalog
                data={props.data}

                filters={[
                    {
                        name:"Roast",
                        label: "Roast",
                        values: uniqueRoasts,
                        defaultValue: "All Roasts"
                    },
                    {
                        name: "Origin",
                        label: "Origin",
                        values: uniqueOrigins,
                        defaultValue: "Any Origin"
                    }
                ]}
                sortOptions={[
                    {value: "Product Name", label: "Name"}
                ]}
                defaultSort="Product Name"

                cardSettings={{
                    title: (item) => {
                        return (item['Product Name'])
                    },

                    data: (item) => {
                        return (
                            [
                            item['Type'] && ['Type', item['Type']],
                            item['Roast'] && ['Roast', item['Roast']],
                            item['Origin'] && ['Origin', item['Origin']]]
                        )
                    },
                    href: (item) => {
                        return('/caffeine/'+item.slug)
                    },
                    buttonText: (item) => {return("See More")}

                }}
            
            />
        </>
    )
}
export default CaffeineCatalog