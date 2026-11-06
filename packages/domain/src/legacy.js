import { z } from 'zod'

import {
  CAFFEINE_TYPES,
  CIGAR_STRENGTH_VALUES,
  PRODUCT_TYPES,
  TOBACCO_SALE_FORMS,
} from './constants.js'
import { createLegacyProductId, createLegacyVariantId, isValidUuid } from './identity.js'
import { productSchema } from './schemas.js'
import { createProductSlug, isValidSlug } from './slug.js'

const LEGACY_FIELDS = {
  cigar: new Set([
    'Cigar Name',
    'Cigar Brand',
    'Wrapper',
    'Binder',
    'Filler',
    'Flavor_Profile',
    'Strength_Profile',
    'description',
    'Date Added',
    'hidden',
    'Podcast_Link',
    'featured_Eds_Pick',
    'featured_Teds_Pick',
    'featured_StickFigures',
    'Sizes',
    'image',
    'slug',
    '_clientId',
  ]),
  tobacco: new Set([
    'Tobacco Name',
    'Tobacco Brand',
    'Family',
    'description',
    'Sale Form',
    'Components',
    'image',
    'slug',
    '_clientId',
  ]),
  pipe: new Set([
    'Pipe Name',
    'Pipe Brand',
    'Material',
    'Type',
    'description',
    'image',
    'slug',
    '_clientId',
  ]),
  caffeine: new Set([
    'Product Name',
    'Roast',
    'Origin',
    'Type',
    'Description',
    'image',
    'slug',
    '_clientId',
  ]),
}

const asNullableText = (value) => {
  if (value === null || value === undefined) return null
  const normalized = String(value).trim()
  return normalized || null
}

const asNullableDate = (value) => asNullableText(value)

const makeIssue = ({ code, type, slug, index, path = [], message, value }) => ({
  code,
  type,
  slug,
  index,
  path,
  message,
  ...(value === undefined ? {} : { value }),
})

const canonicalError = (issue, context) =>
  makeIssue({
    code: 'CANONICAL_VALIDATION_ERROR',
    ...context,
    path: issue.path,
    message: issue.message,
    value: issue.code,
  })

const normalizePrice = (value, context, warnings) => {
  const text = asNullableText(value)
  if (text === null) return null
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return text

  const normalized = Number(text).toFixed(2)
  if (normalized !== text) {
    warnings.push(
      makeIssue({
        code: 'PRICE_NORMALIZED',
        ...context,
        message: `Normalized legacy price ${JSON.stringify(text)} to ${normalized}`,
        value: text,
      }),
    )
  }
  return normalized
}

const getIdentityFields = (type, raw) => {
  switch (type) {
    case 'cigar':
      return { name: raw['Cigar Name'], brand: raw['Cigar Brand'] }
    case 'tobacco':
      return { name: raw['Tobacco Name'], brand: raw['Tobacco Brand'] }
    case 'pipe':
      return { name: raw['Pipe Name'], brand: raw['Pipe Brand'] }
    case 'caffeine':
      return { name: raw['Product Name'], brand: null }
    default:
      throw new TypeError(`Unknown product type: ${type}`)
  }
}

const mapCommon = (type, raw, context, warnings) => {
  const identity = getIdentityFields(type, raw)
  const generatedSlug = createProductSlug(type, identity)
  let slug = raw.slug

  if (!isValidSlug(slug)) {
    warnings.push(
      makeIssue({
        code: 'INVALID_SLUG_REPLACED',
        ...context,
        message: `Replaced invalid legacy slug with ${generatedSlug}`,
        value: slug,
      }),
    )
    slug = generatedSlug
  } else if (generatedSlug && slug !== generatedSlug) {
    warnings.push(
      makeIssue({
        code: 'SLUG_DIFFERS_FROM_GENERATED',
        ...context,
        slug,
        message: `Preserved route slug; current generator would produce ${generatedSlug}`,
        value: generatedSlug,
      }),
    )
  }

  if (raw._clientId !== undefined) {
    warnings.push(
      makeIssue({
        code: 'LEGACY_CLIENT_ID_IGNORED',
        ...context,
        slug,
        path: ['_clientId'],
        message: 'Ignored browser-only _clientId and assigned a stable product UUID',
      }),
    )
  }

  for (const field of Object.keys(raw)) {
    if (!LEGACY_FIELDS[type].has(field)) {
      warnings.push(
        makeIssue({
          code: 'UNKNOWN_LEGACY_FIELD',
          ...context,
          slug,
          path: [field],
          message: `Legacy field ${field} has no canonical mapping`,
          value: raw[field],
        }),
      )
    }
  }

  return {
    id: createLegacyProductId(type, slug),
    type,
    slug,
    name: asNullableText(identity.name) ?? '',
    brand: asNullableText(identity.brand),
    description: asNullableText(
      type === 'caffeine' ? raw.Description : raw.description,
    ),
    imageUrl: asNullableText(raw.image),
    hidden: raw.hidden === true,
    published: true,
    dateAdded: type === 'cigar' ? asNullableDate(raw['Date Added']) : null,
    version: 1,
    createdAt: null,
    updatedAt: null,
    publishedAt: null,
  }
}

