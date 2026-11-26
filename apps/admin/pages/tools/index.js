import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';

export default function ToolsPage() {
  return (
    <Layout>
      <Head>
        <title>Developer Tools | King Street Emporium Admin</title>
      </Head>
      <PageTitle1>Developer Tools</PageTitle1>
      <div className="tools">
        <section className="warning" aria-labelledby="danger-heading">
          <h2 id="danger-heading">Danger Zone</h2>
          <p>Do not touch anything here unless you know what you&apos;re doing.</p>
        </section>
        <nav aria-label="Developer tools">
          <ul>
            <li>
              <Link href="/tools/catalog-import"><a>Catalog Import</a></Link>
              <p>Preview and apply a legacy catalog JSON import.</p>
            </li>
            <li>
              <Link href="/tools/revalidation"><a>Public Cache Refresh</a></Link>
              <p>Refresh storefront pages after a missed or failed cache update.</p>
            </li>
            <li>
              <Link href="/tools/database">
                <a>Database Dashboard</a>
              </Link>
              <p>
                Audit catalog quality, duplicates, data integrity, health, and permissions; browse change history and Neon usage.
              </p>
            </li>
          </ul>
        </nav>
      </div>
      <style jsx>{`
        .tools {
          width: calc(100% - 2rem);
          max-width: 980px;
          margin: 1rem auto 4rem;
          color: #292724;
        }
        .warning {
          padding: 1rem 1.1rem;
          border: 1px solid #dfbdb8;
          border-left: 4px solid #a53d36;
          border-radius: 5px;
          background: #fff1ef;
          color: #782d28;
        }
        h2 {
          margin: 0 0 .25rem;
          font-size: 1.15rem;
          font-weight: 700;
        }
        p {
          margin: 0;
        }
        ul {
          display: grid;
          gap: .75rem;
          list-style: none;
          margin: 1rem 0 0;
          padding: 0;
        }
        li {
          padding: 1rem 1.1rem;
          border: 1px solid #d9d6d1;
          border-radius: 5px;
          background: #fff;
        }
        a {
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: .2em;
        }
        li p {
          margin-top: .25rem;
          color: #69655f;
          font-size: .9rem;
        }
      `}</style>
    </Layout>
  );
}
