const FILTER_PATHS = {
  cigar: ['/cigars', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers'],
  tobacco: ['/tobacco', '/tobacco/brands', '/tobacco/components', '/tobacco/families'],
  pipe: ['/pipes', '/pipes/brands', '/pipes/materials', '/pipes/types'],
  caffeine: ['/caffeine', '/caffeine/origins', '/caffeine/roasts'],
};

export async function revalidatePublicSite(changes) {
  const siteUrl = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;
  if (!siteUrl || !secret) return { skipped: true };
  const paths = new Set(['/']);
  for (const change of changes) {
    for (const path of FILTER_PATHS[change.type] || []) paths.add(path);
    const route = change.type === 'cigar' ? 'cigars' : change.type === 'tobacco' ? 'tobacco' : null;
    if (route && change.oldSlug) paths.add(`/${route}/${change.oldSlug}`);
    if (route && change.newSlug) paths.add(`/${route}/${change.newSlug}`);
  }
  const response = await fetch(new URL('/api/revalidate', siteUrl), {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths: [...paths] }),
  });
  if (!response.ok) throw new Error(`Public revalidation failed with status ${response.status}`);
  return response.json();
}
