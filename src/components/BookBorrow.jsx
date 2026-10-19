import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../contexts/UserContext';
import { useUser } from '../contexts/UserProvider';
export default function BookBorrow() {
 const { user } = useUser(); const admin = user.role === 'ADMIN'; const [search] = useSearchParams();
 const [requests, setRequests] = useState([]); const [books, setBooks] = useState([]); const [revision, setRevision] = useState(0);
 const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true);
 useEffect(() => {
  let active = true;
  Promise.all([api('/api/borrow'), admin ? Promise.resolve([]) : api('/api/books')]).then(([r,b]) => { if (active) { setRequests(r); setBooks(b); } }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
 }, [revision, admin]);
 async function submit(event) {
  event.preventDefault(); setBusy(true); setError(''); setNotice('');
  try {
   const data = Object.fromEntries(new FormData(event.currentTarget));
   const request = await api('/api/borrow', { method: 'POST', body: JSON.stringify(data) });
   setNotice(request.status === 'INIT' ? 'Request submitted for administrator review.' : 'Request closed: no copies are currently available.'); setRevision(v => v + 1);
  } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 async function update(id, status) {
  setBusy(true); setError(''); setNotice('');
  try { const r = await api('/api/borrow', { method: 'PATCH', body: JSON.stringify({ id, status }) }); setNotice(`Request updated: ${r.status}`); setRevision(v => v + 1); } catch (e) { setError(e.message); } finally { setBusy(false); }
 }
 return <><div className="page-heading"><div><p className="eyebrow">BORROWING DESK</p><h1>{admin ? 'Manage book requests.' : 'Your next read awaits.'}</h1><p className="muted">{admin ? 'Review requests and manage copy availability.' : 'Choose a book and a pickup date. We’ll take it from there.'}</p></div><Link to="/books">Browse collection →</Link></div>
 {error && <p className="error" role="alert">{error}</p>}{notice && <p className="success" role="status">{notice}</p>}
 {!admin && <section className="panel"><h2>Request a book</h2><form className="search-form" onSubmit={submit}><label>Book<select name="bookId" required defaultValue={search.get('bookId') || ''} key={books.length}><option value="">Select a book</option>{books.map(b => <option key={b._id} value={b._id}>{b.title} — {b.quantity} available</option>)}</select></label><label>Pickup date<input name="targetDate" type="date" min={new Date().toISOString().slice(0,10)} required /></label><button disabled={busy || !books.length}>Submit request</button></form><p className="hint">One copy per request. Your request reserves a copy when an administrator accepts it. Cancelling an accepted request returns that copy.</p></section>}
 <section className="panel"><div className="section-heading"><h2>{admin ? 'All borrowing requests' : 'My requests'}</h2><span className="muted">{requests.length} requests</span></div>{loading ? <p role="status">Loading requests…</p> : requests.length === 0 ? <div className="empty"><h3>No requests yet</h3><p>{admin ? 'Reader requests will appear here.' : 'Pick a book to start your next chapter.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>Book{admin ? ' / Reader' : ''}</th><th>Submitted</th><th>Pickup date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{requests.map(r => <tr key={r._id}><td><strong>{r.bookTitle}</strong>{admin && <small>{r.userEmail}</small>}</td><td>{new Date(r.createdAt).toLocaleDateString()}</td><td>{r.targetDate}</td><td><span className={`badge ${r.status.startsWith('CANCEL') || r.status.startsWith('CLOSE') ? 'gray' : ''}`}>{r.status}</span></td><td><div className="actions">{r.status === 'INIT' && admin && <><button disabled={busy} onClick={() => update(r._id,'ACCEPTED')}>Accept</button><button className="secondary" disabled={busy} onClick={() => update(r._id,'CLOSE-NO-AVAILABLE-BOOK')}>No copies</button></>}{['INIT','ACCEPTED'].includes(r.status) && <button className="danger" disabled={busy} onClick={() => update(r._id, admin ? 'CANCEL-ADMIN' : 'CANCEL-USER')}>Cancel</button>}{!['INIT','ACCEPTED'].includes(r.status) && <span className="muted">Closed</span>}</div></td></tr>)}</tbody></table></div>}</section></>;
}
