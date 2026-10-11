import { API_BASE } from './config';

export async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.message || data.error || data.detail || `Request failed (${response.status})`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export function authHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function apiGet(path) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.replace(/^\/api/, '')}`;
  return fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  }).then(parseResponse);
}

export function apiPost(path, body) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.replace(/^\/api/, '')}`;
  return fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(parseResponse);
}