const mapCigar = (raw, context, warnings) => {
  const common = mapCommon('cigar', raw, context, warnings)
  const sourceVariants = Array.isArray(raw.Sizes) ? raw.Sizes : []

  if (sourceVariants.length === 0) {
    warnings.push(
      makeIssue({
        code: 'CIGAR_WITHOUT_VARIANTS',
        ...context,
        slug: common.slug,
        path: ['Sizes'],
        message: 'Cigar has no size/price variants',
      }),
    )
  }

  const variants = sourceVariants.map((variant, variantIndex) => {
    const variantContext = {
      ...context,
      slug: common.slug,
      path: ['Sizes', variantIndex],
    }
    const size = asNullableText(variant.Size)
    const barcode = asNullableText(variant.Barcode)

    if (size === null) {
      warnings.push(
        makeIssue({
          code: 'MISSING_VARIANT_SIZE',
          ...variantContext,
          message: 'Variant has no size label; it was retained with size=null',
        }),
      )
    }

    let inStock = variant.In_Stock
    if (typeof inStock !== 'boolean') {
      warnings.push(
        makeIssue({
          code: 'MISSING_VARIANT_STOCK_STATUS',
          ...variantContext,
          path: [...variantContext.path, 'In_Stock'],
          message: 'Missing stock status was normalized to false',
          value: inStock,
        }),
      )
      inStock = false
    }

    const normalized = {
      size,
      barcode,
      inStock,
      price: normalizePrice(
        variant.Price,
        { ...variantContext, path: [...variantContext.path, 'Price'] },
        warnings,
      ),
    }

    if (variant._clientId !== undefined) {
      warnings.push(
        makeIssue({
          code: 'LEGACY_CLIENT_ID_IGNORED',
          ...variantContext,
          path: [...variantContext.path, '_clientId'],
          message: 'Ignored browser-only variant _clientId and assigned a stable UUID',
        }),
      )
    }

    return {
      id: createLegacyVariantId(common.id, normalized, variantIndex),
      ...normalized,
    }
  })

  const strength = asNullableText(raw.Strength_Profile)

  return {
    ...common,
    details: {
      wrapper: asNullableText(raw.Wrapper),
      binder: asNullableText(raw.Binder),
      filler: asNullableText(raw.Filler),
      flavorProfile: asNullableText(raw.Flavor_Profile),
      strength,
      podcastLink: asNullableText(raw.Podcast_Link),
      featured: {
        edsPick: asNullableDate(raw.featured_Eds_Pick),
        tedsPick: asNullableDate(raw.featured_Teds_Pick),
        stickFigures: asNullableDate(raw.featured_StickFigures),
      },
    },
    variants,
  }
}

const mapTobacco = (raw, context, warnings) => ({
  ...mapCommon('tobacco', raw, context, warnings),
  details: {
    family: asNullableText(raw.Family),
    saleForm: asNullableText(raw['Sale Form']),
    components: Array.isArray(raw.Components)
      ? raw.Components.map(asNullableText).filter(Boolean)
      : [],
  },
})

const mapPipe = (raw, context, warnings) => ({
  ...mapCommon('pipe', raw, context, warnings),
  details: {
    material: asNullableText(raw.Material) ?? '',
    pipeType: asNullableText(raw.Type),
  },
})

const mapCaffeine = (raw, context, warnings) => ({
  ...mapCommon('caffeine', raw, context, warnings),
  details: {
    roast: asNullableText(raw.Roast),
    origin: asNullableText(raw.Origin),
    caffeineType: asNullableText(raw.Type),
  },
})

const mappers = {
  cigar: mapCigar,
  tobacco: mapTobacco,
  pipe: mapPipe,
  caffeine: mapCaffeine,
}

export const importLegacyProduct = (type, raw, options = {}) => {
  if (!PRODUCT_TYPES.includes(type)) throw new TypeError(`Unknown product type: ${type}`)
  const context = {
    type,
    slug: typeof raw?.slug === 'string' ? raw.slug : null,
    index: options.index ?? null,
  }
  const warnings = []

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      success: false,
      data: null,
      warnings,
      errors: [
        makeIssue({
          code: 'INVALID_LEGACY_RECORD',
          ...context,
          message: 'Expected a legacy product object',
          value: raw,
        }),
      ],
    }
  }

  const candidate = mappers[type](raw, context, warnings)
  const result = productSchema.safeParse(candidate)

  if (!result.success) {
    return {
      success: false,
      data: null,
      warnings,
      errors: result.error.issues.map((issue) => canonicalError(issue, context)),
    }
  }

  return { success: true, data: result.data, warnings, errors: [] }
}

