import { z } from 'zod'

import {
  CAFFEINE_TYPES,
  CIGAR_STRENGTH_VALUES,
  PRODUCT_TYPES,
  TOBACCO_SALE_FORMS,
} from './constants.js'

const isCalendarDate = (value) => {
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export const productTypeSchema = z.enum(PRODUCT_TYPES)
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(isCalendarDate, 'Expected a valid calendar date')
export const nullableDateSchema = dateStringSchema.nullable()
export const nullableTextSchema = z.string().trim().min(1).nullable()
export const nullableDescriptionSchema = z.string().trim().min(1).max(2000).nullable()
export const moneySchema = z.string().regex(/^(0|[1-9]\d*)\.\d{2}$/)
export const barcodeSchema = z.string().regex(/^\d+$/).nullable()

const baseProductShape = {
  id: z.string().uuid(),
  type: productTypeSchema,
  slug: slugSchema,
  name: z.string().trim().min(1),
  brand: nullableTextSchema,
  description: nullableDescriptionSchema,
  imageUrl: z.string().url().nullable(),
  hidden: z.boolean(),
  published: z.boolean(),
  dateAdded: nullableDateSchema,
  version: z.number().int().positive(),
  createdAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime().nullable(),
  publishedAt: z.string().datetime().nullable(),
}

export const cigarVariantSchema = z
  .object({
    id: z.string().uuid(),
    size: nullableTextSchema,
    barcode: barcodeSchema,
    inStock: z.boolean(),
    price: moneySchema.nullable(),
  })
  .strict()

export const cigarProductSchema = z
  .object({
    ...baseProductShape,
    type: z.literal('cigar'),
    name: z.string().trim().min(2),
    brand: z.string().trim().min(2),
    details: z
      .object({
        wrapper: nullableTextSchema,
        binder: nullableTextSchema,
        filler: nullableTextSchema,
        flavorProfile: nullableTextSchema,
        strength: z.enum(CIGAR_STRENGTH_VALUES).nullable(),
        podcastLink: nullableTextSchema,
        featured: z
          .object({
            edsPick: nullableDateSchema,
            tedsPick: nullableDateSchema,
            stickFigures: nullableDateSchema,
          })
          .strict(),
      })
      .strict(),
    variants: z.array(cigarVariantSchema),
  })
  .strict()

export const tobaccoProductSchema = z
  .object({
    ...baseProductShape,
    type: z.literal('tobacco'),
    name: z.string().trim().min(2),
    brand: z.string().trim().min(2),
    details: z
      .object({
        family: nullableTextSchema,
        saleForm: z.enum(TOBACCO_SALE_FORMS).nullable(),
        components: z.array(z.string().trim().min(1)),
      })
      .strict(),
  })
  .strict()

export const pipeProductSchema = z
  .object({
    ...baseProductShape,
    type: z.literal('pipe'),
    details: z
      .object({
        material: z.string().trim().min(1),
        pipeType: nullableTextSchema,
      })
      .strict(),
  })
  .strict()

export const caffeineProductSchema = z
  .object({
    ...baseProductShape,
    type: z.literal('caffeine'),
    details: z
      .object({
        roast: nullableTextSchema,
        origin: nullableTextSchema,
        caffeineType: z.enum(CAFFEINE_TYPES),
      })
      .strict(),
  })
  .strict()

export const productSchema = z.discriminatedUnion('type', [
  cigarProductSchema,
  tobaccoProductSchema,
  pipeProductSchema,
  caffeineProductSchema,
])

const systemFields = {
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}

export const cigarVariantInputSchema = cigarVariantSchema
  .omit({ id: true })
  .extend({ id: z.string().uuid().optional() })

export const adminProductInputSchema = z.discriminatedUnion('type', [
  cigarProductSchema
    .omit(systemFields)
    .extend({ variants: z.array(cigarVariantInputSchema) }),
  tobaccoProductSchema.omit(systemFields),
  pipeProductSchema.omit(systemFields),
  caffeineProductSchema.omit(systemFields),
])

const createChangeSchema = z
  .object({
    id: z.string().uuid(),
    operation: z.literal('create'),
    productId: z.null(),
    baseVersion: z.null(),
    payload: productSchema,
  })
  .strict()

const updateChangeSchema = z
  .object({
    id: z.string().uuid(),
    operation: z.literal('update'),
    productId: z.string().uuid(),
    baseVersion: z.number().int().positive(),
    payload: productSchema,
  })
  .strict()

const deleteChangeSchema = z
  .object({
    id: z.string().uuid(),
    operation: z.literal('delete'),
    productId: z.string().uuid(),
    baseVersion: z.number().int().positive(),
    payload: z.null(),
  })
  .strict()

export const changeSetItemSchema = z
  .discriminatedUnion('operation', [
    createChangeSchema,
    updateChangeSchema,
    deleteChangeSchema,
  ])
  .superRefine((item, context) => {
    if (item.operation !== 'update') return
    if (item.payload.id !== item.productId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload', 'id'],
        message: 'Updated payload ID must match productId',
      })
    }
    if (item.payload.version !== item.baseVersion) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload', 'version'],
        message: 'Updated payload version must match baseVersion',
      })
    }
  })

export const changeSetSchema = z
  .object({
    id: z.string().uuid(),
    status: z.enum(['draft', 'published', 'discarded']),
    message: nullableTextSchema,
    createdAt: z.string().datetime(),
    publishedAt: z.string().datetime().nullable(),
    items: z.array(changeSetItemSchema),
  })
  .strict()

export const publicProductSchema = productSchema.refine(
  (product) => product.published && !product.hidden,
  'Public products must be published and visible',
)

export const validateProduct = (value) => productSchema.safeParse(value)
export const validateAdminProductInput = (value) =>
  adminProductInputSchema.safeParse(value)
export const validateChangeSet = (value) => changeSetSchema.safeParse(value)
export const validatePublicProduct = (value) => publicProductSchema.safeParse(value)
