import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  PlusCircle,
  Minimize2,
  Maximize2,
  ChevronDown,
  Loader2,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
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
      text: `Xin chào ${user?.fullName || 'bạn'}! 👋 Tôi là **Trợ lý Ảo AI HelpDesk** (được cung cấp bởi Google Gemini).

Tôi có thể giúp bạn:
* 💡 Hướng dẫn tự sửa các lỗi máy in, mạng Wi-Fi, VPN, Outlook, ERP...
* ⏱️ Giải đáp quy định cam kết thời gian hỗ trợ (SLA).
* 📝 Hướng dẫn tạo phiếu hỗ trợ kỹ thuật đến đúng phòng ban.

Bạn đang gặp sự cố nào cần tôi hỗ trợ ngay không?`,
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

  // Suggested prompt chips
  const suggestions = [
    'Máy in không nhận lệnh in',
    'Cách kết nối VPN làm việc từ xa',
    'Tài khoản bị khóa vì sai mật khẩu',
    'Cam kết thời gian xử lý sự cố SLA',
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
          text: 'Xin lỗi bạn, có sự cố kết nối với máy chủ AI. Bạn vui lòng thử lại hoặc gọi Hotline **8888** nhé!',
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
        text: 'Cuộc trò chuyện đã được làm mới. Tôi sẵn sàng lắng nghe sự cố kỹ thuật tiếp theo của bạn!',
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

  // Helper to format simple markdown-like text
  const renderFormattedText = (content) => {
    return content.split('\n').map((line, idx) => {
      // Bold rendering
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet list item
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
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-primary-600 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-primary-600 rounded-full"></span>
          </div>

          <div className="text-left">
            <span className="block text-xs font-bold leading-tight flex items-center space-x-1">
              <span>Hỏi Trợ Lý AI</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="block text-[10px] text-primary-200 leading-none mt-0.5">
              Tư vấn kỹ thuật 24/7
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 text-white p-4 flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center shadow-inner relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center space-x-1.5">
                  <span>HelpDesk AI Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                    Gemini
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Trực tuyến 24/7 • Chuyên sâu CNTT</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              {!isMinimized && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Xóa làm mới đoạn hội thoại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Đóng cửa sổ chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message history */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {renderFormattedText(msg.text)}
                      <span
                        className={`block text-[10px] mt-1.5 text-right ${
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
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                      <div className="flex items-center space-x-1.5 text-primary-600">
                        <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[11px] text-slate-500 font-medium ml-1">
                          Gemini AI đang suy nghĩ...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              {messages.length <= 3 && (
                <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/60 overflow-x-auto">
                  <span className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Gợi ý câu hỏi nhanh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-600 border border-slate-200 transition-colors shadow-2xs whitespace-nowrap"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shortcut Banner to Create Ticket */}
              <div className="px-4 py-2 bg-primary-50/70 border-t border-primary-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-medium">
                  Cần kỹ thuật viên sửa tận nơi?
                </span>
                <button
                  onClick={handleCreateTicketRedirect}
                  className="font-bold text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Tạo Ticket Ngay</span>
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
                    placeholder="Mô tả sự cố bạn gặp phải..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-slate-50"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white transition-all shadow-sm flex-shrink-0"
                    title="Gửi tin nhắn"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-1.5">
                  AI chuyên biệt cho HelpDesk • Powered by Google AI Studio
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
