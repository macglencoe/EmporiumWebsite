export function getServerSideProps() {
  return { redirect: { destination: '/tools/database/monitoring/', permanent: false } };
}
export default function LegacyMonitoring() { return null; }
