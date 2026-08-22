import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import SchemaForm, { FormButtons } from "../../components/schemaForm";
import { SlugPreview } from "../../components/schemaForm";
import uiSchema from "../../public/data/cigar.ui.schema.json";
import { buildSchemaArtifacts } from "../../utils/schemaMapper";
import { buildCigarSuggestions } from "../../utils/suggestions";
import { useDraftItem } from "../../hooks/useDraftItem";

export const getServerSideProps = async () => {
  const { readCatalog, legacyEnvelope } = await import("../../lib/catalog/server.mjs");
  const records = (await readCatalog(['cigar'])).map(legacyEnvelope);
  return { props: { data: records.map((item) => item.legacy) } };
};

const AddCigarPage = (props) => {
  const router = useRouter();
  const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), []);

  // Set "Date Added" to current date for new items, but allow it to be overridden by defaults if provided
  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);
  const defaultsWithToday = useMemo(
    () => ({
      ...defaults,
      "Date Added": defaults["Date Added"] ?? today,
    }),
    [defaults, today]
  );

  const {
    draft,
    setDraft,
    saveDraft,
    isSlugUnique,
    generateSlug,
  } = useDraftItem({
    slug: "", // new item
    defaults: defaultsWithToday,
    initialItem: defaultsWithToday,
    allItems: props.data || [],
    type: 'cigar',
  });

  const suggestions = useMemo(
    () => buildCigarSuggestions(props.data || []),
    [props.data]
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
        uiSchema={uiSchema}
        initialValues={draft}
        suggestions={suggestions}
        onSubmit={handleSubmit}
        mode="add"
        title="Add cigar"
        backHref="/cigars"
      >
        <SlugPreview
          generateSlug={generateSlug}
          isSlugUnique={isSlugUnique}
          fallbackSlug=""
          baseRoute="www.kingstreetemporium.com/cigars"
        />
        <FormButtons mode="add" onClickRevert={() => setDraft({ ...defaultsWithToday })} />
      </SchemaForm>
    </Layout>
  );
};


export default AddCigarPage;
