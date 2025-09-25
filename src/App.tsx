import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Quotes from './pages/Dashboard/Quotes';
import Subscription from './pages/Dashboard/Subscription';
import ScaffoldForm from './pages/ScaffoldForm';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const AppRoutes = () => {
  const { user, store, loading } = useAuth();

  // Auto redirect authenticated users to dashboard
  useEffect(() => {
    if (user && store && !loading && window.location.pathname === '/login') {
      window.location.href = '/dashboard';
    }
  }, [user, store, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            {/* Public form route */}
            <Route path="form/:storeId" element={<ScaffoldForm />} />
            
            {/* Protected dashboard routes */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;