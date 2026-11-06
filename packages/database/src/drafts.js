import { randomUUID } from 'node:crypto';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { and, asc, desc, eq } from 'drizzle-orm';
import ws from 'ws';

import { productSchema } from '@emporium/domain';

import { changeSetItems, changeSets } from './schema/index.js';

neonConfig.webSocketConstructor ??= ws;

export class PublishConflictError extends Error {
  constructor(conflicts) { super('One or more products changed after this draft was saved'); this.name = 'PublishConflictError'; this.conflicts = conflicts; }
}

export async function getActiveDraft(database, { create = false } = {}) {
  let [draft] = await database.select().from(changeSets).where(eq(changeSets.status, 'draft')).orderBy(desc(changeSets.updatedAt)).limit(1);
  if (!draft && create) {
    try { [draft] = await database.insert(changeSets).values({ message: 'Catalog changes' }).returning(); }
    catch { [draft] = await database.select().from(changeSets).where(eq(changeSets.status, 'draft')).limit(1); }
  }
  if (!draft) return null;
  const items = await database.select().from(changeSetItems).where(eq(changeSetItems.changeSetId, draft.id)).orderBy(asc(changeSetItems.createdAt));
  return { ...draft, items };
}

export async function stageDraftItem(database, item) {
  const draft = await getActiveDraft(database, { create: true });
  const payload = item.payload === null ? null : productSchema.parse(item.payload);
  const draftKey = item.draftKey || item.productId || payload?.id;
  if (!draftKey) throw new Error('A stable draft key is required');
  const values = {
    id: item.id || randomUUID(), changeSetId: draft.id, draftKey,
    productId: item.operation === 'create' ? null : item.productId,
    operation: item.operation, baseVersion: item.operation === 'create' ? null : item.baseVersion,
    payload,
  };
  const [saved] = await database.insert(changeSetItems).values(values).onConflictDoUpdate({
    target: [changeSetItems.changeSetId, changeSetItems.draftKey],
    set: { productId: values.productId, operation: values.operation, baseVersion: values.baseVersion, payload: values.payload, updatedAt: new Date() },
  }).returning();
  await database.update(changeSets).set({ updatedAt: new Date() }).where(eq(changeSets.id, draft.id));
  return saved;
}

export async function removeDraftItem(database, itemId) {
  await database.delete(changeSetItems).where(eq(changeSetItems.id, itemId));
}

export async function updateDraftMessage(database, message) {
  const draft = await getActiveDraft(database, { create: true });
  await database.update(changeSets).set({ message: message?.trim() || null, updatedAt: new Date() }).where(eq(changeSets.id, draft.id));
}

export async function discardActiveDraft(database) {
  const draft = await getActiveDraft(database);
  if (draft) await database.update(changeSets).set({ status: 'discarded', updatedAt: new Date() }).where(and(eq(changeSets.id, draft.id), eq(changeSets.status, 'draft')));
}

const mapProductRow = async (client, id) => {
  const { rows: baseRows } = await client.query('select * from products where id = $1', [id]);
  const row = baseRows[0]; if (!row) return null;
  const common = { id: row.id, type: row.type, slug: row.slug, name: row.name, brand: row.brand, description: row.description, imageUrl: row.image_url, hidden: row.hidden, published: row.published, dateAdded: row.date_added, version: row.version, createdAt: row.created_at?.toISOString?.() ?? row.created_at, updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at, publishedAt: row.published_at?.toISOString?.() ?? row.published_at };
  if (row.type === 'cigar') {
    const [{ rows: details }, { rows: variants }] = await Promise.all([client.query('select * from cigar_details where product_id = $1', [id]), client.query('select * from cigar_variants where product_id = $1 order by sort_order', [id])]);
    const d = details[0]; return { ...common, details: { wrapper: d.wrapper, binder: d.binder, filler: d.filler, flavorProfile: d.flavor_profile, strength: d.strength, podcastLink: d.podcast_link, featured: { edsPick: d.eds_pick_at, tedsPick: d.teds_pick_at, stickFigures: d.stick_figures_at } }, variants: variants.map((v) => ({ id: v.id, size: v.size, barcode: v.barcode, inStock: v.in_stock, price: v.price === null ? null : Number(v.price).toFixed(2) })) };
  }
  if (row.type === 'tobacco') { const [{ rows: details }, { rows: components }] = await Promise.all([client.query('select * from tobacco_details where product_id = $1', [id]), client.query('select * from tobacco_components where product_id = $1 order by sort_order', [id])]); return { ...common, details: { family: details[0].family, saleForm: details[0].sale_form, components: components.map((c) => c.component) } }; }
  if (row.type === 'pipe') { const { rows } = await client.query('select * from pipe_details where product_id = $1', [id]); return { ...common, details: { material: rows[0].material, pipeType: rows[0].pipe_type } }; }
  const { rows } = await client.query('select * from caffeine_details where product_id = $1', [id]); return { ...common, details: { roast: rows[0].roast, origin: rows[0].origin, caffeineType: rows[0].type } };
};

