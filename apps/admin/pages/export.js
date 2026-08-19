import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout";
import PageTitle1 from "../components/pagetitle1";

export const getStaticProps = async () => {
  const cigarData = await import("../public/data/consolidated_cigars.json");
  const tobaccoData = await import("../public/data/tobacco.json");

  return {
    props: {
      fallbackCigars: cigarData.default || [],
      fallbackTobacco: tobaccoData.default || [],
    },
  };
};

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const flattenCigarsBySize = (cigars = []) => {
  if (!Array.isArray(cigars)) return [];
  return cigars.flatMap((cigar) => {
    if (!cigar || typeof cigar !== "object") return [];
    const { Sizes, ...base } = cigar;
    const sizes = Array.isArray(Sizes) ? Sizes : [];

    if (sizes.length === 0) {
      return [base];
    }

    return sizes.map((size) => ({
      ...base,
      ...(size && typeof size === "object" ? size : {}),
    }));
  });
};

const normalizeRows = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items.filter(Boolean).map((item) => {
    if (!item || typeof item !== "object") {
      return { value: item };
    }
    return { ...item };
  });
};

const collectColumns = (rows = []) => {
  const columns = [];
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  });
  return columns;
};

const normalizeCell = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const escapeCsv = (value) => {
  const raw = normalizeCell(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
};

const buildCsv = (rows = [], columnsOverride) => {
  if (!rows.length) return "";
  const columns = columnsOverride || collectColumns(rows);
  const header = columns.map(escapeCsv).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsv(row?.[column])).join(",")
  );
  return [header, ...lines].join("\n");
};

const buildFilename = (prefix) => {
  const dateTag = new Date().toISOString().slice(0, 10);
  return `${prefix}-${dateTag}.csv`;
};

const ExportPage = ({ fallbackCigars, fallbackTobacco }) => {
  const [selection, setSelection] = useState("cigars");
  const [originCigars, setOriginCigars] = useState(null);
  const [originTobacco, setOriginTobacco] = useState(null);
  const [originMeta, setOriginMeta] = useState({ sha: "", message: "" });

  const loadOriginData = () => {
    if (typeof window === "undefined") return;

    const cigars = safeParse(localStorage.getItem("originData_cigars"));
    const tobacco = safeParse(localStorage.getItem("originData_tobacco"));

    setOriginCigars(Array.isArray(cigars) ? cigars : null);
    setOriginTobacco(Array.isArray(tobacco) ? tobacco : null);

    setOriginMeta({
      sha: localStorage.getItem("originData_sha") || "",
      message: localStorage.getItem("originData_message") || "",
    });
  };

  useEffect(() => {
    loadOriginData();
  }, []);

  const activeSource = selection === "cigars"
    ? (Array.isArray(originCigars) ? originCigars : fallbackCigars)
    : (Array.isArray(originTobacco) ? originTobacco : fallbackTobacco);

  const sourceLabel = selection === "cigars"
    ? (Array.isArray(originCigars) ? "originData_cigars" : "fallback (public/data)")
    : (Array.isArray(originTobacco) ? "originData_tobacco" : "fallback (public/data)");
  const usingFallback = selection === "cigars"
    ? !Array.isArray(originCigars)
    : !Array.isArray(originTobacco);

  const rows = useMemo(() => {
    return selection === "cigars"
      ? flattenCigarsBySize(activeSource)
      : normalizeRows(activeSource);
  }, [selection, activeSource]);

  const columns = useMemo(() => collectColumns(rows), [rows]);
  const csv = useMemo(() => buildCsv(rows, columns), [rows, columns]);
  const previewCsv = useMemo(() => buildCsv(rows.slice(0, 5), columns), [rows, columns]);

  const rawCount = Array.isArray(activeSource) ? activeSource.length : 0;
  const rowCount = rows.length;

  const handleDownload = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildFilename(selection === "cigars" ? "cigars-export" : "tobacco-export");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <PageTitle1 subtitle="Download origin data as CSV">Export</PageTitle1>

      <div className="export-grid">
        <section className="panel">
          <h2>Export Options</h2>

          <div className="option">
            <label>
              <input
                type="radio"
                name="export-type"
                value="cigars"
                checked={selection === "cigars"}
                onChange={() => setSelection("cigars")}
              />
              <span>Cigars (flat by size)</span>
            </label>
            <p>Each cigar size exports as its own row.</p>
          </div>

          <div className="option">
            <label>
              <input
                type="radio"
                name="export-type"
                value="tobacco"
                checked={selection === "tobacco"}
                onChange={() => setSelection("tobacco")}
              />
              <span>Tobacco (one row per blend)</span>
            </label>
            <p>Exports the tobacco entries exactly once each.</p>
          </div>

          <div className="meta">
            <div><strong>Source:</strong> {sourceLabel}</div>
            {originMeta.message && (
              <div><strong>Origin version:</strong> {originMeta.message}</div>
            )}
            {originMeta.sha && (
              <div><strong>Origin SHA:</strong> {originMeta.sha}</div>
            )}
            {usingFallback && (
              <div className="hint">Origin data not found in localStorage. Use Reload Origin Data after syncing.</div>
            )}
          </div>

          <div className="stats">
            <div><strong>Rows:</strong> {rowCount.toLocaleString()}</div>
            <div><strong>Items:</strong> {rawCount.toLocaleString()}</div>
          </div>

          <div className="actions">
            <button onClick={handleDownload} disabled={!csv}>
              Download CSV
            </button>
            <button type="button" className="ghost" onClick={loadOriginData}>
              Reload Origin Data
            </button>
          </div>
        </section>

        <section className="panel preview">
          <h2>Preview</h2>
          {csv ? (
            <pre>{previewCsv}</pre>
          ) : (
            <p>No data found for this export.</p>
          )}
        </section>
      </div>

      <style jsx>{`
        .export-grid {
          display: grid;
          grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
          gap: 1.5rem;
          padding: 1.5rem 0;
        }
        .panel {
          background: var(--dl-color-theme-primary2);
          border: 1px solid var(--dl-color-theme-primary1);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .panel h2 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--dl-color-theme-secondary2);
        }
        .option label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--dl-color-theme-secondary1);
        }
        .option p {
          margin: 0.25rem 0 0 1.6rem;
          color: var(--dl-color-theme-secondary1);
          opacity: 0.8;
        }
        .meta,
        .stats {
          display: grid;
          gap: 0.35rem;
          font-size: 0.95rem;
          color: var(--dl-color-theme-secondary1);
        }
        .hint {
          font-size: 0.85rem;
          color: var(--dl-color-theme-secondary2);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .actions button {
          padding: 0.6rem 1rem;
          font-weight: 700;
          background: var(--dl-color-theme-secondary2);
          color: var(--dl-color-theme-primary2);
          cursor: pointer;
        }
        .actions button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .actions button.ghost {
          background: transparent;
          border: 1px solid var(--dl-color-theme-secondary2);
          color: var(--dl-color-theme-secondary2);
        }
        .preview pre {
          margin: 0;
          background: var(--dl-color-theme-secondary1);
          color: var(--dl-color-theme-primary2);
          padding: 0.75rem;
          white-space: pre-wrap;
          max-height: 420px;
          overflow: auto;
          font-size: 0.85rem;
        }
        @media (max-width: 900px) {
          .export-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ExportPage;
