import { useState } from 'react';

import { DatabasePage, ProductReference, displayTime, downloadReport, styles } from '../../../components/databaseTools';
import { DATABASE_TOOLS, SCAN_TOOLS, findingsCsv, rememberScan } from '../../../lib/database/tools.mjs';

function Auditor({ tool }) {
  const metadata = DATABASE_TOOLS.find((item) => item.id === tool);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [severity, setSeverity] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(30);
  const catalogTool = ['quality', 'duplicates', 'integrity'].includes(tool);
  async function scan() {
    setBusy(true); setError(''); setResult(null); setLimit(30);
    try {
      const response = await fetch(`/api/tools/database/${tool}/`, { method: 'POST' });
      if (response.status === 401) throw new Error('Your session has expired. Sign in again, then rerun this check.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Scan failed.');
      setResult(data); rememberScan(tool, data.summary);
    } catch (failure) {
      setError(failure.message); rememberScan(tool, { status: 'failed', checkedAt: new Date().toISOString() });
    } finally { setBusy(false); }
  }
  const findings = (result?.findings || []).filter((finding) => (!severity || finding.severity === severity) && (!type || finding.products.some((product) => product.type === type)) && (!search || JSON.stringify(finding).toLowerCase().includes(search.toLowerCase())));
  const resetLimit = (setter) => (event) => { setter(event.target.value); setLimit(30); };
  return <DatabasePage title={metadata.title} active={tool}>
    <p className={styles.intro}>{metadata.description} Checks cover the connected database, including hidden and unpublished products. No records are changed.</p>
    {tool === 'duplicates' && <p className={styles.muted}>Candidates use exact shared barcodes or brand/name matches after punctuation and case normalization. Alternate names without this evidence may be missed. Review comparisons before deciding whether records represent the same product.</p>}
    {tool === 'quality' && <p className={styles.muted}>Missing optional fields are informational. Image checks validate stored URL format; they do not fetch remote images or verify that a file exists.</p>}
    {tool === 'permissions' && <p className={styles.muted}>Checks inspect expected catalog relations, schema access, and configured logins. This is not a comprehensive security audit of functions, row policies, or other schemas.</p>}
    <div className={styles.toolbar}><button className={styles.primary} onClick={scan} disabled={busy}>{busy ? 'Checking…' : result ? 'Run again' : 'Run check'}</button>
      {result && <><button onClick={() => downloadReport(`database-${tool}.json`, JSON.stringify({ ...result, findings, filters: { severity, type, search } }, null, 2), 'application/json')}>Download JSON</button><button onClick={() => downloadReport(`database-${tool}.csv`, findingsCsv(findings), 'text/csv;charset=utf-8')}>Download CSV</button></>}
    </div>
    {busy && <p role="status">Reading database records and evaluating checks…</p>}
    {error && <p role="alert" className={`${styles.status} ${styles.failure}`}>{error}</p>}
    {!result && !busy && !error && <p className={styles.status}>Not checked. Run a check to see current results.</p>}
    {result && <>
      <div role="status" className={styles.status}>Completed {displayTime(result.checkedAt)}{result.scanned !== undefined ? ` · ${result.scanned} products scanned` : ''}. {result.findings.length ? `${result.findings.length} findings.` : 'No findings detected.'}
        <div>{Object.entries(result.summary.counts).map(([key, count]) => <span className={`${styles.badge} ${styles[key]}`} key={key}>{count} {key}</span>)}</div>
      </div>
      {result.checks && <dl className={styles.checks}>{result.checks.map((check) => <div key={check.label}><dt>{check.label}</dt><dd>{check.value}</dd></div>)}</dl>}
      <div className={styles.toolbar}>
        <label>Severity<select value={severity} onChange={resetLimit(setSeverity)}><option value="">All severities</option>{['error', 'warning', 'info'].map((value) => <option key={value}>{value}</option>)}</select></label>
        {catalogTool && <label>Product type<select value={type} onChange={resetLimit(setType)}><option value="">All types</option>{['cigar', 'tobacco', 'pipe', 'caffeine'].map((value) => <option key={value}>{value}</option>)}</select></label>}
        <label>Search findings<input value={search} onChange={resetLimit(setSearch)} placeholder="Name, slug, barcode, or rule" /></label>
      </div>
      <p className={styles.muted}>{findings.length} findings match. Downloads include all matching findings.</p>
      {!findings.length && result.findings.length > 0 && <p>No findings match these filters.</p>}
      <div className={styles.list}>{findings.slice(0, limit).map((finding) => <article className={styles.card} key={finding.id}>
        <span className={`${styles.badge} ${styles[finding.severity]}`}>{finding.severity}</span><span className={styles.muted}>{finding.rule}</span>
        <h2>{finding.title}</h2><p>{finding.evidence}</p>
        {finding.products.map((product) => <div key={product.id}><ProductReference product={product} /></div>)}
        {finding.comparison && <details><summary>Compare product data</summary><div className={styles.comparison}>{finding.comparison.map((product) => <section key={product.id}><h3>{product.slug}</h3><pre>{JSON.stringify(product, null, 2)}</pre></section>)}</div></details>}
      </article>)}</div>
      {findings.length > limit && <button onClick={() => setLimit(limit + 30)}>Show more findings ({findings.length - limit} remaining)</button>}
    </>}
  </DatabasePage>;
}

export function getServerSideProps({ params }) {
  return SCAN_TOOLS.includes(params.tool) ? { props: { tool: params.tool } } : { notFound: true };
}

export default function DatabaseAuditor(props) { return <Auditor key={props.tool} {...props} />; }
