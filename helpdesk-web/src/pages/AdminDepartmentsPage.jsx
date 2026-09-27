import React, { useState } from 'react';
import {
  Building2,
  FolderTree,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ChevronRight,
  Layers,
  Users,
  AlertCircle,
  X,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function AdminDepartmentsPage() {
  const [activeTab, setActiveTab] = useState('DEPARTMENTS'); // 'DEPARTMENTS' or 'CATEGORIES'
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Departments
  const [departments, setDepartments] = useState([
    {
      id: 1,
      code: 'IT_OPS',
      name: 'IT Operations & Hạ Tầng Mạng',
      manager: 'Lê Văn Cường',
      membersCount: 8,
      categoriesCount: 6,
      description: 'Chịu trách nhiệm máy chủ, hệ thống mạng LAN/Wifi, máy in và bảo trì máy trạm người dùng.',
      isActive: true,
    },
    {
      id: 2,
      code: 'ERP_DEV',
      name: 'Phát Triển Phần Mềm & ERP',
      manager: 'Trần Thị Bích',
      membersCount: 12,
      categoriesCount: 5,
      description: 'Phát triển và bảo trì phần mềm nội bộ, hệ thống kế toán MISA, ERP SAP và cơ sở dữ liệu.',
      isActive: true,
    },
    {
      id: 3,
      code: 'ADMIN_HR',
      name: 'Hành Chính & Nhân Sự (HR)',
      manager: 'Phạm Thị Lan',
      membersCount: 5,
      categoriesCount: 4,
      description: 'Tiếp nhận yêu cầu thẻ xe, trang thiết bị văn phòng phẩm, chế độ phúc lợi và tài sản hành chính.',
      isActive: true,
    },
    {
      id: 4,
      code: 'FIN_ACC',
      name: 'Kế Toán & Tài Chính',
      manager: 'Đặng Tuấn Anh',
      membersCount: 6,
      categoriesCount: 3,
      description: 'Thanh toán hóa đơn, đối soát chi phí, hoàn ứng và hồ sơ chứng từ công tác.',
      isActive: true,
    },
  ]);

  // Initial Categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      code: 'CAT_NET',
      name: 'Mạng LAN, Wi-Fi & VPN',
      departmentId: 1,
      departmentName: 'IT Operations & Hạ Tầng Mạng',
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
      departmentName: 'IT Operations & Hạ Tầng Mạng',
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
      departmentName: 'IT Operations & Hạ Tầng Mạng',
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
      departmentName: 'Phát Triển Phần Mềm & ERP',
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
      departmentName: 'Hành Chính & Nhân Sự (HR)',
      defaultPriority: 'LOW',
      slaHours: '8 giờ',
      description: 'Đăng ký mượn máy chiếu cuộc họp, cấp bàn ghế mới, đăng ký thẻ từ ra vào tòa nhà.',
      isActive: true,
    },
  ]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ code: '', name: '', manager: '', description: '' });
  const [catForm, setCatForm] = useState({
    code: '',
    name: '',
    departmentId: '1',
    defaultPriority: 'MEDIUM',
    slaHours: '4 giờ',
    description: '',
  });

  const toggleDeptStatus = (id) => {
    setDepartments(departments.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  };

  const toggleCatStatus = (id) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    const newDept = {
      id: Date.now(),
      code: deptForm.code.toUpperCase(),
      name: deptForm.name,
      manager: deptForm.manager || 'Chưa phân công',
      membersCount: 1,
      categoriesCount: 0,
      description: deptForm.description || 'Chưa có mô tả',
      isActive: true,
    };
    setDepartments([newDept, ...departments]);
    setDeptForm({ code: '', name: '', manager: '', description: '' });
    setShowModal(false);
  };

  const handleAddCat = (e) => {
    e.preventDefault();
    if (!catForm.name || !catForm.code) return;
    const parentDept = departments.find((d) => d.id === parseInt(catForm.departmentId));
    const newCat = {
      id: Date.now(),
      code: catForm.code.toUpperCase(),
      name: catForm.name,
      departmentId: parseInt(catForm.departmentId),
      departmentName: parentDept ? parentDept.name : 'IT Operations',
      defaultPriority: catForm.defaultPriority,
      slaHours: catForm.slaHours,
      description: catForm.description || 'Chưa có mô tả chi tiết',
      isActive: true,
    };
    setCategories([newCat, ...categories]);
    setCatForm({ code: '', name: '', departmentId: '1', defaultPriority: 'MEDIUM', slaHours: '4 giờ', description: '' });
    setShowModal(false);
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCats = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Phòng Ban & Danh Mục Sự Cố
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập cơ cấu bộ phận xử lý và phân loại nhóm yêu cầu kỹ thuật tiếp nhận trong toàn cơ quan
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          {activeTab === 'DEPARTMENTS' ? 'Thêm Phòng Ban' : 'Thêm Danh Mục'}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('DEPARTMENTS');
            setSearchTerm('');
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'DEPARTMENTS'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Danh Sách Phòng Ban ({departments.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('CATEGORIES');
            setSearchTerm('');
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'CATEGORIES'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Danh Mục Sự Cố & Phân Loại ({categories.length})</span>
        </button>
      </div>

      {/* Main Content Card */}
      <Card bodyClassName="p-0 overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'DEPARTMENTS'
                  ? 'Tìm kiếm theo tên phòng, mã code, trưởng bộ phận...'
                  : 'Tìm kiếm theo tên sự cố, mã danh mục, phòng ban...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Hiển thị {activeTab === 'DEPARTMENTS' ? filteredDepts.length : filteredCats.length} kết quả
          </span>
        </div>

        {/* Tab 1: DEPARTMENTS TABLE */}
        {activeTab === 'DEPARTMENTS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã Code</th>
                  <th className="py-3 px-4">Tên Phòng Ban</th>
                  <th className="py-3 px-4">Trưởng Bộ Phận</th>
                  <th className="py-3 px-4 text-center">Nhân Sự</th>
                  <th className="py-3 px-4 text-center">Danh Mục</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDepts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{d.name}</div>
                      <div className="text-[11px] text-slate-400 max-w-sm truncate">{d.description}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{d.manager}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700">
                        {d.membersCount} nhân viên
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {d.categoriesCount} nhóm
                    </td>
                    <td className="py-3 px-4">
                      {d.isActive ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hoạt động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 font-semibold space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tạm ngưng</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleDeptStatus(d.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          d.isActive
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {d.isActive ? 'Khóa' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: CATEGORIES TABLE */}
        {activeTab === 'CATEGORIES' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã Mục</th>
                  <th className="py-3 px-4">Tên Loại Sự Cố / Yêu Cầu</th>
                  <th className="py-3 px-4">Phòng Ban Tiếp Nhận</th>
                  <th className="py-3 px-4 text-center">Mức Ưu Tiên</th>
                  <th className="py-3 px-4 text-center">Cam Kết SLA</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCats.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400 max-w-sm truncate">{c.description}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{c.departmentName}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.defaultPriority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : c.defaultPriority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.defaultPriority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{c.slaHours}</td>
                    <td className="py-3 px-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Kích hoạt</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 font-semibold space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Ẩn</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleCatStatus(c.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          c.isActive
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {c.isActive ? 'Khóa' : 'Mở lại'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Create Department / Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">
                {activeTab === 'DEPARTMENTS' ? 'Khởi Tạo Phòng Ban Mới' : 'Thêm Danh Mục Sự Cố Mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeTab === 'DEPARTMENTS' ? (
              <form onSubmit={handleAddDept} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Phòng Ban (Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NETWORK_SEC"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Phòng Ban *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Phòng An Toàn Thông Tin & Mạng"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trưởng Phòng Phụ Trách</label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn Nam"
                    value={deptForm.manager}
                    onChange={(e) => setDeptForm({ ...deptForm, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Chức Năng</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả phạm vi trách nhiệm kỹ thuật của phòng ban..."
                    value={deptForm.description}
                    onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Lưu Phòng Ban
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddCat} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Danh Mục *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: CAT_SECURITY"
                    value={catForm.code}
                    onChange={(e) => setCatForm({ ...catForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Nhóm Sự Cố *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nghi ngờ virus hoặc rò rỉ dữ liệu máy trạm"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phòng Ban Phụ Trách</label>
                    <select
                      value={catForm.departmentId}
                      onChange={(e) => setCatForm({ ...catForm, departmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mức Ưu Tiên Mặc Định</label>
                    <select
                      value={catForm.defaultPriority}
                      onChange={(e) => setCatForm({ ...catForm, defaultPriority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="LOW">LOW (Thấp)</option>
                      <option value="MEDIUM">MEDIUM (Bình thường)</option>
                      <option value="HIGH">HIGH (Ưu tiên cao)</option>
                      <option value="URGENT">URGENT (Khẩn cấp)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời Gian Giải Quyết SLA Dự Kiến</label>
                  <input
                    type="text"
                    placeholder="VD: 2 giờ"
                    value={catForm.slaHours}
                    onChange={(e) => setCatForm({ ...catForm, slaHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Chi Tiết</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả tiêu chí nhận diện cho danh mục này..."
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Lưu Danh Mục
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
