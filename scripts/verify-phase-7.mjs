import assert from 'node:assert/strict';

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { importLegacyProduct } from '@emporium/domain';
import {
  PublishConflictError, createDatabase, exportCatalog, getActiveDraft,
  publishDraft, stageDraftItem,
} from '@emporium/database';

config({ path: '.env.local', quiet: true });
const connectionString = process.env.ADMIN_DATABASE_URL;
if (!connectionString) throw new Error('ADMIN_DATABASE_URL is required');
const database = createDatabase(connectionString); const sql = neon(connectionString);
const slug = `phase-7-conflict-${Date.now()}`;
const mapped = importLegacyProduct('tobacco', { 'Tobacco Name':'Phase Seven Conflict', 'Tobacco Brand':'Emporium Test', Family:'Test', description:'Initial', 'Sale Form':'Bulk', Components:['Virginia'], image:null, slug });
assert.equal(mapped.success, true);
await stageDraftItem(database, { operation:'create', draftKey:mapped.data.id, payload:mapped.data });
let draft = await getActiveDraft(database); await publishDraft(connectionString, draft.id);
let created = (await exportCatalog(database)).find((product) => product.slug === slug);
await stageDraftItem(database, { operation:'update', draftKey:created.id, productId:created.id, baseVersion:created.version, payload:{ ...created, description:'Staged update' } });
draft = await getActiveDraft(database);
await sql`update products set version=version+1 where id=${created.id}`;
await assert.rejects(() => publishDraft(connectionString, draft.id), (error) => error instanceof PublishConflictError && error.conflicts.length === 1);
assert.equal((await getActiveDraft(database)).items.length, 1);
await sql`update products set version=${created.version} where id=${created.id}`;
await publishDraft(connectionString, draft.id);
created = (await exportCatalog(database)).find((product) => product.slug === slug);
assert.equal(created.description, 'Staged update');
await stageDraftItem(database, { operation:'delete', draftKey:created.id, productId:created.id, baseVersion:created.version, payload:null });
draft = await getActiveDraft(database); await publishDraft(connectionString, draft.id);
assert.equal((await exportCatalog(database)).some((product) => product.slug === slug), false);
console.log('Verified optimistic conflict rollback, update publication, and cleanup.');
