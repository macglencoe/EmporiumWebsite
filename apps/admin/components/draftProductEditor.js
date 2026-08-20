import { useMemo } from 'react';
import { useRouter } from 'next/router';

import Layout from './layout';
import SchemaForm, { FormButtons, SlugPreview } from './schemaForm';
import { useDraftItem } from '../hooks/useDraftItem';
import { buildSchemaArtifacts } from '../utils/schemaMapper';

export default function DraftProductEditor({ item, catalog, type, uiSchema, buildSuggestions, slugFields, baseRoute }) {
  const router = useRouter();
  const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), [uiSchema]);
  const { draft, setDraft, saveDraft, isSlugUnique, generateSlug } = useDraftItem({
    slug: item.afterLegacy.slug,
    defaults,
    initialItem: item.afterLegacy,
    allItems: catalog,
    draftItemId: item.id,
    type,
    slugFields,
  });
  const suggestions = useMemo(() => buildSuggestions(catalog), [buildSuggestions, catalog]);

  async function handleSubmit(values) {
    const result = await saveDraft(values);
    if (result?.error === 'slug-conflict') return alert('Slug already exists. Please choose a different name.');
    if (result?.error) return alert(result.message || 'Unable to update the staged product.');
    router.push('/submit');
  }

  return <Layout>
    <SchemaForm key={item.id} uiSchema={uiSchema} initialValues={draft} suggestions={suggestions} onSubmit={handleSubmit}>
      <SlugPreview generateSlug={generateSlug} isSlugUnique={isSlugUnique} fallbackSlug={item.afterLegacy.slug} baseRoute={baseRoute}/>
      <FormButtons onClickRevert={() => setDraft(item.afterLegacy)}/>
    </SchemaForm>
  </Layout>;
}
