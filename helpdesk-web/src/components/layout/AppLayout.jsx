import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatbotWidget from '../chat/ChatbotWidget';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout() {
  const { user } = useAuthStore();

  // Chặn hoàn toàn: Khách hàng / Người dùng tuyệt đối không được truy cập Console Quản trị kỹ thuật
  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
