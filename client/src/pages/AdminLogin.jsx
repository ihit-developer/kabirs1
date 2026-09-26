import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthed, checking } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!checking && isAuthed) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="font-serif text-2xl font-bold">
            <span className="text-gold">Kabir's</span> Admin
          </h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage the restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg2 border border-white/10 rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          {error && <p className="text-red text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-bg font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <Link to="/" className="block text-center text-white/40 hover:text-gold text-sm mt-6">
          ← Back to Kabir's Restaurant
        </Link>
      </div>
    </div>
  );
}
