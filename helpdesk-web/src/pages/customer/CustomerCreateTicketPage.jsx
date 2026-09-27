import React, { useState } from 'react';
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
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';

export default function CustomerCreateTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCat = searchParams.get('category') || '1';

  const [formData, setFormData] = useState({
    category: preSelectedCat,
    title: '',
    description: '',
    urgency: 'MEDIUM',
    location: '',
    phone: '0912.345.678',
  });

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const categories = [
    { id: '1', name: 'Phần cứng & Thiết bị (Máy tính, màn hình, máy in)', icon: Laptop },
    { id: '2', name: 'Mạng LAN, Wi-Fi & Kết nối VPN', icon: Wifi },
    { id: '3', name: 'Phần mềm & Hệ thống (ERP, Outlook, Office 365)', icon: FileCode2 },
    { id: '4', name: 'Tài khoản & Phân quyền truy cập thư mục', icon: KeyRound },
  ];

  const urgencyLevels = [
    {
      value: 'LOW',
      label: 'Thấp (Không gấp)',
      desc: 'Vẫn làm việc bình thường, yêu cầu hỗ trợ chung',
      time: 'Giải quyết trong 24h',
    },
    {
      value: 'MEDIUM',
      label: 'Bình thường',
      desc: 'Ảnh hưởng đến một số tác vụ nhưng vẫn có thể làm việc khác',
      time: 'Giải quyết trong 4h',
    },
    {
      value: 'HIGH',
      label: 'Khẩn cấp / Dừng công việc',
      desc: 'Máy tính hoặc mạng hỏng hoàn toàn, không thể tiếp tục công việc',
      time: 'Tiếp nhận ngay trong 15p',
    },
  ];

  const { createTicket } = useTicketStore();
  const { user } = useAuthStore();

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
    const categoryName = selectedCategoryObj ? selectedCategoryObj.name.split(' (')[0] : 'Hỗ trợ kỹ thuật';

    const creatorName = user ? `${user.fullName} (${user.department || 'Khách hàng'})` : 'Nguyễn Thu Trang (Marketing)';
    const creatorEmail = user?.email || 'customer@company.com';

    const newTicket = createTicket({
      title: formData.title,
      description: formData.description,
      category: categoryName,
      department: 'IT Operations & Mạng',
      priority: formData.urgency,
      urgency: formData.urgency,
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
        eta: newTicket.eta || (formData.urgency === 'HIGH' ? '15 - 30 phút' : '2 - 4 giờ làm việc'),
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
            Gửi Yêu Cầu Thành Công
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hệ thống đã tiếp nhận sự cố của bạn!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Kỹ thuật viên phù hợp nhất đã được tự động điều phối để xử lý yêu cầu của bạn.
          </p>
        </div>

        {/* Ticket receipt card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-left max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-500">Mã phiếu hỗ trợ:</span>
            <span className="font-mono font-bold text-primary-600 text-base">{createdTicket.id}</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500">Nội dung yêu cầu:</span>
            <p className="font-semibold text-slate-800 text-sm">{createdTicket.title}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center space-x-1.5 text-slate-600">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Thời gian phản hồi cam kết (SLA):</span>
            </span>
            <span className="font-bold text-slate-900">{createdTicket.eta}</span>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* 1. Category Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Loại Vấn Đề Cần Hỗ Trợ <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = formData.category === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setFormData({ ...formData, category: c.id })}
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
                    <span className="font-bold text-slate-900 block leading-tight">{c.name.split(' (')[0]}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{c.name.split(' (')[1]?.replace(')', '') || ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Issue Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Tóm Tắt Ngắn Gọn Sự Cố <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Máy in văn phòng lầu 2 bị kẹt giấy và báo đèn đỏ..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* 3. Detailed Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Mô Tả Chi Tiết Vấn Đề Gặp Phải <span className="text-rose-500">*</span>
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

        {/* 4. Urgency selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            4. Mức Độ Khẩn Cấp Ảnh Hưởng Công Việc <span className="text-rose-500">*</span>
          </label>
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
                    <span className="text-[11px] text-slate-500 mt-1 block">{lvl.desc}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-2 block border-t border-slate-100 pt-1">
                    {lvl.time}
                  </span>
                </div>
              );
            })}
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
