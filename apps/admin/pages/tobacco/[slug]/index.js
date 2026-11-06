import AdminProductDetail from '../../../components/adminProductDetail';

export async function getServerSideProps({ params }) { const {readCatalog,legacyEnvelope}=await import('../../../lib/catalog/server.mjs');const record=(await readCatalog(['tobacco'])).map(legacyEnvelope).find((item)=>item.slug===params.slug);if(!record)return{notFound:true};return{props:{record}}; }
export default function Tobacco({record}) { return <AdminProductDetail record={record} type="tobacco" />; }
