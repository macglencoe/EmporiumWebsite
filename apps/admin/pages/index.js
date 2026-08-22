import Link from 'next/link';
import { PiArrowRightBold, PiCheckCircleFill, PiPlusBold, PiWarningCircleFill } from 'react-icons/pi';
import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';
import styles from './index.module.css';

export async function getServerSideProps() {
  const { readCatalog, describeDraft } = await import('../lib/catalog/server.mjs');
  const [catalog, draft] = await Promise.all([readCatalog(['cigar', 'tobacco']), describeDraft()]);
  return { props: {
    cigarCount: catalog.filter((item) => item.type === 'cigar').length,
    tobaccoCount: catalog.filter((item) => item.type === 'tobacco').length,
    draftCount: draft?.items?.length || 0,
  } };
}

function ArrowLink({ href, children, className = '' }) {
  return <Link href={href}><a className={`${styles.arrowLink} ${className}`}><span>{children}</span><PiArrowRightBold aria-hidden="true" /></a></Link>;
}

function CatalogCard({ title, count, description, href, addHref }) {
  return <article className={styles.catalogCard}>
    <div className={styles.catalogTopline}><h2>{title}</h2><span>{count.toLocaleString()} products</span></div>
    <p>{description}</p>
    <div className={styles.cardActions}>
      <ArrowLink href={href}>Manage {title.toLowerCase()}</ArrowLink>
      <Link href={addHref}><a className={styles.addLink}><PiPlusBold aria-hidden="true" /> Add new</a></Link>
    </div>
  </article>;
}

export default function AdminHome({ cigarCount, tobaccoCount, draftCount }) {
  const hasDrafts = draftCount > 0;
  return <Layout>
    <div className={styles.dashboard}>
      <PageTitle1 subtitle="Catalog administration and publishing overview">Dashboard</PageTitle1>

      <div className={styles.workspace}>
        <section className={`${styles.publishStatus} ${hasDrafts ? styles.pending : styles.current}`} aria-labelledby="publishing-status">
          <div className={styles.statusIcon}>{hasDrafts ? <PiWarningCircleFill aria-hidden="true" /> : <PiCheckCircleFill aria-hidden="true" />}</div>
          <div className={styles.statusCopy}>
            <span>Publishing status</span>
            <h2 id="publishing-status">{hasDrafts ? `${draftCount} change${draftCount === 1 ? '' : 's'} ready for review` : 'Catalog is up to date'}</h2>
            <p>{hasDrafts ? 'Review the staged changes before publishing them to the catalog.' : 'There are no unpublished changes.'}</p>
          </div>
          <ArrowLink href="/submit">{hasDrafts ? 'Review changes' : 'View publishing'}</ArrowLink>
        </section>

        <section className={styles.stats} aria-label="Catalog totals">
          <div><span>Total products</span><strong>{(cigarCount + tobaccoCount).toLocaleString()}</strong></div>
          <div><span>Cigars</span><strong>{cigarCount.toLocaleString()}</strong></div>
          <div><span>Pipe tobacco</span><strong>{tobaccoCount.toLocaleString()}</strong></div>
        </section>

        <section className={styles.catalogSection} aria-labelledby="catalog-heading">
          <header><div><span>Catalog</span><h2 id="catalog-heading">Catalog management</h2></div><p>Select a catalog to browse or add a new product.</p></header>
          <div className={styles.catalogGrid}>
            <CatalogCard title="Cigars" count={cigarCount} description="Manage product details, pricing, brands, sizes, wrappers, and strengths." href="/cigars" addHref="/cigars/add" />
            <CatalogCard title="Pipe tobacco" count={tobaccoCount} description="Manage blends, brands, families, components, and product information." href="/tobacco" addHref="/tobacco/add" />
          </div>
        </section>
      </div>
    </div>
  </Layout>;
}
