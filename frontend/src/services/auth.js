import { api } from './api';

export async function verifyAdminAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    return { authenticated: false, reason: 'missing-token' };
  }

  try {
    const result = await api.get('/auth/me');
    return { authenticated: Boolean(result?.authenticated), user: result?.user || null };
  } catch (error) {
    localStorage.removeItem('token');
    return { authenticated: false, reason: 'invalid-token', error };
  }
}

