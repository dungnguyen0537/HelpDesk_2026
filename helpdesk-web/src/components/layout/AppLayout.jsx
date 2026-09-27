import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatbotWidget from '../chat/ChatbotWidget';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar automatically upon route navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Chặn hoàn toàn: Khách hàng / Người dùng tuyệt đối không được truy cập Console Quản trị kỹ thuật
  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar with mobile drawer support */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Content Body (Optimized for smooth scrolling on touch devices) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 overscroll-contain">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
