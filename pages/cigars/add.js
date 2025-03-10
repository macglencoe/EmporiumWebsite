import { useEffect, useState } from "react"
import Layout from "../../components/layout"

export const getStaticProps = async () => {
    const data = await import('../../public/data/consolidated_cigars.json');
    return {
      props: {
        data: data.default
      },
    };
  };

const AddCigarPage = (props) => {
    const [cigar, setCigar] = useState({
        "Cigar Brand": "Zino",
      "Cigar Name": "Zino",
      "Wrapper": "Ecuadorian Connecticut",
      "Binder": "Nicaraguan",
      "Filler": "Dominican, Honduran, Nicaraguan",
      "Flavor_Profile": "Earth, Cedar, Coffee, Dark Chocolate, Cream, Spices",
      "Strength_Profile": "Medium-Full",
      "Sizes": [
          {
              "Size": "Toro",
              "Barcode": 7623500431704,
              "In_Stock": "TRUE",
              "Price": "$\t7.35"
          },
          {
              "Size": "Robusto",
              "Barcode": 7623500431698,
              "In_Stock": "TRUE",
              "Price": "$\t7.20"
          }
      ],
      "slug": "zino-zino"
    });

    /* const cigarFields = Object.keys(cigar).map((key, index) => {
        return (
            <div key={index}>
                <label>{key}</label>
                <input type="text" value={cigar[key]} onChange={(e) => setCigar({ ...cigar, [key]: e.target.value })} />
            </div>
        );
    }); */

    const cigarFields = {
        'Cigar Brand': "",
        'Cigar Name': "",
        'Wrapper': "",
        'Binder': "",
        'Filler': "",
        "Flavor_Profile": "",
        "Strength_Profile": "",
        "Sizes": [{}]
        // 'slug': "", // slug is generated from the cigar name, added afterwards
    }

    const sizeFields = {
        "Size": "",
        "Barcode": "",
        "In_Stock": "",
        "Price": ""
    }

    const [tempData, setTempData] = useState(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setTempData(JSON.parse(localStorage.getItem('tempData_cigars')));
        }
    }, []);
    
    return (


        <>
            <Layout>
                <section onSubmit={
                    (e) => {
                        fetch('/api/addCigar', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(cigar),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }
                }
                >
                    {
                        Object.keys(cigarFields).map((key, index) => {
                            if (typeof cigarFields[key] === "string")
                                return (
                                    <div key={index}>
                                        <label>{key}</label>
                                        <input type="text" value={cigar[key]} onChange={(e) => setCigar({ ...cigar, [key]: e.target.value })} />
                                    </div>
                                );
                            else if (Array.isArray(cigarFields[key]))
                                if (key === "Sizes")
                                    return (
                                        <div id="sizes">
                                            <h2>{key}</h2>
                                            {cigar.Sizes.map((size, sizeIndex) => {
                                                return (
                                                    <div key={index} className="l2">
                                                        {Object.keys(sizeFields).map((key, index) => {
                                                            return (
                                                                <div>
                                                                    <label>{key}</label>
                                                                    <input
                                                                        type="text"
                                                                        value={cigar.Sizes[sizeIndex][key]}
                                                                        onChange={(e) => {
                                                                            const updatedSizes = [...cigar.Sizes];
                                                                            updatedSizes[sizeIndex][key] = e.target.value;
                                                                            setCigar({ ...cigar, Sizes: updatedSizes });
                                                                        }}
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                        )}
                                                        <div>
                                                            <button type="button" onClick={() => {
                                                                const updatedSizes = [...cigar.Sizes];
                                                                updatedSizes.splice(sizeIndex, 1);
                                                                setCigar({ ...cigar, Sizes: updatedSizes });
                                                            }}>
                                                                Remove Size
                                                            </button>
                                                        </div>

                                                    </div>
                                                );
                                            })}
                                            <div className="l2">
                                                <button type="button" onClick={() => {
                                                    const updatedSizes = [...cigar.Sizes];
                                                    updatedSizes.push({ ...sizeFields });
                                                    setCigar({ ...cigar, Sizes: updatedSizes });
                                                }}>
                                                    Add Size
                                                </button>
                                            </div>
                                        </div>
                                    )
                                    
                        })
                    }
                    <div>
                        
                        <button
                            onClick={
                                (e) => {
                                    let tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
                                    if (!tempData) {
                                        tempData = props.data;
                                        localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
                                    }
                                    const index = tempData.findIndex(item => item.slug === cigar.slug);
                                    if (index !== -1) {
                                        tempData[index] = cigar;
                                    } else {
                                        tempData.push(cigar);
                                    }
                                    localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
                                }
                            }
                        >Submit</button>
                    </div>
                </section>
            </Layout>
            <style jsx>
                {`
                .l2 {
                    margin: 1em;
                }
                `}
            </style>
        </>
    )
}

export default AddCigarPage