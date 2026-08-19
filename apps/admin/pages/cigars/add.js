import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import SchemaForm, { FormButtons } from "../../components/schemaForm";
import { SlugPreview } from "../../components/schemaForm";
import uiSchema from "../../public/data/cigar.ui.schema.json";
import { buildSchemaArtifacts } from "../../utils/schemaMapper";
import { buildCigarSuggestions } from "../../utils/suggestions";
import { useDraftItem } from "../../hooks/useDraftItem";
import { useSlugPreview } from "../../hooks/useSlugPreview";

export const getStaticProps = async () => {
  const data = await import("../../public/data/consolidated_cigars.json");
  return {
    props: {
      data: data.default,
    },
  };
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
  });

  const suggestions = useMemo(
    () => buildCigarSuggestions(props.data || []),
    [props.data]
  );

  const handleSubmit = (values) => {
    const result = saveDraft(values);
    if (result?.error === "slug-conflict") {
      alert("Slug already exists. Please choose a different name.");
      return;
    }
    router.push("/cigars");
  };

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
          baseRoute="www.kingstreetemporium.com/cigars"
        />
        <FormButtons onClickRevert={() => setDraft(defaultsWithToday)} />
      </SchemaForm>
    </Layout>
  );
};


export default AddCigarPage;
