import { API_BASE } from './config';
import { authHeaders, parseResponse } from './client';

export const DURATION_TYPES = [
  { value: 'hourly', label: 'Hourly', unit: 'hour' },
  { value: 'daily', label: 'Daily', unit: 'day' },
  { value: 'weekly', label: 'Weekly', unit: 'week' },
  { value: 'monthly', label: 'Monthly', unit: 'month' },
];

export function normalizeBundlesList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.bundles)) return data.bundles;
  return [];
}

export function getBundleId(bundle) {
  const id = bundle?.id ?? bundle?._id ?? bundle?.bundleId ?? bundle?.bundle_id;
  return id != null && id !== '' ? String(id) : '';
}

export function getDurationTypeMeta(value) {
  return DURATION_TYPES.find((item) => item.value === value) || DURATION_TYPES[1];
}

export function formatDurationText(duration, durationType) {
  const meta = getDurationTypeMeta(durationType);
  const count = Number(duration) || 1;
  const unit = count === 1 ? meta.unit : `${meta.unit}s`;
  return `${count} ${unit}`;
}

export function formatBundleLabel(bundle) {
  const amount = Number(bundle?.amount ?? 0);
  const durationType = bundle?.durationType ?? bundle?.duration_type ?? 'daily';
  const duration = bundle?.duration ?? 1;
  return `${amount.toLocaleString()} TZS — ${formatDurationText(duration, durationType)}`;
}

export function createBundle({ amount, durationType, duration }) {
  return fetch(`${API_BASE}/bundles`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ amount, durationType, duration }),
  }).then(parseResponse);
}

export function updateBundle(bundleId, { amount, durationType, duration }) {
  return fetch(`${API_BASE}/bundles/${bundleId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ amount, durationType, duration }),
  }).then(parseResponse);
}

export function deleteBundle(bundleId) {
  return fetch(`${API_BASE}/bundles/${bundleId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(parseResponse);
}

export function getBundles() {
  return fetch(`${API_BASE}/bundles`, {
    method: 'GET',
    headers: authHeaders(),
  })
    .then(parseResponse)
    .then(normalizeBundlesList);
}
