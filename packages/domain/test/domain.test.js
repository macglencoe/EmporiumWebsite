import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  changeSetSchema,
  adminProductInputSchema,
  createLegacyProductId,
  createProductSlug,
  createSlug,
  exportLegacyProduct,
  importLegacyCatalog,
  importLegacyProduct,
  isValidUuid,
  makeUniqueSlug,
  productSchema,
} from '../src/index.js'

const repositoryRoot = path.resolve(process.cwd(), '../..')

const load = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'))

test('slug creation preserves the established route convention', () => {
  assert.equal(createSlug("Greg's Mix"), 'gregs-mix')
  assert.equal(createSlug('J.C. Newman', 'Diamond Crown'), 'jc-newman-diamond-crown')
  assert.equal(createProductSlug('tobacco', { name: "Greg's Mix" }), 'gregs-mix')
  assert.equal(
    makeUniqueSlug('Diamond Crown', ['diamond-crown', 'diamond-crown-2']),
    'diamond-crown-3',
  )
})

test('legacy identities are deterministic UUIDs and ignore browser IDs', () => {
  const first = createLegacyProductId('cigar', 'example-cigar')
  const second = createLegacyProductId('cigar', 'example-cigar')
  assert.equal(first, second)
  assert.equal(isValidUuid(first), true)

  const result = importLegacyProduct('tobacco', {
    'Tobacco Name': 'Example Blend',
    'Tobacco Brand': 'Example Brand',
    slug: 'example-blend',
    _clientId: 'tablet-only-id',
  })
  assert.equal(result.success, true)
  assert.equal(result.data.id, createLegacyProductId('tobacco', 'example-blend'))
  assert.ok(result.warnings.some((warning) => warning.code === 'LEGACY_CLIENT_ID_IGNORED'))
})

test('legacy export is a compatibility boundary, not a canonical field leak', () => {
  const result = importLegacyProduct('cigar', {
    'Cigar Name': 'Example',
    'Cigar Brand': 'Brand',
    Sizes: [{ Size: 'Toro', Barcode: '123', In_Stock: true, Price: '10' }],
    slug: 'brand-example',
  })
  assert.equal(result.success, true)
  assert.equal(result.data.variants[0].price, '10.00')
  assert.equal(productSchema.safeParse(result.data).success, true)

  const exported = exportLegacyProduct(result.data)
  assert.equal(exported['Cigar Name'], 'Example')
  assert.equal(exported.Sizes[0].Price, '10.00')
  assert.equal(Object.hasOwn(exported, 'id'), false)
})

test('all public and admin legacy records map to the canonical model', () => {
  const sources = [
    ['cigar', 'apps/public/public/data/consolidated_cigars.json', 551],
    ['tobacco', 'apps/public/public/data/tobacco.json', 70],
    ['pipe', 'apps/public/public/data/pipes.json', 14],
    ['caffeine', 'apps/public/public/data/caffeine.json', 27],
    ['cigar', 'apps/admin/public/data/consolidated_cigars.json', 551],
    ['tobacco', 'apps/admin/public/data/tobacco.json', 70],
    ['pipe', 'apps/admin/public/data/pipes.json', 14],
    ['caffeine', 'apps/admin/public/data/caffeine.json', 24],
  ]

  for (const [type, relativePath, expectedCount] of sources) {
    const result = importLegacyCatalog(type, load(relativePath), { source: relativePath })
    assert.equal(result.errors.length, 0, `${relativePath}: ${JSON.stringify(result.errors)}`)
    assert.equal(result.products.length, expectedCount)
    assert.equal(new Set(result.products.map((product) => product.id)).size, expectedCount)
  }
})

test('change sets require stable IDs and optimistic base versions', () => {
  const cigar = importLegacyProduct('cigar', {
    'Cigar Name': 'Example',
    'Cigar Brand': 'Brand',
    Sizes: [],
    slug: 'brand-example',
  }).data

  const result = changeSetSchema.safeParse({
    id: '0ce68424-260b-4a32-a02a-036afd09f710',
    status: 'draft',
    message: 'Update example',
    createdAt: '2026-08-19T12:00:00.000Z',
    publishedAt: null,
    items: [
      {
        id: '330e2711-9cc0-4cb5-91da-717bb98adfea',
        operation: 'update',
        productId: cigar.id,
        baseVersion: cigar.version,
        payload: cigar,
      },
    ],
  })
  assert.equal(result.success, true)

  const stale = changeSetSchema.safeParse({
    ...result.data,
    items: [{ ...result.data.items[0], baseVersion: 2 }],
  })
  assert.equal(stale.success, false)
})

test('admin creation inputs do not require database-managed IDs', () => {
  const cigar = importLegacyProduct('cigar', {
    'Cigar Name': 'Example',
    'Cigar Brand': 'Brand',
    Sizes: [{ Size: 'Toro', In_Stock: true, Price: '10.00' }],
    slug: 'brand-example',
  }).data
  const input = structuredClone(cigar)
  delete input.id
  delete input.version
  delete input.createdAt
  delete input.updatedAt
  delete input.publishedAt
  input.variants = input.variants.map(({ id: variantId, ...variant }) => variant)
  assert.equal(adminProductInputSchema.safeParse(input).success, true)
})
