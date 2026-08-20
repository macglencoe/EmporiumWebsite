import Link from 'next/link';
import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';

export async function getServerSideProps() {
  const { readCatalog, describeDraft } = await import('../lib/catalog/server.mjs');
  const [catalog,draft]=await Promise.all([readCatalog(['cigar','tobacco']),describeDraft()]);
  return { props: { cigarCount:catalog.filter((item)=>item.type==='cigar').length,tobaccoCount:catalog.filter((item)=>item.type==='tobacco').length,draftCount:draft?.items?.length||0 } };
}
export default function AdminHome({ cigarCount,tobaccoCount,draftCount }) {
  return <Layout><PageTitle1 subtitle="Neon-backed catalog administration">Store Admin</PageTitle1><div style={{display:'grid',gap:16,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}><section><h2>Cigars</h2><p>{cigarCount} products</p><Link href="/cigars">Open catalog</Link> · <Link href="/cigars/add">Add cigar</Link></section><section><h2>Tobacco</h2><p>{tobaccoCount} products</p><Link href="/tobacco">Open catalog</Link> · <Link href="/tobacco/add">Add tobacco</Link></section><section><h2>Draft changes</h2><p>{draftCount} staged change(s)</p><Link href="/submit">Review and publish</Link></section><section><h2>Tools</h2><Link href="/cigars/barcodeSearch">Barcode search</Link> · <Link href="/export">Export</Link></section></div></Layout>;
}
