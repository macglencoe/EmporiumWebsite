import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import PageTitle1 from "../../../components/pagetitle1";
import SchemaForm from "../../../components/schemaForm";
import uiSchema from "../../../public/data/cigar.ui.schema.json";
import { buildSchemaArtifacts } from "../../../utils/schemaMapper";
import { useDraftItem } from "../../../hooks/useDraftItem";
import { useSlugPreview } from "../../../hooks/useSlugPreview";

const STORAGE_KEY = "tempData_cigars";

const EditNewCigarPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { defaults } = useMemo(() => buildSchemaArtifacts(uiSchema), []);

  const [initialDraft, setInitialDraft] = useState(null);
  const [allItems, setAllItems] = useState([]);

  // Hydrate from localStorage once the slug is available on the client.
  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;
    const tempData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setAllItems(Array.isArray(tempData) ? tempData : []);
    const match = tempData.find((item) => item.slug === slug);
    setInitialDraft(match || null);
  }, [router.isReady, slug]);

  const {
    draft,
    setDraft,
    saveDraft,
    isSlugUnique,
    generateSlug,
  } = useDraftItem({
    slug: slug || "",
    defaults,
    initialItem: initialDraft || defaults,
    allItems,
  });

  const handleSubmit = (values) => {
    const result = saveDraft(values);
    if (result?.error === "slug-conflict") {
      alert("Slug already exists. Please choose a different name.");
      return;
    }
    router.push("/cigars");
  };

  const handleDelete = () => {
    if (typeof window === "undefined") return;
    const tempData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const next = tempData.filter((item) => item.slug !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    router.push("/cigars");
  };

  if (!router.isReady) {
    return (
      <Layout>
        <PageTitle1 subtitle="Loading draft...">Loading</PageTitle1>
      </Layout>
    );
  }

  if (!initialDraft) {
    return (
      <Layout>
        <PageTitle1 subtitle="This form is for editing a new cigar, not an existing one">Cigar not found</PageTitle1>
        {slug ? (
          <p>The slug (found in the URL) may be incorrect: {slug}</p>
        ) : (
          <p>No slug found in the URL.</p>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div id="top-toolbar">
        <button onClick={handleDelete}>Delete Cigar</button>
      </div>
      <PageTitle1 subtitle="This form is for editing a new cigar, not an existing one">Edit New Cigar</PageTitle1>

      <SchemaForm
        key={slug}
        uiSchema={uiSchema}
        initialValues={draft}
        onSubmit={handleSubmit}
      >
        <SlugPreview
          generateSlug={generateSlug}
          isSlugUnique={isSlugUnique}
          fallbackSlug={slug}
        />
        <div className="tools">
          <button type="submit" className="standard-button">Save Changes</button>
          <button
            type="button"
            className="standard-button"
            onClick={() => setDraft(initialDraft || defaults)}
          >
            Revert All
          </button>
        </div>
      </SchemaForm>

      <style jsx>{`
        #top-toolbar {
          display: flex;
          justify-content: flex-end;
          padding: 10px;
        }
        #top-toolbar button {
          padding: 10px;
          background-color: var(--dl-color-theme-secondary2);
          cursor: pointer;
          color: var(--dl-color-theme-primary1);
          font-weight: bold;
        }
        #top-toolbar button:hover {
          color: var(--dl-color-theme-primary2);
        }
      `}</style>
    </Layout>
  );
};

const SlugPreview = ({ generateSlug, isSlugUnique, fallbackSlug }) => {
  const { slug, unique } = useSlugPreview({ generateSlug, isSlugUnique });
  const displaySlug = slug || fallbackSlug || "";

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

export default EditNewCigarPage;
