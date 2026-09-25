import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ShopProvider } from './context/ShopContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import BillsPage from './pages/BillsPage';
import CashInPage from './pages/CashInPage';
import UsersPage from './pages/UsersPage';
import OverdueBillsPage from './pages/OverdueBillsPage';
import ChequesPage from './pages/ChequesPage';
import IntegrationsPage from './pages/IntegrationsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <AppDataProvider>
                    <AppLayout />
                  </AppDataProvider>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="bills" element={<BillsPage />} />
                <Route path="cash-in" element={<CashInPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="overdue-bills" element={<OverdueBillsPage />} />
                <Route path="cheques" element={<ChequesPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
