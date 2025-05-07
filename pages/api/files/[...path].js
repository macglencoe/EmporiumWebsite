// pages/api/files/[...path].js

const OWNER = 'macglencoe';
const REPO  = 'EmporiumWebsite';
const TOKEN = process.env.GITHUB_TOKEN;
const BASE  = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export default async function handler(req, res) {
  // Only allow GET and PUT
  if (req.method !== 'GET' && req.method !== 'PUT') {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Reconstruct the file path from the catch-all segments
  const segments = req.query.path || [];
  const filePath = segments.join('/');
  if (!filePath) {
    return res.status(400).json({ message: 'Missing file path' });
  }

  // === GET: proxy file contents ===
  if (req.method === 'GET') {
    try {
      const sha = req.query.sha;
      const url = `${BASE}/${encodeURIComponent(filePath)}${sha ? `?ref=${sha}` : ''}`;

      const ghRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: 'application/vnd.github.raw+json'
        }
      });

      if (!ghRes.ok) {
        const errorText = await ghRes.text();
        return res.status(ghRes.status).json({ message: errorText });
      }

      const raw = await ghRes.text();
      // if you know it’s JSON, parse it:
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        // if it’s not JSON, just return the raw text
        return res.status(200).send(raw);
      }
      return res.status(200).json(data);

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // === PUT: create or update file ===
  if (req.method === 'PUT') {
    try {
      const { content, message, branch = 'main' } = req.body;

      if (typeof content !== 'string' || !message) {
        return res.status(400).json({ message: 'content (string) and message are required' });
      }

      const url = `${BASE}/${encodeURIComponent(filePath)}?ref=${branch}`;

      // Fetch existing SHA (if the file exists)
      const getRes = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });

      let sha;
      if (getRes.ok) {
        const meta = await getRes.json();
        sha = meta.sha;
      }

      // Build commit payload
      const commitPayload = {
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        branch
      };
      if (sha) commitPayload.sha = sha;

      // Send the commit
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify(commitPayload)
      });

      const result = await putRes.json();
      if (!putRes.ok) {
        return res.status(putRes.status).json({ error: result });
      }

      return res.status(200).json({ message: 'Committed successfully', result });

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
