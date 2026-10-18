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
  FileText,
  Eye,
  User,
  Calendar,
  X,
  Share2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useKnowledgeStore } from '../../store/knowledgeStore';

export default function CustomerFAQPage() {
  const {
    articles,
    categories: kbCategories,
    voteArticle,
    incrementViews,
    votedArticles,
  } = useKnowledgeStore();

  const [activeTab, setActiveTab] = useState('KB'); // 'KB' | 'FAQ'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(1);
  const [helpfulFaqVotes, setHelpfulFaqVotes] = useState({});
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || null;

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

  const handleVoteFaq = (id) => {
    setHelpfulFaqVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenArticle = (art) => {
    incrementViews(art.id);
    setSelectedArticleId(art.id);
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
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
          Cẩm Nang Hướng Dẫn & Câu Hỏi Thường Gặp
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Tra cứu cách tự khắc phục các vấn đề máy tính, mạng và phần mềm trước khi gửi yêu cầu hỗ trợ.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm cẩm nang kỹ thuật, từ khóa lỗi (VPN, Outlook, Máy in...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setActiveTab('KB');
              setSelectedCategory('ALL');
            }}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'KB'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cẩm Nang Kỹ Thuật ({articles.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('FAQ');
              setSelectedCategory('ALL');
            }}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'FAQ'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Câu Hỏi Thường Gặp ({faqs.length})</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      {activeTab === 'KB' ? (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất Cả ({articles.length})
          </button>
          {kbCategories.map((cat) => {
            const count = articles.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>
      ) : (
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
      )}

      {/* TAB 1: KNOWLEDGE BASE ARTICLES */}
      {activeTab === 'KB' && (
        <div className="space-y-3">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-3">
                        <span className="font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                          {art.categoryName}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{art.views} lượt xem</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{art.likes} hữu ích</span>
                        </span>
                        <span>Cập nhật: {art.updated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center flex items-center space-x-2 text-primary-600 font-semibold text-xs flex-shrink-0">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Không tìm thấy cẩm nang phù hợp</div>
              <p className="text-xs text-slate-400">
                Không tìm thấy tài liệu nào khớp với từ khóa "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAQ ACCORDION LIST */}
      {activeTab === 'FAQ' && (
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
                        onClick={() => handleVoteFaq(faq.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          helpfulFaqVotes[faq.id]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{helpfulFaqVotes[faq.id] ? 'Cảm ơn bạn đã đánh giá!' : 'Hữu ích?'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ARTICLE READER MODAL (FOR CUSTOMER) */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticleId(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                  {selectedArticle.categoryName}
                </span>
                <span className="text-xs text-slate-400">• Cập nhật: {selectedArticle.updated}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <button
                  onClick={copyArticleLink}
                  className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Sao chép liên kết"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {selectedArticle.title}
                </h1>
                <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2 pb-4 border-b border-slate-100">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Tác giả: <strong>{selectedArticle.author}</strong></span>
                  </span>
                  <span>•</span>
                  <span>{selectedArticle.views} lượt xem</span>
                </div>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-slate-700 space-y-2">
                {selectedArticle.content}
              </div>

              {/* Vote */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Bài viết này có hữu ích với bạn?</span>
                  <span className="text-[11px] text-slate-400">Đánh giá giúp cải thiện chất lượng hỗ trợ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => voteArticle(selectedArticle.id, 'up')}
                    disabled={Boolean(votedArticles[selectedArticle.id])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      votedArticles[selectedArticle.id] === 'up'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Hữu ích ({selectedArticle.likes})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
