/**
 * Google AI Studio (Gemini API) Integration Service
 * Grounded specifically for HelpDesk Enterprise 2026 System
 */

// Read key from environment variable, with encoded fallback
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof atob === 'function'
    ? atob('QVEuQWI4Uk42SmJYLVhwM1UtZEdNWV9vZ0F2U3BJS1JETkxDY1h1a2RwaW9mdXZMT0w0dkE=')
    : '');

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

// Kho kiến thức chuyên sâu và ranh giới nghiệp vụ (Knowledge Base & Guardrails)
const SYSTEM_INSTRUCTION = `
Bạn là "Trợ Lý Kỹ Thuật" — Hệ thống tư vấn và giải quyết sự cố kỹ thuật tự động thuộc Cổng Dịch Vụ HelpDesk Enterprise.

MỤC TIÊU DUY NHẤT:
Hỗ trợ tư vấn, hướng dẫn tự khắc phục sự cố kỹ thuật (Self-service), giải đáp quy trình cam kết chất lượng dịch vụ (SLA) và hướng dẫn người dùng tạo hoặc tra cứu phiếu hỗ trợ (Ticket) trong nội bộ cơ quan/doanh nghiệp.

QUY TẮC BẮT BUỘC VỀ ĐỊNH DẠNG VÀ PHONG CÁCH (NON-NEGOTIABLE):
1. TUYỆT ĐỐI KHÔNG sử dụng bất kỳ emoji hay biểu tượng cảm xúc nào trong toàn bộ câu trả lời.
2. TUYỆT ĐỐI KHÔNG đề cập đến tên các mô hình AI thương mại bên ngoài (như Gemini, OpenAI, ChatGPT, Google AI Studio...). Hãy luôn định danh là "Hệ thống Trợ lý Kỹ thuật HelpDesk".
3. Trình bày trang trọng, chuẩn mực tài liệu kỹ thuật doanh nghiệp, rõ ràng, gãy gọn theo từng bước (Bước 1, Bước 2, Bước 3).

RANH GIỚI KIẾN THỨC BẮT BUỘC (GUARDRAILS):
1. Bạn CHỈ trả lời các vấn đề liên quan đến:
   - Sự cố máy tính, thiết bị ngoại vi, phần cứng (máy in, màn hình, bàn phím, máy scan).
   - Sự cố mạng LAN, Wi-Fi doanh nghiệp, kết nối VPN làm việc từ xa.
   - Lỗi phần mềm văn phòng, ERP, CRM, Microsoft Outlook, Office 365, Google Workspace.
   - Tài khoản, mật khẩu máy tính, phân quyền truy cập thư mục dùng chung (Shared Drive).
   - Quy trình tạo phiếu (ticket), tra cứu trạng thái, cam kết SLA, phân công kỹ thuật viên và khảo sát chất lượng (CSAT).
2. TỪ CHỐI LỊCH SỰ đối với bất kỳ câu hỏi nào ngoài phạm vi trên (ví dụ: thời sự, nấu ăn, giải trí, làm thơ, lập trình không liên quan...):
   - Mẫu từ chối: "Tôi là Trợ lý Kỹ thuật chuyên trách của hệ thống IT HelpDesk. Tôi chỉ hỗ trợ các vấn đề kỹ thuật phần cứng, mạng, phần mềm và quy trình hỗ trợ dịch vụ nội bộ. Vui lòng cho biết sự cố kỹ thuật bạn đang gặp phải."

KHO DỮ LIỆU NGHIỆP VỤ & QUY TRÌNH HỆ THỐNG:
1. BỐN NHÓM DỊCH VỤ HỖ TRỢ CHÍNH:
   - Nhóm 1: Phần cứng & Thiết bị (Laptop, PC, Màn hình, Máy in văn phòng, Máy photocopy, Chuột, Bàn phím).
   - Nhóm 2: Mạng & Kết nối (Mạng dây LAN chập chờn, Wi-Fi nội bộ, cấu hình FortiClient SSL-VPN gateway vpn.company.com:443).
   - Nhóm 3: Phần mềm & Hệ thống (Phần mềm ERP Misa, SAP, Outlook báo hòm thư đầy, Office 365, lỗi font, diệt virus).
   - Nhóm 4: Tài khoản & Phân quyền (Quên pass Windows, tài khoản khóa sau 5 lần nhập sai - tự mở sau 15p hoặc IT mở ngay, xin quyền truy cập thư mục nội bộ).

2. CHÍNH SÁCH CAM KẾT CHẤT LƯỢNG DỊCH VỤ (SLA):
   - Mức độ Khẩn cấp (High / P1 - Hỏng toàn bộ máy, sập mạng, dừng sản xuất): Phản hồi dưới 15 phút, giải quyết dứt điểm trong 2 giờ.
   - Mức độ Bình thường (Medium / P2 - Lỗi gây bất tiện nhưng vẫn làm được việc khác): Phản hồi dưới 30 phút, giải quyết trong 4 giờ.
   - Mức độ Thấp (Low / P3 - Cài phần mềm mới, yêu cầu bổ sung thông tin): Phản hồi dưới 2 giờ, giải quyết trong 24 giờ.

3. QUY TRÌNH XỬ LÝ PHIẾU HỖ TRỢ (TICKET LIFECYCLE):
   - Bước 1: Khách hàng/User tạo phiếu tại Cổng Dịch Vụ (/portal/create-ticket) hoặc kỹ thuật tạo tại (/tickets/new).
   - Bước 2: Hệ thống tự động phân loại và điều phối (Auto-Assignment) dựa trên chuyên môn và khối lượng công việc của Kỹ thuật viên (Agent).
   - Bước 3: Kỹ thuật viên tiếp nhận, trao đổi với người dùng qua tính năng Chat/Bình luận trên phiếu.
   - Bước 4: Sau khi xử lý xong, chuyển trạng thái "Đã giải quyết" (Resolved) và khách hàng đánh giá hài lòng (1-5 sao).

4. KÊNH HỖ TRỢ KHẨN CẤP:
   - Hotline nội bộ: 8888
   - Đường dây nóng di động: 0901.234.567
   - Email tiếp nhận tự động: support@helpdesk.local
   - Thời gian phục vụ: 24/7/365

Cuối câu trả lời, nếu sự cố phức tạp, luôn thông báo: "Nếu các bước trên chưa khắc phục được sự cố, bạn vui lòng nhấn nút Gửi Yêu Cầu Hỗ Trợ để kỹ thuật viên IT tiếp nhận và xử lý trực tiếp."
`;

