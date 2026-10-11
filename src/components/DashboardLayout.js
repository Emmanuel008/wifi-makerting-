import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/wifi-password', label: 'WiFi Password' },
  { to: '/dashboard/wifi-bundles', label: 'WiFi Bundles' },
  { to: '/dashboard/captive-portal', label: 'Captive Portal' },
  { to: '/dashboard/transactions', label: 'Transactions' },
  { to: '/dashboard/user-management', label: 'User Management' },
];

function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="dash-shell">
      <nav className="dash-navbar" aria-label="Main navigation">
        <div className="dash-navbar-header">
          <div className="dash-logo">WP</div>
          <div className="dash-brand-text">
            <span className="dash-brand">WiFi Payment</span>
            <span className="dash-brand-sub">Admin</span>
          </div>
        </div>

        <ul className="dash-navbar-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `dash-navbar-link${isActive ? ' dash-navbar-link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="dash-navbar-footer">
          <button type="button" className="dash-signout-btn" onClick={() => navigate('/login')}>
            Sign out
          </button>
        </div>
      </nav>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
