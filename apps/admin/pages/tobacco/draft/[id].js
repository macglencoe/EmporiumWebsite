import DraftProductEditor from '../../../components/draftProductEditor';
import uiSchema from '../../../public/data/tobacco.ui.schema.json';
import { buildTobaccoSuggestions } from '../../../utils/suggestions';

export async function getServerSideProps({ params }) {
  const { describeDraft, legacyEnvelope, readCatalog } = await import('../../../lib/catalog/server.mjs');
  const [draft, products] = await Promise.all([describeDraft(), readCatalog(['tobacco'])]);
  const item = draft?.items.find((candidate) => candidate.id === params.id && candidate.operation === 'create' && candidate.payload?.type === 'tobacco');
  if (!item) return { notFound: true };
  return { props: { item: JSON.parse(JSON.stringify(item)), catalog: products.map((product) => legacyEnvelope(product).legacy) } };
}

export default function EditStagedTobaccoPage(props) {
  return <DraftProductEditor {...props} type="tobacco" uiSchema={uiSchema} buildSuggestions={buildTobaccoSuggestions} slugFields={['Tobacco Name']} baseRoute="www.kingstreetemporium.com/tobacco"/>;
}
