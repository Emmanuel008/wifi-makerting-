import { API_BASE } from './config';
import { parseResponse } from './client';

export function extractTransactionId(data) {
  if (!data || typeof data !== 'object') return null;
  return (
    data.transactionId ||
    data.transaction_id ||
    data.id ||
    data.data?.transactionId ||
    data.data?.transaction_id ||
    null
  );
}

export function extractPaymentStatus(data) {
  if (!data || typeof data !== 'object') return 'unknown';
  const status =
    data.status ||
    data.paymentStatus ||
    data.payment_status ||
    data.data?.status ||
    data.data?.paymentStatus ||
    'unknown';
  return String(status).toLowerCase();
}

export function initiatePayment({ bundleId, providerCode, msisdn }) {
  return fetch(`${API_BASE}/payment/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bundleId: Number(bundleId),
      providerCode,
      msisdn,
    }),
  }).then(parseResponse);
}

export function getPaymentStatus(transactionId) {
  return fetch(`${API_BASE}/payment/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId }),
  }).then(parseResponse);
}

export const PROVIDERS = [
  { code: 'YAS', label: 'Yas' },
  { code: 'VODACOM', label: 'Vodacom' },
  { code: 'HALOTEL', label: 'Halotel' },
  { code: 'AIRTEL', label: 'Airtel' },
];
