import React, { useState } from 'react';
import { Search, BookOpen, ThumbsUp, ChevronRight, FileText, HelpCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { title: 'Mạng & Truy Cập VPN', count: 18, desc: 'Hướng dẫn kết nối mạng wifi nội bộ, remote VPN công ty' },
    { title: 'Email & Ứng Dụng Office', count: 24, desc: 'Cấu hình Outlook, Microsoft 365, lưu trữ OneDrive' },
    { title: 'Máy In & Thiết Bị Ngoại Vi', count: 12, desc: 'Kết nối máy in qua IP mạng, máy scan tài liệu hợp đồng' },
    { title: 'Tài Khoản & Mật Khẩu', count: 31, desc: 'Tự khôi phục mật khẩu tài khoản Domain, kích hoạt 2FA' },
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'Hướng dẫn cài đặt và cấu hình OpenVPN trên máy tính Windows 11',
      category: 'Mạng & Truy Cập VPN',
      views: 1420,
      likes: 98,
      updated: '3 ngày trước',
    },
    {
      id: 2,
      title: 'Cách xử lý khi Microsoft Outlook báo trạng thái "Disconnected"',
      category: 'Email & Ứng Dụng Office',
      views: 890,
      likes: 64,
      updated: '1 tuần trước',
    },
    {
      id: 3,
      title: 'Hướng dẫn map ổ đĩa chia sẻ nội bộ NAS (Z:) cho phòng Kế toán',
      category: 'Mạng & Truy Cập VPN',
      views: 654,
      likes: 42,
      updated: '2 tuần trước',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-slate-900 rounded-2xl p-8 text-center text-white shadow-md">
        <h1 className="text-2xl font-bold">Trung Tâm Tri Thức & Giải Pháp Kỹ Thuật</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
          Tra cứu nhanh tài liệu hướng dẫn khắc phục sự cố thông thường trước khi mở yêu cầu hỗ trợ
        </p>

        <div className="max-w-xl mx-auto mt-6 relative">
          <input
            type="text"
            placeholder="Nhập câu hỏi, mã lỗi hoặc từ khóa hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg placeholder-slate-400"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <Card key={idx} className="hover:border-primary-500 cursor-pointer transition-all">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">{cat.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.desc}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary-600 font-medium">
              <span>{cat.count} bài viết</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        ))}
      </div>

      {/* Popular Articles */}
      <Card
        title="Bài Viết Được Xem Nhiều Nhất"
        subtitle="Tổng hợp các hướng dẫn khắc phục sự cố phổ biến"
      >
        <div className="divide-y divide-slate-100">
          {popularArticles.map((art) => (
            <div
              key={art.id}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 hover:text-primary-600">
                    {art.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span>{art.views} lượt xem</span>
                    <span>•</span>
                    <span>Cập nhật {art.updated}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{art.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
