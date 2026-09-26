const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('kabir_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no body
  }
  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

function get(path) {
  return fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } }).then(handle);
}

function post(path, body) {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  }).then(handle);
}

function put(path, body) {
  return fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  }).then(handle);
}

function del(path) {
  return fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: { ...authHeaders() } }).then(handle);
}

export const api = { get, post, put, del, API_BASE };
