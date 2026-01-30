import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { buildSchemaArtifacts } from '../../utils/schemaMapper';
import uiSchema from '../../public/data/tobacco.ui.schema.json'
import { buildTobaccoSuggestions } from '../../utils/suggestions';
import Layout from '../../components/layout';
import SchemaForm, { FormButtons, SlugPreview } from '../../components/schemaForm';
import { useDraftItem } from '../../hooks/useDraftItem';

export const getStaticProps = async () => {
    const data = await import('../../public/data/tobacco.json');
    return {
        props: {
            data: data.default
        }
    }
}

const AddTobaccoPage = (props) => {
    const router = useRouter();
    const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), []);

    const {
        draft,
        setDraft,
        saveDraft,
        isSlugUnique,
        generateSlug,
    } = useDraftItem({
        slug: "", // new item
        defaults,
        initialItem: defaults,
        allItems: props.data || [],
        slugFields: ['Tobacco Name'],
        storageKey: 'tempData_tobacco',
        originKey: 'originData_tobacco'
    });

    const suggestions = useMemo(
        () => buildTobaccoSuggestions(props.data || []),
        [props.data]
    )

    const handleSubmit = (values) => {
        const result = saveDraft(values);
        if (result?.error === "slug-conflict") {
            alert("Slug already exists. Please choose a different name");
            return;
        }
        router.push("/tobacco");
    }

    return (
        <Layout>
            <SchemaForm
                uiSchema={uiSchema}
                initialValues={draft}
                suggestions={suggestions}
                onSubmit={handleSubmit}
            >
                <SlugPreview
                    generateSlug={generateSlug}
                    isSlugUnique={isSlugUnique}
                    fallbackSlug=""
                    baseRoute="www.kingstreetemporium.com/tobacco"
                />
                <FormButtons onClickRevert={() => setDraft(defaults)} />
            </SchemaForm>
        </Layout>
    )
}

export default AddTobaccoPage;