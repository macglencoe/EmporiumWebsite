import Link from 'next/link';
import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';

export async function getServerSideProps({ params }) { const {readCatalog,legacyEnvelope}=await import('../../../lib/catalog/server.mjs');const record=(await readCatalog(['tobacco'])).map(legacyEnvelope).find((item)=>item.slug===params.slug);if(!record)return{notFound:true};return{props:{record}}; }
export default function Tobacco({record}){return <Layout><PageTitle1 subtitle={record.legacy['Tobacco Brand']}>{record.legacy['Tobacco Name']}</PageTitle1><p><Link href={`/tobacco/${record.slug}/edit`}>Edit</Link> · <Link href={`/tobacco/${record.slug}/delete`}>Delete</Link></p><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(record.legacy,null,2)}</pre></Layout>;}
