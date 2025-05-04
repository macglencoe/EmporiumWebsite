import { useRouter } from "next/router";
import Layout from "../../components/layout";
import PageTitle1 from "../../components/pagetitle1";
import { use, useEffect, useState } from "react";
import CrudForm from "../../components/crudForm";
import Toolbar from "../../components/toolbar";
import cigarFields from "../../public/data/cigar-fields.json"

export const getStaticProps = async () => {
    const cigarsData = await import('../../public/data/consolidated_cigars.json');
    const data = await cigarsData.default;
    return { props: { data } };
}

const EditNewCigarPage = (props) => {
    const router = useRouter();
    const slug = router.query.slug;

    const [cigarLocalData, setCigarLocalData] = useState({});
    const [allCigarData, setAllCigarData] = useState(props.data);

    
    const sizeFields = {
        "Size": "",
        "Barcode": "",
        "In_Stock": "",
        "Price": ""
    }

    const originalData = {
        'Cigar Brand': "",
        'Cigar Name': "",
        'Wrapper': "",
        'Binder': "",
        'Filler': "",
        "Flavor_Profile": "",
        "Strength_Profile": "",
        "Sizes": [{}]
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pullTempData();
            if (localStorage.getItem('originData_cigars')) {
                setAllCigarData(JSON.parse(localStorage.getItem('originData_cigars')));
            }
        }

    }, [router.query.slug]);

    /**
     * Pulls the current cigar data from local storage and updates the state.
     * If the cigar doesn't exist in local storage, does nothing.
     * @function
     */
    const pullTempData = () => {
        if (typeof window !== 'undefined') {
            const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
            const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === router.query.slug);

            // if slug matches a cigar in original data, do not set cigarLocalData
            // this is because the user is editing a new cigar, not an existing one
            if (!allCigarData.find((cigar) => cigar.slug === slug)) {
                setCigarLocalData(firstCigarWithSameSlug);
                return firstCigarWithSameSlug;
            }
        }
    }
    /**
     * Pulls all cigar data from local storage and updates the state.
     * If the temp data doesn't exist, does nothing.
     * @returns {Array<Object>} - The array of cigar data
     */
    const pullAllTempData = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        setAllCigarData(tempData);
        return tempData;
    }

    /**
     * Generates a slug from the given local cigar data.
     * The slug is created by concatenating the cigar brand and name,
     * converting to lower case, removing non-alphanumeric and whitespace characters,
     * and replacing multiple spaces with a single hyphen.
     * @param {Object} localData - The local cigar data containing 'Cigar Brand' and 'Cigar Name'
     * @returns {String} - The generated slug
     */

    const generateSlug = (localData) => {
        if (localData) {
            const slug = (localData['Cigar Brand'] + ' ' + localData['Cigar Name']).toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-');
            return slug;
        }
    }

    /**
     * Checks if the slug generated from the given local cigar data is unique among all cigars.
     * The slug is considered unique if no other cigar has the same slug, including any 'new-slug' entries.
     * @param {Object} localData - The local cigar data
     * @returns {Boolean} - True if the slug is unique, false otherwise
     */

    const isSlugUnique = (localData) => {
        if (localData) {
            const slugExists = allCigarData.some((cigar) =>
                (cigar.slug !== localData.slug && cigar.slug === generateSlug(localData)) ||
                (cigar['new-slug'] && cigar['new-slug'] === generateSlug(localData))
            );
            return !slugExists;
        }
    }

    const saveChanges = (localData) => {
        if (!isSlugUnique(localData)) {
            alert('Slug already exists. Please choose a different name.');
            return;
        }
        localData['slug'] = generateSlug(localData);

        // Load the temp data from local storage
        // If it doesn't exist, alert the user and return without saving
        let tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        if (!tempData) {
            alert('No temp data found. Please report this error.');
            return;
        }
        // Find the index of the item in the temporary data that has the same slug as the data we're trying to save.
        // If it doesn't exist, alert the user and return without saving.
        const index = tempData.findIndex(item => item.slug === localData.slug);
        if (index !== -1) {
            tempData[index] = localData;
        } else {
            alert('Index not found. Please report this error.');
            return;
        }
        // Remove any non-objects from the Sizes array.
        // This is because the Sizes array is an array of objects, and we want to make sure it stays that way.
        // If someone manually edits the local storage, they might accidentally add a non-object to the Sizes array.
        // This line removes any non-objects from the Sizes array, so we can be sure that the Sizes array is always an array of objects.
        if (tempData[index].Sizes) { tempData[index].Sizes = tempData[index].Sizes.filter(size => typeof size === 'object'); }

        // Save the temp data to local storage
        localStorage.setItem('tempData_cigars', JSON.stringify(tempData));

        router.push('/cigars');
    }

    /**
     * Deletes a cigar from the temporary data in local storage based on the slug from the URL query.
     * If the cigar is found, it is removed from the data, the updated data is saved back to local storage,
     * an alert is shown to the user, and the page is redirected to the main cigars page.
     * If the cigar is not found, no action is taken.
     */

    const deleteCigar = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        const index = tempData.findIndex(item => item.slug === router.query.slug);
        if (index !== -1) {
            tempData.splice(index, 1);
            localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
            alert('Cigar deleted.');
            router.push('/cigars');
        }
    }

    if (!cigarLocalData) {
        return (
            <>
                <Layout>
                    <PageTitle1 subtitle="This form is for editing a new cigar, not an existing one">Cigar not found</PageTitle1>
                    {
                        router.query.slug ? (
                            <p>The slug (found in the URL) may be incorrect: {router.query.slug}</p>
                        ) : (
                            <p>No slug found in the URL.</p>
                        )
                    }
                </Layout>
            </>
        )
    }
    return (
        <>
            <Layout>
                <div id="top-toolbar">
                    <button onClick={deleteCigar}>Delete Cigar</button>
                </div>
                <PageTitle1 subtitle="This form is for editing a new cigar, not an existing one">Edit New Cigar</PageTitle1>

                <CrudForm
                    pullTempData={pullTempData}
                    pullAllTempData={pullAllTempData}
                    dataFields={cigarFields}
                    dataOriginal={originalData}
                    onMetadataChange={(e) => {
                        setCigarLocalData({ ...cigarLocalData, [e.target.name]: e.target.value });
                    }}
                    onMetadataRevert={(e) => {
                        setCigarLocalData({ ...cigarLocalData, [e.target.name]: cigarFields[e.target.name] });
                    }}
                    arrayFields={{
                        'Sizes': sizeFields
                    }}
                    generateSlug={generateSlug}
                    isSlugUnique={isSlugUnique}
                    onSubmit={saveChanges}
                ></CrudForm>

            </Layout>
            <style jsx>{`
                #top-toolbar {
                    display: flex;
                    justify-content: flex-end;
                    padding: 10px;
                }
                #top-toolbar button {
                    padding: 10px;
                    background-color: var(--dl-color-theme-secondary2);
                    cursor: pointer;
                    color: var(--dl-color-theme-primary1);
                    font-weight: bold;
                }
                #top-toolbar button:hover {
                    color: var(--dl-color-theme-primary2);
                }
            `}</style>
        </>
    )
}

export default EditNewCigarPage