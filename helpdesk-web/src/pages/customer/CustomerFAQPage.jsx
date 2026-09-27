import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  PlusCircle,
  ExternalLink,
  Laptop,
  Wifi,
  FileCode2,
  KeyRound,
} from 'lucide-react';

export default function CustomerFAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(1);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const faqs = [
    {
      id: 1,
      category: 'Phần cứng',
      question: 'Máy in không nhận lệnh in trong mạng văn phòng thì xử lý thế nào?',
      answer: `Bước 1: Kiểm tra dây cáp mạng cắm vào máy in hoặc đảm bảo máy in đang kết nối đúng Wi-Fi công ty.\nBước 2: Mở Control Panel trên máy tính -> Devices and Printers -> Click chuột phải vào máy in chọn "See what's printing" -> Printer -> Bỏ chọn "Use Printer Offline".\nBước 3: Khởi động lại dịch vụ Print Spooler bằng cách ấn tổ hợp phím Windows + R, gõ "services.msc", tìm "Print Spooler" và bấm Restart.\nNếu vẫn không được, hãy nhấn "Gửi Yêu Cầu Mới" để kỹ thuật viên hỗ trợ kiểm tra IP tĩnh của máy in.`,
      views: 342,
    },
    {
      id: 2,
      category: 'Mạng',
      question: 'Cách cài đặt và đăng nhập VPN FortiClient để làm việc từ xa?',
      answer: `Bước 1: Tải bộ cài đặt FortiClient VPN chuẩn từ cổng nội bộ công ty.\nBước 2: Chọn "SSL-VPN", đặt tên kết nối là "Company-VPN".\nBước 3: Điền Remote Gateway là vpn.company.com kèm Port 443.\nBước 4: Nhập tài khoản và mật khẩu Active Directory của bạn để đăng nhập.\nLưu ý: Bạn cần có thông báo phê duyệt từ Trưởng bộ phận trước khi tài khoản được cấp quyền truy cập VPN.`,
      views: 890,
    },
    {
      id: 3,
      category: 'Tài khoản',
      question: 'Tôi bị khóa tài khoản máy tính do nhập sai mật khẩu quá 5 lần?',
      answer: `Theo chính sách an ninh thông tin, tài khoản sẽ tự động khóa trong vòng 15 phút sau 5 lần nhập sai liên tiếp.\nBạn có thể chờ hết 15 phút và thử lại bằng mật khẩu gần nhất, hoặc tạo phiếu yêu cầu loại "Tài khoản & Phân quyền" để bộ phận IT mở khóa ngay lập tức.`,
      views: 520,
    },
    {
      id: 4,
      category: 'Phần mềm',
      question: 'Hòm thư Outlook báo lỗi "Mailbox is full" không nhận được thư mới?',
      answer: `Nguyên nhân do dung lượng hộp thư của bạn đã vượt quá giới hạn 50GB.\nGiải pháp:\n1. Vào mục "Deleted Items" và "Junk Email" để dọn sạch thư rác.\n2. Chuyển các thư cũ trên 1 năm sang tệp lưu trữ nội bộ (.pst archive).\n3. Nếu cần mở rộng hạn mức hòm thư, vui lòng tạo phiếu hỗ trợ đính kèm phê duyệt của Quản lý bộ phận.`,
      views: 460,
    },
  ];

  const handleVote = (id) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cơ Sở Tri Thức & Giải Pháp Xử Lý Nhanh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Câu Hỏi Thường Gặp & Hướng Dẫn Kỹ Thuật
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Tra cứu cách khắc phục các vấn đề máy tính, mạng và phần mềm trước khi gửi yêu cầu hỗ trợ.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc từ khóa lỗi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {['ALL', 'Phần cứng', 'Mạng', 'Phần mềm', 'Tài khoản'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'Tất cả chủ đề' : cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : faq.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded mr-2">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base inline">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400 p-1 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 space-y-4 border-t border-slate-100">
                  <div className="whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl font-normal text-slate-700">
                    {faq.answer}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <span>{faq.views} người đã xem bài viết này</span>

                    <button
                      onClick={() => handleVote(faq.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        helpfulVotes[faq.id]
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{helpfulVotes[faq.id] ? 'Cảm ơn bạn đã đánh giá hữu ích!' : 'Hữu ích?'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Vẫn chưa tìm thấy cách giải quyết?</h3>
          <p className="text-xs text-slate-500">
            Đừng lo lắng! Hãy gửi ngay một phiếu yêu cầu và kỹ thuật viên sẽ liên hệ hỗ trợ bạn trực tiếp.
          </p>
        </div>

        <Link
          to="/portal/create-ticket"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gửi Yêu Cầu Trợ Giúp</span>
        </Link>
      </div>
    </div>
  );
}
