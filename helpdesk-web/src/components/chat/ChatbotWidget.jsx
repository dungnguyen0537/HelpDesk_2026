import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  User,
  RotateCcw,
  PlusCircle,
  Minimize2,
  Maximize2,
  Loader2,
  Headphones,
  LifeBuoy,
} from 'lucide-react';
import { sendChatMessage } from '../../services/geminiService';
import { useAuthStore } from '../../store/authStore';

export default function ChatbotWidget() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Xin chào ${user?.fullName || 'bạn'}. Tôi là **Trợ Lý Kỹ Thuật Trực Tuyến** của hệ thống HelpDesk.

Tôi có thể hỗ trợ bạn:
* Hướng dẫn xử lý sự cố thiết bị phần cứng, máy in, mạng LAN, Wi-Fi, VPN.
* Khắc phục lỗi phần mềm văn phòng, Outlook, ERP và tài khoản truy cập.
* Hướng dẫn quy trình gửi phiếu hỗ trợ và thời gian cam kết dịch vụ (SLA).

Vui lòng mô tả vấn đề kỹ thuật bạn đang gặp phải để được trợ giúp.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Clean suggested prompt chips (no emojis)
  const suggestions = [
    'Máy in không nhận lệnh in',
    'Hướng dẫn kết nối VPN từ xa',
    'Mở khóa tài khoản do sai mật khẩu',
    'Quy định cam kết thời gian SLA',
    'Quy trình tạo phiếu yêu cầu mới',
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const botReply = await sendChatMessage(messages, query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Hệ thống hỗ trợ tự động tạm thời gián đoạn. Vui lòng liên hệ Hotline nội bộ 8888 hoặc tạo phiếu yêu cầu mới.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Đoạn hội thoại đã được làm mới. Vui lòng nhập nội dung sự cố bạn cần hỗ trợ.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCreateTicketRedirect = () => {
    setIsOpen(false);
    if (user?.role === 'CUSTOMER') {
      navigate('/portal/create-ticket');
    } else {
      navigate('/tickets/new');
    }
  };

  // Helper to format clean text
  const renderFormattedText = (content) => {
    return content.split('\n').map((line, idx) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processed.substring(2) }}
          />
        );
      }
      return (
        <p
          key={idx}
          className="text-xs leading-relaxed mb-1 min-h-[1rem]"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center space-x-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all duration-200 cursor-pointer border border-slate-700 hover:shadow-2xl"
        >
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary-400">
              <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>

          <div className="text-left hidden xs:block sm:block">
            <span className="block text-xs font-semibold leading-tight text-white">
              Hỗ Trợ Kỹ Thuật
            </span>
            <span className="block text-[10px] text-slate-400 leading-none mt-0.5">
              Trực tuyến 24/7
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-200 overflow-hidden ${
            isMinimized
              ? 'w-72 sm:w-80 h-14'
              : 'fixed inset-x-2 bottom-20 top-auto sm:static sm:inset-auto w-auto sm:w-[420px] h-[78vh] sm:h-[580px] max-h-[82vh] z-50'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400 relative">
                <LifeBuoy className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-xs text-white tracking-tight">
                  Trợ Lý Kỹ Thuật HelpDesk
                </h3>
                <p className="text-[10px] text-slate-400">
                  Hệ thống giải đáp sự cố tự động
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              {!isMinimized && (
                <button
                  onClick={handleClearChat}
                  className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Làm mới hội thoại"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                title="Đóng cửa sổ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message history */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Headphones className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {renderFormattedText(msg.text)}
                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none px-3.5 py-2.5 shadow-2xs">
                      <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                        <span>Đang xử lý câu trả lời...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              {messages.length <= 3 && (
                <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto">
                  <span className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                    Chủ đề hỗ trợ nhanh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200 transition-colors shadow-2xs whitespace-nowrap"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shortcut Banner to Create Ticket */}
              <div className="px-3.5 py-2 bg-primary-50/80 border-t border-primary-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Cần nhân viên kỹ thuật hỗ trợ trực tiếp?
                </span>
                <button
                  onClick={handleCreateTicketRedirect}
                  className="font-semibold text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center space-x-1 text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Tạo Phiếu Yêu Cầu</span>
                </button>
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    placeholder="Mô tả sự cố bạn đang gặp phải..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-slate-50"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-all shadow-sm flex-shrink-0"
                    title="Gửi"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
