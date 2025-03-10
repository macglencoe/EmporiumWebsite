import { useEffect, useState } from 'react';
import Layout from '../../../components/layout';
import setLocalData from '../../../utils/setLocalData';


export const getStaticPaths = async () => {
    const cigars = await import('../../../public/data/consolidated_cigars.json');
    const data = await cigars.default;
    const paths = data.map((cigar) => ({
        params: { slug: cigar.slug },
    }));
    return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
    const cigarsData = await import('../../../public/data/consolidated_cigars.json');
    const data = await cigarsData.default;
    const cigarIndex = data.findIndex((cigar) => cigar.slug === params.slug);
    const cigar = data[cigarIndex];
    const prevCigar = cigarIndex > 0 ? data[cigarIndex - 1] : null;
    const nextCigar = cigarIndex + 1 < data.length ? data[cigarIndex + 1] : null;
    return { props: { cigar, next: nextCigar, prev: prevCigar, allCigars: data } };
}

const EditCigarPage = (props) => {
    if (!props.cigar) {
        return <div>Cigar not found</div>;
    }

    const [cigarLocalData, setCigarLocalData] = useState(props.cigar);
    const [allCigarsLocalData, setAllCigarsLocalData] = useState(props.allCigars);

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

    useEffect(() => {
        setLocalData(props.allCigars);
        if (typeof window !== 'undefined') {
            pullTempData();
            setAllCigarsLocalData(JSON.parse(localStorage.getItem('tempData_cigars')));
        }
    }, []);

    const pullTempData = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === cigarLocalData.slug);
        setCigarLocalData(firstCigarWithSameSlug);
    }

    const revertToOriginal = () => {
        setCigarLocalData(props.cigar);
    };


    const generateSlug = () => {
        const slug = (cigarLocalData['Cigar Brand'] + ' ' + cigarLocalData['Cigar Name']).toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-');
        return slug;
    }

    const isSlugUnique = () => {
        const slugExists = allCigarsLocalData.some((cigar) => cigar.slug !== cigarLocalData.slug && cigar.slug === generateSlug());
        return !slugExists;
    }

    const saveChanges = () => {
        if (!isSlugUnique()) {
            alert('Slug already exists. Please choose a different name.');
            return;
        }
        cigarLocalData['new-slug'] = generateSlug();
        let tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        if (!tempData) {
            tempData = props.data;
            localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
        }
        const index = tempData.findIndex(item => item.slug === cigarLocalData.slug);
        if (index !== -1) {
            tempData[index] = cigarLocalData;
        } else {
            tempData.push(cigarLocalData);
        }
        localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
    }

    return (
        <>
            <Layout>
                <section>
                    {
                        Object.keys(cigarFields).map((key, index) => {
                            if (typeof cigarFields[key] === "string")
                                return (
                                    <div key={index} id={key.replace(/\s/g, '_')} className={
                                        (cigarLocalData[key] != props.cigar[key] ? "changed" : "") + " inputField"
                                    }>
                                        <label>{key}</label>
                                        <div>
                                            <button onClick={(e) => {
                                                setCigarLocalData({ ...cigarLocalData, [key]: props.cigar[key] })
                                            }}
                                            >Revert
                                            </button>
                                            <strike>{props.cigar[key]}</strike>
                                            <input
                                                type="text"
                                                value={cigarLocalData[key]}
                                                onChange={(e) => setCigarLocalData({ ...cigarLocalData, [key]: e.target.value })}

                                            />
                                        </div>
                                    </div>
                                );
                            else if (Array.isArray(cigarFields[key]))
                                if (key === "Sizes")
                                    return (
                                        <div id="sizes">
                                            <h2>{key}</h2>
                                            {cigarLocalData.Sizes.map((size, sizeIndex) => {
                                                return (
                                                    <div key={index} className="l2">
                                                        {Object.keys(sizeFields).map((key, index) => {
                                                            return (
                                                                <div className={
                                                                    (cigarLocalData.Sizes[sizeIndex][key] != (props.cigar.Sizes[sizeIndex] ? props.cigar.Sizes[sizeIndex][key] : "") ? "changed" : "") + " inputField"
                                                                }>
                                                                    <label>{key}</label>
                                                                    <div>
                                                                        <button onClick={(e) => {
                                                                            setCigarLocalData({ ...cigarLocalData, Sizes: [...cigarLocalData.Sizes.map((size, index) => index === sizeIndex ? { ...size, [key]: props.cigar.Sizes?.[sizeIndex]?.[key] || "" } : size)] })
                                                                        }}
                                                                        >Revert
                                                                        </button>
                                                                        <strike>{props.cigar.Sizes[sizeIndex]?.[key] ? props.cigar.Sizes[sizeIndex][key] : ""}</strike>
                                                                        <input
                                                                            type="text"
                                                                            value={cigarLocalData.Sizes[sizeIndex][key]}
    
                                                                            onChange={(e) => {
                                                                                const updatedSizes = [...cigarLocalData.Sizes];
                                                                                updatedSizes[sizeIndex][key] = e.target.value;
                                                                                setCigarLocalData({ ...cigarLocalData, Sizes: updatedSizes });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        )}
                                                        <div>
                                                            <button type="button" onClick={() => {
                                                                const updatedSizes = [...cigarLocalData.Sizes];
                                                                updatedSizes.splice(sizeIndex, 1);
                                                                setCigarLocalData({ ...cigarLocalData, Sizes: updatedSizes });
                                                            }}>
                                                                Remove Size
                                                            </button>
                                                        </div>

                                                    </div>
                                                );
                                            })}
                                            <div className="l2">
                                                <button type="button" onClick={() => {
                                                    const updatedSizes = [...cigarLocalData.Sizes];
                                                    updatedSizes.push({ ...sizeFields });
                                                    setCigarLocalData({ ...cigarLocalData, Sizes: updatedSizes });
                                                }}>
                                                    Add Size
                                                </button>
                                            </div>
                                        </div>
                                    )

                        })
                    }
                    <div className='slug-container'>
                        <p>Slug: <b style={{
                            color: isSlugUnique() ? 'green' : 'red'
                        }}>{generateSlug()}</b></p>
                    </div>
                    <div>

                        <button
                            onClick={
                                (e) => {
                                    saveChanges();
                                }
                            }
                        >Submit</button>
                        <button onClick={(e) => {
                            let numChanges = 0;
                            Object.keys(cigarLocalData).forEach((key) => {
                                if (cigarLocalData[key] !== props.cigar[key] && key !== "slug") {
                                    numChanges += 1;
                                }
                            });
                            if (confirm(`Are you sure you want to revert ${numChanges} field(s) to original?`)) {
                                revertToOriginal();
                            }
                        }}>Revert Changes</button>
                    </div>
                </section>
            </Layout>
            <style jsx>
                {`
.l2 {
    margin: 1em;
}

section {
    padding: 20px;
}

.inputField {
    margin: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.inputField label {
    font-weight: bold;
    font-size: 1.2em;
    padding-top: 0.2em;
    width: 100%;
    border-top: 3px solid var(--dl-color-theme-secondary2);

}

.inputField input {
    padding: 0.5em;
    width: 100%;
    grid-column: 1 / -1;
    grid-row: 2;
}

.inputField input:focus {
    outline: none
}

.inputField > div:focus-within {
    outline: 3px solid var(--dl-color-theme-secondary2);
}

.inputField > div {
    border-radius: 5px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
}
.inputField > div button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    cursor: pointer;
    grid-row: 1;
}
.inputField > div strike {
    width: 100%;
    padding: 0.5em;
    background-color: var(--dl-color-theme-primary2);
    border-bottom: 3px solid var(--dl-color-theme-secondary2);
}




.inputField:not(.changed) > div button, 
.inputField:not(.changed) > div strike {
    display: none;
}









#Cigar_Brand {
    margin: 1em;
}
                `}
            </style>
        </>
    )
}

export default EditCigarPage