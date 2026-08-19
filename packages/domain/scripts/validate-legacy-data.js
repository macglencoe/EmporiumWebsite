import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { importLegacyCatalog } from '../src/index.js'

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
)

const sources = [
  ['public', 'cigar', 'apps/public/public/data/consolidated_cigars.json'],
  ['public', 'tobacco', 'apps/public/public/data/tobacco.json'],
  ['public', 'pipe', 'apps/public/public/data/pipes.json'],
  ['public', 'caffeine', 'apps/public/public/data/caffeine.json'],
  ['admin', 'cigar', 'apps/admin/public/data/consolidated_cigars.json'],
  ['admin', 'tobacco', 'apps/admin/public/data/tobacco.json'],
  ['admin', 'pipe', 'apps/admin/public/data/pipes.json'],
  ['admin', 'caffeine', 'apps/admin/public/data/caffeine.json'],
]

const catalogs = sources.map(([application, type, relativePath]) => {
  const rows = JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'))
  const result = importLegacyCatalog(type, rows, {
    source: `${application}:${relativePath}`,
  })
  return { application, relativePath, ...result }
})

const byKey = new Map(catalogs.map((catalog) => [`${catalog.application}:${catalog.stats.type}`, catalog]))
const parity = ['cigar', 'tobacco', 'pipe', 'caffeine'].map((type) => {
  const publicSlugs = new Set(byKey.get(`public:${type}`).products.map((product) => product.slug))
  const adminSlugs = new Set(byKey.get(`admin:${type}`).products.map((product) => product.slug))
  return {
    type,
    publicOnly: [...publicSlugs].filter((slug) => !adminSlugs.has(slug)),
    adminOnly: [...adminSlugs].filter((slug) => !publicSlugs.has(slug)),
  }
})

const report = {
  generatedAt: new Date().toISOString(),
  success: catalogs.every((catalog) => catalog.success),
  catalogs: catalogs.map(({ application, relativePath, stats, warnings, errors }) => ({
    application,
    relativePath,
    stats,
    warningCodes: Object.fromEntries(
      [...new Set(warnings.map((warning) => warning.code))]
        .sort()
        .map((code) => [code, warnings.filter((warning) => warning.code === code).length]),
    ),
    warnings,
    errors,
  })),
  parity,
}

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
} else {
  for (const catalog of report.catalogs) {
    const { stats } = catalog
    console.log(
      `${catalog.application}/${stats.type}: ${stats.validRecords}/${stats.inputRecords} valid, ` +
        `${stats.variantCount} variants, ${stats.warningCount} warnings, ${stats.errorCount} errors`,
    )
    for (const [code, count] of Object.entries(catalog.warningCodes)) {
      console.log(`  ${code}: ${count}`)
    }
  }

  for (const comparison of parity) {
    if (comparison.publicOnly.length || comparison.adminOnly.length) {
      console.log(
        `parity/${comparison.type}: public-only=${comparison.publicOnly.join(',') || 'none'}; ` +
          `admin-only=${comparison.adminOnly.join(',') || 'none'}`,
      )
    }
  }
}

if (!report.success) process.exitCode = 1
