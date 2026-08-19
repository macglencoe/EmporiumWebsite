import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter(); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.message); return; }
      const destination = typeof router.query.next === 'string' && router.query.next.startsWith('/') && !router.query.next.startsWith('//') ? router.query.next : '/';
      await router.replace(destination);
    } catch { setMessage('Sign-in is temporarily unavailable.'); } finally { setBusy(false); }
  }
  return <main className="auth-page"><Head><title>Admin sign in | King Street Emporium</title><meta name="robots" content="noindex,nofollow" /></Head><form className="auth-card" onSubmit={submit}><h1>Admin sign in</h1><label htmlFor="username">Username</label><input id="username" value="store-admin" disabled autoComplete="username" /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required autoFocus />{message && <p role="alert">{message}</p>}<button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form><style jsx>{`.auth-page{min-height:100vh;display:grid;place-items:center;padding:1rem;background:#17120e}.auth-card{width:min(26rem,100%);display:grid;gap:.75rem;padding:2rem;background:#fff;border-radius:.5rem}.auth-card h1{margin:0 0 .5rem}.auth-card input,.auth-card button{font:inherit;padding:.75rem}.auth-card button{cursor:pointer}.auth-card p{color:#9b1c1c;margin:0}`}</style></main>;
}
