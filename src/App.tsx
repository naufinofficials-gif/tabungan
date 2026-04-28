import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { MemberRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Plans from './pages/Plans';

// Member pages
import MemberDashboard from './pages/member/Dashboard';
import MemberDeposit from './pages/member/Deposit';
import MemberReinvest from './pages/member/Reinvest';
import MemberWithdraw from './pages/member/Withdraw';
import MemberReferral from './pages/member/Referral';
import MemberBank from './pages/member/Bank';
import MemberProfile from './pages/member/Profile';
import MemberPassword from './pages/member/Password';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDeposits from './pages/admin/Deposits';
import AdminWithdrawals from './pages/admin/Withdrawals';
import AdminPlans from './pages/admin/Plans';
import AdminReferral from './pages/admin/Referral';
import AdminBank from './pages/admin/Bank';
import AdminProfile from './pages/admin/Profile';
import AdminPassword from './pages/admin/Password';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plans" element={<Plans />} />

            {/* Member */}
            <Route path="/member" element={<MemberRoute><MemberDashboard /></MemberRoute>} />
            <Route path="/member/deposit" element={<MemberRoute><MemberDeposit /></MemberRoute>} />
            <Route path="/member/reinvest" element={<MemberRoute><MemberReinvest /></MemberRoute>} />
            <Route path="/member/withdraw" element={<MemberRoute><MemberWithdraw /></MemberRoute>} />
            <Route path="/member/referral" element={<MemberRoute><MemberReferral /></MemberRoute>} />
            <Route path="/member/bank" element={<MemberRoute><MemberBank /></MemberRoute>} />
            <Route path="/member/profile" element={<MemberRoute><MemberProfile /></MemberRoute>} />
            <Route path="/member/password" element={<MemberRoute><MemberPassword /></MemberRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/deposits" element={<AdminRoute><AdminDeposits /></AdminRoute>} />
            <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
            <Route path="/admin/plans" element={<AdminRoute><AdminPlans /></AdminRoute>} />
            <Route path="/admin/referral" element={<AdminRoute><AdminReferral /></AdminRoute>} />
            <Route path="/admin/bank" element={<AdminRoute><AdminBank /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
            <Route path="/admin/password" element={<AdminRoute><AdminPassword /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
