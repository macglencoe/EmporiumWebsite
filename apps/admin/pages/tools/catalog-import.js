import { useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '../../components/layout';
import PageTitle1 from '../../components/pagetitle1';

const typeLabel = (type) => type === 'cigar' ? 'Cigars' : 'Pipe tobacco';

function downloadBackup(rows, type) {
  const blob = new Blob([`${JSON.stringify(rows, null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `emporium-${type}-before-import-${new Date().toISOString().replaceAll(':', '')}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function CatalogImportPage() {
  const router = useRouter();
  const [type, setType] = useState('cigar');
  const [mode, setMode] = useState('merge');
  const [rows, setRows] = useState(null);
  const [filename, setFilename] = useState('');
  const [preview, setPreview] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function request(destination) {
    setBusy(true); setMessage('');
    const response = await fetch('/api/catalog/import', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, mode, rows, destination, confirmation }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(result.message || result.errors?.slice(0, 3).map((error) => error.message).join(' ') || 'Import failed.'); return null; }
    if (destination === 'preview') setPreview(result);
    return result;
  }

  async function readFile(event) {
    const file = event.target.files?.[0];
    setPreview(null); setMessage(''); setFilename(file?.name || '');
    if (!file) { setRows(null); return; }
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error('The file must contain a JSON array.');
      setRows(parsed);
    } catch (error) { setRows(null); setMessage(error.message); }
  }

  async function apply(destination) {
    if (destination === 'direct') downloadBackup(preview.backup, type);
    const result = await request(destination);
    if (!result) return;
    if (destination === 'draft') await router.push('/submit');
    else { setPreview(null); setRows(null); setFilename(''); setConfirmation(''); setMessage('Import published successfully.'); }
  }

  return <Layout>
    <PageTitle1 subtitle="Validate and apply a legacy catalog JSON array">Catalog JSON import</PageTitle1>
    <div className="import-page">
      <section className="panel form">
        <label>Catalog
          <select value={type} onChange={(event) => { setType(event.target.value); setPreview(null); }}>
            <option value="cigar">Cigars</option><option value="tobacco">Pipe tobacco</option>
          </select>
        </label>
        <label>Import behavior
          <select value={mode} onChange={(event) => { setMode(event.target.value); setPreview(null); }}>
            <option value="merge">Merge — do not delete omitted products</option>
            <option value="replace">Replace — delete products omitted from this file</option>
          </select>
        </label>
        <label>JSON file<input type="file" accept="application/json,.json" onChange={readFile}/></label>
        {filename && <span className="file">{filename} · {rows?.length ?? 0} records</span>}
        <button disabled={!rows || busy} onClick={() => request('preview')}>{busy ? 'Working…' : 'Validate and preview'}</button>
        {message && <p className="message" role="alert">{message}</p>}
      </section>

      {preview && <section className="panel preview">
        <h2>Import preview</h2>
        <div className="counts">
          <span><b>{preview.counts.create}</b> create</span><span><b>{preview.counts.update}</b> update</span><span><b>{preview.counts.delete}</b> delete</span>
        </div>
        <p>{preview.uploadedCount} uploaded; {preview.currentCount} currently in {typeLabel(type).toLowerCase()}.</p>
        {preview.warnings.length > 0 && <p className="warning">{preview.warnings.length} validation warning(s). Review the source file before continuing.</p>}
        <div className="change-list">
          {preview.preview.length ? preview.preview.map((item) => <div key={`${item.operation}-${item.slug}`}><b>{item.operation}</b> {item.name} <small>{item.slug}</small></div>) : <p>No database changes.</p>}
        </div>
        <div className="actions">
          <button disabled={busy || !preview.preview.length} onClick={() => apply('draft')}>Save as draft</button>
          <div className="direct">
            <label>Type <b>YEET {type === 'cigar' ? 'CIGARS' : 'TOBACCO'}</b> for direct import
              <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
            </label>
            <button className="danger" disabled={busy || !preview.preview.length || confirmation !== `YEET ${type === 'cigar' ? 'CIGARS' : 'TOBACCO'}`} onClick={() => apply('direct')}>Direct import</button>
          </div>
        </div>
      </section>}
    </div>
    <style jsx>{`
      .import-page{width:min(100%,1000px);margin:0 auto;padding:1.5rem;display:grid;gap:1rem;color:#2b2118}.panel{padding:1.25rem;border:1px solid #d8c8ae;border-radius:8px;background:#fff}.form{display:grid;gap:1rem}.form label,.direct label{display:grid;gap:.35rem;font-weight:700}select,input[type=file],.direct input{padding:.6rem;border:1px solid #a99a87;background:#fff}button{width:max-content;padding:.65rem 1rem;border-radius:5px;background:#6f361f;color:#fff;font-weight:700;cursor:pointer}button:disabled{cursor:not-allowed;opacity:.5}.file{font-size:.9rem;color:#62564a}.message,.warning{padding:.7rem;border-left:4px solid #a53d36;background:#fff1ef}.preview h2{margin-top:0}.counts{display:flex;gap:1rem;flex-wrap:wrap}.counts span{padding:.6rem .8rem;background:#f7efe3}.change-list{max-height:320px;overflow:auto;border:1px solid #e0d6c7}.change-list div,.change-list p{padding:.55rem .7rem;margin:0;border-bottom:1px solid #eee}.change-list b{text-transform:uppercase;font-size:.75rem;margin-right:.4rem}.change-list small{color:#766b60}.actions{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-top:1rem}.direct{display:flex;align-items:flex-end;gap:.6rem}.danger{background:#8c251f}@media(max-width:700px){.actions,.direct{align-items:stretch;flex-direction:column}.actions button,.direct button{width:100%}}
    `}</style>
  </Layout>;
}
