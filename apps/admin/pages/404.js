import Link from 'next/link';

import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';

export default function NotFound() {
  return <Layout>
    <PageTitle1 subtitle="The requested admin page does not exist">Page not found</PageTitle1>
    <p><Link href="/"><a>Return to the admin dashboard</a></Link></p>
  </Layout>;
}
