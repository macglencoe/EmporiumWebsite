import AdminProductDetail from '../../../components/adminProductDetail';

export async function getServerSideProps({ params }) { const {readCatalog,legacyEnvelope}=await import('../../../lib/catalog/server.mjs');const record=(await readCatalog(['cigar'])).map(legacyEnvelope).find((item)=>item.slug===params.slug);if(!record)return{notFound:true};return{props:{record}}; }
export default function Cigar({record}) { return <AdminProductDetail record={record} type="cigar" />; }
