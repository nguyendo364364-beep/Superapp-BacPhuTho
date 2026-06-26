import React, { useState, useEffect } from "react";
import contentData from "../data/contentData.json";

interface HeaderProps {
  onBackToHome: () => void;
  activeModule: string | null;
  onEndChat: () => void;
}

export default function Header({ onBackToHome, activeModule, onEndChat }: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const dateString = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setTime(`${dateString} | ${formatString}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#005B94] via-[#0072B8] to-[#005B94] text-white shadow-md border-b-2 border-[#E31A22]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={onBackToHome}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
          id="brand-logo-container"
        >
          <img 
            src={contentData.logoUrl} 
            alt="VietinBank Logo" 
            className="h-10 sm:h-12 w-auto object-contain bg-white/95 rounded px-2 py-1 shadow-sm transition-all group-hover:shadow"
          />
          <div className="h-8 w-[1px] bg-white/30 hidden sm:block"></div>
          <div>
            <h1 className="text-md sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              VietinBank
              <span className="text-xs bg-[#E31A22] text-white px-2 py-0.5 rounded font-medium">Bắc Phú Thọ</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-[#E2F1FC]">Nâng giá trị cuộc sống</p>
          </div>
        </div>

        {/* Real-time Clock & System Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-right">
          <div className="flex items-center gap-2 text-xs sm:text-sm bg-black/15 px-3 py-1.5 rounded-full border border-white/10 font-mono text-[#E2F1FC]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>{time}</span>
          </div>

          {activeModule && (
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-white text-[#0072B8] hover:bg-[#E2F1FC] transition-colors shadow-sm"
              id="header-home-btn"
            >
              Trở về Trang chủ
            </button>
          )}

          <button
            onClick={onEndChat}
            className="text-xs font-semibold px-3 py-1.5 rounded bg-[#E31A22] hover:bg-[#C01E2E] text-white transition-colors shadow-sm"
            id="header-end-btn"
          >
            Kết thúc giao dịch
          </button>
        </div>
      </div>
    </header>
  );
}
