import { validate as isUuid, v5 as uuidv5 } from 'uuid'

import { LEGACY_UUID_NAMESPACE } from './constants.js'

export const isValidUuid = (value) => typeof value === 'string' && isUuid(value)

export const createLegacyProductId = (type, slug) =>
  uuidv5(`product:${type}:${slug}`, LEGACY_UUID_NAMESPACE)

export const createLegacyVariantId = (productId, variant, index) =>
  uuidv5(
    `variant:${productId}:${index}:${variant.size ?? ''}:${variant.barcode ?? ''}`,
    LEGACY_UUID_NAMESPACE,
  )
