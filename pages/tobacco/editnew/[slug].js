import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react";
import { buildSchemaArtifacts } from "../../../utils/schemaMapper";
import uiSchema from '../../../public/data/tobacco.ui.schema.json'
import { useDraftItem } from "../../../hooks/useDraftItem";
import { buildTobaccoSuggestions } from "../../../utils/suggestions";
import Layout from "../../../components/layout";
import PageTitle1 from "../../../components/pagetitle1";
import SchemaForm, { FormButtons, SlugPreview } from "../../../components/schemaForm";


const EditNewTobaccoPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), [])

    const [initialDraft, setInitialDraft] = useState(null);
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        if (!router.isReady || typeof window === "undefined") return;
        const tempData = JSON.parse(localStorage.getItem('tempData_tobacco') || "[]");
        setAllItems(Array.isArray(tempData) ? tempData : []);
        const match = tempData.find((item) => item.slug === slug);
        setInitialDraft(match || null);
    }, [router.isReady, slug])

    const {
        draft,
        setDraft,
        saveDraft,
        isSlugUnique,
        generateSlug
    } = useDraftItem({
        slug: slug || "",
        defaults,
        initialItem: initialDraft || defaults,
        allItems,
        slugFields: ['Tobacco Name'],
        storageKey: 'tempData_tobacco',
        originKey: 'originData_tobacco'
    });

    const suggestions = useMemo(
        () => buildTobaccoSuggestions(allItems || []),
        [allItems]
    );

    const handleSubmit = (values) => {
        const results = saveDraft(values);
        if (results?.error === "slug-conflict") {
            alert("Slug already exists. Please choose a different name");
            return;
        }
        router.push("/tobacco")
    };

    const handleDelete = () => {
        if (typeof window === "undefined") return;
        const tempData = JSON.parse(localStorage.getItem("tempData_tobacco") || "[]");
        const next = tempData.filter((item) => item.slug !== slug);
        localStorage.setItem("tempData_tobacco", JSON.stringify(next));
        router.push("/tobacco")
    }

    if (!router.isReady) {
        return (
            <Layout>
                <PageTitle1 subtitle="Loading draft...">Loading</PageTitle1>
            </Layout>
        );
    }

    if (!initialDraft) {
        return (
            <Layout>
                <PageTitle1 subtitle="This form is for editing a new tobacco item, not an existing one">Tobacco not found</PageTitle1>
                {slug ? (
                    <p>The slug (found in the URL) may be incorrect: {slug}</p>
                ) : (
                    <p>No slug found in the URL</p>
                )}
            </Layout>
        )
    }

    return (
        <Layout>
            <div id="top-toolbar">
                <button onClick={handleDelete}>Delete Tobacco</button>
            </div>
            <PageTitle1 subtitle="This form is for editing a new tobacco product, not an existing one">Edit New Tobacco</PageTitle1>

            <SchemaForm
                key={slug}
                uiSchema={uiSchema}
                initialValues={draft}
                suggestions={suggestions}
                onSubmit={handleSubmit}
            >
                <SlugPreview
                    generateSlug={generateSlug}
                    isSlugUnique={isSlugUnique}
                    fallbackSlug={slug}
                    baseRoute="www.kingstreetemporium.com/tobacco"
                />
                <FormButtons onClickRevert={() => setDraft(initialDraft || defaults)} />
            </SchemaForm>
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
        </Layout>
    )
}

export default EditNewTobaccoPage