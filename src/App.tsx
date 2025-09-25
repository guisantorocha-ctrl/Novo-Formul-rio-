import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Quotes from './pages/Dashboard/Quotes';
import Subscription from './pages/Dashboard/Subscription';
import ScaffoldForm from './pages/ScaffoldForm';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;