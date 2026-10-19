/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext, api } from './UserContext';
const guest = { isLoggedIn: false };
export function UserProvider({ children }) {
 const [user, setUser] = useState(guest);
 const [loading, setLoading] = useState(true);
 useEffect(() => {
  let active = true;
  api('/api/user/profile').then(profile => { if (active) setUser({ ...profile, isLoggedIn: true }); })
   .catch(() => { if (active) setUser(guest); }).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
 }, []);
 const login = async (email, password) => {
  const result = await api('/api/user/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setUser({ ...result.user, isLoggedIn: true });
 };
 const logout = useCallback(async () => {
  await api('/api/user/logout', { method: 'POST' });
  setUser(guest);
 }, []);
 return <UserContext.Provider value={{ user, loading, login, logout }}>{children}</UserContext.Provider>;
}
export function useUser() { return useContext(UserContext); }
