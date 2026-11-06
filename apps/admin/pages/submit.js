import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';

const OP = { create: ['New product','create'], update: ['Product update','update'], delete: ['Product removal','delete'] };
const LABELS = { hidden:'Visibility', image:'Product image', slug:'Page address', description:'Description', Sizes:'Sizes and pricing', Components:'Components' };
const nameOf = (item) => item.afterLegacy?.['Cigar Name'] || item.afterLegacy?.['Tobacco Name'] || item.beforeLegacy?.['Cigar Name'] || item.beforeLegacy?.['Tobacco Name'] || 'Untitled product';
const typeOf = (item) => (item.afterLegacy?.['Cigar Name'] || item.beforeLegacy?.['Cigar Name']) ? 'Cigar' : 'Pipe tobacco';
const fieldLabel = (key) => LABELS[key] || key.replaceAll('_',' ');
const changesOf = (item) => {
  const before=item.beforeLegacy||{}, after=item.afterLegacy||{};
  return [...new Set([...Object.keys(before),...Object.keys(after)])]
    .filter((key)=>JSON.stringify(before[key])!==JSON.stringify(after[key]))
    .map((key)=>({key,before:before[key],after:after[key]}));
};

function Value({ field, value }) {
  if (field === 'Sizes') return value?.length ? <ul className="sizes">{value.map((size,index)=><li key={`${size.Size}-${size.Barcode||index}`}><strong>{size.Size||'Unnamed size'}</strong>{size.Price!=null&&<span>${size.Price}</span>}<span>{size.In_Stock?'In stock':'Out of stock'}</span>{size.Barcode&&<small className="barcode">Barcode {size.Barcode}</small>}</li>)}</ul> : <em>None</em>;
  if (field === 'Components') return value?.length ? <div className="chips">{value.map((part)=><span key={part}>{part}</span>)}</div> : <em>None</em>;
  if (field === 'hidden') return value ? 'Hidden from customers' : 'Visible to customers';
  if (field === 'image' && value) return <a href={value} target="_blank" rel="noreferrer">View image</a>;
  if (value===null || value===undefined || value==='') return <em>Not set</em>;
  if (typeof value==='boolean') return value?'Yes':'No';
  if (Array.isArray(value)) return value.join(', ')||<em>None</em>;
  return String(value);
}

function FieldChange({ change, operation }) {
  if (operation==='create') return <div className="field-row"><dt>{fieldLabel(change.key)}</dt><dd><Value field={change.key} value={change.after}/></dd></div>;
  return <div className="field-row"><dt>{fieldLabel(change.key)}</dt><dd className="value-change"><div><Value field={change.key} value={change.before}/></div><div className="after"><Value field={change.key} value={change.after}/></div></dd></div>;
}

function ChangeCard({ item, busy, onRemove }) {
  const [operation,tone]=OP[item.operation]||OP.update;
  const allChanges=changesOf(item);
  const changes=item.operation==='create'?allChanges.filter(({after})=>after!==null&&after!==''&&(!Array.isArray(after)||after.length)):allChanges;
  return <article className={`change-card ${tone}`}>
    <header><div><div className="eyebrow"><span>{operation}</span> {typeOf(item)}</div><h2>{nameOf(item)}</h2><p>{item.operation==='delete'?'This product and its catalog page will be permanently removed.':`${changes.length} field${changes.length===1?'':'s'} ${item.operation==='create'?'will be set':'changed'}.`}</p></div><div className="card-actions">{item.operation==='create'&&<Link href={`/${item.payload.type==='cigar'?'cigars':'tobacco'}/draft/${item.id}`}><a className="edit-link">Edit staged product</a></Link>}<button disabled={busy} onClick={()=>onRemove(item.id)}>Remove from draft</button></div></header>
    {item.operation==='delete'?<div className="delete-warning"><strong>Will be deleted:</strong> {item.beforeLegacy?.slug||item.draftKey}</div>:<>{item.operation==='update'&&<div className="change-columns" aria-hidden="true"><span/><span>Before</span><span>After</span></div>}<dl>{changes.map((change)=><FieldChange key={change.key} change={change} operation={item.operation}/>)}</dl></>}
    <details><summary>Technical details</summary><div className="meta"><span>Operation: {item.operation}</span><span>Product ID: {item.productId||item.draftKey}</span><span>Base version: {item.baseVersion??'New product'}</span></div><div className="json-grid"><section><h3>Before JSON</h3><pre>{JSON.stringify(item.beforeLegacy,null,2)}</pre></section><section><h3>After JSON</h3><pre>{JSON.stringify(item.afterLegacy,null,2)}</pre></section></div></details>
  </article>;
}

