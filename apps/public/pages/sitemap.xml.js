const escapeXml = (value) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));

export async function getServerSideProps({ res }) {
  const { readPublicSitemapSlugs, PUBLIC_SITEMAP_CACHE_TAG } = await import('../lib/catalog/server.mjs');
  const products = await readPublicSitemapSlugs();
  const base = process.env.SITE_URL || 'https://kingstreetemporium.com';
  const staticPaths = ['/', '/cigars', '/tobacco', '/pipes', '/caffeine', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers', '/tobacco/brands', '/tobacco/components', '/tobacco/families'];
  const paths = [...staticPaths, ...products.map(({ type, slug }) => `/${type === 'cigar' ? 'cigars' : 'tobacco'}/${slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(`${base}${path}`)}</loc></url>`).join('')}</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=60');
  res.setHeader('Vercel-Cache-Tag', PUBLIC_SITEMAP_CACHE_TAG);
  res.write(body); res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
