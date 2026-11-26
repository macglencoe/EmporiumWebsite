import { useEffect, useState } from 'react';
import Link from 'next/link';

import { DatabasePage, displayTime, styles } from '../../../components/databaseTools';
import { DATABASE_TOOLS, SUMMARY_KEY } from '../../../lib/database/tools.mjs';

export default function DatabaseDashboard() {
  const [summaries, setSummaries] = useState({});
  useEffect(() => {
    try { setSummaries(JSON.parse(sessionStorage.getItem(SUMMARY_KEY) || '{}')); } catch { /* Optional tab-local summaries. */ }
  }, []);
  return <DatabasePage title="Database Dashboard">
    <p className={styles.intro}>Inspect catalog quality, database access, and publication history. Open a tool to run a read-only check or browse activity.</p>
    <div className={styles.status}>Scan summaries reflect the last run in this browser tab. They are not live health indicators; rerun a check after catalog or configuration changes.</div>
    <div className={styles.grid}>{DATABASE_TOOLS.map((tool) => {
      const summary = summaries[tool.id];
      return <section className={styles.card} key={tool.id}>
        <h2><Link href={`/tools/database/${tool.id}`}><a>{tool.title}</a></Link></h2>
        <p>{tool.description}</p>
        {!summary ? <p className={styles.muted}>{['history', 'monitoring'].includes(tool.id) ? 'Not loaded' : 'Not checked'}</p> : <>
          <p>{summary.status === 'failed' ? 'Last attempt failed' : summary.status === 'viewed' ? `${summary.count} records loaded` : Object.values(summary.counts).some(Boolean) ? 'Findings to review' : 'No findings detected'}</p>
          {summary.counts && <p>{Object.entries(summary.counts).map(([severity, count]) => <span key={severity} className={`${styles.badge} ${styles[severity]}`}>{count} {severity}</span>)}</p>}
          <p className={styles.muted}>{displayTime(summary.checkedAt)}</p>
        </>}
      </section>;
    })}</div>
  </DatabasePage>;
}
