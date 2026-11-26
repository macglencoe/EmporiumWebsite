import journal from '../../../../../../packages/database/migrations/meta/_journal.json';

import { withAuth } from '../../../../lib/auth/server.mjs';
import { SCAN_TOOLS } from '../../../../lib/database/tools.mjs';
import { parseHistoryQuery, readHistory, scanCatalog, scanHealth, scanPermissions, summarizeScan } from '../../../../lib/database/server.mjs';

export async function databaseToolHandler(req, res) {
  const { tool } = req.query;
  if (![...SCAN_TOOLS, 'history'].includes(tool)) return res.status(404).json({ message: 'Database tool not found.' });
  const method = tool === 'history' ? 'GET' : 'POST';
  if (req.method !== method) {
    res.setHeader('Allow', method);
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  let filters;
  if (tool === 'history') {
    try { filters = parseHistoryQuery(req.query); } catch { return res.status(400).json({ message: 'Invalid history filters or cursor.' }); }
  }
  try {
    if (tool === 'history') return res.status(200).json(await readHistory(filters));
    const result = tool === 'health' ? await scanHealth(journal.entries) : tool === 'permissions' ? await scanPermissions() : await scanCatalog(tool);
    result.checkedAt = new Date().toISOString();
    return res.status(200).json({ ...result, summary: summarizeScan(result) });
  } catch {
    // Database error text can contain connection details; keep it server-side.
    return res.status(503).json({ message: 'The database tool could not complete. Check database connectivity and the configured role’s access, then retry.' });
  }
}

export default withAuth(databaseToolHandler);
