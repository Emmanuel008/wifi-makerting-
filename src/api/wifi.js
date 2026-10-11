import { API_BASE } from './config';
import { parseResponse } from './client';

export function storeWifiPassword(wifiPassword) {
  return fetch(`${API_BASE}/store-wifi-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wifiPassword }),
  }).then(parseResponse);
}
