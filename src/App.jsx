import './App.css';
import LibraryStyles from './components/LibraryStyles';
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from './contexts/UserProvider';
import RequireAuth from './middleware/RequireAuth';
import Login from './components/Login';
import Logout from './components/Logout';
import Books from './components/Books';
import { BookDetail } from './components/BookDetail';
import BookBorrow from './components/BookBorrow';
function App() {
 const { user } = useUser();
 return <><LibraryStyles /><header><Link className="brand" to="/books"><span className="brand-icon">▤</span> The Reading Room<span className="brand-sub">LIBRARY MANAGEMENT</span></Link>
 {user.isLoggedIn && <nav aria-label="Main navigation"><NavLink to="/books">Books</NavLink><NavLink to="/borrow">{user.role === 'ADMIN' ? 'Manage requests' : 'My borrowing'}</NavLink><span className="identity">{user.email} <b>{user.role}</b></span><Link to="/logout">Sign out</Link></nav>}</header>
 <main><Routes>
 <Route path="/login" element={<Login />} />
 <Route path="/logout" element={<RequireAuth><Logout /></RequireAuth>} />
 <Route path="/books" element={<RequireAuth><Books /></RequireAuth>} />
 <Route path="/books/:id" element={<RequireAuth><BookDetail /></RequireAuth>} />
 <Route path="/borrow" element={<RequireAuth><BookBorrow /></RequireAuth>} />
 <Route path="*" element={<Navigate to="/books" replace />} />
 </Routes></main><footer>The Reading Room <span>A place for your next chapter.</span></footer></>;
}
export default App;
