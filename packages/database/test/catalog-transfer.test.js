import assert from 'node:assert/strict';
import test from 'node:test';

import { importLegacyProduct } from '@emporium/domain';

import { toDatabaseRows } from '../src/catalog-transfer.js';

test('maps a cigar and preserves variant order and identity', () => {
  const result = importLegacyProduct('cigar', {
    'Cigar Name': 'Test Cigar', 'Cigar Brand': 'Test Brand', Wrapper: '', Binder: '', Filler: '',
    Flavor_Profile: '', Strength_Profile: 'Medium', description: 'Description', 'Date Added': '2024-01-02',
    hidden: false, Podcast_Link: '', featured_Eds_Pick: null, featured_Teds_Pick: null,
    featured_StickFigures: null, image: 'https://example.com/cigar.jpg', slug: 'test-cigar',
    Sizes: [
      { Size: 'First', Barcode: '123', In_Stock: true, Price: '4.5' },
      { Size: 'Second', Barcode: null, In_Stock: false, Price: null },
    ],
  });
  assert.equal(result.success, true);
  const rows = toDatabaseRows(result.data);
  assert.equal(rows.product.slug, 'test-cigar');
  assert.equal(rows.images[0].isPrimary, true);
  assert.deepEqual(rows.cigarVariants.map(({ id, sortOrder, price }) => ({ id, sortOrder, price })), [
    { id: result.data.variants[0].id, sortOrder: 0, price: '4.50' },
    { id: result.data.variants[1].id, sortOrder: 1, price: null },
  ]);
});

test('maps ordered tobacco components and subtype details', () => {
  const result = importLegacyProduct('tobacco', {
    'Tobacco Name': 'Test Blend', 'Tobacco Brand': 'Test Brand', Family: 'English', description: null,
    'Sale Form': 'Bulk', Components: ['Latakia', 'Virginia'], image: null, slug: 'test-blend',
  });
  assert.equal(result.success, true);
  const rows = toDatabaseRows(result.data);
  assert.deepEqual(rows.tobaccoComponents.map(({ component, sortOrder }) => ({ component, sortOrder })), [
    { component: 'Latakia', sortOrder: 0 }, { component: 'Virginia', sortOrder: 1 },
  ]);
});
