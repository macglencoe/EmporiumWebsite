import { useEffect, useState } from "react";
import Layout from "../../../components/layout"
import PageTitle1 from "../../../components/pagetitle1"
import { useRouter } from "next/router";

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

/**
 * Page for deleting a cigar from the temporary data in local storage
 * @function
 * @param {Object} props - The props passed to the component
 * @param {Object} props.cigar - The cigar to delete
 * @param {Array} props.allCigars - The list of all cigars
 */
const DeleteCigarPage = (props) => {
    const router = useRouter();
    const [cigarLocalData, setCigarLocalData] = useState(props.cigar);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            pullTempData();
        }
    }, [router.asPath]);

    /**
     * Pulls the current cigar data from local storage and updates the state.
     * If the cigar doesn't exist in local storage, does nothing.
     * @function
     */
    const pullTempData = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        const firstCigarWithSameSlug = tempData.find((cigar) => cigar.slug === cigarLocalData.slug);
        setCigarLocalData(firstCigarWithSameSlug);
    }

    /**
     * Deletes a cigar from the temporary data in local storage and redirects to /cigars
     * @function
     */
    const deleteCigar = () => {
        const tempData = JSON.parse(localStorage.getItem('tempData_cigars'));
        const index = tempData.findIndex(item => item.slug === cigarLocalData.slug);
        if (index !== -1) {
            tempData.splice(index, 1);
            localStorage.setItem('tempData_cigars', JSON.stringify(tempData));
            alert('Cigar deleted.');
            router.push('/cigars');
        }
    }

    return (
        <>
            <Layout>
                <PageTitle1>Delete Cigar</PageTitle1>
                <section>
                    <h2>Understand the ramifications</h2>
                    <p>Deleting this cigar will remove it from the temporary data for this session.
                        <br></br>
                    Upon submitting all changes to GitHub, this change will be permanent.
                    </p>
                    <div className="confirmation">
                        <h2>Confirm deletion of the following data:</h2>
                        <pre>{JSON.stringify(cigarLocalData, null, 2)}</pre>
                        <button onClick={deleteCigar}>Delete Cigar</button>
                    </div>
                </section>
    
            </Layout>
            <style jsx>
                {`
section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}
.confirmation {
    background-color: var(--dl-color-theme-primary2);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.confirmation h2 {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary2);
    padding: 10px;
}
.confirmation pre {
    padding: 10px;
}
.confirmation button {
    background-color: var(--dl-color-theme-secondary2);
    color: var(--dl-color-theme-primary1);
    padding: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}
.confirmation button:hover {
    background-color: red;
    color: var(--dl-color-theme-primary2);
}
                `}
            </style>
        </>
    )
}

export default DeleteCigarPage