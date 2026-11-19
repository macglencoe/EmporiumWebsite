import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';

const endpoint = '/api/tools/revalidation/';
const quantity = (count, noun) => `${count.toLocaleString()} ${noun}${count === 1 ? '' : 's'}`;
const sitemapLabels = { refreshed: 'Refreshed', failed: 'Failed', unconfirmed: 'Could not confirm refresh' };

async function request(action, data = {}) {
  const response = await fetch(endpoint, action ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  } : undefined);
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) throw new Error(result?.message || 'Could not complete the request.');
  return result;
}

export default function PublicCacheRefreshPage() {
  const [overview, setOverview] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [connection, setConnection] = useState(null);
  const [section, setSection] = useState('');
  const [product, setProduct] = useState('');
  const [includeSitemap, setIncludeSitemap] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const busy = Boolean(progress);

  useEffect(() => {
    request().then(setOverview).catch(() => setLoadError('Could not load the cache refresh tool. Reload the page to try again.'));
  }, []);

  async function run(label, operation) {
    setError('');
    setProgress(label);
    try {
      await operation();
    } catch (error) {
      setError(error.message);
    } finally {
      setProgress('');
    }
  }

  async function refresh(label, plan, changeSetId) {
    const paths = [...new Set(plan.paths)];
    const { batchSize } = overview;
    const total = Math.max(Math.ceil(paths.length / batchSize), Number(plan.sitemap));
    const warnings = new Set();
    let revalidated = 0;
    let sitemap = null;
    const failedPaths = [];
    for (let index = 0; index < total; index++) {
      setProgress(`${label} · batch ${index + 1} of ${total}`);
      const batch = paths.slice(index * batchSize, (index + 1) * batchSize);
      const refreshSitemap = index === 0 && plan.sitemap;
      try {
        const outcome = await request('refresh', { paths: batch, sitemap: refreshSitemap });
        revalidated += outcome.revalidated;
        sitemap = outcome.sitemap ?? sitemap;
        failedPaths.push(...(outcome.failedPaths ?? []));
        if (outcome.warning) warnings.add(outcome.warning);
      } catch (error) {
        failedPaths.push(...batch);
        if (refreshSitemap) sitemap = 'unconfirmed';
        warnings.add(error.message);
      }
    }
    setResult({ label, revalidated, sitemap, failedPaths, warnings: [...warnings], skipped: total === 0, planningWarning: plan.planningWarning, changeSetId });
  }

  function checkConnection() {
    return run('Checking connection…', async () => {
      setConnection(null);
      const { connection } = await request('check');
      setConnection(connection);
    });
  }

  function refreshPublication(id) {
    return run('Finding affected pages…', async () => {
      const plan = await request('publication', { changeSetId: id });
      await refresh('Publication refresh', plan, id);
    });
  }

  function refreshSelected(event) {
    event.preventDefault();
    const productPath = product.trim().replace(/\/$/, '');
    if (product.trim() && !/^\/(?:cigars|tobacco)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productPath)) {
      setError('Enter a product path such as /cigars/product-slug.');
      return;
    }
    return run('Refreshing selected pages…', () => refresh('Selected pages', {
      paths: [section, productPath].filter(Boolean),
      sitemap: includeSitemap,
    }));
  }

  function previewStorefront() {
    return run('Counting storefront pages…', async () => {
      setPreview(null);
      setPreview(await request('preview'));
    });
  }

  function refreshStorefront() {
    if (!window.confirm(`Refresh ${quantity(preview.paths.length, 'public page')} and the sitemap?`)) return;
    const plan = preview;
    setPreview(null);
    return run('Refreshing storefront…', () => refresh('Storefront refresh', plan));
  }

  function retryFailures() {
    const retrySitemap = result.sitemap === 'failed' || result.sitemap === 'unconfirmed';
    return run('Retrying cache refresh…', () => refresh('Cache refresh retry', {
      paths: result.failedPaths,
      sitemap: retrySitemap,
      planningWarning: result.planningWarning,
    }, result.changeSetId));
  }

  const configuration = overview?.configuration;
  const retryable = result && (result.failedPaths.length > 0 || ['failed', 'unconfirmed'].includes(result.sitemap));
  return (
    <Layout>
      <Head><title>Public Cache Refresh | King Street Emporium Admin</title></Head>
      <PageTitle1>Public Cache Refresh</PageTitle1>
      <div className="refresh-tool">
        <Link href="/tools"><a>Developer Tools</a></Link>
        {loadError && <p className="warning" role="alert">{loadError}</p>}
        {!overview && !loadError && <p role="status">Loading cache refresh tool…</p>}
        {overview && <>
          <section>
            <h2>Configuration</h2>
            <dl>
              <dt>Public site</dt><dd>{configuration.siteUrl || 'Missing or invalid'}</dd>
              <dt>Refresh endpoint</dt><dd>{configuration.endpoint || 'Unavailable'}</dd>
              <dt>Signing secret</dt><dd>{configuration.signingSecret}</dd>
              {connection && <>
                <dt>Public catalog source</dt><dd>{connection.dataSource}</dd>
                <dt>Page revalidation interval</dt><dd>{quantity(connection.revalidateSeconds, 'second')}</dd>
              </>}
            </dl>
            <button type="button" disabled={busy} onClick={checkConnection}>Check connection</button>
            {connection && <p role="status">The public site accepted the refresh credentials.</p>}
          </section>

          {progress && <p role="status">{progress}</p>}
          {error && <p role="alert" className="warning">{error}</p>}
          {result && <section aria-labelledby="result-heading">
            <h2 id="result-heading">Latest refresh result</h2>
            <p role="status"><strong>{result.label}.</strong> {result.skipped
              ? 'No public pages needed refreshing.'
              : `Refreshed ${quantity(result.revalidated, 'public page')}.`}</p>
            {result.sitemap && <p><strong>Sitemap.</strong> {sitemapLabels[result.sitemap]}</p>}
            {(result.warnings.length > 0 || result.planningWarning) && <p className="warning" role="alert">
              {[result.planningWarning, ...result.warnings].filter(Boolean).join(' ')}
            </p>}
            {result.failedPaths.length > 0 && <details>
              <summary>{quantity(result.failedPaths.length, 'page')} to retry</summary>
              <ul className="failed-paths">{result.failedPaths.map((path) => <li key={path}><code>{path}</code></li>)}</ul>
            </details>}
            <div className="actions">
              {retryable && <button type="button" disabled={busy} onClick={retryFailures}>Retry failed targets</button>}
              {result.planningWarning && <button type="button" disabled={busy} onClick={() => refreshPublication(result.changeSetId)}>Recheck affected publication pages</button>}
            </div>
          </section>}

          <section>
            <h2>Recent publications</h2>
            <p>Refresh pages affected by a publication, including old URLs for renamed or removed products.</p>
            {overview.historyWarning && <p className="warning" role="alert">{overview.historyWarning}</p>}
            {!overview.historyWarning && !overview.publications.length && <p>No publications yet.</p>}
            {overview.publications.length > 0 && <ul className="publications">
              {overview.publications.map(({ id, note, publishedAt, itemCount }) => <li key={id}>
                <div>
                  <strong>{note || 'Catalog changes'}</strong>
                  <span><time dateTime={publishedAt}>{new Date(publishedAt).toLocaleString()}</time>{itemCount == null ? '' : ` · ${quantity(itemCount, 'change')}`}</span>
                </div>
                <button type="button" disabled={busy} onClick={() => refreshPublication(id)}>Refresh affected pages</button>
              </li>)}
            </ul>}
          </section>

          <section>
            <h2>Refresh selected pages</h2>
            <form onSubmit={refreshSelected}>
              <label>Homepage or catalog page
                <select value={section} onChange={(event) => setSection(event.target.value)}>
                  <option value="">Choose a page</option>
                  {overview.sectionPaths.map((path) => <option key={path} value={path}>{path === '/' ? 'Homepage (/)' : path}</option>)}
                </select>
              </label>
              <label>Product page path
                <input value={product} onChange={(event) => setProduct(event.target.value)} placeholder="/cigars/product-slug" aria-describedby="product-path-help" />
              </label>
              <small id="product-path-help">Use a path beginning with /cigars/ or /tobacco/.</small>
              <label className="checkbox"><input type="checkbox" checked={includeSitemap} onChange={(event) => setIncludeSitemap(event.target.checked)} /> Refresh the sitemap</label>
              <button disabled={busy || (!section && !product.trim() && !includeSitemap)}>Refresh selected pages</button>
            </form>
          </section>

          <section>
            <h2>Refresh entire storefront</h2>
            <p>Refresh the homepage, catalog sections, current public product pages, and sitemap. Keep this tab open until all batches finish.</p>
            <button type="button" disabled={busy} onClick={previewStorefront}>Preview full refresh</button>
            {preview && <div className="warning">
              <p role="status">This will refresh <strong>{quantity(preview.paths.length, 'public page')}</strong> and the sitemap.</p>
              <div className="actions">
                <button type="button" className="danger" disabled={busy} onClick={refreshStorefront}>Refresh entire storefront</button>
                <button type="button" disabled={busy} onClick={() => setPreview(null)}>Cancel</button>
              </div>
            </div>}
          </section>
        </>}
      </div>
      <style jsx>{`
        .refresh-tool { width: calc(100% - 2rem); max-width: 980px; margin: 1rem auto 4rem; color: #292724; }
        a { text-decoration: underline; text-underline-offset: .2em; }
        section { margin-top: 1rem; padding: 1rem 1.1rem; border: 1px solid #d9d6d1; border-radius: 5px; background: #fff; }
        h2 { margin: 0 0 .5rem; font-size: 1.15rem; font-weight: 700; }
        p, dl { margin: 0 0 .75rem; }
        p:last-child { margin-bottom: 0; }
        dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .3rem 1rem; }
        dt { font-weight: 600; }
        dd, code { overflow-wrap: anywhere; }
        dd { margin: 0; }
        button { width: fit-content; padding: .5rem .75rem; border: 1px solid #a99a87; border-radius: 4px; background: #fffaf0; color: #4b4038; font-weight: 700; cursor: pointer; }
        button:disabled { opacity: .55; cursor: default; }
        button + p, .warning { margin-top: .75rem; }
        .warning { padding: .75rem; border-left: 4px solid #a53d36; background: #fff1ef; color: #782d28; }
        .danger { border-color: #8c251f; background: #8c251f; color: #fff; }
        .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
        details + .actions, p + .actions { margin-top: .75rem; }
        summary { cursor: pointer; }
        .failed-paths { max-height: 14rem; overflow: auto; padding-left: 1.25rem; }
        .publications { list-style: none; margin: 0; padding: 0; }
        .publications li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem; padding: .65rem 0; border-top: 1px solid #e7e4df; }
        .publications span { display: block; color: #69655f; font-size: .85rem; }
        form { display: grid; gap: .65rem; }
        label { display: grid; gap: .25rem; font-weight: 600; }
        .checkbox { display: flex; align-items: center; gap: .45rem; }
        select, input:not([type=checkbox]) { width: 100%; max-width: 32rem; padding: .5rem; border: 1px solid #a99a87; border-radius: 4px; background: #fff; }
        small { color: #69655f; }
      `}</style>
    </Layout>
  );
}
