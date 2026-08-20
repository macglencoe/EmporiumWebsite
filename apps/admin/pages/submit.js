import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';

const label = (item) => item.afterLegacy?.['Cigar Name'] || item.afterLegacy?.['Tobacco Name'] || item.beforeLegacy?.['Cigar Name'] || item.beforeLegacy?.['Tobacco Name'] || item.draftKey;

export default function SubmitPage() {
  const [draft,setDraft]=useState(null); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  async function load(){const response=await fetch('/api/catalog/draft');const result=await response.json();setDraft(result.draft);setMessage(result.draft?.message || 'Catalog changes');}
  useEffect(()=>{load();},[]);
  async function remove(id){await fetch(`/api/catalog/draft?item=${encodeURIComponent(id)}`,{method:'DELETE'});await load();}
  async function discard(){if(!confirm('Discard every staged change?'))return;await fetch('/api/catalog/draft',{method:'DELETE'});await load();}
  async function publish(){if(!confirm(`Publish ${draft.items.length} staged change(s)?`))return;setBusy(true);setError('');await fetch('/api/catalog/draft',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});const response=await fetch('/api/catalog/publish',{method:'POST'});const result=await response.json();if(!response.ok){setError(result.conflicts?.length ? `Conflict: ${result.conflicts.map((item)=>item.slug || item.productId).join(', ')}` : result.message);setBusy(false);return;}await load();setBusy(false);alert(`Published ${result.itemCount} change(s).`);}
  return <Layout><PageTitle1 subtitle="Database-backed draft review">Publish changes</PageTitle1>{!draft?.items?.length?<p>No changes are currently staged.</p>:<><label>Publication message<input value={message} onChange={(event)=>setMessage(event.target.value)} /></label>{error&&<p role="alert">{error}</p>}<div>{draft.items.map((item)=><article key={item.id} style={{border:'1px solid #999',padding:12,margin:'12px 0'}}><h2>{item.operation.toUpperCase()}: {label(item)}</h2><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><section><h3>Before</h3><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(item.beforeLegacy,null,2)}</pre></section><section><h3>After</h3><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(item.afterLegacy,null,2)}</pre></section></div><button onClick={()=>remove(item.id)}>Remove from draft</button></article>)}</div><div style={{display:'flex',gap:12}}><button disabled={busy} onClick={publish}>{busy?'Publishing…':'Publish atomically'}</button><button disabled={busy} onClick={discard}>Discard draft</button></div></>}</Layout>;
}
