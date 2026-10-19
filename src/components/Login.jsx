import { useState } from 'react';
import { useUser } from '../contexts/UserProvider';
import { Navigate } from 'react-router-dom';
export default function Login() {
 const { user, loading, login } = useUser();
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 if (loading) return <p role="status">Checking your session…</p>;
 if (user.isLoggedIn) return <Navigate to="/books" replace />;
 async function submit(event) {
  event.preventDefault(); setBusy(true); setError('');
  const data = new FormData(event.currentTarget);
  try { await login(data.get('email'), data.get('password')); } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 return <section className="login-layout"><div className="welcome"><p className="eyebrow">YOUR LIBRARY, CONNECTED</p><h1>Every book opens<br />a new possibility.</h1><p>Explore the collection, plan your next read, and keep your borrowing in one place.</p><div className="book-art" aria-hidden="true"><i>THE ART<br />OF READING</i><i>WONDER<br />& WORDS</i><i>STORIES<br />TO KEEP</i></div></div>
 <div className="panel login-panel"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your library</h2><p className="muted">Use your library account to continue.</p><form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></label>{error && <p className="error" role="alert">{error}</p>}<button disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button></form><p className="hint">Test accounts<br />Admin: admin@test.com<br />User: user@test.com</p></div></section>;
}
