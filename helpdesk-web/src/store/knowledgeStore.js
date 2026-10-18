import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const INITIAL_CATEGORIES = [
  {
    id: 'VPN_NET',
    title: 'Mạng & Truy Cập VPN',
    desc: 'Kết nối mạng wifi nội bộ, remote VPN FortiClient, thông số IP',
  },
  {
    id: 'OFFICE_MAIL',
    title: 'Email & Ứng Dụng Văn Phòng',
    desc: 'Cấu hình Outlook, Microsoft 365, lưu trữ OneDrive, Teams',
  },
  {
    id: 'PRINTER_HW',
    title: 'Máy In & Thiết Bị Ngoại Vi',
    desc: 'Kết nối máy in qua IP, máy scan tài liệu, lỗi kẹt giấy',
  },
  {
    id: 'AUTH_SEC',
    title: 'Tài Khoản & Bảo Mật',
    desc: 'Tự khôi phục mật khẩu Domain AD, kích hoạt 2FA, chính sách bảo mật',
  },
];

export const INITIAL_ARTICLES = [
  {
    id: 1,
    title: 'Hướng dẫn cài đặt và cấu hình VPN FortiClient truy cập mạng cơ quan từ xa',
    category: 'VPN_NET',
    categoryName: 'Mạng & Truy Cập VPN',
    author: 'Lê Văn Cường (Senior Network)',
    views: 1540,
    likes: 124,
    updated: '25/09/2026',
    summary:
      'Các bước cài đặt phần mềm FortiClient SSL-VPN, cấu hình Gateway Host và xác thực bằng mã OTP để truy cập tài nguyên nội bộ an toàn.',
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
    summary:
      'Khắc phục triệt để tình trạng Outlook không nhận được email mới, mất kết nối máy chủ Exchange Server do lưu trữ thông tin xác thực cũ.',
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
    summary:
      'Quy trình gắn ổ đĩa mạng dùng chung để truy cập tài liệu, biểu mẫu chung và sao lưu báo cáo công tác nội bộ.',
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
    summary:
      'Cách reset dịch vụ Print Spooler của Windows để giải phóng hàng đợi in bị treo và kết nối lại máy in IP văn phòng.',
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
    summary:
      'Quy chuẩn an toàn thông tin cơ quan, chính sách hết hạn mật khẩu định kỳ 90 ngày và phương thức yêu cầu mở khóa tài khoản tự động.',
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
    summary:
      'Các lệnh làm mới bộ đệm DNS, cấp phát lại IP từ DHCP Server để khắc phục lỗi không thể truy cập website.',
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
    summary:
      'Cài đặt đường dẫn máy chủ cơ sở dữ liệu SQL Server cho kế toán viên mới nhận bàn giao máy trạm.',
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
    summary:
      'Kích hoạt bảo vệ 2 lớp ngăn chặn việc lộ lọt mật khẩu, truy cập trái phép vào dữ liệu cơ quan.',
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
];

export const useKnowledgeStore = create(
  persist(
    (set, get) => ({
      articles: INITIAL_ARTICLES,
      categories: INITIAL_CATEGORIES,
      votedArticles: {}, // { [articleId]: 'up' | 'down' }

      // Get count of articles per category
      getCategoryCount: (catId) => {
        return get().articles.filter((a) => a.category === catId).length;
      },

      // Add a new article
      addArticle: (newArticle) => {
        const categories = get().categories;
        const catObj = categories.find((c) => c.id === newArticle.category);

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${now.getFullYear()}`;

        const created = {
          id: Date.now(),
          title: newArticle.title.trim(),
          category: newArticle.category,
          categoryName: catObj ? catObj.title : 'Hỗ trợ kỹ thuật',
          author: newArticle.author || 'Kỹ Thuật Viên IT',
          views: 1,
          likes: 0,
          updated: dateStr,
          summary:
            newArticle.summary?.trim() ||
            (newArticle.content.length > 120
              ? newArticle.content.substring(0, 120).trim() + '...'
              : newArticle.content),
          content: newArticle.content,
        };

        set((state) => ({
          articles: [created, ...state.articles],
        }));

        return created;
      },

      // Update an existing article
      updateArticle: (id, updatedFields) => {
        const categories = get().categories;
        const catObj = categories.find((c) => c.id === updatedFields.category);

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${now.getFullYear()}`;

        let updatedArticle = null;

        set((state) => ({
          articles: state.articles.map((a) => {
            if (a.id === id) {
              updatedArticle = {
                ...a,
                ...updatedFields,
                categoryName: catObj ? catObj.title : a.categoryName,
                updated: dateStr,
              };
              return updatedArticle;
            }
            return a;
          }),
        }));

        return updatedArticle;
      },

      // Delete an article by ID
      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        }));
      },

      // Vote on an article (helpful / unhelpful)
      voteArticle: (id, type) => {
        const { votedArticles, articles } = get();
        if (votedArticles[id]) return;

        set({
          votedArticles: { ...votedArticles, [id]: type },
          articles: articles.map((a) => {
            if (a.id === id) {
              return {
                ...a,
                likes: type === 'up' ? a.likes + 1 : a.likes,
              };
            }
            return a;
          }),
        });
      },

      // Increment views count
      incrementViews: (id) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, views: a.views + 1 } : a
          ),
        }));
      },

      // Reset to initial articles
      resetToDefaults: () => {
        set({
          articles: INITIAL_ARTICLES,
          categories: INITIAL_CATEGORIES,
          votedArticles: {},
        });
      },
    }),
    {
      name: 'helpdesk_knowledge_store',
    }
  )
);
