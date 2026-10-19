import { createContext } from 'react';
export const UserContext = createContext();
export async function api(path, options = {}) {
 const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${path}`, {
  credentials: 'include', ...options,
  headers: { 'Content-Type': 'application/json', ...options.headers },
 });
 const data = await response.json().catch(() => ({}));
 if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
 return data;
}
