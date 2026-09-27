import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ticketApi } from '../api/ticketApi';
import { useTicketStore } from '../store/ticketStore';
import { useAuthStore } from '../store/authStore';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    departmentId: '1',
    categoryId: '1',
    priorityId: '2',
    description: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { createTicket } = useTicketStore();
  const { user } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleRemoveFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      try {
        await ticketApi.createTicket(formData);
      } catch (err) {
        // Fallback demo mock
      }

      const creatorName = user ? `${user.fullName} (${user.department || 'Nhân sự'})` : 'Quản trị viên';
      const creatorEmail = user?.email || 'admin@company.com';

      createTicket({
        title: formData.title,
        departmentId: formData.departmentId,
        categoryId: formData.categoryId,
        priorityId: formData.priorityId,
        description: formData.description,
        creator: creatorName,
        creatorEmail: creatorEmail,
        attachments: attachments,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/tickets');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Tạo Phiếu Yêu Cầu Hỗ Trợ Mới</h1>
          <p className="text-xs text-slate-500">
            Vui lòng điền thông tin chi tiết để bộ phận kỹ thuật hỗ trợ kịp thời theo cam kết SLA
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Phiếu yêu cầu đã được tạo thành công! Đang chuyển hướng về danh sách phiếu...</span>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Tiêu đề yêu cầu / Tên sự cố"
            name="title"
            required
            placeholder="Ví dụ: Không kết nối được máy chủ tập tin nội bộ tầng 4"
            value={formData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phòng ban tiếp nhận <span className="text-rose-500">*</span>
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="1">IT Operations & Mạng</option>
                <option value="2">Hành chính & Thiết bị VP</option>
                <option value="3">Phần mềm Kế toán / ERP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Danh mục sự cố <span className="text-rose-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="1">Hạ tầng Mạng & Wifi</option>
                <option value="2">Máy tính trạm & Màn hình</option>
                <option value="3">Cấp quyền & Reset Mật khẩu</option>
                <option value="4">Máy in & Thiết bị số</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Độ ưu tiên đề xuất <span className="text-rose-500">*</span>
              </label>
              <select
                name="priorityId"
                value={formData.priorityId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="1">Thấp (Low) - 24 giờ</option>
                <option value="2">Trung bình (Medium) - 8 giờ</option>
                <option value="3">Cao (High) - 4 giờ</option>
                <option value="4">Khẩn cấp (Urgent) - 2 giờ</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Mô tả chi tiết sự cố & Hiện tượng <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Mô tả cụ thể thông báo lỗi, thời điểm phát sinh và các bước bạn đã thử..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Attachment Dropzone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tệp tin đính kèm (Ảnh chụp lỗi, file log, tài liệu liên quan)
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
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20'
                  : 'border-slate-300 hover:border-primary-500 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">
                Kéo thả hình ảnh hoặc tệp vào đây hoặc{' '}
                <span className="text-primary-600 font-semibold underline">Duyệt file từ máy tính</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hỗ trợ PNG, JPG, GIF, WebP, PDF, DOCX, ZIP tối đa 20MB/file
              </p>
            </div>

            {/* Uploaded Files & Image Previews List */}
            {attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      {file.isImage && file.dataUrl ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
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
                        handleRemoveFile(idx);
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

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tickets')}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Gửi Yêu Cầu Hỗ Trợ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