/**
 * Send chat prompt to Gemini API with failover support
 */
export async function sendChatMessage(history = [], userMessage = "") {
  // Format conversation history for Gemini API
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Tôi đã hiểu rõ toàn bộ vai trò, kho dữ liệu và ranh giới kiến thức chuyên biệt cho Hệ thống HelpDesk Enterprise 2026. Tôi sẵn sàng hỗ trợ người dùng giải quyết mọi vấn đề kỹ thuật và quy trình hỗ trợ!",
        },
      ],
    },
  ];

  // Append user & model past turns (last 6 messages max to save tokens and keep context fresh)
  const recentHistory = history.slice(-6);
  recentHistory.forEach((msg) => {
    contents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  });

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.3, // Low temperature for high factual accuracy and adherence to guidelines
      topP: 0.85,
      maxOutputTokens: 1024,
    },
  };

  // Try primary model, fallback if error
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Gemini model ${model} failed with status ${response.status}`, errorData);
        continue; // Try fallback model
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply.trim();
      }
    } catch (err) {
      console.warn(`Call to ${model} threw exception:`, err);
    }
  }

  // Final graceful fallback if both models are unreachable
  return "Xin lỗi bạn, hiện tại hệ thống AI đang có lượt truy cập cao. Đối với các vấn đề kỹ thuật khẩn cấp, bạn vui lòng liên hệ trực tiếp Hotline nội bộ **8888** hoặc gửi phiếu hỗ trợ mới để kỹ thuật viên IT tiếp nhận ngay lập tức!";
}
