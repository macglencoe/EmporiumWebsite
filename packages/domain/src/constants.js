export const PRODUCT_TYPES = Object.freeze([
  'cigar',
  'tobacco',
  'pipe',
  'caffeine',
])

export const CIGAR_STRENGTHS = Object.freeze([
  '',
  'Mild',
  'Mild-Medium',
  'Medium',
  'Medium-Full',
  'Full',
])

export const CIGAR_STRENGTH_VALUES = Object.freeze(CIGAR_STRENGTHS.filter(Boolean))

export const TOBACCO_SALE_FORMS = Object.freeze(['Bulk', 'Tin'])
export const CAFFEINE_TYPES = Object.freeze(['Coffee', 'Tea'])

// Generated once for this project. Changing it would change every deterministic
// legacy UUID and break idempotent imports.
export const LEGACY_UUID_NAMESPACE = 'dc6c92ef-7285-5db9-97e8-b2bc4805548f'
