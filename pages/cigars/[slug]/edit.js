import { useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import SchemaForm from "../../../components/schemaForm";
import uiSchema from "../../../public/data/cigar.ui.schema.json";
import { buildSchemaArtifacts } from "../../../utils/schemaMapper";
import { useDraftItem } from "../../../hooks/useDraftItem";
import { useSlugPreview } from "../../../hooks/useSlugPreview";

export const getStaticPaths = async () => {
  const cigars = await import("../../../public/data/consolidated_cigars.json");
  const data = await cigars.default;
  const paths = data.map((cigar) => ({
    params: { slug: cigar.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const cigarsData = await import("../../../public/data/consolidated_cigars.json");
  const data = await cigarsData.default;
  const cigarIndex = data.findIndex((cigar) => cigar.slug === params.slug);
  const cigar = data[cigarIndex];
  const prevCigar = cigarIndex > 0 ? data[cigarIndex - 1] : null;
  const nextCigar = cigarIndex + 1 < data.length ? data[cigarIndex + 1] : null;
  return { props: { cigar, next: nextCigar, prev: prevCigar, allCigars: data } };
};

const EditCigarPage = ({ cigar, allCigars }) => {
  const router = useRouter();
  if (!cigar) {
    return <div>Cigar not found</div>;
  }

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
  });

  const handleSubmit = (values) => {
    const result = saveDraft(values);
    if (result?.error === "slug-conflict") {
      alert("Slug already exists. Please choose a different name.");
      return;
    }
    const targetSlug = values.slug || cigar.slug;
    router.push("/cigars/" + targetSlug);
  };

  return (
    <Layout>
      <SchemaForm
        key={cigar.slug}
        uiSchema={uiSchema}
        initialValues={draft}
        onSubmit={handleSubmit}
      >
        <SlugPreview
          generateSlug={generateSlug}
          isSlugUnique={isSlugUnique}
          fallbackSlug={cigar.slug}
        />
        <div className="tools">
          <button id="submit" type="submit" className="standard-button">Submit</button>
          <button
            id="revert"
            type="button"
            className="standard-button"
            onClick={() => setDraft({ ...defaults, ...cigar })}
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
      <strong style={{ color: unique ? "green" : "red" }}>{displaySlug}</strong>
      {!unique && <p className="slug-warning">Slug already exists. Please choose a different name.</p>}
      {unique && (
        <p className="slug-success">
          Once committed: {`www.kingstreetemporium.com/cigars/${displaySlug}`}
        </p>
      )}
    </div>
  );
};

export default EditCigarPage;
