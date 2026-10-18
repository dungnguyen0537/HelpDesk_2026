import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  FileText,
  HelpCircle,
  Plus,
  Eye,
  Calendar,
  User,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Share2,
  Copy,
  Terminal,
  LifeBuoy,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useKnowledgeStore } from '../store/knowledgeStore';

export default function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    articles,
    categories,
    votedArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    voteArticle,
    incrementViews,
    resetToDefaults,
  } = useKnowledgeStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notification, setNotification] = useState(null);

  // Determine current active selected article from store
  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || null;

  const isStaff = user?.role === 'ADMIN' || user?.role === 'AGENT' || user?.role === 'MANAGER';

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Form state for New Article
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'VPN_NET',
    summary: '',
    content: '',
  });

  const handleOpenArticle = (art) => {
    incrementViews(art.id);
    setSelectedArticleId(art.id);
  };

  const handleVote = (articleId, type) => {
    voteArticle(articleId, type);
  };

  const handleStartCreate = () => {
    setNewArticle({
      title: '',
      category: 'VPN_NET',
      summary: '',
      content: '',
    });
    setShowAddModal(true);
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.content.trim()) return;

    const created = addArticle({
      ...newArticle,
      author: user?.fullName || 'Kỹ Thuật Viên IT',
    });

    setShowAddModal(false);
    showToast(`Đã thêm bài viết mới: "${created.title}"`);
  };

  const handleStartEdit = (art, e) => {
    if (e) e.stopPropagation();
    setEditingArticle({ ...art });
  };

  const handleUpdateArticle = (e) => {
    e.preventDefault();
    if (!editingArticle.title.trim() || !editingArticle.content.trim()) return;

    updateArticle(editingArticle.id, {
      title: editingArticle.title,
      category: editingArticle.category,
      summary: editingArticle.summary,
      content: editingArticle.content,
    });

    setEditingArticle(null);
    showToast(`Đã cập nhật bài viết: "${editingArticle.title}"`);
  };

  const handleStartDelete = (art, e) => {
    if (e) e.stopPropagation();
    setDeleteConfirmArticle(art);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmArticle) return;
    const title = deleteConfirmArticle.title;
    deleteArticle(deleteConfirmArticle.id);

    if (selectedArticleId === deleteConfirmArticle.id) {
      setSelectedArticleId(null);
    }
    setDeleteConfirmArticle(null);
    showToast(`Đã xóa bài viết "${title}" khỏi hệ thống`, 'info');
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper to format inline markdown safely
  const renderInlineFormatted = (rawText) => {
    if (!rawText) return '';
    let formatted = rawText.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] border border-slate-200 font-semibold">$1</code>'
    );
    formatted = formatted.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold text-slate-900">$1</strong>'
    );
    return formatted;
  };

  // Render article content block by block
  const renderArticleBody = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check code block fences
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div
              key={`code-${index}`}
              className="my-3 p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner"
            >
              <pre>{codeBuffer.join('\n')}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Empty line -> spacing
      if (!trimmed) {
        elements.push(<div key={`sp-${index}`} className="h-2" />);
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2 pb-1.5 border-b border-slate-100 flex items-center space-x-2"
          >
            <span dangerouslySetInnerHTML={{ __html: renderInlineFormatted(title) }} />
          </h3>
        );
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2 pb-1.5 border-b border-slate-200"
          >
            <span dangerouslySetInnerHTML={{ __html: renderInlineFormatted(title) }} />
          </h2>
        );
        return;
      }

      // Numbered List: 1. Item
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (orderedMatch) {
        const num = orderedMatch[1];
        const text = orderedMatch[2];
        elements.push(
          <div key={`ol-${index}`} className="flex items-start space-x-2.5 my-1.5 ml-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
              {num}
            </span>
            <div
              className="text-xs sm:text-sm text-slate-700 leading-relaxed flex-1"
              dangerouslySetInnerHTML={{ __html: renderInlineFormatted(text) }}
            />
          </div>
        );
        return;
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
        const text = trimmed.substring(2);
        elements.push(
          <div key={`ul-${index}`} className="flex items-start space-x-2 my-1 ml-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
            <div
              className="text-xs sm:text-sm text-slate-700 leading-relaxed flex-1"
              dangerouslySetInnerHTML={{ __html: renderInlineFormatted(text) }}
            />
          </div>
        );
        return;
      }

      // Regular Paragraph
      elements.push(
        <p
          key={`p-${index}`}
          className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: renderInlineFormatted(line) }}
        />
      );
    });

    return elements;
  };

  // Filter Articles
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Search Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-center text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            Kho Tri Thức & Giải Pháp CNTT Doanh Nghiệp
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bạn Đang Cần Hỗ Trợ Kỹ Thuật Gì?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tra cứu cẩm nang hướng dẫn tự khắc phục sự cố máy tính, mạng wifi, VPN và phần mềm nội bộ
          </p>

          <div className="pt-4 relative">
            <input
              type="text"
              placeholder="Nhập từ khóa lỗi, mã sự cố (Ví dụ: VPN, Outlook, Mạng Wifi, Kẹt giấy...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 shadow-lg placeholder-slate-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Action Bar & Categories Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tất Cả ({articles.length})
          </button>
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Action Controls for Staff/Admin */}
        <div className="flex items-center space-x-2">
          {isStaff && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleStartCreate}
              className="flex-shrink-0"
            >
              Thêm Tài Liệu Mới
            </Button>
          )}
        </div>
      </div>

      {/* Category Overview Cards */}
      {selectedCategory === 'ALL' && !searchTerm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-primary-600 font-semibold">
                  <span>{count} cẩm nang</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Articles List Card */}
      <Card
        title={
          selectedCategory === 'ALL'
            ? 'Danh Sách Cẩm Nang Kỹ Thuật'
            : `Cẩm Nang Thuộc Nhóm: ${categories.find((c) => c.id === selectedCategory)?.title}`
        }
        subtitle={`Tìm thấy ${filteredArticles.length} bài viết hướng dẫn`}
        bodyClassName="p-0 overflow-hidden"
      >
        {filteredArticles.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {art.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                        {art.categoryName}
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{art.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{art.views} lượt xem</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Cập nhật: {art.updated}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end sm:self-center flex-shrink-0">
                  <div className="flex items-center space-x-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{art.likes}</span>
                  </div>

                  {isStaff && (
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleStartEdit(art, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Chỉnh sửa tài liệu"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleStartDelete(art, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">Không tìm thấy bài viết phù hợp</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Không có tài liệu nào chứa từ khóa "{searchTerm}". Vui lòng thử từ khóa khác hoặc tạo tài liệu hướng dẫn mới.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
              >
                Xóa bộ lọc
              </Button>
              {isStaff && (
                <Button variant="primary" size="sm" icon={Plus} onClick={handleStartCreate}>
                  Thêm Tài Liệu Mới
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticleId(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                  {selectedArticle.categoryName}
                </span>
                <span className="text-xs text-slate-400">• Cập nhật: {selectedArticle.updated}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                {isStaff && (
                  <div className="flex items-center space-x-1 mr-2 border-r border-slate-200 pr-2">
                    <button
                      onClick={() => handleStartEdit(selectedArticle)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      title="Chỉnh sửa tài liệu này"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleStartDelete(selectedArticle)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      title="Xóa tài liệu này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={copyArticleLink}
                  className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Sao chép liên kết bài viết"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Đóng cửa sổ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {selectedArticle.title}
                </h1>
                <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2 pb-4 border-b border-slate-100">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tác giả: <strong>{selectedArticle.author}</strong></span>
                  </span>
                  <span>•</span>
                  <span>{selectedArticle.views} lượt tham khảo</span>
                </div>
              </div>

              {/* Render formatted content */}
              <div className="space-y-1 font-sans">
                {renderArticleBody(selectedArticle.content)}
              </div>

              {/* Helpfulness Feedback Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Bài viết này có giải quyết được sự cố của bạn?</span>
                  <span className="text-slate-400">Đánh giá giúp bộ phận IT hoàn thiện cẩm nang hướng dẫn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(selectedArticle.id, 'up')}
                    disabled={Boolean(votedArticles[selectedArticle.id])}
                    className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 transition-all ${
                      votedArticles[selectedArticle.id] === 'up'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Hữu ích ({selectedArticle.likes})</span>
                  </button>
                  <button
                    onClick={() => handleVote(selectedArticle.id, 'down')}
                    disabled={Boolean(votedArticles[selectedArticle.id])}
                    className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 transition-all ${
                      votedArticles[selectedArticle.id] === 'down'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Chưa rõ</span>
                  </button>
                </div>
              </div>

              {/* Shortcut to Create Ticket if unresolved */}
              <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <LifeBuoy className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Vẫn chưa giải quyết được sự cố?</span>
                    <span className="text-slate-500">Mở phiếu yêu cầu để kỹ thuật viên IT tiếp nhận và hỗ trợ trực tiếp.</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedArticleId(null);
                    if (user?.role === 'CUSTOMER') {
                      navigate('/portal/create-ticket');
                    } else {
                      navigate('/tickets/new');
                    }
                  }}
                >
                  Tạo Phiếu Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ARTICLE MODAL (Admin/Agent/Manager) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Thêm Bài Viết Hướng Dẫn Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Hướng Dẫn *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hướng dẫn cài đặt chứng thư số nội bộ trên trình duyệt Chrome"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phân Nhóm Tri Thức</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tóm Tắt Ngắn Gọn</label>
                <input
                  type="text"
                  placeholder="Mô tả mục tiêu của hướng dẫn trong 1-2 câu..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Chi Tiết (Markdown) *</label>
                <textarea
                  rows={7}
                  required
                  placeholder="### 1. Chuẩn bị&#10;### 2. Các bước thực hiện&#10;1. Bước 1:...&#10;2. Bước 2:..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu & Đăng Bài
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Chỉnh Sửa Tài Liệu Hướng Dẫn</h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateArticle} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Hướng Dẫn *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phân Nhóm Tri Thức</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tóm Tắt Ngắn Gọn</label>
                <input
                  type="text"
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Chi Tiết (Markdown) *</label>
                <textarea
                  rows={7}
                  required
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingArticle(null)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu Thay Đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Xóa Tài Liệu?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết{' '}
                <strong className="text-slate-900 font-semibold">"{deleteConfirmArticle.title}"</strong>? Thao tác này sẽ xóa vĩnh viễn tài liệu khỏi cơ sở tri thức.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmArticle(null)}
              >
                Hủy Bỏ
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Xác Nhận Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
