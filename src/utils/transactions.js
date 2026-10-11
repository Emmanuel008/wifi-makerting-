const STORAGE_KEY = 'wifi-payment-transactions';

export function getTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveTransaction(transaction) {
  const list = getTransactions();
  const index = list.findIndex((item) => item.transactionId === transaction.transactionId);
  if (index >= 0) {
    list[index] = { ...list[index], ...transaction, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({ ...transaction, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function updateTransaction(transactionId, updates) {
  const list = getTransactions();
  const index = list.findIndex((item) => item.transactionId === transactionId);
  if (index < 0) return list;
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
