import { CheckSquare2, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message?.includes('incomplete login response') ? requestError.message : getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/"><span className="brand-mark">T</span><span>taskflow</span></Link>
        <div className="auth-intro"><span className="eyebrow">WELCOME BACK</span><h1>Good to see you.</h1><p>Sign in to pick up where you left off.</p></div>
        <ErrorMessage message={error} />
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <div className="input-icon"><Mail size={17} /><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div>
          <label htmlFor="password">Password</label>
          <div className="input-icon"><LockKeyhole size={17} /><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></div>
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Signing in…</> : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New to Taskflow? <Link to="/register">Create an account</Link></p>
        <div className="auth-footnote"><CheckSquare2 size={15} /> Your tasks, all in one place.</div>
      </section>
    </main>
  );
}
