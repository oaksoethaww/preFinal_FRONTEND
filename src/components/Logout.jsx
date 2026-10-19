import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserProvider';
import { Navigate, Link } from 'react-router-dom';
export default function Logout() {
 const { user, logout } = useUser();
 const [error, setError] = useState('');
 useEffect(() => { logout().catch(e => setError(e.message)); }, [logout]);
 if (!user.isLoggedIn) return <Navigate to="/login" replace />;
 return error ? <p className="error" role="alert">{error} <Link to="/books">Back to books</Link></p> : <p role="status">Signing out…</p>;
}
