import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import SchemaForm from "../../components/schemaForm";
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

const SlugPreview = ({ generateSlug, isSlugUnique, fallbackSlug }) => {
  const { slug, unique } = useSlugPreview({ generateSlug, isSlugUnique });
  const displaySlug = slug || fallbackSlug;

  return (
    <div className="slug-preview">
      <p>Preview URL slug:</p>
      <strong style={{ color: unique ? "green" : "red" }}>{displaySlug || "(none yet)"}</strong>
      {!unique && <p className="slug-warning">Slug already exists. Please choose a different name.</p>}
      {unique && displaySlug && (
        <p className="slug-success">
          Once committed: {`www.kingstreetemporium.com/cigars/${displaySlug}`}
        </p>
      )}
    </div>
  );
};

export default AddCigarPage;
