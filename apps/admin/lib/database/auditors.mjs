const detailTables = { cigar: 'cigar_details', tobacco: 'tobacco_details', pipe: 'pipe_details', caffeine: 'caffeine_details' };
export const CATALOG_TABLES = ['products', 'product_images', 'cigar_details', 'cigar_variants', 'tobacco_details', 'tobacco_components', 'pipe_details', 'caffeine_details'];
export const EXPECTED_TABLES = [...CATALOG_TABLES, 'change_sets', 'change_set_items', 'audit_events', 'admin_credentials', 'admin_sessions', 'admin_auth_events'];
export const EXPECTED_VIEWS = CATALOG_TABLES.map((table) => `public_${table}`);
const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const blank = (value) => value == null || String(value).trim() === '';
const reference = (product) => ({ id: product.id, type: product.type, slug: product.slug, name: product.name, brand: product.brand, published: product.published, hidden: product.hidden });
const grouped = (rows, key) => {
  const groups = new Map();
  for (const row of rows) {
    const value = key(row);
    if (value) groups.set(value, [...(groups.get(value) || []), row]);
  }
  return groups;
};

export function auditCatalog(tool, snapshot) {
  const findings = [];
  const products = snapshot.products || [];
  const byId = new Map(products.map((product) => [product.id, product]));
  const add = (severity, rule, title, evidence, affected, comparison = null) => findings.push({
    id: `${rule}:${findings.length}`, severity, rule, title, evidence,
    products: affected.map(reference), ...(comparison ? { comparison } : {}),
  });
  const children = Object.fromEntries(CATALOG_TABLES.slice(1).map((table) => [table, grouped(snapshot[table] || [], (row) => row.product_id)]));
  if (tool === 'quality') {
    for (const product of products) {
      const missing = ['brand', 'description', 'image_url'].filter((field) => blank(product[field]));
      if (missing.length) add('info', 'missing-content', 'Optional catalog content is missing', `Missing: ${missing.join(', ')}.`, [product]);
      const detail = children[detailTables[product.type]]?.get(product.id)?.[0];
      const fields = { cigar: ['wrapper', 'binder', 'filler', 'strength'], tobacco: ['family', 'sale_form'], pipe: ['material'], caffeine: ['type'] }[product.type] || [];
      const incomplete = fields.filter((field) => blank(detail?.[field]));
      if (incomplete.length) add('info', 'incomplete-details', 'Product details are incomplete', `Missing: ${incomplete.join(', ')}.`, [product]);
      for (const variant of children.cigar_variants.get(product.id) || []) {
        const fieldsMissing = ['size', 'barcode', 'price'].filter((field) => blank(variant[field]));
        if (fieldsMissing.length) add('info', 'incomplete-variant', 'Variant information is missing', `Variant ${variant.size || variant.id}: missing ${fieldsMissing.join(', ')}.`, [product]);
        if (!blank(variant.barcode) && !/^\d+$/.test(variant.barcode)) add('warning', 'barcode-format', 'Barcode contains nonnumeric characters', `Variant ${variant.size || variant.id}: ${variant.barcode}. Leading zeroes are preserved.`, [product]);
      }
      const urls = [product.image_url, ...(children.product_images.get(product.id) || []).map((image) => image.url)].filter((url) => !blank(url));
      for (const url of new Set(urls)) {
        let valid = false;
        try { valid = ['https:', 'http:'].includes(new URL(url).protocol); } catch { /* Invalid URL. */ }
        if (!valid) add('warning', 'image-url', 'Image reference is not an HTTP URL', String(url), [product]);
      }
    }
  } else if (tool === 'integrity') {
    for (const product of products) {
      const details = children[detailTables[product.type]]?.get(product.id) || [];
      if (details.length !== 1) add('error', 'detail-count', 'Expected one matching detail record', `${product.type}: found ${details.length} matching detail records.`, [product]);
      const variants = children.cigar_variants.get(product.id) || [];
      if (product.type === 'cigar' && !variants.length) add('warning', 'no-variants', 'Cigar has no variants', 'No size, barcode, stock, or price records exist.', [product]);
      for (const [key, rows] of grouped(variants, (variant) => JSON.stringify([normalize(variant.size), variant.barcode?.trim() || null]))) {
        if (rows.length > 1) add('warning', 'repeated-variant', 'Repeated variants within a product', `${rows.length} variants share size/barcode ${key}.`, [product]);
      }
      if (product.published && !product.published_at) add('warning', 'publication-timestamp', 'Published product has no publication timestamp', 'The product is marked published but published_at is empty.', [product]);
      const primary = (children.product_images.get(product.id) || []).filter((image) => image.is_primary);
      if (primary.length > 1 || (primary.length === 1 && primary[0].url !== product.image_url)) add('warning', 'primary-image', 'Primary image references disagree', 'Compare products.image_url with the primary product_images record.', [product]);
    }
    for (const [table, groups] of Object.entries(children)) {
      const requiredType = Object.entries(detailTables).find(([, name]) => name === table)?.[0] || ({ cigar_variants: 'cigar', tobacco_components: 'tobacco' })[table];
      for (const [productId, rows] of groups) {
        const product = byId.get(productId);
        if (!product) add('error', 'orphan-record', 'Child records have no parent product', `${table}: ${rows.length} records reference missing product ${productId}.`, []);
        else if (requiredType && product.type !== requiredType) add('error', 'wrong-product-type', 'Child records belong to a different product type', `${table} contains ${rows.length} records for a ${product.type} product.`, [product]);
      }
    }
  } else if (tool === 'duplicates') {
    const pairs = new Map();
    const pair = (a, b, evidence) => {
      if (a.id === b.id) return;
      const sorted = [a, b].sort((x, y) => x.id.localeCompare(y.id));
      const key = sorted.map(({ id }) => id).join(':');
      if (!pairs.has(key)) pairs.set(key, { products: sorted, reasons: new Set() });
      pairs.get(key).reasons.add(evidence);
    };
    for (const rows of grouped(products, (product) => normalize(product.brand) && normalize(product.name) ? `${product.type}:${normalize(product.brand)}:${normalize(product.name)}` : null).values()) {
      for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) pair(rows[i], rows[j], 'Brand and name match after punctuation/case normalization');
    }
    for (const [barcode, variants] of grouped(snapshot.cigar_variants || [], (variant) => variant.barcode?.trim()).entries()) {
      const owners = [...new Set(variants.map((variant) => variant.product_id))].map((id) => byId.get(id)).filter(Boolean);
      for (let i = 0; i < owners.length; i++) for (let j = i + 1; j < owners.length; j++) pair(owners[i], owners[j], `Shared barcode: ${barcode}`);
    }
    for (const { products: affected, reasons } of pairs.values()) {
      const comparison = affected.map((product) => ({
        ...reference(product), description: product.description,
        details: (children[detailTables[product.type]]?.get(product.id) || []).map(({ product_id, ...detail }) => detail),
        variants: (children.cigar_variants.get(product.id) || []).map(({ size, barcode, price, in_stock }) => ({ size, barcode, price, in_stock })),
      }));
      const conflicts = [];
      if (affected[0].description !== affected[1].description) conflicts.push('descriptions differ');
      if (JSON.stringify(comparison[0].details) !== JSON.stringify(comparison[1].details)) conflicts.push('detail attributes differ');
      const left = children.cigar_variants.get(affected[0].id) || [];
      const right = children.cigar_variants.get(affected[1].id) || [];
      if (left.some((a) => right.some((b) => a.barcode?.trim() && a.barcode.trim() === b.barcode?.trim() && a.price != null && b.price != null && Number(a.price) !== Number(b.price)))) conflicts.push('prices differ for a shared barcode');
      add('warning', 'duplicate-candidate', 'Possible duplicate products — review required', `${[...reasons].join('; ')}.${conflicts.length ? ` Conflicts: ${conflicts.join('; ')}.` : ''} Matching evidence does not establish identical products.`, affected, comparison);
    }
  } else throw new Error('Unknown catalog auditor');
  return { scanned: products.length, findings };
}
