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
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [votedArticles, setVotedArticles] = useState({}); // { [id]: 'up' | 'down' }

  // 4 Main Knowledge Categories
  const categories = [
    { id: 'VPN_NET', title: 'Mạng & Truy Cập VPN', count: 4, desc: 'Kết nối mạng wifi nội bộ, remote VPN FortiClient, thông số IP' },
    { id: 'OFFICE_MAIL', title: 'Email & Ứng Dụng Văn Phòng', count: 3, desc: 'Cấu hình Outlook, Microsoft 365, lưu trữ OneDrive, Teams' },
    { id: 'PRINTER_HW', title: 'Máy In & Thiết Bị Ngoại Vi', count: 2, desc: 'Kết nối máy in qua IP, máy scan tài liệu, lỗi kẹt giấy' },
    { id: 'AUTH_SEC', title: 'Tài Khoản & Bảo Mật', count: 3, desc: 'Tự khôi phục mật khẩu Domain AD, kích hoạt 2FA, chính sách bảo mật' },
  ];

  // Rich Technical Knowledge Base Articles
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Hướng dẫn cài đặt và cấu hình VPN FortiClient truy cập mạng cơ quan từ xa',
      category: 'VPN_NET',
      categoryName: 'Mạng & Truy Cập VPN',
      author: 'Lê Văn Cường (Senior Network)',
      views: 1540,
      likes: 124,
      updated: '25/09/2026',
      summary: 'Các bước cài đặt phần mềm FortiClient SSL-VPN, cấu hình Gateway Host và xác thực bằng mã OTP để truy cập tài nguyên nội bộ an toàn.',
      content: `### 1. Yêu cầu tiên quyết
- Máy tính cá nhân chạy hệ điều hành Windows 10/11 hoặc macOS 12 trở lên.
- Đã được cấp tài khoản Domain nội bộ và ứng dụng xác thực Google Authenticator.

### 2. Các bước cấu hình VPN FortiClient:
1. **Tải phần mềm**: Truy cập trang tải nội bộ hoặc bộ cài do phòng IT cung cấp (\`FortiClientVPNSetup_v7.exe\`).
2. **Khởi động ứng dụng**: Sau khi cài đặt hoàn tất, mở FortiClient và chọn **Configure VPN**.
3. **Điền thông số kết nối**:
   - **VPN Type**: Chọn **SSL-VPN**.
   - **Connection Name**: \`VPN Cong Ty - Noi Bo\`
   - **Remote Gateway**: \`vpn.dshinee.site\` (hoặc IP dự phòng: \`103.159.51.10\`)
   - **Customize Port**: Tích chọn và nhập cổng \`443\` (hoặc \`10443\` nếu mạng gia đình chặn 443).
   - **Enable Single Sign On (SSO)**: Bỏ chọn.
4. **Đăng nhập**:
   - Nhập **Username** và **Mật khẩu** tài khoản nội bộ của bạn.
   - Nhập chuỗi 6 số từ ứng dụng xác thực trên điện thoại khi có yêu cầu OTP.
5. **Kiểm tra kết nối**: Khi thanh tiến trình đạt **100%**, biểu tượng ổ khóa màu xanh lá cây xuất hiện trên thanh tác vụ Taskbar. Bạn đã có thể truy cập ổ đĩa chia sẻ và phần mềm nội bộ.`,
    },
    {
      id: 2,
      title: 'Cách xử lý khi Microsoft Outlook báo trạng thái "Disconnected" hoặc "Need Password"',
      category: 'OFFICE_MAIL',
      categoryName: 'Email & Ứng Dụng Văn Phòng',
      author: 'Trần Thị Bích (System Admin)',
      views: 1120,
      likes: 86,
      updated: '20/09/2026',
      summary: 'Khắc phục triệt để tình trạng Outlook không nhận được email mới, mất kết nối máy chủ Exchange Server do lưu trữ thông tin xác thực cũ.',
      content: `### Nguyên nhân thường gặp:
Lỗi xuất hiện khi bạn vừa đổi mật khẩu Windows Domain gần đây hoặc chứng chỉ xác thực trên Windows Credential Manager bị lỗi thời.

### Các bước khắc phục từng bước:
1. **Kiểm tra mạng Internet**:
   - Đảm bảo máy tính đang kết nối dây mạng LAN hoặc Wifi nội bộ của cơ quan. Nếu đang làm việc tại nhà, vui lòng bật kết nối **VPN**.
2. **Xóa thông tin xác thực cũ trong Windows**:
   - Bấm phím **Windows + S**, gõ tìm kiếm **Credential Manager** (Trình quản lý chứng thư).
   - Chọn mục **Windows Credentials**.
   - Tìm kiếm tất cả các mục có tên liên quan đến: \`MicrosoftOffice16_Data:SSPI\`, \`OneDriveCachedCredential\`, hoặc địa chỉ email của bạn.
   - Bấm vào mũi tên mở rộng và chọn **Remove** (Xóa bỏ).
3. **Khởi động lại Outlook**:
   - Tắt hoàn toàn Microsoft Outlook (đảm bảo không chạy ngầm trong Task Manager).
   - Mở lại Outlook, màn hình sẽ hiển thị hộp thoại yêu cầu đăng nhập mới.
   - Nhập đầy đủ địa chỉ email và mật khẩu mới nhất của bạn, tích chọn **Remember my credentials**.
4. **Xác nhận**: Trạng thái ở góc dưới bên phải Outlook sẽ chuyển từ \`Disconnected\` sang **Connected to: Microsoft Exchange**.`,
    },
    {
      id: 3,
      title: 'Hướng dẫn kết nối và map ổ đĩa chia sẻ nội bộ NAS (Z:) cho phòng ban',
      category: 'VPN_NET',
      categoryName: 'Mạng & Truy Cập VPN',
      author: 'Lê Văn Cường (Senior Network)',
      views: 890,
      likes: 67,
      updated: '18/09/2026',
      summary: 'Quy trình gắn ổ đĩa mạng dùng chung để truy cập tài liệu, biểu mẫu chung và sao lưu báo cáo công tác nội bộ.',
      content: `### Thông tin máy chủ lưu trữ:
- **Địa chỉ máy chủ**: \`\\\\192.168.1.250\\DataShare\` hoặc \`\\\\nas.company.local\\Shared\`
- **Ký tự ổ đĩa quy ước**: Ổ \`Z:\`

### Hướng dẫn Map Network Drive trên Windows:
1. Bấm tổ hợp phím **Windows + E** để mở cửa sổ **File Explorer**.
2. Bấm chuột phải vào mục **This PC** ở danh sách bên trái, chọn **Map network drive...**
3. Trong bảng cài đặt:
   - **Drive**: Chọn chữ cái **Z:**
   - **Folder**: Nhập chính xác đường dẫn: \`\\\\192.168.1.250\\DataShare\`
   - Tích chọn ô: **Reconnect at sign-in** (Tự động kết nối lại mỗi khi khởi động máy tính).
   - Tích chọn ô: **Connect using different credentials** (nếu máy tính của bạn không gia nhập Domain).
4. Bấm **Finish**. Khi hộp thoại bảo mật hiện lên, nhập:
   - User: \`company\\your_username\`
   - Password: Mật khẩu của bạn
5. Sau khi kết nối thành công, ổ đĩa Z: sẽ xuất hiện trong mục This PC giống như một ổ cứng thông thường.`,
    },
    {
      id: 4,
      title: 'Xử lý sự cố máy in mạng văn phòng báo Offline hoặc kẹt lệnh in (Print Spooler)',
      category: 'PRINTER_HW',
      categoryName: 'Máy In & Thiết Bị Ngoại Vi',
      author: 'Trần Văn Bình (Desktop Support)',
      views: 740,
      likes: 54,
      updated: '15/09/2026',
      summary: 'Cách reset dịch vụ Print Spooler của Windows để giải phóng hàng đợi in bị treo và kết nối lại máy in IP văn phòng.',
      content: `### Khi nào cần áp dụng:
Bạn bấm in tài liệu nhưng máy in không phản hồi, hàng đợi hiển thị nhiều tài liệu ở trạng thái \`Error - Printing\` hoặc máy in báo \`Offline\`.

### Cách 1: Khởi động lại dịch vụ Print Spooler bằng lệnh:
1. Bấm **Windows + S**, gõ **cmd**, bấm chuột phải chọn **Run as administrator**.
2. Nhập lần lượt các lệnh sau và bấm Enter:
   \`\`\`bash
   net stop spooler
   del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"
   net start spooler
   \`\`\`
3. Mở lại tệp và thử in lại 1 trang thử nghiệm.

### Cách 2: Kiểm tra kết nối mạng của máy in:
1. Kiểm tra màn hình máy in xem có báo lỗi hết giấy (Out of paper) hoặc kẹt giấy (Paper Jam) hay không.
2. Kiểm tra dây cáp mạng cắm phía sau máy in, đảm bảo đèn cổng mạng màu xanh lá đang sáng.
3. Địa chỉ IP máy in văn phòng các tầng:
   - Tầng 2 (Canon LBP 2900): \`192.168.1.201\`
   - Tầng 3 (HP LaserJet Pro M404dn): \`192.168.1.202\`
   - Tầng 4 (Ricoh MP 5055 Đa chức năng): \`192.168.1.203\``,
    },
    {
      id: 5,
      title: 'Quy tắc đặt mật khẩu bảo mật và hướng dẫn tự mở khóa tài khoản khi bị khóa 5 lần',
      category: 'AUTH_SEC',
      categoryName: 'Tài Khoản & Bảo Mật',
      author: 'Quản Trị Viên Hệ Thống',
      views: 980,
      likes: 72,
      updated: '10/09/2026',
      summary: 'Quy chuẩn an toàn thông tin cơ quan, chính sách hết hạn mật khẩu định kỳ 90 ngày và phương thức yêu cầu mở khóa tài khoản tự động.',
      content: `### Chính sách mật khẩu an toàn theo quy chuẩn cơ quan:
- Độ dài tối thiểu **8 ký tự**.
- Phải bao gồm ít nhất 3 trong 4 nhóm:
  + Chữ in hoa (A-Z)
  + Chữ in thường (a-z)
  + Chữ số (0-9)
  + Ký tự đặc biệt (!, @, #, $, %, ^, &...)
- Không được chứa họ tên hoặc tên đăng nhập của chính bạn.
- Không được trùng lặp với 5 mật khẩu sử dụng gần nhất.
- Thời hạn hiệu lực: Mật khẩu tự động hết hạn sau mỗi **90 ngày**.

### Khi tài khoản bị khóa sau 5 lần nhập sai:
- Hệ thống kích hoạt cơ chế tự bảo vệ và khóa tài khoản trong **15 phút**.
- Sau 15 phút, tài khoản sẽ tự động mở khóa để bạn thử lại.
- **Nếu cần xử lý khẩn cấp ngay**: Vui lòng liên hệ trực tiếp Hotline IT \`8888\` hoặc bấm nút **Tạo phiếu hỗ trợ khẩn cấp** bên dưới để Kỹ thuật viên reset mật khẩu ngay trong 5 phút.`,
    },
    {
      id: 6,
      title: 'Khắc phục lỗi mạng Wi-Fi "No Internet, Secured" hoặc xung đột địa chỉ IP',
      category: 'VPN_NET',
      categoryName: 'Mạng & Truy Cập VPN',
      author: 'Lê Văn Cường (Senior Network)',
      views: 620,
      likes: 45,
      updated: '05/09/2026',
      summary: 'Các lệnh làm mới bộ đệm DNS, cấp phát lại IP từ DHCP Server để khắc phục lỗi không thể truy cập website.',
      content: `### Thao tác làm mới card mạng nhanh bằng Command Prompt:
1. Bấm **Windows + X**, chọn **Terminal** hoặc **Command Prompt (Admin)**.
2. Gõ các lệnh bên dưới theo thứ tự:
   \`\`\`bash
   ipconfig /release
   ipconfig /flushdns
   ipconfig /renew
   \`\`\`
3. Lệnh trên sẽ giải phóng IP cũ, xóa toàn bộ cache DNS bị sai lệch và yêu cầu máy chủ cấp một dải IP hợp lệ mới.
4. Tắt Wi-Fi trên máy tính trong 5 giây sau đó bật lại và chọn đúng mạng Wi-Fi văn phòng: \`Company_Staff_5G\` (Mật khẩu: liên hệ Trưởng bộ phận).`,
    },
    {
      id: 7,
      title: 'Hướng dẫn cấu hình kết nối phần mềm kế toán MISA và sao lưu dữ liệu dự phòng',
      category: 'OFFICE_MAIL',
      categoryName: 'Email & Ứng Dụng Văn Phòng',
      author: 'Phạm Thị Lan (ERP Specialist)',
      views: 510,
      likes: 38,
      updated: '01/09/2026',
      summary: 'Cài đặt đường dẫn máy chủ cơ sở dữ liệu SQL Server cho kế toán viên mới nhận bàn giao máy trạm.',
      content: `### Thông số máy chủ MISA SME:
- **Tên máy chủ SQL**: \`SRV-MISA-2026\\MISASML2026\`
- **Cơ sở dữ liệu**: \`KT_DSHINEE_2026\`
- **Giao thức**: TCP/IP Port 1433

### Hướng dẫn kết nối:
1. Mở phần mềm **MISA** trên máy trạm.
2. Tại màn hình đăng nhập, bấm vào nút **Mở rộng** -> chọn **Đăng ký dữ liệu**.
3. Chọn máy chủ dữ liệu: Nhập \`192.168.1.15\` và bấm **Tìm kiếm**.
4. Chọn đúng tệp dữ liệu năm tài chính hiện hành.
5. Đăng nhập bằng tài khoản cá nhân do Trưởng phòng Kế toán phê duyệt.`,
    },
    {
      id: 8,
      title: 'Hướng dẫn kích hoạt xác thực 2 bước (2FA) bảo vệ tài khoản nhân viên',
      category: 'AUTH_SEC',
      categoryName: 'Tài Khoản & Bảo Mật',
      author: 'Quản Trị Viên Hệ Thống',
      views: 480,
      likes: 52,
      updated: '28/08/2026',
      summary: 'Kích hoạt bảo vệ 2 lớp ngăn chặn việc lộ lọt mật khẩu, truy cập trái phép vào dữ liệu cơ quan.',
      content: `### Tại sao bắt buộc dùng 2FA?
Xác thực 2 yếu tố yêu cầu ngoài mật khẩu, bạn cần nhập thêm mã bảo mật ngẫu nhiên sinh ra từ điện thoại, vô hiệu hóa hoàn toàn nguy cơ bị hacker đánh cắp tài khoản dù lộ mật khẩu.

### Cách cài đặt:
1. Cài đặt ứng dụng **Google Authenticator** hoặc **Microsoft Authenticator** trên điện thoại (iOS / Android).
2. Đăng nhập vào trang quản lý hồ sơ cá nhân: [Hồ sơ người dùng](/profile).
3. Tại mục **Bảo Mật & Xác Thực 2FA**, bấm **Kích Hoạt**.
4. Dùng camera điện thoại quét mã QR hiển thị trên màn hình.
5. Nhập 6 số xác nhận từ ứng dụng vào ô kiểm tra để hoàn tất.
6. Lưu lại **Mã khôi phục dự phòng (Recovery Keys)** vào nơi an toàn.`,
    },
  ]);

  // Form for New Article
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'VPN_NET',
    summary: '',
    content: '',
  });

  const handleVote = (articleId, type) => {
    if (votedArticles[articleId]) return;
    setVotedArticles({ ...votedArticles, [articleId]: type });
    if (type === 'up') {
      setArticles(
        articles.map((a) => (a.id === articleId ? { ...a, likes: a.likes + 1 } : a))
      );
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle({ ...selectedArticle, likes: selectedArticle.likes + 1 });
      }
    }
  };

  const handleOpenArticle = (art) => {
    // Increase view count
    setArticles(articles.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a)));
    setSelectedArticle({ ...art, views: art.views + 1 });
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    const catObj = categories.find((c) => c.id === newArticle.category);
    const created = {
      id: Date.now(),
      title: newArticle.title,
      category: newArticle.category,
      categoryName: catObj ? catObj.title : 'Hỗ trợ kỹ thuật',
      author: user?.fullName || 'Kỹ Thuật Viên IT',
      views: 1,
      likes: 1,
      updated: 'Vừa xong',
      summary: newArticle.summary || newArticle.content.substring(0, 120) + '...',
      content: newArticle.content,
    };

    setArticles([created, ...articles]);
    setNewArticle({ title: '', category: 'VPN_NET', summary: '', content: '' });
    setShowAddModal(false);
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 translate-y-[-5px]" />
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Create Article Button (Staff/Admin) */}
        {(user?.role === 'ADMIN' || user?.role === 'AGENT' || user?.role === 'MANAGER') && (
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            className="flex-shrink-0"
          >
            Đăng Bài Hướng Dẫn Mới
          </Button>
        )}
      </div>

      {/* Category Overview Cards */}
      {selectedCategory === 'ALL' && !searchTerm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
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
                <span>{cat.count} cẩm nang</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
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

                <div className="flex items-center space-x-4 self-end sm:self-center flex-shrink-0">
                  <div className="flex items-center space-x-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{art.likes}</span>
                  </div>
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
              Không có tài liệu nào chứa từ khóa "{searchTerm}". Vui lòng thử từ khóa khác hoặc gửi yêu cầu hỗ trợ trực tiếp.
            </p>
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
          </div>
        )}
      </Card>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
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
              <div className="flex items-center space-x-1 text-slate-400">
                <button
                  onClick={copyArticleLink}
                  className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Sao chép liên kết bài viết"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
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
              <div className="space-y-3 font-sans">
                {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-sm font-bold text-slate-900 mt-4 pt-2 border-t border-slate-100">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const code = lines.slice(1, -1).join('\n');
                    return (
                      <div key={pIdx} className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2 border border-slate-800">
                        <pre>{code}</pre>
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
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
                    setSelectedArticle(null);
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

      {/* CREATE ARTICLE MODAL (Admin/Agent) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Đăng Tải Hướng Dẫn Kỹ Thuật Mới</h3>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Chi Tiết (Từng bước) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="### 1. Chuẩn bị&#10;### 2. Các bước thực hiện&#10;Bước 1:...&#10;Bước 2:..."
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
                  Đăng Cẩm Nang
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
