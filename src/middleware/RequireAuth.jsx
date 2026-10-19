import { useUser } from '../contexts/UserProvider';
import { Navigate } from 'react-router-dom';
export default function RequireAuth({ children }) {
 const { user, loading } = useUser();
 if (loading) return <p role="status">Checking your session…</p>;
 return user.isLoggedIn ? children : <Navigate to="/login" replace />;
}
