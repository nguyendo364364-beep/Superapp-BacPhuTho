import React, { useState } from "react";
import Header from "./components/Header";
import FAQModule from "./components/FAQModule";
import SavingsCalculator from "./components/SavingsCalculator";
import LoanCalculator from "./components/LoanCalculator";
import BranchNetwork from "./components/BranchNetwork";
import EndConversationModal from "./components/EndConversationModal";
import contentData from "./data/contentData.json";
import { HelpCircle, PiggyBank, Calculator, MapPin, ChevronRight, MessageSquareCode, Clock, Info } from "lucide-react";

export default function App() {
  const [activeModule, setActiveModule] = useState<"faq" | "savings" | "loan" | "branches" | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const handleSelectModule = (mod: "faq" | "savings" | "loan" | "branches") => {
    setActiveModule(mod);
  };

  const handleBackToHome = () => {
    setActiveModule(null);
  };

  const handleEndChat = () => {
    setShowEndModal(true);
  };

  const handleRestartSession = () => {
    setShowEndModal(false);
    setActiveModule(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans antialiased text-slate-800 selection:bg-[#0072B8] selection:text-white">
      {/* Header component */}
      <Header 
        onBackToHome={handleBackToHome} 
        activeModule={activeModule} 
        onEndChat={handleEndChat} 
      />

      {/* Main Kiosk Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeModule === null ? (
          // HOME MODULE SELECTOR DASHBOARD
          <div className="space-y-8 animate-fade-in" id="app-dashboard-home">
            
            {/* Banner of VietinBank */}
            <div className="bg-gradient-to-r from-[#E2F1FC] via-white to-[#E2F1FC] border border-[#0072B8]/20 rounded-2xl p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0072B8]/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E31A22]/5 rounded-full -ml-16 -mb-16"></div>
              
              <div className="max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#E31A22] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  KIOSK THÔNG TIN TỰ PHỤC VỤ
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0072B8] tracking-tight">
                  Chào mừng Quý khách đến với VietinBank!
                </h2>
                <h3 className="text-base sm:text-lg font-bold text-slate-700">
                  Anh/chị đang gặp khó khăn hoặc cần hỗ trợ với nội dung nào?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                  Vui lòng chọn một trong các dịch vụ thông tin nhanh tại quầy giao dịch dưới đây để nhận hướng dẫn hoặc lập lịch dự toán dòng tiền tức thì.
                </p>
              </div>
            </div>

            {/* Grid of 4 modular cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* Card 1: FAQs */}
              <div
                onClick={() => handleSelectModule("faq")}
                className="group relative bg-white rounded-2xl p-6 border border-slate-150 hover:border-[#0072B8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 items-start hover:-translate-y-0.5"
                id="home-module-faq-btn"
              >
                <div className="bg-[#E2F1FC] group-hover:bg-[#0072B8] text-[#0072B8] group-hover:text-white p-3.5 rounded-xl transition-all duration-300 shadow-sm shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-base group-hover:text-[#0072B8] transition-colors">
                      Giải đáp thắc mắc thường gặp
                    </h4>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0072B8] transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Xem hướng dẫn chi tiết từng bước bằng ảnh chụp thực tế và video Youtube để tự lấy lại mật khẩu iPay, đóng thẻ hay xác thực CCCD sinh trắc học.
                  </p>
                  <span className="text-xs font-bold text-[#0072B8] inline-flex items-center gap-1 group-hover:underline pt-1">
                    Bắt đầu tra cứu →
                  </span>
                </div>
              </div>

              {/* Card 2: Savings Calculator */}
              <div
                onClick={() => handleSelectModule("savings")}
                className="group relative bg-white rounded-2xl p-6 border border-slate-150 hover:border-[#0072B8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 items-start hover:-translate-y-0.5"
                id="home-module-savings-btn"
              >
                <div className="bg-[#E2F1FC] group-hover:bg-[#0072B8] text-[#0072B8] group-hover:text-white p-3.5 rounded-xl transition-all duration-300 shadow-sm shrink-0">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-base group-hover:text-[#0072B8] transition-colors">
                      Tính toán lãi suất tiền gửi
                    </h4>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0072B8] transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Công cụ lập dự toán nhanh tiền gửi tiết kiệm thông thường trả lãi sau. Nhập số tiền gửi và tùy chọn lãi suất kỳ hạn để xem tổng thu nhập.
                  </p>
                  <span className="text-xs font-bold text-[#0072B8] inline-flex items-center gap-1 group-hover:underline pt-1">
                    Mở bảng tính lãi →
                  </span>
                </div>
              </div>

              {/* Card 3: Loan Monthly Schedule */}
              <div
                onClick={() => handleSelectModule("loan")}
                className="group relative bg-white rounded-2xl p-6 border border-slate-150 hover:border-[#0072B8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 items-start hover:-translate-y-0.5"
                id="home-module-loan-btn"
              >
                <div className="bg-[#E2F1FC] group-hover:bg-[#0072B8] text-[#0072B8] group-hover:text-white p-3.5 rounded-xl transition-all duration-300 shadow-sm shrink-0">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-base group-hover:text-[#0072B8] transition-colors">
                      Lịch trả nợ vay hàng tháng
                    </h4>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0072B8] transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Tính lịch thanh toán định kỳ theo dư nợ giảm dần (Gốc trả đều, Lãi giảm dần). Hỗ trợ đổi chu kỳ trả nợ và áp quy tắc làm tròn 1.000đ chuyên biệt.
                  </p>
                  <span className="text-xs font-bold text-[#0072B8] inline-flex items-center gap-1 group-hover:underline pt-1">
                    Lập kế hoạch nợ →
                  </span>
                </div>
              </div>

              {/* Card 4: Branch network lookup */}
              <div
                onClick={() => handleSelectModule("branches")}
                className="group relative bg-white rounded-2xl p-6 border border-slate-150 hover:border-[#0072B8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 items-start hover:-translate-y-0.5"
                id="home-module-branches-btn"
              >
                <div className="bg-[#E2F1FC] group-hover:bg-[#0072B8] text-[#0072B8] group-hover:text-white p-3.5 rounded-xl transition-all duration-300 shadow-sm shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-base group-hover:text-[#0072B8] transition-colors">
                      Danh sách mạng lưới & bản đồ
                    </h4>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0072B8] transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Tra cứu 7 phòng giao dịch và trụ sở chính của VietinBank chi nhánh Bắc Phú Thọ. Nhúng bản đồ Google Maps và hướng dẫn chỉ đường đi chi tiết.
                  </p>
                  <span className="text-xs font-bold text-[#0072B8] inline-flex items-center gap-1 group-hover:underline pt-1">
                    Tìm quầy gần nhất →
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Helper Banner */}
            <div className="max-w-md mx-auto bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-inner">
              <Clock className="w-5 h-5 text-[#0072B8] shrink-0" />
              <div className="text-[11px] sm:text-xs text-slate-600 font-medium">
                <strong>Giờ mở cửa giao dịch tại quầy:</strong> Thứ 2 đến Thứ 6 (Sáng 07:30 - 11:30 | Chiều 13:00 - 16:30). Nghỉ Thứ 7 & Chủ Nhật.
              </div>
            </div>

            {/* End Conversation option floating next */}
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={handleEndChat}
                className="px-6 py-3 rounded-xl bg-[#E31A22] hover:bg-[#C01E2E] text-white font-extrabold text-sm transition-all shadow-md active:scale-95"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        ) : (
          // ACTIVE WORKSPACE CONTROLLERS
          <div className="space-y-6">
            {activeModule === "faq" && (
              <FAQModule 
                onBackToMainMenu={handleBackToHome} 
                onEndChat={handleEndChat} 
              />
            )}
            {activeModule === "savings" && (
              <SavingsCalculator 
                onBackToMainMenu={handleBackToHome} 
                onEndChat={handleEndChat} 
              />
            )}
            {activeModule === "loan" && (
              <LoanCalculator 
                onBackToMainMenu={handleBackToHome} 
                onEndChat={handleEndChat} 
              />
            )}
            {activeModule === "branches" && (
              <BranchNetwork 
                onBackToMainMenu={handleBackToHome} 
                onEndChat={handleEndChat} 
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Branding credits */}
      <footer className="bg-slate-800 text-slate-400 py-4 border-t border-slate-700 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 Ngân hàng TMCP Công Thương Việt Nam - VietinBank. Tất cả quyền được bảo lưu.</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Hỗ trợ giao dịch viên số VietinBank iPay</span>
        </div>
      </footer>

      {/* MODAL: END CONVERSATION OVERLAY THANK YOU */}
      {showEndModal && (
        <EndConversationModal onRestartSession={handleRestartSession} />
      )}
    </div>
  );
}
