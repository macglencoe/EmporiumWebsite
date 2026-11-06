import type { ZodType } from 'zod'

export type ProductType = 'cigar' | 'tobacco' | 'pipe' | 'caffeine'
export type CigarStrength =
  | 'Mild'
  | 'Mild-Medium'
  | 'Medium'
  | 'Medium-Full'
  | 'Full'
export type TobaccoSaleForm = 'Bulk' | 'Tin'
export type CaffeineType = 'Coffee' | 'Tea'

export interface BaseProduct {
  id: string
  type: ProductType
  slug: string
  name: string
  brand: string | null
  description: string | null
  imageUrl: string | null
  hidden: boolean
  published: boolean
  dateAdded: string | null
  version: number
  createdAt: string | null
  updatedAt: string | null
  publishedAt: string | null
}

export interface CigarVariant {
  id: string
  size: string | null
  barcode: string | null
  inStock: boolean
  price: string | null
}

export interface CigarProduct extends BaseProduct {
  type: 'cigar'
  brand: string
  details: {
    wrapper: string | null
    binder: string | null
    filler: string | null
    flavorProfile: string | null
    strength: CigarStrength | null
    podcastLink: string | null
    featured: {
      edsPick: string | null
      tedsPick: string | null
      stickFigures: string | null
    }
  }
  variants: CigarVariant[]
}

export interface TobaccoProduct extends BaseProduct {
  type: 'tobacco'
  brand: string
  details: {
    family: string | null
    saleForm: TobaccoSaleForm | null
    components: string[]
  }
}

export interface PipeProduct extends BaseProduct {
  type: 'pipe'
  details: {
    material: string
    pipeType: string | null
  }
}

export interface CaffeineProduct extends BaseProduct {
  type: 'caffeine'
  details: {
    roast: string | null
    origin: string | null
    caffeineType: CaffeineType
  }
}

export type Product = CigarProduct | TobaccoProduct | PipeProduct | CaffeineProduct
type SystemProductFields = 'id' | 'version' | 'createdAt' | 'updatedAt' | 'publishedAt'
export type CigarAdminInput = Omit<CigarProduct, SystemProductFields | 'variants'> & {
  variants: Array<Omit<CigarVariant, 'id'> & { id?: string }>
}
export type AdminProductInput =
  | CigarAdminInput
  | Omit<TobaccoProduct, SystemProductFields>
  | Omit<PipeProduct, SystemProductFields>
  | Omit<CaffeineProduct, SystemProductFields>

export interface CreateChangeSetItem {
  id: string
  operation: 'create'
  productId: null
  baseVersion: null
  payload: Product
}

export interface UpdateChangeSetItem {
  id: string
  operation: 'update'
  productId: string
  baseVersion: number
  payload: Product
}

export interface DeleteChangeSetItem {
  id: string
  operation: 'delete'
  productId: string
  baseVersion: number
  payload: null
}

export type ChangeSetItem =
  | CreateChangeSetItem
  | UpdateChangeSetItem
  | DeleteChangeSetItem

export interface ChangeSet {
  id: string
  status: 'draft' | 'published' | 'discarded'
  message: string | null
  createdAt: string
  publishedAt: string | null
  items: ChangeSetItem[]
}

export interface LegacyIssue {
  code: string
  type: ProductType
  slug: string | null
  index: number | null
  path: Array<string | number>
  message: string
  value?: unknown
}

export interface LegacyProductResult {
  success: boolean
  data: Product | null
  warnings: LegacyIssue[]
  errors: LegacyIssue[]
}

export interface LegacyCatalogResult {
  success: boolean
  products: Product[]
  warnings: LegacyIssue[]
  errors: LegacyIssue[]
  stats: {
    source: string | null
    type: ProductType
    inputRecords: number
    validRecords: number
    warningCount: number
    errorCount: number
    variantCount: number
  }
}

export const PRODUCT_TYPES: readonly ProductType[]
export const CIGAR_STRENGTHS: readonly (CigarStrength | '')[]
export const CIGAR_STRENGTH_VALUES: readonly CigarStrength[]
export const TOBACCO_SALE_FORMS: readonly TobaccoSaleForm[]
export const CAFFEINE_TYPES: readonly CaffeineType[]
export const LEGACY_UUID_NAMESPACE: string

export const productSchema: ZodType<Product>
export const cigarProductSchema: ZodType<CigarProduct>
export const tobaccoProductSchema: ZodType<TobaccoProduct>
export const pipeProductSchema: ZodType<PipeProduct>
export const caffeineProductSchema: ZodType<CaffeineProduct>
export const adminProductInputSchema: ZodType<AdminProductInput>
export const changeSetSchema: ZodType<ChangeSet>
export const publicProductSchema: ZodType<Product>

export function createSlug(...parts: unknown[]): string
export function isValidSlug(value: unknown): boolean
export function createProductSlug(type: ProductType, value: { name: string; brand?: string | null }): string
export function makeUniqueSlug(candidate: string, existingSlugs: Iterable<string>, currentSlug?: string | null): string
export function isValidUuid(value: unknown): boolean
export function createLegacyProductId(type: ProductType, slug: string): string
export function createLegacyVariantId(productId: string, variant: Pick<CigarVariant, 'size' | 'barcode'>, index: number): string
export function importLegacyProduct(type: ProductType, raw: unknown, options?: { index?: number; source?: string }): LegacyProductResult
export function importLegacyCatalog(type: ProductType, rows: unknown[], options?: { source?: string }): LegacyCatalogResult
export function exportLegacyProduct(product: Product): Record<string, unknown>
export function exportLegacyCatalog(products: Product[]): Array<Record<string, unknown>>
export function validateProduct(value: unknown): ReturnType<ZodType<Product>['safeParse']>
export function validateAdminProductInput(value: unknown): ReturnType<ZodType<AdminProductInput>['safeParse']>
export function validateChangeSet(value: unknown): ReturnType<ZodType<ChangeSet>['safeParse']>
export function validatePublicProduct(value: unknown): ReturnType<ZodType<Product>['safeParse']>
