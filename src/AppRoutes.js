import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import WiFiPasswordPage from './pages/WiFiPasswordPage';
import WiFiBundlesPage from './pages/WiFiBundlesPage';
import CaptivePortalPage from './pages/CaptivePortalPage';
import TransactionsPage from './pages/TransactionsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="wifi-password" element={<WiFiPasswordPage />} />
        <Route path="wifi-bundles" element={<WiFiBundlesPage />} />
        <Route path="captive-portal" element={<CaptivePortalPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
