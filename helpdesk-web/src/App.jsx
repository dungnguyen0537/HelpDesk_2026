import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ReportsPage from './pages/ReportsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ProfilePage from './pages/ProfilePage';

// Customer Pages
import CustomerPortalPage from './pages/customer/CustomerPortalPage';
import CustomerTicketListPage from './pages/customer/CustomerTicketListPage';
import CustomerCreateTicketPage from './pages/customer/CustomerCreateTicketPage';
import CustomerFAQPage from './pages/customer/CustomerFAQPage';

import { ProtectedRoute, PublicRoute } from './routes/guards';
import { useAuthStore } from './store/authStore';

// Smart Root Redirect based on Role
function RootRedirect() {
  const { user } = useAuthStore();
  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/portal" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* 1. CUSTOMER PORTAL DEDICATED LAYOUT (User Portal) */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerPortalPage />} />
          <Route path="my-tickets" element={<CustomerTicketListPage />} />
          <Route path="create-ticket" element={<CustomerCreateTicketPage />} />
          <Route path="faq" element={<CustomerFAQPage />} />
        </Route>

        {/* 2. ADMIN & STAFF CONSOLE LAYOUT (Admin / Agent / Manager ONLY) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGENT']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Smart Redirect for Root */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootRedirect />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
