import DraftProductEditor from '../../../components/draftProductEditor';
import uiSchema from '../../../public/data/cigar.ui.schema.json';
import { buildCigarSuggestions } from '../../../utils/suggestions';

export async function getServerSideProps({ params }) {
  const { describeDraft, legacyEnvelope, readCatalog } = await import('../../../lib/catalog/server.mjs');
  const [draft, products] = await Promise.all([describeDraft(), readCatalog(['cigar'])]);
  const item = draft?.items.find((candidate) => candidate.id === params.id && candidate.operation === 'create' && candidate.payload?.type === 'cigar');
  if (!item) return { notFound: true };
  return { props: { item: JSON.parse(JSON.stringify(item)), catalog: products.map((product) => legacyEnvelope(product).legacy) } };
}

export default function EditStagedCigarPage(props) {
  return <DraftProductEditor {...props} type="cigar" uiSchema={uiSchema} buildSuggestions={buildCigarSuggestions} baseRoute="www.kingstreetemporium.com/cigars"/>;
}
