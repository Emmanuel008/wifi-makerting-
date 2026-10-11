import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  PROVIDERS,
  extractPaymentStatus,
  extractTransactionId,
  getPaymentStatus,
  initiatePayment,
} from '../api/payment';
import {
  formatBundleLabel,
  getBundleId,
  getBundles,
} from '../api/bundles';
import { saveTransaction, updateTransaction } from '../utils/transactions';
import { showError, showInfo, showSuccess, showWarning } from '../utils/alerts';
import '../styles/pages.css';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

function isTerminalStatus(status) {
  const value = status.toLowerCase();
  return ['success', 'successful', 'completed', 'paid', 'failed', 'cancelled', 'canceled', 'rejected', 'expired'].includes(value);
}

function isSuccessStatus(status) {
  const value = status.toLowerCase();
  return ['success', 'successful', 'completed', 'paid'].includes(value);
}

function CaptivePortalPage() {
  const [bundles, setBundles] = useState([]);
  const [loadingBundles, setLoadingBundles] = useState(true);
  const [selectedBundleId, setSelectedBundleId] = useState('');
  const [providerCode, setProviderCode] = useState('VODACOM');
  const [msisdn, setMsisdn] = useState('');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [activeTransactionId, setActiveTransactionId] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  const selectedBundle = useMemo(
    () => bundles.find((item) => getBundleId(item) === selectedBundleId),
    [bundles, selectedBundleId]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBundles() {
      setLoadingBundles(true);
      try {
        const data = await getBundles();
        if (cancelled) return;

        const withIds = data.filter((bundle) => getBundleId(bundle));
        setBundles(withIds);
        if (withIds.length > 0) {
          setSelectedBundleId(getBundleId(withIds[0]));
        }
      } catch (loadError) {
        if (!cancelled) {
          showError('Failed to load bundles', loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingBundles(false);
        }
      }
    }

    loadBundles();
    return () => {
      cancelled = true;
    };
  }, []);

  const pollStatus = async (transactionId) => {
    setPolling(true);
    setActiveTransactionId(transactionId);

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      try {
        const statusResponse = await getPaymentStatus(transactionId);
        const status = extractPaymentStatus(statusResponse);
        setActiveStatus(status);
        updateTransaction(transactionId, { status, statusResponse });

        if (isTerminalStatus(status)) {
          if (isSuccessStatus(status)) {
            showSuccess('Payment complete', `Payment ${status}.`);
          } else {
            showError('Payment failed', `Payment ${status}.`);
          }
          setPolling(false);
          return;
        }
      } catch (pollError) {
        showError('Status check failed', pollError.message);
        setPolling(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    showInfo('Still waiting', 'Payment confirmation is pending. Check Transactions for updates.');
    setPolling(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActiveStatus('');
    setActiveTransactionId('');

    const phone = msisdn.trim();

    if (!selectedBundle || !selectedBundleId) {
      showWarning('No bundle selected', 'Select a WiFi bundle to continue.');
      return;
    }
    if (!phone) {
      showWarning('Missing phone number', 'Phone number is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await initiatePayment({
        bundleId: selectedBundleId,
        providerCode,
        msisdn: phone,
      });

      const transactionId = extractTransactionId(response);
      if (!transactionId) {
        throw new Error('No transaction ID returned from payment API.');
      }

      const status = extractPaymentStatus(response);
      const bundleAmount = Number(selectedBundle.amount ?? response.amount ?? 0);

      saveTransaction({
        transactionId,
        providerCode,
        amount: bundleAmount,
        msisdn: phone,
        bundleId: selectedBundleId,
        bundleLabel: formatBundleLabel(selectedBundle),
        status: status || 'pending',
        initiateResponse: response,
      });

      showInfo('Payment initiated', 'Complete the prompt on your phone.');
      setActiveTransactionId(transactionId);
      setActiveStatus(status || 'pending');

      if (!isTerminalStatus(status || 'pending')) {
        await pollStatus(transactionId);
      } else if (isSuccessStatus(status)) {
        showSuccess('Payment complete', `Payment ${status}.`);
      } else {
        showError('Payment failed', `Payment ${status}.`);
      }
    } catch (submitError) {
      showError('Payment failed', submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Captive Portal" />

      <div className="page-content">
        <p className="page-note">
          Collect payment via LipaHuru by bundle. The customer receives a mobile money prompt on their phone.
        </p>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="bundle">WiFi bundle</label>
            <select
              id="bundle"
              value={selectedBundleId}
              onChange={(event) => setSelectedBundleId(event.target.value)}
              disabled={loading || polling || loadingBundles || bundles.length === 0}
              required
            >
              {loadingBundles ? (
                <option value="">Loading bundles…</option>
              ) : bundles.length === 0 ? (
                <option value="">No active bundles</option>
              ) : (
                bundles.map((bundle) => {
                  const bundleId = getBundleId(bundle);
                  return (
                    <option key={bundleId} value={bundleId}>
                      {formatBundleLabel(bundle)}
                    </option>
                  );
                })
              )}
            </select>
            {selectedBundle && (
              <p className="field-hint">
                Amount: {Number(selectedBundle.amount ?? 0).toLocaleString()} TZS (from bundle)
              </p>
            )}
            {!loadingBundles && bundles.length === 0 && (
              <p className="field-hint">Create bundles from the WiFi Bundles page first.</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="provider">Mobile provider</label>
            <select
              id="provider"
              value={providerCode}
              onChange={(event) => setProviderCode(event.target.value)}
              disabled={loading || polling}
            >
              {PROVIDERS.map((provider) => (
                <option key={provider.code} value={provider.code}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="msisdn">Phone number (msisdn)</label>
            <input
              id="msisdn"
              type="tel"
              placeholder="255754123456"
              value={msisdn}
              onChange={(event) => setMsisdn(event.target.value)}
              disabled={loading || polling}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || polling || loadingBundles || bundles.length === 0}
          >
            {loading ? 'Initiating…' : polling ? 'Waiting for payment…' : 'Initiate payment'}
          </button>
        </form>

        {activeTransactionId && (
          <div className="status-box">
            <p><strong>Transaction ID:</strong> {activeTransactionId}</p>
            <p><strong>Status:</strong> {activeStatus || 'pending'}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default CaptivePortalPage;
