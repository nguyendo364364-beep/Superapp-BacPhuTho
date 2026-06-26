import React, { useState } from "react";
import { HelpCircle, ChevronRight, ChevronLeft, ArrowRight, Play, CheckCircle2, AlertTriangle, Phone, RefreshCw } from "lucide-react";
import contentData from "../data/contentData.json";

interface FAQModuleProps {
  onBackToMainMenu: () => void;
  onEndChat: () => void;
}

export default function FAQModule({ onBackToMainMenu, onEndChat }: FAQModuleProps) {
  const [mode, setMode] = useState<"menu" | "guide" | "feedback" | "support">("menu");
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Get current selected FAQ
  const currentFaq = contentData.faqs.find(faq => faq.id === selectedFaqId);

  const handleSelectFaq = (faqId: string) => {
    setSelectedFaqId(faqId);
    setCurrentStepIndex(0);
    setMode("guide");
  };

  const handleNextStep = () => {
    if (currentFaq && currentStepIndex < currentFaq.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Reached the end of steps, go to feedback screen
      setMode("feedback");
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      setMode("menu");
    }
  };

  const handleFeedbackResponse = (isOk: boolean) => {
    if (isOk) {
      // If OK, go back to menu
      setMode("menu");
      setSelectedFaqId(null);
    } else {
      // If NOT OK, show the contact info of Tran Hoang Trung
      setMode("support");
    }
  };

  const handleRestartFaq = () => {
    setMode("menu");
    setSelectedFaqId(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[580px] flex flex-col" id="faq-module-root">
      
      {/* FAQ Banner Header */}
      <div className="bg-gradient-to-r from-[#0072B8] to-[#005B94] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/20">
            <HelpCircle className="w-6 h-6 text-[#E2F1FC]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Giải đáp thắc mắc khách hàng</h2>
            <p className="text-xs text-[#E2F1FC]/90">Hướng dẫn trực quan từng bước giúp quý khách tự xử lý giao dịch</p>
          </div>
        </div>
        <button
          onClick={onBackToMainMenu}
          className="text-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
          id="faq-back-home-btn"
        >
          Trở về Menu
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        
        {/* MODE: MENU */}
        {mode === "menu" && (
          <div className="animate-fade-in flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center mt-2">
                Anh/chị đang gặp khó khăn với nội dung nào?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Vui lòng chọn một trong các thẻ hướng dẫn nhanh dưới đây
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {contentData.faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    onClick={() => handleSelectFaq(faq.id)}
                    className="group border border-slate-200 hover:border-[#0072B8] rounded-xl p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between"
                    id={`faq-card-${faq.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0072B8] bg-[#E2F1FC] px-2 py-0.5 rounded">
                          HƯỚNG DẪN 0{idx + 1}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0072B8] transition-colors" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-base group-hover:text-[#0072B8] transition-colors mb-1.5">
                        {faq.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {faq.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E31A22]"></span>
                        {faq.steps.length} bước thực hiện
                      </span>
                      <span className="font-semibold text-[#0072B8] group-hover:underline">
                        Bắt đầu xem →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-100 pt-6">
              <button
                onClick={onBackToMainMenu}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors text-center"
              >
                Quay lại menu chính
              </button>
              <button
                onClick={onEndChat}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E31A22] hover:bg-[#C01E2E] text-white font-semibold text-sm transition-colors text-center shadow-sm"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        )}

        {/* MODE: STEP BY STEP GUIDE */}
        {mode === "guide" && currentFaq && (
          <div className="animate-fade-in flex-1 flex flex-col justify-between">
            <div>
              {/* Guide Header with Youtube video launch */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0072B8]">{currentFaq.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">Tiến trình:</span>
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#0072B8] h-full transition-all duration-300"
                        style={{ width: `${((currentStepIndex + 1) / currentFaq.steps.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#0072B8]">
                      {currentStepIndex + 1} / {currentFaq.steps.length}
                    </span>
                  </div>
                </div>

                {/* Youtube link icon trigger */}
                <a
                  href={currentFaq.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold bg-[#E31A22] text-white hover:bg-[#C01E2E] px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                  id={`faq-youtube-link-${currentFaq.id}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Xem video hướng dẫn trên Youtube</span>
                </a>
              </div>

              {/* Step Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
                {/* Step Instruction text */}
                <div className="md:col-span-5 space-y-4">
                  <div className="inline-flex items-center justify-center bg-[#E2F1FC] text-[#0072B8] w-12 h-12 rounded-full font-bold text-lg border-2 border-white shadow-md">
                    {currentStepIndex + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Hướng dẫn chi tiết:
                    </h4>
                    <p className="text-base font-medium text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {currentFaq.steps[currentStepIndex].text}
                    </p>
                  </div>
                </div>

                {/* Step Illustration Image */}
                <div className="md:col-span-7 flex justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-inner max-h-[350px] relative overflow-hidden group">
                  <img
                    src={currentFaq.steps[currentStepIndex].image}
                    alt={`${currentFaq.title} - Bước ${currentStepIndex + 1}`}
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-sm transition-transform group-hover:scale-105 duration-300"
                    onError={(e) => {
                      // Fallback image source if URL fails
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                    Hình minh hoạ {currentFaq.id === "forgot-ipay" ? "1." : currentFaq.id === "close-card" ? "2." : "3."}
                    {currentFaq.steps[currentStepIndex].index}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 gap-4">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors flex items-center gap-1.5"
                id="faq-prev-step-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                {currentStepIndex === 0 ? "Quay lại danh sách" : "Bước trước"}
              </button>

              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#0072B8] hover:bg-[#005B94] text-white font-semibold text-sm transition-colors flex items-center gap-1.5 shadow-md shadow-blue-50"
                id="faq-next-step-btn"
              >
                <span>{currentStepIndex === currentFaq.steps.length - 1 ? "Hoàn tất" : "Bước tiếp theo"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE: FEEDBACK */}
        {mode === "feedback" && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center items-center max-w-lg mx-auto py-8">
            <div className="bg-[#E2F1FC] p-4 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-[#0072B8]" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
              Quý khách đã thực hiện thành công hay chưa?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">
              Hãy cho chúng tôi biết nếu bạn gặp bất kỳ sự cố nào để hệ thống được hỗ trợ hoặc kết nối chuyên viên trực tiếp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
              <button
                onClick={() => handleFeedbackResponse(true)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-100 transition-all text-center"
                id="feedback-ok-btn"
              >
                Dạ đã ổn (Xong)
              </button>
              <button
                onClick={() => handleFeedbackResponse(false)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#E31A22] hover:bg-[#C01E2E] active:scale-95 text-white font-bold text-base shadow-lg shadow-red-100 transition-all text-center"
                id="feedback-fail-btn"
              >
                Dạ chưa ổn (Cần hỗ trợ)
              </button>
            </div>

            <div className="flex gap-4 border-t border-slate-100 pt-6 w-full justify-center">
              <button
                onClick={handleRestartFaq}
                className="text-xs font-semibold text-[#0072B8] hover:underline"
              >
                Quay lại danh mục thắc mắc
              </button>
            </div>
          </div>
        )}

        {/* MODE: SUPPORT FROM ADVISOR */}
        {mode === "support" && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center max-w-2xl mx-auto py-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    Cảm ơn Quý khách đã phản hồi. Quý khách có thể liên hệ Chuyên viên tư vấn{" "}
                    <strong className="font-bold text-slate-900">{contentData.advisor.name}</strong> – số điện thoại:{" "}
                    <strong className="font-mono text-[#E31A22]">{contentData.advisor.phone}</strong> để hỗ trợ trực tiếp.
                    Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn!
                  </p>
                </div>
              </div>
            </div>

            {/* Advisor profile details */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[#E2F1FC] border border-blue-200 flex items-center justify-center text-[#0072B8] font-black text-2xl shadow-sm">
                TH
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{contentData.advisor.name}</h4>
                  <p className="text-xs text-slate-500">Chuyên viên tư vấn Khách hàng Cá nhân - CN Bắc Phú Thọ</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center pt-1 justify-center sm:justify-start">
                  <a
                    href={`tel:${contentData.advisor.phone}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-[#0072B8] hover:bg-[#005B94] px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi {contentData.advisor.phone}</span>
                  </a>
                  <span className="text-xs text-slate-400 font-medium">Hỗ trợ nhanh 24/7 qua cuộc gọi</span>
                </div>
              </div>
            </div>

            {/* Menu buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-150 pt-6">
              <button
                onClick={handleRestartFaq}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors text-center"
              >
                Quay lại danh mục giải đáp
              </button>
              <button
                onClick={onBackToMainMenu}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0072B8] hover:bg-[#005B94] text-white font-semibold text-sm transition-colors text-center shadow-sm"
              >
                Trở lại menu chính
              </button>
              <button
                onClick={onEndChat}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E31A22] hover:bg-[#C01E2E] text-white font-semibold text-sm transition-colors text-center shadow-sm"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
