import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { extractPaymentStatus, getPaymentStatus } from '../api/payment';
import { getTransactions, updateTransaction } from '../utils/transactions';
import { showError, showSuccess } from '../utils/alerts';
import '../styles/pages.css';

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [refreshingId, setRefreshingId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadTransactions = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  const rangeStart = transactions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, transactions.length);

  const handleRefresh = async (transactionId) => {
    setRefreshingId(transactionId);
    try {
      const response = await getPaymentStatus(transactionId);
      const status = extractPaymentStatus(response);
      updateTransaction(transactionId, { status, statusResponse: response });
      loadTransactions();
      showSuccess('Status updated', `Current status: ${status || 'pending'}.`);
    } catch (refreshError) {
      showError('Refresh failed', refreshError.message);
    } finally {
      setRefreshingId('');
    }
  };

  return (
    <>
      <PageHeader title="Transactions" />

      <div className="page-content">
        <div className="data-table-wrap">
          <table className="data-table data-table--nowrap data-table--compact">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Provider</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8}>No transactions yet. Initiate a payment from Captive Portal.</td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => (
                  <tr key={txn.transactionId}>
                    <td>{txn.transactionId}</td>
                    <td>{txn.providerCode}</td>
                    <td>{txn.msisdn}</td>
                    <td>{txn.amount}</td>
                    <td>{txn.status || 'pending'}</td>
                    <td>{formatDate(txn.createdAt)}</td>
                    <td>{formatDate(txn.updatedAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        disabled={refreshingId === txn.transactionId}
                        onClick={() => handleRefresh(txn.transactionId)}
                      >
                        {refreshingId === txn.transactionId ? 'Checking…' : 'Refresh'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {transactions.length > 0 && (
          <div className="pagination">
            <p className="pagination-info">
              Showing {rangeStart}–{rangeEnd} of {transactions.length}
            </p>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="pagination-page">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TransactionsPage;
