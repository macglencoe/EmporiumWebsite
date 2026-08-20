import { useRouter } from "next/router";
import { useMemo } from "react";
import { buildSchemaArtifacts, normalizeType } from "../../../utils/schemaMapper";
import uiSchema from "../../../public/data/tobacco.ui.schema.json"
import { useDraftItem } from "../../../hooks/useDraftItem";
import Layout from "../../../components/layout";
import { buildTobaccoSuggestions } from "../../../utils/suggestions";
import SchemaForm, { FormButtons, SlugPreview } from "../../../components/schemaForm";

export const getServerSideProps = async ({ params }) => {
    const { readCatalog, legacyEnvelope } = await import("../../../lib/catalog/server.mjs");
    const records = (await readCatalog(['tobacco'])).map(legacyEnvelope);
    const record = records.find((item) => item.slug === params.slug);
    if (!record) return { notFound: true };
    return { props: { tobacco: record.legacy, productId: record.id, allTobacco: records.map((item) => item.legacy) } };
}

const EditTobaccoPage = ({ tobacco, productId, allTobacco }) => {
    const router = useRouter();
    const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), [])
    const {
        draft,
        setDraft,
        saveDraft,
        isSlugUnique,
        generateSlug,
    } = useDraftItem({
        slug: tobacco.slug,
        defaults,
        initialItem: tobacco,
        allItems: allTobacco || [],
        slugFields: ["Tobacco Name"],
        productId,
        type: 'tobacco'
    });

    const suggestions = useMemo(
        () => buildTobaccoSuggestions(allTobacco || []),
        [allTobacco]
    )

    const handleSubmit = async (values) => {
        const result = await saveDraft(values);
        if(result?.error === 'slug-conflict') {
            alert("Slug already exists. Please choose a different name.");
            return;
        }
        if (result?.error) { alert(result.message || "Unable to save draft."); return; }
        router.push('/submit')
    }

    return (
        <Layout>
            <SchemaForm
                key={tobacco.slug}
                uiSchema={uiSchema}
                initialValues={draft}
                suggestions={suggestions}
                onSubmit={handleSubmit}
                tabs={[
                    {
                        id: "metadata",
                        label: "METADATA",
                        filter: (n, f) => sectionOf(f) === "metadata"
                    },
                    {
                        id: "components",
                        label: "COMPONENTS",
                        filter: (n, f) => sectionOf(f) === "components"
                    },
                    {
                        id: "image",
                        label: "IMAGE",
                        filter: (n, f) => sectionOf(f) === "image"
                    }
                ]}
            >
                <SlugPreview
                    generateSlug={generateSlug}
                    isSlugUnique={isSlugUnique}
                    fallbackSlug={tobacco.slug}
                    baseRoute="www.kingstreetemporium.com/tobacco"
                />
                <FormButtons onClickRevert={() => setDraft({ ...defaults, ...tobacco })}/>
            </SchemaForm>
        </Layout>
    )
}

const sectionOf = (field) => (field?.ui?.section || "")

export default EditTobaccoPage
