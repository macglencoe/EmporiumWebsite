
import { withAuth } from '../../../lib/auth/server.mjs';

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      message: 'Method not allowed',
    });
  }

  const token = process.env.MONITORING_GITHUB_TOKEN;
  const repo = process.env.MONITORING_GITHUB_REPO;

  if (
    !token ||
    !/^[\w.-]+\/[\w.-]+$/.test(repo || '')
  ) {
    return res.status(503).json({
      message: 'Monitoring is not configured',
    });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/monitoring/neon-hourly.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.raw+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (
      !Array.isArray(data) ||
      !data.every(
        row =>
          typeof row.hour === 'string' &&
          Number.isFinite(row.compute_unit_hours) &&
          row.compute_unit_hours >= 0
      )
    ) {
      throw new Error('Invalid monitoring data');
    }

    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Monitoring fetch failed:', error.message);
    return res.status(502).json({
      message: 'Unable to load Neon monitoring history',
    });
  }
}

export default withAuth(handler);
