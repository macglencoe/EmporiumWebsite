import { useRouter } from 'next/router';

export default function AuthControls() {
  const router = useRouter();
  if (router.pathname === '/login') return null;
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); await router.replace('/login'); }
  return <button type="button" onClick={logout} style={{ position: 'fixed', right: 12, top: 12, zIndex: 10000 }}>Log out</button>;
}
