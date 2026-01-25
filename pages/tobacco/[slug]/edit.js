import { useRouter } from "next/router";
import { useMemo } from "react";
import { buildSchemaArtifacts, normalizeType } from "../../../utils/schemaMapper";
import uiSchema from "../../../public/data/tobacco.ui.schema.json"
import { useDraftItem } from "../../../hooks/useDraftItem";
import Layout from "../../../components/layout";
import { buildTobaccoSuggestions } from "../../../utils/suggestions";
import SchemaForm, { SlugPreview } from "../../../components/schemaForm";

export const getStaticPaths = async () => {
    const tobaccos = await import("../../../public/data/tobacco.json");
    const data = await tobaccos.default;
    const paths = data.map((tobacco) => ({
        params: { slug: tobacco.slug },
    }));
    return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
    const tobaccosData = await import("../../../public/data/tobacco.json");
    const data = await tobaccosData.default;
    const tobaccoIndex = data.findIndex((tobacco) => tobacco.slug === params.slug);
    const tobacco = data[tobaccoIndex];
    const prevTobacco = tobaccoIndex > 0 ? data[tobaccoIndex - 1] : null;
    const nextTobacco = tobaccoIndex + 1 < data.length ? data[tobaccoIndex + 1] : null;
    return { props: {tobacco, next: nextTobacco, prev: prevTobacco, allTobacco: data } };
}

const EditTobaccoPage = ({ tobacco, allTobacco }) => {
    const router = useRouter();
    if (!tobacco) {
        return <div>Tobacco Not Found</div>
    }
    
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
        slugFields: ["Tobacco Name"]
    });

    const suggestions = useMemo(
        () => buildTobaccoSuggestions(allTobacco || []),
        [allTobacco]
    )

    const handleSubmit = (values) => {
        const result = saveDraft(values);
        if(result?.error === 'slug-conflict') {
            alert("Slug already exists. Please choose a different name.");
            return;
        }
        const targetSlug = values.slug || tobacco.slug;
        router.push(uiSchema.slugBasePath + '/' + targetSlug)
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
                    }
                ]}
            >
                <SlugPreview
                    generateSlug={generateSlug}
                    isSlugUnique={isSlugUnique}
                    fallbackSlug={tobacco.slug}
                    baseRoute="www.kingstreetemporium.com/tobacco"
                />
            </SchemaForm>
        </Layout>
    )
}

const sectionOf = (field) => (field?.ui?.section || "")

export default EditTobaccoPage