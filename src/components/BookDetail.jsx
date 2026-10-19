import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import { api } from '../contexts/UserContext';
export function BookDetail() {
 const { id } = useParams(); const navigate = useNavigate(); const { user } = useUser();
 const [book, setBook] = useState(null); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
 useEffect(() => { let active = true; api(`/api/books/${id}`).then(b => { if (active) setBook(b); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [id]);
 async function save(event) {
  event.preventDefault(); setBusy(true); setError(''); setNotice('');
  const data = Object.fromEntries(new FormData(event.currentTarget)); data.quantity = Number(data.quantity);
  try { setBook(await api(`/api/books/${id}`, { method: 'PATCH', body: JSON.stringify(data) })); setNotice('Book updated.'); } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 async function remove() {
  if (!window.confirm('Soft-delete this book? It will be hidden from readers.')) return;
  setBusy(true); setError('');
  try { await api(`/api/books/${id}`, { method: 'DELETE' }); navigate('/books'); } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 return <><Link className="back-link" to="/books">← Back to collection</Link>{error && <p className="error" role="alert">{error}</p>}{notice && <p className="success" role="status">{notice}</p>}{!book ? !error && <p role="status">Loading book…</p> : <section className="panel detail"><p className="eyebrow">BOOK DETAILS · {book.status}</p><h1>{book.title}</h1><p className="muted">by {book.author}</p>
 {user.role === 'ADMIN' && book.status === 'ACTIVE' ? <form className="form-grid" onSubmit={save} key={book._id}><label>Title<input name="title" defaultValue={book.title} required maxLength={300} /></label><label>Author<input name="author" defaultValue={book.author} required maxLength={300} /></label><label>Available quantity<input name="quantity" type="number" min="0" max="1000000" step="1" defaultValue={book.quantity} required /></label><label>Location<input name="location" defaultValue={book.location} required maxLength={300} /></label><div className="actions"><button disabled={busy}>Save changes</button><button type="button" className="danger" disabled={busy} onClick={remove}>Delete book</button></div></form> : <><dl><dt>Location</dt><dd>{book.location}</dd><dt>Available copies</dt><dd>{book.quantity}</dd></dl>{user.role === 'USER' && <Link className="button" to={`/borrow?bookId=${book._id}`}>Request this book →</Link>}</>}
 </section>}</>;
}
