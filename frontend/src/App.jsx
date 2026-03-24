import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import InvoicesPage from './pages/InvoicesPage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import RecoveryPage from './pages/RecoveryPage';
import CustomersPage from './pages/CustomersPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
