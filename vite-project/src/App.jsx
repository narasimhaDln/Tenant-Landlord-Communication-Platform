import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import Messages from './pages/Messages';
import Schedule from './pages/Schedule';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { MaintenanceProvider } from './context/MaintenanceContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  const token = localStorage.getItem('token');

  return (
    <MaintenanceProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Show sidebar only when token exists */}
            {token && <Sidebar />}
            
            <div className={token ? "ml-64" : ""}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/maintenance" element={
                  <ProtectedRoute>
                    <Maintenance />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/schedule" element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ChatProvider>
    </MaintenanceProvider>
  );
}

export default App;