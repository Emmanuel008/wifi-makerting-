import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  DURATION_TYPES,
  createBundle,
  deleteBundle,
  getBundleId,
  getBundles,
  updateBundle,
} from '../api/bundles';
import { showConfirm, showError, showSuccess, showWarning } from '../utils/alerts';
import '../styles/pages.css';

const DEFAULT_FORM = {
  amount: '1000',
  durationType: 'daily',
  duration: '1',
};

function formatDurationType(value) {
  return DURATION_TYPES.find((item) => item.value === value)?.label || value;
}

function WiFiBundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [amount, setAmount] = useState(DEFAULT_FORM.amount);
  const [durationType, setDurationType] = useState(DEFAULT_FORM.durationType);
  const [duration, setDuration] = useState(DEFAULT_FORM.duration);

  const isEditing = Boolean(editingBundleId);

  const loadBundles = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getBundles();
      setBundles(data);
    } catch (loadError) {
      showError('Failed to load bundles', loadError.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadBundles();
  }, [loadBundles]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingBundleId('');
    setAmount(DEFAULT_FORM.amount);
    setDurationType(DEFAULT_FORM.durationType);
    setDuration(DEFAULT_FORM.duration);
  }, []);

  useEffect(() => {
    if (!showModal) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !saving) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showModal, saving, closeModal]);

  const openCreateModal = () => {
    closeModal();
    setShowModal(true);
  };

  const openEditModal = (bundle) => {
    const bundleId = getBundleId(bundle);
    if (!bundleId) {
      showError('Update failed', 'This bundle has no ID.');
      return;
    }

    setEditingBundleId(bundleId);
    setAmount(String(bundle.amount ?? ''));
    setDurationType(bundle.durationType ?? bundle.duration_type ?? 'daily');
    setDuration(String(bundle.duration ?? '1'));
    setShowModal(true);
  };

  const closeModalIfIdle = () => {
    if (!saving) {
      closeModal();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const parsedDuration = Number(duration);

    if (!parsedAmount || parsedAmount <= 0) {
      showWarning('Invalid amount', 'Enter a valid amount.');
      return;
    }
    if (!parsedDuration || parsedDuration <= 0) {
      showWarning('Invalid duration', 'Enter a valid duration.');
      return;
    }

    const payload = {
      amount: parsedAmount,
      durationType,
      duration: parsedDuration,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await updateBundle(editingBundleId, payload);
        showSuccess('Bundle updated', 'The WiFi bundle was updated successfully.');
      } else {
        await createBundle(payload);
        showSuccess('Bundle created', 'The WiFi bundle was created successfully.');
      }

      closeModal();
      await loadBundles();
    } catch (submitError) {
      showError(isEditing ? 'Update failed' : 'Create failed', submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bundle) => {
    const bundleId = getBundleId(bundle);
    if (!bundleId) {
      showError('Delete failed', 'This bundle has no ID.');
      return;
    }

    const result = await showConfirm(
      'Delete bundle?',
      'This will deactivate the bundle. It will no longer appear in the captive portal.',
      'Delete'
    );

    if (!result.isConfirmed) return;

    setDeletingId(bundleId);
    try {
      await deleteBundle(bundleId);
      showSuccess('Bundle deleted', 'The WiFi bundle was deleted successfully.');
      await loadBundles();
    } catch (deleteError) {
      showError('Delete failed', deleteError.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <>
      <PageHeader title="WiFi Bundles" />

      <div className="page-content">
        <section className="section">
          <div className="section-header-row">
            <h2>Bundles</h2>
            <button type="button" className="btn-primary" onClick={openCreateModal}>
              Create
            </button>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Amount (TZS)</th>
                  <th>Duration type</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td colSpan={4}>Loading…</td>
                  </tr>
                ) : bundles.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No bundles yet.</td>
                  </tr>
                ) : (
                  bundles.map((bundle, index) => {
                    const bundleId = getBundleId(bundle);
                    const rowBusy = deletingId === bundleId;

                    return (
                      <tr key={bundleId || index}>
                        <td>{Number(bundle.amount ?? 0).toLocaleString()}</td>
                        <td>{formatDurationType(bundle.durationType ?? bundle.duration_type)}</td>
                        <td>{bundle.duration}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => openEditModal(bundle)}
                              disabled={rowBusy || saving}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn-danger"
                              onClick={() => handleDelete(bundle)}
                              disabled={rowBusy || saving}
                            >
                              {rowBusy ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModalIfIdle} role="presentation">
          <div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bundle-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="bundle-modal-title">{isEditing ? 'Edit bundle' : 'Create bundle'}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={closeModalIfIdle}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="bundle-amount">Amount (TZS)</label>
                <input
                  id="bundle-amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={saving}
                  required
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label htmlFor="bundle-duration-type">Duration type</label>
                <select
                  id="bundle-duration-type"
                  value={durationType}
                  onChange={(event) => setDurationType(event.target.value)}
                  disabled={saving}
                >
                  {DURATION_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="bundle-duration">Duration</label>
                <input
                  id="bundle-duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : isEditing ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModalIfIdle}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default WiFiBundlesPage;
