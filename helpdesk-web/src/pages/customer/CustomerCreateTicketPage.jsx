import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Wifi,
  FileCode2,
  KeyRound,
  MapPin,
  Clock,
  ChevronLeft,
  AlertTriangle,
  Zap,
  Users,
  User as UserIcon,
  Globe,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useTicketStore, calculatePriorityMatrix } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';

export default function CustomerCreateTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCat = searchParams.get('category') || '1';

  const [formData, setFormData] = useState({
    ticketType: 'INCIDENT', // INCIDENT, SERVICE_REQUEST, QUESTION
    category: preSelectedCat,
    subCategory: 'Wifi chậm hoặc chập chờn',
    title: '',
    description: '',
    impact: 'PERSONAL', // PERSONAL, GROUP, BROAD
    urgency: 'MEDIUM', // LOW, MEDIUM, HIGH
    isClassroomEmergency: false,
    location: '',
    phone: '0912.345.678',
  });

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const { tickets, createTicket } = useTicketStore();
  const { user } = useAuthStore();

  const ticketTypes = [
    { value: 'INCIDENT', label: 'Sự cố', desc: 'Dịch vụ hoặc thiết bị bị gián đoạn, hỏng hóc' },
    { value: 'SERVICE_REQUEST', label: 'Yêu cầu dịch vụ', desc: 'Xin cấp quyền, cài đặt phần mềm, cấp thiết bị' },
    { value: 'QUESTION', label: 'Câu hỏi / Tư vấn', desc: 'Thắc mắc về quy trình hoặc hướng dẫn kỹ thuật' },
  ];

  const categories = [
    {
      id: '1',
      name: 'Mạng LAN & Wi-Fi',
      icon: Wifi,
      subCategories: ['Wifi chậm hoặc chập chờn', 'Không kết nối được wifi', 'Mất mạng dây LAN', 'Yêu cầu cấp IP tĩnh'],
    },
    {
      id: '2',
      name: 'Phần cứng & Thiết bị phòng học',
      icon: Laptop,
      subCategories: ['Máy chiếu không lên nguồn', 'Micro / Loa trợ giảng hỏng', 'Máy tính giảng viên không boot', 'Chuột / Bàn phím liệt'],
    },
    {
      id: '3',
      name: 'Phần mềm đào tạo & Thi trực tuyến',
      icon: FileCode2,
      subCategories: ['Hệ thống đăng ký học phần', 'Phần mềm thi trắc nghiệm LMS', 'Microsoft Teams / Office 365', 'Lỗi phần mềm thực hành'],
    },
    {
      id: '4',
      name: 'Tài khoản trường & Email SV/GV',
      icon: KeyRound,
      subCategories: ['Quên mật khẩu tài khoản trường', 'Khóa tài khoản portal sinh viên', 'Không nhận được email xác nhận', 'Cấp quyền truy cập thư mục'],
    },
  ];

  const impactLevels = [
    { value: 'PERSONAL', label: 'Cá nhân', desc: 'Chỉ ảnh hưởng mình tôi', icon: UserIcon },
    { value: 'GROUP', label: 'Một nhóm / Phòng', desc: 'Ảnh hưởng một lớp học hoặc một phòng ban', icon: Users },
    { value: 'BROAD', label: 'Nhiều người / Toàn khu vực', desc: 'Ảnh hưởng cả tòa nhà, khu vực trường', icon: Globe },
  ];

  const urgencyLevels = [
    {
      value: 'LOW',
      label: 'Thấp (Chưa gấp)',
      desc: 'Công việc không bị gián đoạn nhiều',
      time: 'Giải quyết trong 5 ngày làm việc',
    },
    {
      value: 'MEDIUM',
      label: 'Trung bình (Bị chậm)',
      desc: 'Ảnh hưởng một phần công việc',
      time: 'Giải quyết trong 3 ngày làm việc',
    },
    {
      value: 'HIGH',
      label: 'Cao (Không học/làm việc được)',
      desc: 'Dừng hoàn toàn công việc hoặc giờ dạy',
      time: 'Ưu tiên cao / Giải quyết trong 4h - 8h',
    },
  ];

  // Calculated Priority Matrix Preview
  const calculatedPriority = formData.isClassroomEmergency
    ? 'URGENT'
    : calculatePriorityMatrix(formData.impact, formData.urgency);

  const priorityLabelMap = {
    URGENT: { label: 'P1 - Khẩn cấp', color: 'bg-rose-100 text-rose-800 border-rose-300' },
    HIGH: { label: 'P2 - Cao', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    MEDIUM: { label: 'P3 - Trung bình', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    LOW: { label: 'P4 - Thấp', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  };

  // Duplicate Check: Check if this user already opened a ticket in this category in the last 24h
  const existingCategoryTicket = tickets.find((t) => {
    const isSameCategory = t.category && t.category.includes(formData.category);
    const isOpen = t.status !== 'RESOLVED' && t.status !== 'CLOSED';
    return isSameCategory && isOpen;
  });

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const sizeStr =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(0)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const isImage = file.type.startsWith('image/');

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              size: sizeStr,
              type: file.type,
              dataUrl: e.target.result,
              isImage: true,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: sizeStr,
            type: file.type || 'application/octet-stream',
            isImage: false,
          },
        ]);
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedCategoryObj = categories.find((c) => c.id === formData.category);
    const categoryName = selectedCategoryObj ? selectedCategoryObj.name : 'Mạng LAN & Wi-Fi';

    const creatorName = user ? `${user.fullName} (${user.department || 'Người dùng'})` : 'Nguyễn Thu Trang (Khoa CNTT)';
    const creatorEmail = user?.email || 'customer@truong.edu.vn';

    const newTicket = createTicket({
      title: formData.title,
      description: formData.description,
      ticketType: formData.ticketType,
      category: categoryName,
      subCategory: formData.subCategory,
      impact: formData.impact,
      urgency: formData.urgency,
      isClassroomEmergency: formData.isClassroomEmergency,
      department: 'Trung tâm CNTT & Truyền thông',
      location: formData.location,
      phone: formData.phone,
      creator: creatorName,
      creatorEmail: creatorEmail,
      attachments: attachments,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedTicket({
        id: newTicket.id,
        title: newTicket.title,
        priorityCode: newTicket.priorityCode || 'P3',
        priorityNotice: newTicket.slaNotice || 'Đang xác định',
        firstResponseSLA: newTicket.firstResponseSLA || '2 giờ làm việc',
        resolutionSLA: newTicket.resolutionSLA || '3 ngày làm việc',
        eta: newTicket.eta || 'Trong ngày',
      });
    }, 600);
  };

  if (createdTicket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Đã Tiếp Nhận Yêu Cầu Của Bạn
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hệ thống đã tiếp nhận và đưa vào hàng chờ xử lý
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Mã số phiếu và thời hạn cam kết SLA đã được ghi nhận. Hệ thống đang tự động điều phối kỹ thuật viên phụ trách.
          </p>
        </div>

        {/* Ticket receipt card matching section III.2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-left max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-500">Mã phiếu:</span>
            <span className="font-mono font-bold text-primary-600 text-base">{createdTicket.id}</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500">Tiêu đề:</span>
            <p className="font-semibold text-slate-800 text-sm">{createdTicket.title}</p>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs">
            <span className="text-slate-500">Mức ưu tiên:</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              {createdTicket.priorityCode} ({createdTicket.priorityNotice.split(':')[1]?.split('-')[0]?.trim() || 'Theo quy trình'})
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Hạn phản hồi đầu tiên:</span>
              </span>
              <span className="font-bold text-slate-900">{createdTicket.firstResponseSLA}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hạn giải quyết cam kết:</span>
              </span>
              <span className="font-bold text-slate-900">{createdTicket.resolutionSLA}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            onClick={() => navigate('/portal/my-tickets')}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 shadow-sm"
          >
            Xem Tiến Độ Yêu Cầu
          </button>
          <button
            onClick={() => {
              setCreatedTicket(null);
              setFormData({
                category: '1',
                title: '',
                description: '',
                urgency: 'MEDIUM',
                location: '',
                phone: '0912.345.678',
              });
              setAttachments([]);
            }}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Tạo Thêm Yêu Cầu Khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to="/portal"
        className="inline-flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Quay lại trang chủ portal</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gửi Yêu Cầu Hỗ Trợ Kỹ Thuật</h1>
        <p className="text-xs text-slate-500">
          Vui lòng điền thông tin chi tiết để kỹ thuật viên nắm rõ tình trạng và hỗ trợ bạn nhanh nhất có thể.
        </p>
      </div>

      {/* Warning banner if duplicate ticket exists in 24h (Section III.2) */}
      {existingCategoryTicket && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-800">Cảnh báo yêu cầu có thể trùng lặp:</span>
            <p>
              Bạn đang có một yêu cầu đang mở trong cùng danh mục ({existingCategoryTicket.id} - "{existingCategoryTicket.title}"). 
              Nếu là cùng một sự cố, bạn có thể bổ sung phản hồi vào phiếu cũ thay vì tạo phiếu mới.
            </p>
          </div>
        </div>
      )}

      {/* Classroom Emergency Mode Banner (Chế độ khẩn cấp lớp học) */}
      <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
        formData.isClassroomEmergency ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${formData.isClassroomEmergency ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs block">Sự cố trong giờ giảng trực tiếp tại phòng học</span>
            <span className="text-[11px] text-slate-500">
              Bật chế độ này nếu bạn là Giảng viên đang đứng lớp bị hỏng máy chiếu, micro, mạng. Hệ thống tự động nâng lên P1 Khẩn cấp!
            </span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={formData.isClassroomEmergency}
            onChange={(e) => setFormData({ ...formData, isClassroomEmergency: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* 1. Ticket Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Loại Phiếu Yêu Cầu <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ticketTypes.map((t) => {
              const isSelected = formData.ticketType === t.value;
              return (
                <div
                  key={t.value}
                  onClick={() => setFormData({ ...formData, ticketType: t.value })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">{t.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{t.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Category & Subcategory Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Danh Mục & Sự Cố Cụ Thể (2 cấp) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = formData.category === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      category: c.id,
                      subCategory: c.subCategories[0] || '',
                    });
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20'
                      : 'border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block leading-tight">{c.name}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {c.subCategories.length} nhóm sự cố con
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subcategory dropdown */}
          {categories.find((c) => c.id === formData.category) && (
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                Chọn sự cố con chi tiết:
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50"
              >
                {categories
                  .find((c) => c.id === formData.category)
                  ?.subCategories.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* 3. Issue Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Tiêu Đề Yêu Cầu <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Wifi phòng học A5.101 chập chờn không kết nối được..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* 4. Detailed Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            4. Mô Tả Chi Tiết Vấn Đề <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Mô tả cụ thể triệu chứng, các bước bạn đã làm trước khi lỗi xuất hiện, thông báo lỗi cụ thể (nếu có)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 leading-relaxed"
          ></textarea>
        </div>

        {/* 5. Impact and Urgency (Priority Matrix) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              5. Mức Độ Ảnh Hưởng & Mức Khẩn Cấp
            </label>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Ưu tiên tự động:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${priorityLabelMap[calculatedPriority]?.color}`}>
                {priorityLabelMap[calculatedPriority]?.label}
              </span>
            </div>
          </div>

          {/* Impact Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600 block">Mức ảnh hưởng:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {impactLevels.map((imp) => {
                const Icon = imp.icon;
                const isSelected = formData.impact === imp.value;
                return (
                  <div
                    key={imp.value}
                    onClick={() => setFormData({ ...formData, impact: imp.value })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start space-x-2.5 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{imp.label}</span>
                      <span className="text-[11px] text-slate-500 block">{imp.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-600 block">Mức khẩn cấp:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {urgencyLevels.map((lvl) => {
                const isSelected = formData.urgency === lvl.value;
                return (
                  <div
                    key={lvl.value}
                    onClick={() => setFormData({ ...formData, urgency: lvl.value })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? lvl.value === 'HIGH'
                          ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
                          : 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{lvl.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{lvl.desc}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2 block border-t border-slate-100 pt-1">
                      {lvl.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Location and Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Vị Trí Làm Việc / Bàn Ngồi
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ví dụ: Tòa nhà A, Tầng 3, Bàn Marketing 12"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Số Điện Thoại Nội Bộ / Di Động
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {/* 6. Attachments Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Đính Kèm Ảnh Chụp Lỗi Hoặc File Log (Tùy chọn)
          </label>

          {/* Hidden native input */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.log,.zip,.rar"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20'
                : 'border-slate-200 hover:border-primary-400 hover:bg-slate-50/60'
            }`}
          >
            <Upload className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-xs text-slate-700 font-medium">
              Kéo thả hình ảnh chụp lỗi vào đây hoặc{' '}
              <span className="text-primary-600 font-bold underline">chọn từ máy tính</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, GIF, WebP, PDF, DOCX dung lượng tối đa 15MB/file</p>
          </div>

          {/* Uploaded Files & Image Previews List */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    {file.isImage && file.dataUrl ? (
                      <img
                        src={file.dataUrl}
                        alt={file.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary-100/70 flex items-center justify-center flex-shrink-0 text-primary-600">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-800 block truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{file.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors ml-2"
                    title="Xóa tệp này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/portal"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Hủy bỏ
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="px-6"
          >
            <span>Gửi Yêu Cầu Hỗ Trợ</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>
    </div>
  );
}
