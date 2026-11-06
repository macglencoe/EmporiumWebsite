const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const createSlug = (...parts) =>
  parts
    .flat()
    .filter((part) => part !== null && part !== undefined && part !== '')
    .join(' ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')

export const isValidSlug = (value) =>
  typeof value === 'string' && SLUG_PATTERN.test(value)

export const createProductSlug = (type, value) => {
  switch (type) {
    case 'cigar':
      return createSlug(value.brand, value.name)
    case 'tobacco':
    case 'caffeine':
      return createSlug(value.name)
    case 'pipe':
      return createSlug(value.brand, value.name)
    default:
      throw new TypeError(`Unknown product type: ${type}`)
  }
}

export const makeUniqueSlug = (candidate, existingSlugs, currentSlug = null) => {
  const base = createSlug(candidate)
  if (!base) return ''

  const existing = new Set(existingSlugs)
  if (currentSlug) existing.delete(currentSlug)
  if (!existing.has(base)) return base

  let suffix = 2
  while (existing.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}
