import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { storeWifiPassword } from '../api/wifi';
import { showError, showSuccess, showWarning } from '../utils/alerts';
import '../styles/pages.css';

function WiFiPasswordPage() {
  const [wifiPassword, setWifiPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!wifiPassword.trim()) {
      showWarning('Missing password', 'WiFi password is required.');
      return;
    }

    setLoading(true);
    try {
      await storeWifiPassword(wifiPassword);
      setWifiPassword('');
      showSuccess('Saved', 'WiFi password saved successfully.');
    } catch (saveError) {
      showError('Save failed', saveError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="WiFi Password" />

      <div className="page-content">
        <form className="form-card" onSubmit={handleSave}>
          <div className="form-field">
            <label htmlFor="wifi-password">WiFi password</label>
            <input
              id="wifi-password"
              type="password"
              value={wifiPassword}
              onChange={(event) => setWifiPassword(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </>
  );
}

export default WiFiPasswordPage;
