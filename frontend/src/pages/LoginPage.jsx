import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import CopyrightBar from '../components/CopyrightBar';
import useAuth from '../context/AuthContext';
import useShop from '../context/ShopContext';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const { shop } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-doc-bg font-sans">
        <p className="text-sm text-doc-muted">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-doc-bg font-sans">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-doc-primary text-lg font-bold text-white shadow-lg shadow-doc-primary/30">
              {shop.shortName}
            </div>
            <h1 className="text-2xl font-bold text-doc-navy">{shop.name}</h1>
            {shop.city ? (
              <p className="mt-1 text-sm font-medium text-doc-primary">{shop.city}</p>
            ) : null}
            <p className="mt-2 text-sm text-doc-muted">Sign in to manage your shop</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-doc-border/60 bg-white p-8 shadow-card"
          >
            <div className="mb-5">
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-doc-navy">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-doc-border/60 bg-doc-bg px-4 py-2.5 text-sm text-doc-navy outline-none transition-colors placeholder:text-doc-muted focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-doc-navy">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-doc-border/60 bg-doc-bg px-4 py-2.5 text-sm text-doc-navy outline-none transition-colors placeholder:text-doc-muted focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
                placeholder="Enter password"
              />
            </div>

            {error ? (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-doc-primary py-3 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition-colors hover:bg-doc-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      <CopyrightBar />
    </div>
  );
}
