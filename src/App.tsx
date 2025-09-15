import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Quotes from './pages/Dashboard/Quotes';
import Subscription from './pages/Dashboard/Subscription';
import ScaffoldForm from './pages/ScaffoldForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public form route */}
          <Route path="form/:storeId" element={<ScaffoldForm />} />
          
          {/* Dashboard routes */}
          <Route path="dashboard" element={<DashboardLayout />}>
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
}

export default App;