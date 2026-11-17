import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Building2,
  Clock,
  ShieldAlert,
  X,
  Layers,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const departmentsList = [
    { id: 1, name: 'IT Operations & Hạ tầng Mạng' },
    { id: 2, name: 'Phát triển Phần mềm & ERP' },
    { id: 3, name: 'Hành chính & Nhân sự (HR)' },
    { id: 4, name: 'Kế toán & Tài chính' },
  ];

  // Initial Categories matching Figure 3.3.15 & UC13
  const [categories, setCategories] = useState([
    {
      id: 1,
      code: 'CAT_NET',
      name: 'Mạng LAN, Wi-Fi & VPN',
      departmentId: 1,
      departmentName: 'IT Operations & Hạ tầng Mạng',
      defaultPriority: 'HIGH',
      slaHours: '2 giờ',
      description: 'Mất kết nối mạng dây, chập chờn wifi, lỗi chứng thư số VPN FortiClient.',
      isActive: true,
    },
    {
      id: 2,
      code: 'CAT_HW',
      name: 'Phần Cứng & Thiết Bị Văn Phòng',
      departmentId: 1,
      departmentName: 'IT Operations & Hạ tầng Mạng',
      defaultPriority: 'MEDIUM',
      slaHours: '4 giờ',
      description: 'Máy tính bàn không lên nguồn, màn hình sọc, máy in kẹt giấy hoặc hết mực.',
      isActive: true,
    },
    {
      id: 3,
      code: 'CAT_AUTH',
      name: 'Tài Khoản & Reset Mật Khẩu',
      departmentId: 1,
      departmentName: 'IT Operations & Hạ tầng Mạng',
      defaultPriority: 'URGENT',
      slaHours: '1 giờ',
      description: 'Khóa tài khoản Windows AD, quên mật khẩu email Outlook, cấp tài khoản cho nhân sự mới.',
      isActive: true,
    },
    {
      id: 4,
      code: 'CAT_ERP',
      name: 'Lỗi Phần Mềm ERP & Kế Toán',
      departmentId: 2,
      departmentName: 'Phát triển Phần mềm & ERP',
      defaultPriority: 'HIGH',
      slaHours: '3 giờ',
      description: 'Lỗi xuất hóa đơn điện tử, sai số liệu báo cáo tài chính, phân quyền sai phân hệ.',
      isActive: true,
    },
    {
      id: 5,
      code: 'CAT_ASSET',
      name: 'Bàn Giao & Mượn Thiết Bị',
      departmentId: 3,
      departmentName: 'Hành chính & Nhân sự (HR)',
      defaultPriority: 'LOW',
      slaHours: '8 giờ',
      description: 'Đăng ký mượn máy chiếu cuộc họp, cấp bàn ghế mới, đăng ký thẻ từ ra vào tòa nhà.',
      isActive: true,
    },
  ]);

  const [addForm, setAddForm] = useState({
    code: '',
    name: '',
    departmentId: 1,
    defaultPriority: 'MEDIUM',
    slaHours: '4 giờ',
    description: '',
  });

  const toggleCategoryStatus = (id) => {
    setCategories(
      categories.map((c) => {
        if (c.id === id) {
          const nextState = !c.isActive;
          showToast(`Đã ${nextState ? 'kích hoạt' : 'khóa'} danh mục ${c.name}`);
          return { ...c, isActive: nextState };
        }
        return c;
      })
    );
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.code.trim()) return;

    const deptObj = departmentsList.find((d) => d.id === parseInt(addForm.departmentId));
    const newCat = {
      id: Date.now(),
      code: addForm.code.trim().toUpperCase(),
      name: addForm.name.trim(),
      departmentId: parseInt(addForm.departmentId),
      departmentName: deptObj ? deptObj.name : 'IT Operations & Hạ tầng Mạng',
      defaultPriority: addForm.defaultPriority,
      slaHours: addForm.slaHours,
      description: addForm.description.trim() || 'Chưa có mô tả chi tiết',
      isActive: true,
    };

    setCategories([...categories, newCat]);
    setAddForm({
      code: '',
      name: '',
      departmentId: 1,
      defaultPriority: 'MEDIUM',
      slaHours: '4 giờ',
      description: '',
    });
    setShowAddModal(false);
    showToast(`Đã thêm danh mục mới: ${newCat.name}`);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim() || !editingCategory.code.trim()) return;

    const deptObj = departmentsList.find((d) => d.id === parseInt(editingCategory.departmentId));
    setCategories(
      categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...editingCategory,
              code: editingCategory.code.trim().toUpperCase(),
              departmentName: deptObj ? deptObj.name : c.departmentName,
            }
          : c
      )
    );
    showToast(`Đã cập nhật danh mục: ${editingCategory.name}`);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!deleteConfirmCat) return;
    setCategories(categories.filter((c) => c.id !== deleteConfirmCat.id));
    showToast(`Đã xóa danh mục ${deleteConfirmCat.name}`, 'info');
    setDeleteConfirmCat(null);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Danh Mục Sự Cố & Dịch Vụ (UC13)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập danh mục phân loại sự cố, bộ phận tiếp nhận và thời hạn cam kết SLA tương ứng
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
          className="shadow-sm"
        >
          Thêm Danh Mục Mới
        </Button>
      </div>

      {/* Search Bar & Stats */}
      <Card bodyClassName="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sự cố, mã danh mục, phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Hiển thị {filteredCategories.length} kết quả
          </div>
        </div>
      </Card>

      {/* Categories Table (Matching Figure 3.3.15) */}
      <Card bodyClassName="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Mã Mục</th>
                <th className="py-3.5 px-4 min-w-[240px]">Tên Loại Sự Cố / Yêu Cầu</th>
                <th className="py-3.5 px-4">Phòng Ban Tiếp Nhận</th>
                <th className="py-3.5 px-4">Mức Ưu Tiên</th>
                <th className="py-3.5 px-4">Cam Kết SLA</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {cat.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block text-sm">{cat.name}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed">
                      {cat.description}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cat.departmentName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border uppercase ${
                        cat.defaultPriority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : cat.defaultPriority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : cat.defaultPriority === 'MEDIUM'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat.defaultPriority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{cat.slaHours}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="checkbox"
                        checked={cat.isActive}
                        onChange={() => toggleCategoryStatus(cat.id)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span
                        className={`font-medium ${
                          cat.isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {cat.isActive ? 'Kích hoạt' : 'Đã khóa'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(cat.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        {cat.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="p-1 rounded text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmCat(cat)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE CATEGORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Thêm Danh Mục Sự Cố Mới (UC13)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Danh Mục *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: CAT_SECURITY"
                    value={addForm.code}
                    onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời Gian Cam Kết SLA *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 2 giờ"
                    value={addForm.slaHours}
                    onChange={(e) => setAddForm({ ...addForm, slaHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Danh Mục Sự Cố *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bảo mật & Phòng chống mã độc"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phòng Ban Tiếp Nhận *</label>
                  <select
                    value={addForm.departmentId}
                    onChange={(e) => setAddForm({ ...addForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {departmentsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Ưu Tiên Mặc Định *</label>
                  <select
                    value={addForm.defaultPriority}
                    onChange={(e) => setAddForm({ ...addForm, defaultPriority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="URGENT">URGENT (Khẩn cấp)</option>
                    <option value="HIGH">HIGH (Ưu tiên cao)</option>
                    <option value="MEDIUM">MEDIUM (Bình thường)</option>
                    <option value="LOW">LOW (Tiêu chuẩn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Chi Tiết Phạm Vi Sự Cố</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các tình huống lỗi thường gặp thuộc danh mục này..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu Danh Mục
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Chỉnh Sửa Danh Mục Sự Cố</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Danh Mục *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.code}
                    onChange={(e) => setEditingCategory({ ...editingCategory, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời Gian Cam Kết SLA *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slaHours}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slaHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Danh Mục Sự Cố *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phòng Ban Tiếp Nhận *</label>
                  <select
                    value={editingCategory.departmentId}
                    onChange={(e) => setEditingCategory({ ...editingCategory, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {departmentsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Ưu Tiên Mặc Định *</label>
                  <select
                    value={editingCategory.defaultPriority}
                    onChange={(e) => setEditingCategory({ ...editingCategory, defaultPriority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="URGENT">URGENT (Khẩn cấp)</option>
                    <option value="HIGH">HIGH (Ưu tiên cao)</option>
                    <option value="MEDIUM">MEDIUM (Bình thường)</option>
                    <option value="LOW">LOW (Tiêu chuẩn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Chi Tiết Phạm Vi Sự Cố</label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingCategory(null)}>
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
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Xóa Danh Mục?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Bạn có chắc chắn muốn xóa danh mục sự cố{' '}
                <strong className="text-slate-900 font-semibold">"{deleteConfirmCat.name}"</strong>? Thao tác này sẽ xóa danh mục khỏi danh sách tiếp nhận của hệ thống.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmCat(null)}
              >
                Hủy Bỏ
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDeleteCategory}
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
