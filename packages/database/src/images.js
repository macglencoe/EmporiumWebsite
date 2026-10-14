import { eq } from 'drizzle-orm';

import { changeSetItems, changeSets, productImages } from './schema/index.js';

export async function getImageReferences(database, url) {
  const references = [];
  const stored = await database.select({ productId: productImages.productId }).from(productImages).where(eq(productImages.url, url));
  references.push(...stored.map(({ productId }) => ({ kind: 'product', id: productId })));
  const drafts = await database.select({ id: changeSetItems.id, payload: changeSetItems.payload })
    .from(changeSetItems).innerJoin(changeSets, eq(changeSetItems.changeSetId, changeSets.id))
    .where(eq(changeSets.status, 'draft'));
  references.push(...drafts.filter(({ payload }) => payload?.imageUrl === url).map(({ id }) => ({ kind: 'draft', id })));
  return references;
}
