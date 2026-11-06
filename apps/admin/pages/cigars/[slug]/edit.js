import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import SchemaForm, { FormButtons } from "../../../components/schemaForm";
import { SlugPreview } from "../../../components/schemaForm";
import uiSchema from "../../../public/data/cigar.ui.schema.json";
import { buildSchemaArtifacts } from "../../../utils/schemaMapper";
import { buildCigarSuggestions } from "../../../utils/suggestions";
import { useDraftItem } from "../../../hooks/useDraftItem";

export const getServerSideProps = async ({ params }) => {
  const { readCatalog, legacyEnvelope } = await import("../../../lib/catalog/server.mjs");
  const records = (await readCatalog(['cigar'])).map(legacyEnvelope);
  const record = records.find((item) => item.slug === params.slug);
  if (!record) return { notFound: true };
  return { props: { cigar: record.legacy, productId: record.id, allCigars: records.map((item) => item.legacy) } };
};

const EditCigarPage = ({ cigar, productId, allCigars }) => {
  const router = useRouter();
  const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), []);
  const {
    draft,
    setDraft,
    saveDraft,
    isSlugUnique,
    generateSlug,
  } = useDraftItem({
    slug: cigar.slug,
    defaults,
    initialItem: cigar,
    allItems: allCigars || [],
    productId,
    type: 'cigar',
  });

  const suggestions = useMemo(
    () => buildCigarSuggestions(allCigars || []),
    [allCigars]
  );

  const handleSubmit = async (values) => {
    const result = await saveDraft(values);
    if (result?.error === "slug-conflict") {
      alert("Slug already exists. Please choose a different name.");
      return;
    }
    if (result?.error) { alert(result.message || "Unable to save draft."); return; }
    router.push("/submit");
  };

  return (
    <Layout>
      <SchemaForm
        key={cigar.slug}
        uiSchema={uiSchema}
        initialValues={draft}
        suggestions={suggestions}
        onSubmit={handleSubmit}
        mode="edit"
        title={cigar["Cigar Name"] || "Edit cigar"}
        backHref="/cigars"
        productId={productId}
      >
        <SlugPreview
          generateSlug={generateSlug}
          isSlugUnique={isSlugUnique}
          fallbackSlug={cigar.slug}
          baseRoute="www.kingstreetemporium.com/cigars"
        />
        <FormButtons onClickRevert={() => setDraft({ ...defaults, ...cigar})}/>
      </SchemaForm>
    </Layout>
  );
};

export default EditCigarPage;
