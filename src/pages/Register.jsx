import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage, getValidationMessages } from '../services/api.js';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/login', { replace: true, state: { notice: 'Account created successfully. Sign in to continue.' } });
    } catch (requestError) {
      const validation = getValidationMessages(requestError);
      setError(validation.length ? validation.join(' ') : getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/"><span className="brand-mark">T</span><span>taskflow</span></Link>
        <div className="auth-intro"><span className="eyebrow">GET STARTED</span><h1>Make room for focus.</h1><p>Create an account to organize your tasks.</p></div>
        <ErrorMessage message={error} />
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your name</label>
          <div className="input-icon"><UserRound size={17} /><input id="name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" /></div>
          <label htmlFor="email">Email address</label>
          <div className="input-icon"><Mail size={17} /><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div>
          <label htmlFor="password">Password</label>
          <div className="input-icon"><LockKeyhole size={17} /><input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></div>
          <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Creating account…</> : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
