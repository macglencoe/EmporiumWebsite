import crypto from 'crypto';

const COOKIE_NAME = 'emp_auth';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('base64url');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configuredPassword = process.env.SITE_PASSWORD;
  if (!configuredPassword) {
    return res.status(500).json({ error: 'SITE_PASSWORD is not configured.' });
  }

  const { password } = req.body || {};
  if (!password || password !== configuredPassword) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  const token = hashPassword(configuredPassword);
  const secureFlag = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ONE_WEEK_SECONDS};${secureFlag}`;

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ ok: true });
}