export default function SubmitPage(){
  const [draft,setDraft]=useState(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState('');
  async function load(){const response=await fetch('/api/catalog/draft');const result=await response.json();setDraft(result.draft);setMessage(result.draft?.message||'Catalog changes');setLoading(false);}
  useEffect(()=>{load();},[]);
  const totals=useMemo(()=>(draft?.items||[]).reduce((sum,item)=>({...sum,[item.operation]:sum[item.operation]+1}),{create:0,update:0,delete:0}),[draft]);
  async function remove(id){await fetch(`/api/catalog/draft?item=${encodeURIComponent(id)}`,{method:'DELETE'});await load();}
  async function discard(){if(!confirm('Discard every staged change? This cannot be undone.'))return;await fetch('/api/catalog/draft',{method:'DELETE'});await load();}
  async function publish(){if(!confirm(`Publish ${draft.items.length} staged change(s)?`))return;setBusy(true);setError('');await fetch('/api/catalog/draft',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});const response=await fetch('/api/catalog/publish',{method:'POST'});const result=await response.json();if(!response.ok){setError(result.conflicts?.length?`Conflict: ${result.conflicts.map((item)=>item.slug||item.productId).join(', ')}`:result.message);setBusy(false);return;}await load();setBusy(false);alert(`Published ${result.itemCount} change(s).`);}
  const hasItems=Boolean(draft?.items?.length);
  return <Layout><div className="submit-page"><PageTitle1 subtitle="Review exactly what will change before publishing">Publish changes</PageTitle1>
    {loading?<div className="empty">Loading draft…</div>:!hasItems?<div className="empty"><h2>Your draft is empty</h2><p>Add, edit, hide, or delete a cigar or tobacco product to stage a change.</p></div>:<main className="review">
      <section className="summary" aria-label="Publication summary"><div className="total"><strong>{draft.items.length}</strong><span>total change{draft.items.length===1?'':'s'}</span></div><div className="counts"><span><i className="green"/>{totals.create} new</span><span><i className="amber"/>{totals.update} updated</span><span><i className="red"/>{totals.delete} deleted</span></div><p>All changes publish together. If any product has changed since this draft was created, nothing will be published.</p></section>
      {error&&<div className="error" role="alert"><strong>Publication stopped.</strong> {error}</div>}
      <div className="cards">{draft.items.map((item)=><ChangeCard key={item.id} item={item} busy={busy} onRemove={remove}/>)}</div>
      <section className="publish-panel"><div className="message"><label htmlFor="publication-message">Publication note</label><p>Describe this group of changes for the audit history.</p><input id="publication-message" value={message} onChange={(event)=>setMessage(event.target.value)}/></div><div className="actions"><button disabled={busy} onClick={discard}>Discard entire draft</button><button className="publish" disabled={busy} onClick={publish}>{busy?'Publishing…':`Publish ${draft.items.length} change${draft.items.length===1?'':'s'}`}</button></div></section>
    </main>}
    <style jsx global>{`
      .review{max-width:1100px;margin:0 auto 4rem;color:#2b2118}.summary{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:2rem;padding:1.25rem 1.5rem;margin:1rem 0 1.5rem;border:1px solid #d8c8ae;border-radius:12px;background:#fffaf0}.summary p{margin:0;color:#62564a}.total{display:flex;flex-direction:column}.total strong{font-size:2rem;line-height:1;color:#6f361f}.counts{display:flex;flex-wrap:wrap;gap:.8rem}.counts span{display:flex;align-items:center;gap:.35rem;white-space:nowrap}.counts i{width:.65rem;height:.65rem;border-radius:50%}.green{background:#2d7a4b}.amber{background:#b16d12}.red{background:#a53d36}.cards{display:grid;gap:1rem}.change-card{overflow:hidden;border:1px solid #d8c8ae;border-left:5px solid #b16d12;border-radius:10px;background:#fff;box-shadow:0 2px 7px #37231314}.change-card.create{border-left-color:#2d7a4b}.change-card.delete{border-left-color:#a53d36}.change-card>header{display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 1.35rem;background:#fffaf4}.change-card h2{margin:.35rem 0 .2rem;font-size:1.35rem}.change-card header p{margin:0;color:#6c6259}.eyebrow{color:#756a61;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em}.eyebrow span{display:inline-block;margin-right:.65rem;padding:.25rem .5rem;border-radius:999px;color:#7a4705;background:#f8e3bf;font-weight:800}.create .eyebrow span{color:#1f6039;background:#d9efdf}.delete .eyebrow span{color:#812e29;background:#f7d9d6}.change-card button,.actions button{border:1px solid #a99a87;border-radius:6px;padding:.55rem .8rem;background:transparent;color:#5d5146;font-weight:700;cursor:pointer}.change-card header button{align-self:flex-start;white-space:nowrap}.change-card dl{margin:0}.field-row{display:grid;grid-template-columns:minmax(150px,22%) 1fr;border-top:1px solid #eee5da}.field-row dt,.field-row dd{padding:1rem 1.35rem}.field-row dt{font-weight:700;color:#54483e}.field-row dd{margin:0;min-width:0;overflow-wrap:anywhere}.value-change{display:grid;grid-template-columns:1fr auto 1fr;gap:1rem}.value-change>div{display:flex;flex-direction:column;min-width:0}.value-change small{margin-bottom:.25rem;color:#8a7e73;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.value-change>b{align-self:center;color:#aa7b42;font-size:1.2rem}.value-change .after{font-weight:600}.field-row em{color:#978b80;font-weight:400}.chips{display:flex;flex-wrap:wrap;gap:.35rem}.chips span{border-radius:999px;padding:.2rem .55rem;background:#eee5d7}.sizes{display:grid;gap:.4rem;margin:0;padding:0;list-style:none}.sizes li{display:flex;flex-wrap:wrap;gap:.35rem .7rem;padding:.45rem .55rem;border-radius:5px;background:#f5efe6}.sizes small{flex-basis:100%;color:#756a61}.delete-warning{margin:1rem 1.35rem;padding:1rem;border-radius:6px;color:#782d28;background:#fff0ee}.change-card details{border-top:1px solid #ded4c7;background:#f7f3ed}.change-card summary{padding:.85rem 1.35rem;cursor:pointer;color:#5d5146;font-weight:700}.meta{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;padding:0 1.35rem .9rem;color:#756a61;font:.8rem monospace}.json-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#d8cfc4;border-top:1px solid #d8cfc4}.json-grid section{min-width:0;padding:1rem;background:#292623;color:#f5eadb}.json-grid h3{margin:0 0 .6rem;color:#e8c995;font-size:.85rem}.json-grid pre{max-height:28rem;overflow:auto;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:.76rem}.publish-panel{position:sticky;bottom:1rem;display:flex;align-items:end;justify-content:space-between;gap:2rem;margin-top:1.5rem;padding:1.2rem 1.35rem;border:1px solid #bda98c;border-radius:10px;background:#fffaf0fa;box-shadow:0 5px 22px #3723132e}.message{flex:1}.message label{display:block;font-weight:800}.message p{margin:.15rem 0 .55rem;color:#70645a;font-size:.88rem}.message input{width:100%;max-width:35rem;border:1px solid #a99a87;border-radius:5px;padding:.65rem;background:#fff}.actions{display:flex;gap:.7rem}.actions .publish{border:0;padding:.72rem 1.1rem;background:#70381f;color:#fff8eb}.actions .publish:hover{background:#562915}button:disabled{cursor:wait;opacity:.6}.error{margin-bottom:1rem;padding:1rem;border:1px solid #c66d64;border-radius:7px;color:#782d28;background:#fff0ee}.empty{max-width:650px;margin:2rem auto;padding:2rem;border:1px dashed #b9a68c;border-radius:10px;text-align:center;background:#fffaf0}.empty h2{margin-top:0}@media(max-width:760px){.summary{grid-template-columns:1fr;gap:.8rem}.change-card>header,.publish-panel{align-items:stretch;flex-direction:column}.field-row{grid-template-columns:1fr}.field-row dt{padding-bottom:.2rem}.value-change,.json-grid{grid-template-columns:1fr}.value-change>b{transform:rotate(90deg)}.publish-panel{position:static}.actions{flex-direction:column-reverse}}
    `}</style>
    <style jsx global>{`
      /* Restrained admin treatment: hierarchy comes from type, spacing, and
         fine rules; color is reserved for operation meaning and actions. */
      .submit-page, .submit-page h1, .submit-page h2, .submit-page h3,
      .submit-page button, .submit-page input, .submit-page summary {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .review { max-width: 980px; color: #292724; }
      .summary {
        grid-template-columns: auto auto 1fr;
        gap: 1.5rem;
        padding: 1rem 1.1rem;
        margin-bottom: 1.25rem;
        border: 1px solid #ddd9d3;
        border-radius: 4px;
        background: #f7f6f4;
      }
      .total strong { font-size: 1.6rem; color: #292724; }
      .total span, .summary p, .counts { color: #69655f; font-size: .88rem; }
      .counts i { width: .5rem; height: .5rem; opacity: 1; }
      .counts .green { background: #27824d; }
      .counts .amber { background: #3974ad; }
      .counts .red { background: #bd433b; }
      .cards { gap: .75rem; }
      .change-card {
        border-color: #d9d6d1;
        border-left: 1px solid #d9d6d1;
        border-radius: 5px;
        box-shadow: none;
      }
      .change-card.create, .change-card.delete { border-left-color: #d9d6d1; }
      .change-card > header { padding: .9rem 1rem; background: #fff; }
      .change-card h2 { margin-top: .25rem; font-size: 1.15rem; }
      .change-card header p { font-size: .88rem; }
      .eyebrow { font-size: .7rem; letter-spacing: .05em; }
      .eyebrow span,
      .create .eyebrow span,
      .delete .eyebrow span {
        margin-right: .45rem;
        padding: 0;
        color: #5f5a54;
        background: transparent;
        font-weight: 700;
      }
      .change-card button, .actions button {
        border-color: #c8c4be;
        border-radius: 4px;
        padding: .45rem .7rem;
        color: #595550;
        font-size: .82rem;
        font-weight: 600;
      }
      .card-actions { display: flex; align-items: center; align-self: flex-start; gap: .5rem; }
      .edit-link {
        border: 1px solid #c8c4be;
        border-radius: 4px;
        padding: .45rem .7rem;
        color: #494540;
        font-size: .82rem;
        font-weight: 600;
        white-space: nowrap;
      }
      .edit-link:hover { background: #f1efec; }
      .change-card button:hover, .actions button:hover { background: #f1efec; }
      .field-row { border-top-color: #e7e4df; }
      .field-row dt, .field-row dd { padding: .7rem 1rem; }
      .field-row dt { color: #4f4b46; font-size: .88rem; }
      .value-change { grid-template-columns: 1fr 1fr; gap: 1.25rem; }
      .change-columns {
        display: grid;
        grid-template-columns: minmax(150px, 22%) 1fr 1fr;
        gap: .625rem;
        padding: .5rem 1rem;
        border-top: 1px solid #e7e4df;
        background: #fafafa;
        color: #77726c;
        font-size: .7rem;
        font-weight: 700;
        letter-spacing: .05em;
        text-transform: uppercase;
      }
      .chips span, .sizes li { border-radius: 3px; background: #f2f0ed; }
      .barcode { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
      .delete-warning { margin: .8rem 1.1rem; padding: .75rem; border-radius: 3px; background: #faf3f2; }
      .change-card details { border-top-color: #dedbd6; background: #faf9f7; }
      .change-card summary { padding: .7rem 1.1rem; color: #69655f; font-size: .82rem; font-weight: 600; }
      .meta { padding: 0 1.1rem .75rem; color: #77726c; }
      .json-grid { border-top-color: #dedbd6; background: #dedbd6; }
      .json-grid section { background: #f5f4f2; color: #35322f; }
      .json-grid h3 { color: #625d57; }
      .publish-panel {
        position: static;
        gap: 1.5rem;
        margin-top: 1.25rem;
        padding: 1rem 1.1rem;
        border-color: #d0ccc6;
        border-radius: 5px;
        background: #fff;
        box-shadow: none;
      }
      .message label { font-size: .9rem; }
      .message p { color: #77726c; font-size: .8rem; }
      .message input { border-color: #c8c4be; border-radius: 4px; }
      .actions .publish { padding: .62rem .9rem; background: #4b4038; color: #fff; }
      .actions .publish:hover { background: #372f2a; }
      .error { border-radius: 4px; background: #faf3f2; }
      .empty { border-color: #d0ccc6; border-radius: 5px; background: #f7f6f4; }
      @media(max-width:760px) {
        .change-columns { grid-template-columns: 1fr 1fr; padding-left: 1rem; }
        .change-columns span:first-child { display: none; }
        .card-actions { align-self: stretch; flex-wrap: wrap; }
      }
    `}</style></div>
  </Layout>;
}
