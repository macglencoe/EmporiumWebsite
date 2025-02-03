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

    const uniqueBrands = [...new Set(props.data
        .map(item => item['Tobacco Brand'])
        .filter(origin => origin != null)
        .map(origin => origin.trim())
    )];

    const uniqueCuts = [...new Set(props.data
        .map(item => item['Cut'])
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
            <Catalog
                data={props.data}

                filters={[
                    {
                        name:"Tobacco Brand",
                        label: "Brand",
                        values: uniqueBrands,
                        defaultValue: "All Brands"
                    },
                    {
                        name: "Cut",
                        label: "Cut",
                        values: uniqueCuts,
                        defaultValue: "All Cuts"
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
                    buttonText: (item) => {return("See More")}

                }}

                
            
            />
        </>
    )
}
export default TobaccoCatalog