export const DATABASE_TOOLS = [
  { id: 'quality', title: 'Catalog Quality', description: 'Missing content, incomplete product details, and image references.' },
  { id: 'duplicates', title: 'Duplicates & Conflicts', description: 'Shared barcodes, matching names, and conflicting product data.' },
  { id: 'integrity', title: 'Data Integrity', description: 'Product relationships, repeated variants, and publication consistency.' },
  { id: 'health', title: 'Database Health', description: 'Connectivity, expected tables and views, and migration status.' },
  { id: 'permissions', title: 'Permissions', description: 'Capability roles and effective access for configured application logins.' },
  { id: 'history', title: 'Change History', description: 'Publications and product changes with before and after comparisons.' },
  { id: 'monitoring', title: 'Usage & Monitoring', description: 'Historical Neon compute consumption and usage trends.' },
];

export const SCAN_TOOLS = DATABASE_TOOLS.slice(0, 5).map(({ id }) => id);
export const AUDIT_ACTIONS = ['create', 'update', 'delete', 'publish', 'image_upload', 'image_delete'];
export const SUMMARY_KEY = 'emporium.database.summaries.v1';

export function rememberScan(tool, summary) {
  try {
    const summaries = JSON.parse(sessionStorage.getItem(SUMMARY_KEY) || '{}');
    sessionStorage.setItem(SUMMARY_KEY, JSON.stringify({ ...summaries, [tool]: summary }));
  } catch { /* Storage is optional; the tool still works when it is disabled. */ }
}

export function findingsCsv(findings) {
  const cell = (value) => {
    const text = String(value ?? '');
    return `"${(/^[\s]*[=+@-]/.test(text) ? "'" : '') + text.replaceAll('"', '""')}"`;
  };
  return [['Severity', 'Rule', 'Finding', 'Evidence', 'Product IDs', 'Slugs'], ...findings.map((finding) => [
    finding.severity, finding.rule, finding.title, finding.evidence,
    finding.products.map(({ id }) => id).join('; '), finding.products.map(({ slug }) => slug).join('; '),
  ])].map((row) => row.map(cell).join(',')).join('\r\n');
}