async function replaceChildren(client, product) {
  const id = product.id;
  await client.query('delete from product_images where product_id=$1', [id]);
  await client.query('delete from cigar_details where product_id=$1', [id]); await client.query('delete from cigar_variants where product_id=$1', [id]);
  await client.query('delete from tobacco_details where product_id=$1', [id]); await client.query('delete from tobacco_components where product_id=$1', [id]);
  await client.query('delete from pipe_details where product_id=$1', [id]); await client.query('delete from caffeine_details where product_id=$1', [id]);
  if (product.imageUrl) await client.query('insert into product_images(product_id,url,alt_text,sort_order,is_primary) values($1,$2,$3,0,true)', [id, product.imageUrl, product.name]);
  if (product.type === 'cigar') {
    const d = product.details; await client.query('insert into cigar_details(product_id,wrapper,binder,filler,flavor_profile,strength,podcast_link,eds_pick_at,teds_pick_at,stick_figures_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [id,d.wrapper,d.binder,d.filler,d.flavorProfile,d.strength,d.podcastLink,d.featured.edsPick,d.featured.tedsPick,d.featured.stickFigures]);
    for (const [sortOrder, v] of product.variants.entries()) await client.query('insert into cigar_variants(id,product_id,size,barcode,in_stock,price,sort_order) values($1,$2,$3,$4,$5,$6,$7)', [v.id,id,v.size,v.barcode,v.inStock,v.price,sortOrder]);
  } else if (product.type === 'tobacco') {
    await client.query('insert into tobacco_details(product_id,family,sale_form) values($1,$2,$3)', [id,product.details.family,product.details.saleForm]);
    for (const [sortOrder, component] of product.details.components.entries()) await client.query('insert into tobacco_components(product_id,component,sort_order) values($1,$2,$3)', [id,component,sortOrder]);
  } else if (product.type === 'pipe') await client.query('insert into pipe_details(product_id,material,pipe_type) values($1,$2,$3)', [id,product.details.material,product.details.pipeType]);
  else await client.query('insert into caffeine_details(product_id,roast,origin,type) values($1,$2,$3,$4)', [id,product.details.roast,product.details.origin,product.details.caffeineType]);
}

async function writeProduct(client, product, operation) {
  if (operation === 'create') await client.query('insert into products(id,type,slug,name,brand,description,image_url,hidden,published,date_added,version,published_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,1,case when $9 then now() else null end)', [product.id,product.type,product.slug,product.name,product.brand,product.description,product.imageUrl,product.hidden,product.published,product.dateAdded]);
  else await client.query('update products set slug=$2,name=$3,brand=$4,description=$5,image_url=$6,hidden=$7,published=$8,date_added=$9,version=version+1,updated_at=now(),published_at=case when $8 then coalesce(published_at,now()) else null end where id=$1', [product.id,product.slug,product.name,product.brand,product.description,product.imageUrl,product.hidden,product.published,product.dateAdded]);
  await replaceChildren(client, product);
}

export async function publishDraft(connectionString, changeSetId) {
  const pool = new Pool({ connectionString }); const client = await pool.connect();
  const imageChanges = [];
  const publicChanges = [];
  try {
    await client.query('begin');
    const { rows: drafts } = await client.query("select * from change_sets where id=$1 and status='draft' for update", [changeSetId]);
    if (!drafts[0]) throw new Error('Draft is no longer available');
    const { rows: items } = await client.query('select * from change_set_items where change_set_id=$1 order by created_at for update', [changeSetId]);
    if (!items.length) throw new Error('Cannot publish an empty draft');
    const conflicts = [];
    for (const item of items) if (item.operation !== 'create') { const { rows } = await client.query('select version,slug from products where id=$1 for update', [item.product_id]); if (!rows[0] || rows[0].version !== item.base_version) conflicts.push({ productId: item.product_id, slug: rows[0]?.slug ?? null, expectedVersion: item.base_version, actualVersion: rows[0]?.version ?? null }); }
    if (conflicts.length) throw new PublishConflictError(conflicts);
    for (const item of items) {
      const before = item.operation === 'create' ? null : await mapProductRow(client, item.product_id);
      if (item.operation === 'delete') await client.query('delete from products where id=$1', [item.product_id]);
      else await writeProduct(client, productSchema.parse(item.payload), item.operation);
      const after = item.operation === 'delete' ? null : await mapProductRow(client, item.payload.id);
      await client.query('insert into audit_events(change_set_id,product_id,actor,action,before,after) values($1,$2,$3,$4,$5,$6)', [changeSetId, item.operation === 'delete' ? null : item.payload.id, 'store-admin', item.operation, before, after]);
      const oldUrl = before?.imageUrl ?? null; const newUrl = after?.imageUrl ?? null;
      publicChanges.push({ type: after?.type ?? before?.type, oldSlug: before?.slug ?? null, newSlug: after?.slug ?? null });
      if (oldUrl !== newUrl) {
        imageChanges.push({ productId: after?.id ?? before?.id ?? null, oldUrl, newUrl });
        if (newUrl) await client.query('insert into audit_events(change_set_id,product_id,actor,action,before,after) values($1,$2,$3,$4,$5,$6)', [changeSetId, after.id, 'store-admin', 'image_upload', oldUrl ? { url: oldUrl } : null, { url: newUrl }]);
        if (oldUrl) await client.query('insert into audit_events(change_set_id,product_id,actor,action,before,after) values($1,$2,$3,$4,$5,$6)', [changeSetId, after?.id ?? null, 'store-admin', 'image_delete', { url: oldUrl }, newUrl ? { url: newUrl } : null]);
      }
    }
    await client.query("update change_sets set status='published',published_at=now(),updated_at=now() where id=$1", [changeSetId]);
    await client.query("insert into audit_events(change_set_id,actor,action,after) values($1,'store-admin','publish',$2)", [changeSetId, { itemCount: items.length, message: drafts[0].message }]);
    await client.query('commit'); return { changeSetId, itemCount: items.length, imageChanges, publicChanges };
  } catch (error) { await client.query('rollback'); throw error; }
  finally { client.release(); await pool.end(); }
}
