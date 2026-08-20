import Link from 'next/link';
import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';

export async function getServerSideProps({ params }) { const {readCatalog,legacyEnvelope}=await import('../../../lib/catalog/server.mjs');const record=(await readCatalog(['cigar'])).map(legacyEnvelope).find((item)=>item.slug===params.slug);if(!record)return{notFound:true};return{props:{record}}; }
export default function Cigar({record}){return <Layout><PageTitle1 subtitle={record.legacy['Cigar Brand']}>{record.legacy['Cigar Name']}</PageTitle1><p><Link href={`/cigars/${record.slug}/edit`}>Edit</Link> · <Link href={`/cigars/${record.slug}/delete`}>Delete</Link></p><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(record.legacy,null,2)}</pre></Layout>;}
