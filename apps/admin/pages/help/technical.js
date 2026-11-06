import Head from 'next/head';
import Link from 'next/link';
import { PiArrowLeftBold, PiWarningCircleFill } from 'react-icons/pi';

import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';
import styles from './technical.module.css';

const Command = ({ children }) => <pre className={styles.command}><code>{children}</code></pre>;

const CommandRow = ({ command, purpose, caution }) => (
  <div className={styles.commandRow}>
    <Command>{command}</Command>
    <div><p>{purpose}</p>{caution && <small>{caution}</small>}</div>
  </div>
);

export default function TechnicalReferencePage() {
  return (
    <Layout>
      <Head>
        <title>Technical Command Reference | King Street Emporium Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className={styles.page}>
        <PageTitle1 subtitle="Repository, database, authentication, and verification commands">
          Technical Command Reference
        </PageTitle1>

        <main className={styles.content}>
          <Link href="/help"><a className={styles.back}><PiArrowLeftBold /> Back to staff documentation</a></Link>

          <section className={styles.intro}>
            <div><span>For Liam and backup maintainers</span><h2>Run commands from the repository root</h2><p>These examples assume PowerShell is open in the <code>EmporiumWebsite</code> folder. Unless a command says otherwise, it uses variables from the repository-root <code>.env.local</code> file.</p></div>
            <div className={styles.path}>C:\Users\mcpau\Documents\GitHub\EmporiumWebsite</div>
          </section>

          <nav className={styles.contents} aria-label="Technical reference contents">
            <a href="#setup">Setup</a><a href="#development">Development</a><a href="#quality">Build and verification</a><a href="#auth">Password and sessions</a><a href="#database">Database</a><a href="#transfer">Import and export</a><a href="#environment">Environment variables</a><a href="#runbooks">Runbooks</a>
          </nav>

          <section id="setup" className={styles.section}>
            <header><span>Local setup</span><h2>Install and configure</h2></header>
            <CommandRow command="npm install" purpose="Install the exact workspace dependencies described by package-lock.json. Run after cloning, pulling dependency changes, or seeing a missing-package error." />
          </section>

          <section id="development" className={styles.section}>
            <header><span>Local applications</span><h2>Development and production-style servers</h2></header>
            <CommandRow command="npm run dev:public" purpose="Start the public website development server, normally at http://localhost:3000." />
            <CommandRow command="npm run dev:admin" purpose="Start the admin development server, normally at http://localhost:3001. ADMIN_DATABASE_URL and AUTH_COOKIE_SECRET are required for sign-in and database-backed pages." />
            <CommandRow command="npm run dev" purpose="Alias for dev:public." />
            <CommandRow command="npm run start --workspace=@emporium/public" purpose="Serve an already-built public application on port 25565." />
            <CommandRow command="npm run start --workspace=@emporium/admin" purpose="Serve an already-built admin application on port 3001." />
            <CommandRow command="npm run export --workspace=@emporium/public" purpose="Run the public workspace's legacy Next.js static-export command. This is not part of the normal database-backed Vercel deployment." />
          </section>

          <section id="quality" className={styles.section}>
            <header><span>Safe checks</span><h2>Build, lint, and test</h2></header>
            <div className={styles.grid}>
              <CommandRow command="npm run build" purpose="Build every workspace." />
              <CommandRow command="npm run build:public" purpose="Build only the public site." />
              <CommandRow command="npm run build:admin" purpose="Build only the admin site." />
              <CommandRow command="npm run lint" purpose="Lint every workspace." />
              <CommandRow command="npm run lint:public" purpose="Lint only the public site." />
              <CommandRow command="npm run lint:admin" purpose="Lint only the admin site." />
              <CommandRow command="npm test" purpose="Run all automated tests." />
              <CommandRow command="npm run test:public" purpose="Run public-site tests." />
              <CommandRow command="npm run test:admin" purpose="Run admin tests." />
            </div>
            <CommandRow command="npm run validate:legacy" purpose="Validate all checked-in legacy JSON catalogs and summarize record, warning, error, and public/admin parity counts. Does not connect to the database." />
            <CommandRow command="node packages/domain/scripts/validate-legacy-data.js --json" purpose="Run the same legacy validation and print the full machine-readable JSON report." />
          </section>

          <section id="auth" className={styles.section}>
            <header><span>Production-sensitive</span><h2>Admin password and sessions</h2></header>
            <div className={styles.danger}><PiWarningCircleFill /><p>Confirm that <code>ADMIN_DATABASE_URL</code> points to the intended environment before running either command. Against production, these immediately affect real staff access.</p></div>
            <CommandRow command="npm run auth:password" purpose="Prompt securely for a new store-admin password. The password must be at least 16 characters. Updating it immediately revokes every existing session." caution="Use for initial setup, password rotation, or when the password may have been exposed." />
            <CommandRow command="npm run auth:revoke" purpose="Immediately revoke every store-admin session without changing the password." caution="Use when the store tablet or another signed-in device is missing." />
          </section>

          <section id="database" className={styles.section}>
            <header><span>Database administration</span><h2>Schema, permissions, and Neon branches</h2></header>
            <div className={styles.danger}><PiWarningCircleFill /><p>The database commands use <code>DATABASE_URL</code>, normally an owner or migration credential. Verify the host, database, and Neon branch before making changes.</p></div>
            <CommandRow command="npm run db:generate" purpose="Generate a new checked-in SQL migration after changing the Drizzle schema. Review the generated SQL before applying it." />
            <CommandRow command="npm run db:migrate" purpose="Apply all pending checked-in migrations to DATABASE_URL. Safe to rerun; already-applied migrations are skipped." />
            <CommandRow command="npm run db:roles" purpose="Create or update the emporium_reader, emporium_writer, and emporium_migrator capability roles and their grants." />
            <CommandRow command="npm run db:check" purpose="Verify expected tables, public views, roles, and core permissions. This is the final check after migrations or role changes." />
            <CommandRow command="npm run db:branch:create -- preview-pr-123" purpose="Create a Neon copy-on-write preview branch and read-write endpoint. Replace preview-pr-123 with a lowercase name containing only letters, numbers, and hyphens." caution="Requires NEON_API_KEY and NEON_PROJECT_ID. NEON_PARENT_BRANCH_ID optionally chooses the source branch." />
          </section>

          <section id="transfer" className={styles.section}>
            <header><span>Catalog migration and recovery</span><h2>Import, verify, and export</h2></header>
            <CommandRow command="npm run import:legacy -- --dry-run" purpose="Validate the four checked-in JSON catalogs and report what would be imported without connecting to Neon." />
            <CommandRow command="npm run import:legacy" purpose="Transactionally reconcile cigars, tobacco, pipes, coffee, and tea from the checked-in legacy JSON into DATABASE_URL." caution="This writes catalog data and removes stale database products managed by the import. Use only after a clean dry run and a backup." />
            <CommandRow command="npm run verify:import" purpose="Compare every normalized database field with legacy JSON, verify counts and unique slugs, rerun the import, and prove that a repeat import makes no normalized changes." caution="This is a write-capable verification because it deliberately reruns the import." />
            <CommandRow command="npm run export:database -- --output backups/export-2026-10-19" purpose="Export all four database catalogs to a newly created directory as recovery JSON. Change the dated directory for each run." caution="Existing files are never overwritten; use a new directory every time." />
            <CommandRow command="npm run verify:phase7" purpose="Exercise create, publish, conflict rollback, update, and delete against ADMIN_DATABASE_URL using a disposable tobacco product." caution="Never run casually against production. The disposable product is removed, but audit and change-set history are intentionally retained." />
          </section>

          <section id="environment" className={styles.section}>
            <header><span>Configuration map</span><h2>Environment variables</h2></header>
            <div className={styles.tableWrap}><table><thead><tr><th>Variable</th><th>Used by</th><th>Purpose</th></tr></thead><tbody>
              <tr><td><code>DATABASE_URL</code></td><td>Database and migration scripts</td><td>Owner/migrator connection for schema, roles, import, verification, and exports.</td></tr>
              <tr><td><code>ADMIN_DATABASE_URL</code></td><td>Admin app and auth scripts</td><td>Writer connection used by the admin application.</td></tr>
              <tr><td><code>PUBLIC_DATABASE_URL</code></td><td>Public app</td><td>Read-only connection granted access only to public views.</td></tr>
              <tr><td><code>AUTH_COOKIE_SECRET</code></td><td>Admin app</td><td>At least 32 characters; signs browser sessions.</td></tr>
              <tr><td><code>AUTH_SESSION_HOURS</code></td><td>Admin app</td><td>Session length from 1 through 168 hours; defaults to 12.</td></tr>
              <tr><td><code>BLOB_READ_WRITE_TOKEN</code></td><td>Admin app</td><td>Allows authenticated product-image upload and cleanup.</td></tr>
              <tr><td><code>DATA_SOURCE</code></td><td>Public app</td><td><code>database</code> for Neon or <code>json</code> for the fallback catalog.</td></tr>
              <tr><td><code>PUBLIC_REVALIDATE_SECONDS</code></td><td>Public app</td><td>Public-page cache interval; defaults to 300 seconds.</td></tr>
              <tr><td><code>REVALIDATION_SECRET</code></td><td>Both apps</td><td>Shared secret used to request safe public-page refreshes after publication.</td></tr>
              <tr><td><code>PUBLIC_SITE_URL</code></td><td>Admin app</td><td>Base URL the admin asks to refresh after publication.</td></tr>
              <tr><td><code>SITE_URL</code></td><td>Public app</td><td>Canonical public website address used for routes and sitemap output.</td></tr>
              <tr><td><code>NEON_API_KEY</code></td><td>Preview branch script</td><td>Neon API credential for creating branches.</td></tr>
              <tr><td><code>NEON_PROJECT_ID</code></td><td>Preview branch script</td><td>Neon project receiving the new branch.</td></tr>
              <tr><td><code>NEON_PARENT_BRANCH_ID</code></td><td>Preview branch script</td><td>Optional parent branch; normally the development branch.</td></tr>
            </tbody></table></div>
            <h3 className={styles.subheading}>Temporary PowerShell variables</h3>
            <Command>$env:DATABASE_URL = 'postgresql://...'
$env:ADMIN_DATABASE_URL = 'postgresql://...'

# Remove them from the current PowerShell session when finished:
Remove-Item Env:DATABASE_URL
Remove-Item Env:ADMIN_DATABASE_URL</Command>
          </section>

          <section id="runbooks" className={styles.section}>
            <header><span>Recommended order</span><h2>Common runbooks</h2></header>
            <div className={styles.runbooks}>
              <article><h3>Fresh database</h3><Command>npm run db:migrate
npm run db:roles
npm run db:check
npm run import:legacy -- --dry-run
npm run import:legacy
npm run verify:import
npm run export:database -- --output backups/initial-production-export</Command></article>
              <article><h3>Before deploying code</h3><Command>npm install
npm run lint
npm test
npm run build</Command></article>
              <article><h3>Lost store tablet</h3><Command>npm run auth:revoke

# If the password may also be exposed:
npm run auth:password</Command></article>
              <article><h3>Admin-only verification</h3><Command>npm run lint:admin
npm run test:admin
npm run build:admin</Command></article>
            </div>
          </section>

          <footer className={styles.footerNote}>Last reviewed against the commands on the <code>migration/admin-neon</code> branch. Recheck this page whenever package scripts or environment variables change.</footer>
        </main>
      </div>
    </Layout>
  );
}
