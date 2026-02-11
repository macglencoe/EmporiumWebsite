import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || 'Login failed.');
        setIsSubmitting(false);
        return;
      }

      const rawNext = typeof router.query.next === 'string' ? router.query.next : '/';
      const nextTarget = rawNext.startsWith('/') ? rawNext : '/';
      router.replace(nextTarget || '/');
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Head>
        <title>Login | King Street Emporium</title>
      </Head>
      <div className="login-card">
        <div className="login-header">
          <h1>King Street Emporium</h1>
          <p>Enter the site password to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            autoFocus
            required
          />
          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background: radial-gradient(circle at top, rgba(232, 168, 21, 0.35), transparent 60%),
            linear-gradient(135deg, #1c1616 0%, #4a3a2b 45%, #201918 100%);
        }

        .login-card {
          width: min(420px, 100%);
          background: rgba(255, 255, 255, 0.92);
          border-radius: 18px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }

        .login-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .login-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.4rem;
          color: #1c1616;
        }

        .login-header p {
          font-family: 'Inter';
          margin: 0;
          color: #4a3a2b;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .login-form label {
          font-size: 0.95rem;
          color: #1c1616;
        }

        .login-form input {
          padding: 0.75rem 1rem;
          border-radius: 999px;
          border: 1px solid #c9b39b;
          font-size: 1rem;
          font-family: 'Inter';
        }

        .login-form input:focus {
          outline: 2px solid #e8a915;
          outline-offset: 2px;
        }

        .login-form button {
          margin-top: 0.5rem;
          padding: 0.85rem 1rem;
          border-radius: 999px;
          border: none;
          background: #1c1616;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .login-form button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .login-form button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(28, 22, 22, 0.2);
        }

        .login-error {
          margin: 0;
          font-family: 'Inter';
          color: #b42318;
          background: rgba(180, 35, 24, 0.1);
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
