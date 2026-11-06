import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';

export async function getServerSideProps({ params }) {
  const { readCatalog, legacyEnvelope } = await import('../../../lib/catalog/server.mjs');
  const record = (await readCatalog(['cigar'])).map(legacyEnvelope).find((item) => item.slug === params.slug);
  if (!record) return { notFound: true };
  return { props: { record } };
}
export default function DeleteCigar({ record }) {
  const router = useRouter();
  async function stageDelete() { if (!confirm(`Stage deletion of ${record.legacy['Cigar Brand']} ${record.legacy['Cigar Name']}?`)) return; const response = await fetch('/api/catalog/draft', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ operation:'delete', productId:record.id }) }); if (!response.ok) { alert('Unable to stage deletion.'); return; } router.push('/submit'); }
  return <Layout><PageTitle1>Delete Cigar</PageTitle1><p>This deletion will remain a reversible draft until the change set is published.</p><pre>{JSON.stringify(record.legacy,null,2)}</pre><button onClick={stageDelete}>Stage deletion</button></Layout>;
}
