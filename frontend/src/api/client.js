const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:2223/api';
const TOKEN_KEY = 'shop_handle_token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(collection, options = {}) {
  const response = await fetch(`${API_BASE}/${collection}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchCollection(collection) {
  return request(collection);
}

export function saveCollection(collection, data) {
  return request(collection, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export const COLLECTIONS = ['customers', 'bills', 'cashIn', 'cheques', 'users'];
