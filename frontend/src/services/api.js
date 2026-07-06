const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function handleAuthFailure(message) {
  const normalized = String(message || '').toLowerCase();
  if (normalized.includes('invalid token') || normalized.includes('not authorized') || normalized.includes('admin access required')) {
    if (!window.__authTokenAlertShown) {
      window.__authTokenAlertShown = true;
      alert('Your admin session has expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      setTimeout(() => {
        window.__authTokenAlertShown = false;
      }, 1000);
    }
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  if (import.meta.env.DEV) {
    console.debug('[API request]', `${BASE_URL}${path}`, {
      method: options.method || 'GET',
      hasBody: Boolean(options.body)
    });
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (import.meta.env.DEV) {
      console.error('[API response error]', `${BASE_URL}${path}`, {
        status: response.status,
        body: data
      });
    }
    handleAuthFailure(data?.message);
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' })
};
