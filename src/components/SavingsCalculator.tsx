import React, { useState, useEffect } from "react";
import { PiggyBank, HelpCircle, AlertCircle, Play, ArrowRight, Video, RotateCcw } from "lucide-react";
import contentData from "../data/contentData.json";

interface SavingsCalculatorProps {
  onBackToMainMenu: () => void;
  onEndChat: () => void;
}

export default function SavingsCalculator({ onBackToMainMenu, onEndChat }: SavingsCalculatorProps) {
  // States
  const [depositAmountRaw, setDepositAmountRaw] = useState("400000000"); // Default 400M
  const [selectedTermId, setSelectedTermId] = useState("12"); // Default 12 months
  const [interestRateRaw, setInterestRateRaw] = useState("4.7"); // Default for 12 months in JSON

  // Validation errors
  const [errors, setErrors] = useState<{
    amount?: string;
    term?: string;
    rate?: string;
  }>({});

  // Calculations
  const [interestEarned, setInterestEarned] = useState(0);
  const [totalMaturityAmount, setTotalMaturityAmount] = useState(0);

  // Sync interest rate with term selection
  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    const termObj = contentData.savingsInterest.terms.find(t => t.id === termId);
    if (termObj) {
      setInterestRateRaw(termObj.defaultRate.toString());
    }
  };

  // Helper to format currency
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Formatter for inputs (adds dots to number string)
  const formatNumberInput = (numStr: string) => {
    const cleaned = numStr.replace(/\D/g, "");
    if (!cleaned) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(cleaned, 10));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const val = e.target.value.replace(/\D/g, "");
    setDepositAmountRaw(val);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow digits and single dot/comma
    let val = e.target.value.replace(",", ".");
    // Filter non-decimal characters
    val = val.replace(/[^0-9.]/g, "");
    // Prevent multiple decimals
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }
    setInterestRateRaw(val);
  };

  // Run validation and calculations
  useEffect(() => {
    const newErrors: { amount?: string; term?: string; rate?: string } = {};
    const amount = parseFloat(depositAmountRaw);
    const rate = parseFloat(interestRateRaw);

    // Validate Deposit Amount
    if (!depositAmountRaw) {
      newErrors.amount = "Vui lòng nhập số tiền gửi hợp lệ.";
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền gửi hợp lệ.";
    } else if (amount < contentData.savingsInterest.minimumDeposit) {
      newErrors.amount = `Số tiền gửi nhỏ hơn mức tối thiểu quy định (${formatVND(contentData.savingsInterest.minimumDeposit)}).`;
    }

    // Validate Term
    if (!selectedTermId) {
      newErrors.term = "Vui lòng chọn kỳ hạn gửi.";
    }

    // Validate Interest Rate
    if (!interestRateRaw) {
      newErrors.rate = "Vui lòng nhập lãi suất hợp lệ.";
    } else if (isNaN(rate) || rate < 0) {
      newErrors.rate = "Vui lòng nhập lãi suất hợp lệ.";
    } else if (rate > contentData.savingsInterest.maxInterestRate) {
      newErrors.rate = `Lãi suất tối đa quy định là ${contentData.savingsInterest.maxInterestRate}%/năm.`;
    }

    setErrors(newErrors);

    // Calculate if no critical block errors
    if (!newErrors.amount && !newErrors.term && !newErrors.rate) {
      const termObj = contentData.savingsInterest.terms.find(t => t.id === selectedTermId);
      if (termObj) {
        const months = termObj.months;
        // Formula: Tiền lãi = Gốc * Lãi suất %/năm * (Kỳ hạn tháng / 12)
        const calculatedInterest = Math.round(amount * (rate / 100) * (months / 12));
        setInterestEarned(calculatedInterest);
        setTotalMaturityAmount(amount + calculatedInterest);
      }
    } else {
      setInterestEarned(0);
      setTotalMaturityAmount(0);
    }
  }, [depositAmountRaw, selectedTermId, interestRateRaw]);

  const handleReset = () => {
    setDepositAmountRaw("400000000");
    setSelectedTermId("12");
    setInterestRateRaw("4.7");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[580px] flex flex-col" id="savings-calculator-root">
      
      {/* Module Banner Header */}
      <div className="bg-gradient-to-r from-[#0072B8] to-[#005B94] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/20">
            <PiggyBank className="w-6 h-6 text-[#E2F1FC]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Công cụ tính lãi suất tiền gửi</h2>
            <p className="text-xs text-[#E2F1FC]/90">Tiết kiệm thông thường - Trực quan, chính xác nhất</p>
          </div>
        </div>
        <button
          onClick={onBackToMainMenu}
          className="text-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
        >
          Trở về Menu
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="max-w-5xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* INPUT FIELDS COLUMN (7 lines) */}
            <div className="lg:col-span-7 bg-slate-50/60 p-6 rounded-2xl border border-slate-100 space-y-5">
              <h3 className="text-sm font-bold text-[#0072B8] uppercase tracking-wider mb-2 border-b border-slate-200/60 pb-2 flex justify-between items-center">
                <span>Thông tin gửi tiết kiệm</span>
                <button 
                  onClick={handleReset}
                  className="text-xs flex items-center gap-1 text-slate-500 hover:text-[#E31A22] font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Đặt lại
                </button>
              </h3>

              {/* Input: Deposit Amount */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                  Số tiền gửi dự tính (VND) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type="text"
                    value={formatNumberInput(depositAmountRaw)}
                    onChange={handleAmountChange}
                    className={`block w-full rounded-xl border ${errors.amount ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-slate-300 focus:ring-[#0072B8] focus:border-[#0072B8]'} bg-white px-4 py-3 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2`}
                    placeholder="Nhập số tiền gửi (Ví dụ: 400.000.000)"
                    id="savings-amount-input"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-xs font-bold text-slate-400 font-mono">VND</span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.amount}
                  </p>
                )}
                {depositAmountRaw && !errors.amount && (
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    Bằng chữ: {(() => {
                      // Simple reader for small helper
                      const amount = parseInt(depositAmountRaw, 10);
                      if (amount >= 1000000000) {
                        return `${(amount / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 3 })} tỷ đồng`;
                      }
                      if (amount >= 1000000) {
                        return `${(amount / 1000000).toLocaleString("vi-VN")} triệu đồng`;
                      }
                      return "Không khả dụng";
                    })()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select: Term */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    Kỳ hạn <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTermId}
                    onChange={(e) => handleTermChange(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                    id="savings-term-select"
                  >
                    <option value="">-- Chọn kỳ hạn --</option>
                    {contentData.savingsInterest.terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.label} (Lãi suất: {term.defaultRate}%/năm)
                      </option>
                    ))}
                  </select>
                  {errors.term && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.term}
                    </p>
                  )}
                </div>

                {/* Input: Interest Rate */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    Lãi suất (% / năm) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <input
                      type="text"
                      value={interestRateRaw}
                      onChange={handleRateChange}
                      className={`block w-full rounded-xl border ${errors.rate ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-slate-300 focus:ring-[#0072B8] focus:border-[#0072B8]'} bg-white px-4 py-3 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2`}
                      placeholder="Lãi suất áp dụng"
                      id="savings-rate-input"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-xs font-bold text-slate-400 font-mono">%/năm</span>
                    </div>
                  </div>
                  {errors.rate && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.rate}
                    </p>
                  )}
                </div>
              </div>

              {/* Video guide link card */}
              <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl flex items-start gap-3 mt-4">
                <Video className="w-5 h-5 text-[#0072B8] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#0072B8] uppercase tracking-wider">Video hướng dẫn gửi tiết kiệm</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Xem clip hướng dẫn các bước mở sổ tiết kiệm thông minh tối ưu lãi suất trực tuyến của chuyên gia.
                  </p>
                  <a
                    href={contentData.savingsInterest.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#E31A22] hover:underline pt-1"
                    id="savings-tiktok-link"
                  >
                    <span>Truy cập video trên Tiktok</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* RESULTS VIEW COLUMN (5 lines) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#EAF2F6] to-[#F4F8FA] p-6 rounded-2xl border-2 border-[#E2F1FC] shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[#0072B8] uppercase tracking-wider border-b border-[#D0E2EC] pb-2">
                Kết quả dự toán (Lãi sau)
              </h3>

              <div className="space-y-5">
                {/* Interest display */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Số tiền lãi nhận được:</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#E31A22] font-mono tracking-tight" id="interest-earned-result">
                    {interestEarned > 0 ? formatVND(interestEarned) : "0 ₫"}
                  </div>
                </div>

                {/* Total display */}
                <div className="space-y-1 bg-white p-4 rounded-xl border border-[#D0E2EC]/60 shadow-inner">
                  <span className="text-xs text-slate-500 font-medium block">Tổng cộng (Gốc + Lãi nhận về):</span>
                  <div className="text-xl sm:text-2xl font-black text-[#0072B8] font-mono tracking-tight" id="total-amount-result">
                    {totalMaturityAmount > 0 ? formatVND(totalMaturityAmount) : "0 ₫"}
                  </div>
                </div>

                {/* Interest structure info */}
                <div className="text-xs text-slate-500 space-y-1.5 bg-black/5 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span>Số tiền gốc:</span>
                    <span className="font-semibold text-slate-700 font-mono">
                      {depositAmountRaw ? formatVND(parseFloat(depositAmountRaw)) : "0 ₫"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kỳ hạn gửi:</span>
                    <span className="font-semibold text-slate-700">
                      {contentData.savingsInterest.terms.find(t => t.id === selectedTermId)?.label || "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lãi suất cam kết:</span>
                    <span className="font-semibold text-slate-700 font-mono">
                      {interestRateRaw || "0"}%/năm
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Commitment banner */}
              <div className="p-3 bg-white/60 border border-[#D0E2EC] rounded-xl text-[11px] text-slate-500 leading-relaxed italic text-center">
                “VietinBank bảo đảm quyền lợi tài chính an toàn tuyệt đối và bảo mật thông tin tối đa cho tất cả khách hàng gửi tiết kiệm.”
              </div>
            </div>
          </div>

        </div>

        {/* Footer buttons */}
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
    </div>
  );
}
