import { apiPost } from './client';

export function login(email, password) {
  return apiPost('/login', { email, password });
}

export function authenticateWifiClient(payload) {
  return apiPost('/api/wifi-client-auth', payload);
}

export function storeWifiPassword(wifiPassword) {
  return apiPost('/api/store-wifi-password', { wifiPassword });
}