export const importLegacyCatalog = (type, rows, options = {}) => {
  if (!Array.isArray(rows)) throw new TypeError('Expected a legacy catalog array')
  const products = []
  const warnings = []
  const errors = []

  rows.forEach((raw, index) => {
    const result = importLegacyProduct(type, raw, { ...options, index })
    warnings.push(...result.warnings)
    errors.push(...result.errors)
    if (result.data) products.push(result.data)
  })

  const slugs = new Map()
  for (const product of products) {
    const prior = slugs.get(product.slug)
    if (prior !== undefined) {
      errors.push(
        makeIssue({
          code: 'DUPLICATE_SLUG',
          type,
          slug: product.slug,
          index: null,
          path: ['slug'],
          message: `Slug is also used at catalog index ${prior}`,
        }),
      )
    } else {
      slugs.set(product.slug, rows.findIndex((row) => row.slug === product.slug))
    }
  }

  if (type === 'cigar') {
    const barcodes = new Map()
    products.forEach((product) => {
      product.variants.forEach((variant, variantIndex) => {
        if (!variant.barcode) return
        const uses = barcodes.get(variant.barcode) ?? []
        uses.push({ slug: product.slug, variantIndex })
        barcodes.set(variant.barcode, uses)
      })
    })

    for (const [barcode, uses] of barcodes) {
      if (uses.length < 2) continue
      warnings.push(
        makeIssue({
          code: 'DUPLICATE_BARCODE',
          type,
          slug: null,
          index: null,
          path: ['variants', 'barcode'],
          message: `Barcode ${barcode} is used by ${uses.map((use) => use.slug).join(', ')}`,
          value: { barcode, uses },
        }),
      )
    }
  }

  return {
    success: errors.length === 0,
    products,
    warnings,
    errors,
    stats: {
      source: options.source ?? null,
      type,
      inputRecords: rows.length,
      validRecords: products.length,
      warningCount: warnings.length,
      errorCount: errors.length,
      variantCount:
        type === 'cigar'
          ? products.reduce((count, product) => count + product.variants.length, 0)
          : 0,
    },
  }
}

const compact = (value) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined))

export const exportLegacyProduct = (product) => {
  const value = productSchema.parse(product)

  switch (value.type) {
    case 'cigar':
      return {
        'Cigar Name': value.name,
        'Cigar Brand': value.brand,
        Wrapper: value.details.wrapper ?? '',
        Binder: value.details.binder ?? '',
        Filler: value.details.filler ?? '',
        Flavor_Profile: value.details.flavorProfile ?? '',
        Strength_Profile: value.details.strength ?? '',
        description: value.description,
        'Date Added': value.dateAdded,
        hidden: value.hidden,
        Podcast_Link: value.details.podcastLink,
        featured_Eds_Pick: value.details.featured.edsPick,
        featured_Teds_Pick: value.details.featured.tedsPick,
        featured_StickFigures: value.details.featured.stickFigures,
        Sizes: value.variants.map((variant) => ({
          Size: variant.size ?? '',
          Barcode: variant.barcode,
          In_Stock: variant.inStock,
          Price: variant.price,
        })),
        image: value.imageUrl,
        slug: value.slug,
      }
    case 'tobacco':
      return {
        'Tobacco Name': value.name,
        'Tobacco Brand': value.brand,
        Family: value.details.family,
        description: value.description,
        'Sale Form': value.details.saleForm,
        Components: value.details.components,
        image: value.imageUrl,
        slug: value.slug,
      }
    case 'pipe':
      return compact({
        'Pipe Name': value.name,
        'Pipe Brand': value.brand ?? undefined,
        Material: value.details.material,
        Type: value.details.pipeType ?? undefined,
        description: value.description ?? undefined,
        image: value.imageUrl ?? undefined,
        slug: value.slug,
      })
    case 'caffeine':
      return compact({
        'Product Name': value.name,
        Roast: value.details.roast ?? undefined,
        Origin: value.details.origin ?? undefined,
        Type: value.details.caffeineType,
        Description: value.description ?? undefined,
        image: value.imageUrl ?? undefined,
        slug: value.slug,
      })
  }
}

export const exportLegacyCatalog = (products) => products.map(exportLegacyProduct)

export const legacyCatalogSchema = z.array(z.record(z.unknown()))

export const LEGACY_ENUMS = Object.freeze({
  cigarStrengths: CIGAR_STRENGTH_VALUES,
  tobaccoSaleForms: TOBACCO_SALE_FORMS,
  caffeineTypes: CAFFEINE_TYPES,
})
