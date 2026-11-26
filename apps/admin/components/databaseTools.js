import Head from 'next/head';
import Link from 'next/link';

import Layout from './layout';
import PageTitle1 from './pagetitle1';
import { DATABASE_TOOLS } from '../lib/database/tools.mjs';
import styles from './databaseTools.module.css';

export { styles };
export const displayTime = (value) => new Date(value).toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' });

export function DatabasePage({ title, children, active }) {
  return <Layout>
    <Head><title>{title} | Emporium Admin</title></Head>
    <PageTitle1>{title}</PageTitle1>
    <main className={styles.page}>
      <p><Link href={active ? '/tools/database' : '/tools'}><a>← {active ? 'Database Dashboard' : 'Developer Tools'}</a></Link></p>
      {active && <nav className={styles.nav} aria-label="Database tools">{DATABASE_TOOLS.map((tool) => <Link key={tool.id} href={`/tools/database/${tool.id}`}><a aria-current={active === tool.id ? 'page' : undefined}>{tool.title}</a></Link>)}</nav>}
      {children}
    </main>
  </Layout>;
}

export function ProductReference({ product }) {
  const section = { cigar: 'cigars', tobacco: 'tobacco' }[product.type];
  return <span>
    {section && product.slug ? <Link href={`/${section}/${encodeURIComponent(product.slug)}`}><a>{product.brand ? `${product.brand} — ` : ''}{product.name || product.slug}</a></Link> : <strong>{product.name || product.slug || product.id}</strong>}
    <span className={styles.muted}> · {product.type} · {product.published ? product.hidden ? 'Published, hidden' : 'Published, visible' : 'Unpublished'}</span>
    <small className={styles.identifier}>{product.slug} · {product.id}</small>
  </span>;
}

export function downloadReport(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
