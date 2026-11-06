import { pgEnum } from 'drizzle-orm/pg-core';

export const productType = pgEnum('product_type', [
  'cigar',
  'tobacco',
  'pipe',
  'caffeine',
]);

export const cigarStrength = pgEnum('cigar_strength', [
  'Mild',
  'Mild-Medium',
  'Medium',
  'Medium-Full',
  'Full',
]);

export const tobaccoSaleForm = pgEnum('tobacco_sale_form', ['Bulk', 'Tin']);
export const caffeineType = pgEnum('caffeine_type', ['Coffee', 'Tea']);
export const changeSetStatus = pgEnum('change_set_status', [
  'draft',
  'published',
  'discarded',
]);
export const changeOperation = pgEnum('change_operation', [
  'create',
  'update',
  'delete',
]);
export const auditAction = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'publish',
  'image_upload',
  'image_delete',
]);
