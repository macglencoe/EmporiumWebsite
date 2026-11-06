const escapeXml = (value) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));

export async function getServerSideProps({ res }) {
  const { readPublicCatalog } = await import('../lib/catalog/server.mjs');
  const [cigars, tobacco] = await Promise.all([readPublicCatalog('cigar'), readPublicCatalog('tobacco')]);
  const base = process.env.SITE_URL || 'https://kingstreetemporium.com';
  const staticPaths = ['/', '/cigars', '/tobacco', '/pipes', '/caffeine', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers', '/tobacco/brands', '/tobacco/components', '/tobacco/families'];
  const paths = [...staticPaths, ...cigars.map(({ slug }) => `/cigars/${slug}`), ...tobacco.map(({ slug }) => `/tobacco/${slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(`${base}${path}`)}</loc></url>`).join('')}</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.write(body); res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
