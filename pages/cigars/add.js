import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import SchemaForm from "../../components/schemaForm";
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
        <div className="tools">
          <button id="submit" type="submit" className="standard-button">Submit</button>
          <button
            id="revert"
            type="button"
            className="standard-button"
            onClick={() => setDraft(defaults)}
          >
            Revert All
          </button>
        </div>
      </SchemaForm>
    </Layout>
  );
};


export default AddCigarPage;
