import React from "react";
import { CheckCircle, Heart, RefreshCw } from "lucide-react";
import contentData from "../data/contentData.json";

interface EndConversationModalProps {
  onRestartSession: () => void;
}

export default function EndConversationModal({ onRestartSession }: EndConversationModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in" id="end-conversation-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl border-t-4 border-[#E31A22] animate-scale-up space-y-6">
        
        {/* Large VietinBank Logo */}
        <div className="flex justify-center mb-2">
          <img 
            src={contentData.logoUrl} 
            alt="VietinBank" 
            className="h-16 w-auto object-contain bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
          />
        </div>

        {/* Polished interactive heart icon */}
        <div className="mx-auto bg-red-50 text-[#E31A22] w-16 h-16 rounded-full flex items-center justify-center shadow-md animate-pulse">
          <Heart className="w-8 h-8 fill-current" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-800">Cảm ơn Quý khách!</h3>
          <p className="text-base font-semibold text-[#0072B8] leading-relaxed px-2">
            Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank. Chúc Quý khách một ngày tốt lành!
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-50 py-2.5 px-4 rounded-xl leading-relaxed italic border border-slate-100">
          “Chúng tôi luôn nỗ lực không ngừng cải tiến dịch vụ để mang đến trải nghiệm hài lòng vượt trội cho Quý khách.”
        </div>

        <div className="pt-4">
          <button
            onClick={onRestartSession}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#0072B8] to-[#005B94] hover:from-[#005B94] hover:to-[#0072B8] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
            id="modal-restart-session-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Bắt đầu cuộc trò chuyện mới</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400">VietinBank - Kiosk thông tin tự phục vụ quầy giao dịch</p>
      </div>
    </div>
  );
}
