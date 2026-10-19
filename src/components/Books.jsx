import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';
import { api } from '../contexts/UserContext';
export default function Books() {
 const { user } = useUser();
 const admin = user.role === 'ADMIN';
 const [books, setBooks] = useState([]);
 const [query, setQuery] = useState('');
 const [revision, setRevision] = useState(0);
 const [loading, setLoading] = useState(true);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 const [notice, setNotice] = useState('');
 const [creating, setCreating] = useState(false);
 useEffect(() => {
  let active = true;
  api(`/api/books?${query}`).then(data => { if (active) setBooks(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
 }, [query, revision]);
 function search(event) {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  setError(''); setLoading(true); setQuery(new URLSearchParams([...data.entries()].filter(([,value]) => value)).toString()); setRevision(v => v + 1);
 }
 async function create(event) {
  event.preventDefault(); setBusy(true); setError('');
  const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); data.quantity = Number(data.quantity);
  try { await api('/api/books', { method: 'POST', body: JSON.stringify(data) }); form.reset(); setCreating(false); setRevision(v => v + 1); setNotice('Book added to the collection.'); } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 return <><div className="page-heading"><div><p className="eyebrow">THE COLLECTION</p><h1>Find your next chapter.</h1><p className="muted">Browse, discover, and make room for a good book.</p></div>{admin && <button onClick={() => setCreating(!creating)}>{creating ? 'Close form' : '+ Add book'}</button>}</div>
 <div className="stats"><div><strong>{books.length}</strong><span>Books in this view</span></div><div><strong>{books.filter(b => b.status === 'ACTIVE' && b.quantity > 0).length}</strong><span>Available titles</span></div><div><strong>{admin ? 'Administrator' : 'Reader'}</strong><span>Your library access</span></div></div>
 {error && <p role="alert" className="error">{error}</p>}{notice && <p role="status" className="success">{notice}</p>}
 {admin && creating && <section className="panel"><h2>Add to the collection</h2><form onSubmit={create} className="form-grid"><label>Title<input name="title" required maxLength={300} /></label><label>Author<input name="author" required maxLength={300} /></label><label>Available quantity<input name="quantity" type="number" min="0" max="1000000" step="1" required /></label><label>Location<input name="location" required maxLength={300} placeholder="e.g. Shelf A-12" /></label><button disabled={busy}>{busy ? 'Saving…' : 'Create book'}</button></form></section>}
 <section className="panel"><div className="section-heading"><h2>Book catalogue</h2><span className="muted">{books.length} results</span></div><form className="search-form" onSubmit={search}><label>Title<input name="title" placeholder="Search by title" /></label><label>Author<input name="author" placeholder="Search by author" /></label>{admin && <label>Status<select name="status"><option value="">All books</option><option value="ACTIVE">Active</option><option value="DELETED">Deleted</option></select></label>}<button type="submit" className="secondary">Search</button></form>
 {loading ? <p role="status">Loading the collection…</p> : books.length === 0 ? <div className="empty"><h3>No books found</h3><p>Try a different search{admin ? ' or add the first book to your collection.' : '.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>Title / Author</th><th>Location</th><th>Available copies</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{books.map(book => <tr key={book._id}><td><Link className="book-title" to={`/books/${book._id}`}>{book.title}</Link><small>{book.author}</small></td><td>{book.location}</td><td>{book.quantity}</td><td><span className={`badge ${book.status === 'DELETED' ? 'gray' : ''}`}>{book.status === 'DELETED' ? 'Deleted' : book.quantity ? 'Available' : 'Out of stock'}</span></td><td><Link to={`/books/${book._id}`}>{admin ? 'Manage' : 'View book'} →</Link></td></tr>)}</tbody></table></div>}</section></>;
}
