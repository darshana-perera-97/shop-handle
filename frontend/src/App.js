import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import BillsPage from './pages/BillsPage';
import CashInPage from './pages/CashInPage';
import UsersPage from './pages/UsersPage';
import OverdueBillsPage from './pages/OverdueBillsPage';
import ChequesPage from './pages/ChequesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="cash-in" element={<CashInPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="overdue-bills" element={<OverdueBillsPage />} />
          <Route path="cheques" element={<ChequesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
