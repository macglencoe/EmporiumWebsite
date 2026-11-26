import { useEffect, useState } from 'react';
import Link from 'next/link';

import { DatabasePage, displayTime, downloadReport, styles } from '../../../components/databaseTools';
import { AUDIT_ACTIONS, rememberScan } from '../../../lib/database/tools.mjs';

const json = (value) => JSON.stringify(value, null, 2);

function EventChanges({ event }) {
  const before = event.before || {};
  const after = event.after || {};
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((key) => json(before[key]) !== json(after[key]));
  return <details><summary>Compare before and after ({changed.length} changed fields)</summary>
    {changed.length > 0 && <div className={styles.tableWrap}><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>{changed.map((key) => <tr key={key}><th scope="row">{key}</th><td><pre>{json(before[key]) ?? 'Not present'}</pre></td><td><pre>{json(after[key]) ?? 'Not present'}</pre></td></tr>)}</tbody></table></div>}
    <details><summary>Full stored snapshots</summary><div className={styles.comparison}><section><h3>Before</h3><pre>{json(event.before)}</pre></section><section><h3>After</h3><pre>{json(event.after)}</pre></section></div></details>
  </details>;
}

export default function DatabaseHistory() {
  const [action, setAction] = useState('');
  const [search, setSearch] = useState('');
  const [request, setRequest] = useState({ action: '', search: '', cursor: null });
  const [events, setEvents] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [checkedAt, setCheckedAt] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true); setError('');
    if (!request.cursor) { setEvents([]); setNextCursor(null); setCheckedAt(null); }
    async function load() {
      try {
        const params = new URLSearchParams({ action: request.action, search: request.search });
        if (request.cursor) params.set('cursor', request.cursor);
        const response = await fetch(`/api/tools/database/history/?${params}`, { signal: controller.signal });
        if (response.status === 401) throw new Error('Your session has expired. Sign in again to browse history.');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'History could not be loaded.');
        if (controller.signal.aborted) return;
        setEvents((previous) => request.cursor ? [...previous, ...data.events] : data.events);
        setNextCursor(data.nextCursor); setCheckedAt(data.checkedAt);
        rememberScan('history', { status: 'viewed', checkedAt: data.checkedAt, count: data.events.length });
      } catch (failure) {
        if (controller.signal.aborted) return;
        setError(failure.message); rememberScan('history', { status: 'failed', checkedAt: new Date().toISOString() });
      } finally { if (!controller.signal.aborted) setBusy(false); }
    }
    load();
    return () => controller.abort();
  }, [request]);
  return <DatabasePage title="Change History" active="history">
    <p className={styles.intro}>Browse recorded publications and product changes. Deleted products retain their stored identity and snapshots. Imports and changes made outside the publishing workflow may have no audit event.</p>
    <form className={styles.toolbar} onSubmit={(event) => { event.preventDefault(); setRequest({ action, search, cursor: null }); }}>
      <label>Action<select value={action} onChange={(event) => setAction(event.target.value)}><option value="">All actions</option>{AUDIT_ACTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Product or publication<input value={search} onChange={(event) => setSearch(event.target.value)} maxLength={160} placeholder="Name, slug, ID, or publication note" /></label>
      <button type="submit" disabled={busy} className={styles.primary}>Load history</button>
      {events.length > 0 && <button type="button" onClick={() => downloadReport('database-history.json', json({ checkedAt, filters: { action: request.action, search: request.search }, events }), 'application/json')}>Download loaded events</button>}
    </form>
    {error && <div className={`${styles.status} ${styles.failure}`} role="alert">{error} <button onClick={() => setRequest({ ...request })}>Retry</button></div>}
    {busy && <p role="status">Loading history…</p>}
    {checkedAt && <p className={styles.muted}>{events.length} events loaded · Retrieved {displayTime(checkedAt)}. New changes appear when you reload history.</p>}
    {!busy && !error && !events.length && <p className={styles.status}>No recorded events match these filters.</p>}
    <div className={styles.list}>{events.map((event) => {
      const section = { cigar: 'cigars', tobacco: 'tobacco' }[event.product_type];
      return <article className={styles.card} key={event.id}>
        <span className={styles.badge}>{event.action}</span><time dateTime={event.created_at}>{displayTime(event.created_at)}</time>
        <h2>{event.product_name || (event.action === 'publish' ? 'Publication' : 'Product event')}</h2>
        {section && event.product_slug && event.product_id && <Link href={`/${section}/${encodeURIComponent(event.product_slug)}`}><a>Open product</a></Link>}
        <p className={styles.muted}>Actor: {event.actor} · Product: {event.product_slug || '—'} · ID: {event.product_id || event.before?.id || event.after?.id || '—'}</p>
        {event.change_set_id && <p>Publication: {event.message || 'No note'} <small className={styles.identifier}>{event.change_set_id} · {event.publication_status || 'Unavailable'}</small></p>}
        <EventChanges event={event} />
      </article>;
    })}</div>
    {nextCursor && <button disabled={busy} onClick={() => setRequest({ ...request, cursor: nextCursor })}>Load older events</button>}
  </DatabasePage>;
}
