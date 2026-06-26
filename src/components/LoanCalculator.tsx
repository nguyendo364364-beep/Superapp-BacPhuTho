import React, { useState, useEffect } from "react";
import { Calculator, Calendar, Landmark, Coins, AlertCircle, Eye, X, Download, HelpCircle, RotateCcw } from "lucide-react";

interface LoanCalculatorProps {
  onBackToMainMenu: () => void;
  onEndChat: () => void;
}

interface ScheduleRow {
  period: number;
  paymentDate: string;
  startBalance: number;
  principal: number;
  interest: number;
  total: number;
  endBalance: number;
}

export default function LoanCalculator({ onBackToMainMenu, onEndChat }: LoanCalculatorProps) {
  // Input States
  const [propertyValueRaw, setPropertyValueRaw] = useState("33333333333"); // Default 33.3B VND
  const [loanAmountRaw, setLoanAmountRaw] = useState("6666666667"); // Default 6.6B VND
  const [loanTerm, setLoanTerm] = useState("240"); // 240 months
  const [annualRate, setAnnualRate] = useState("8"); // 8% per year
  const [disbursementDate, setDisbursementDate] = useState("2026-06-16"); // Default 16/06/2026
  const [repaymentCycle, setRepaymentCycle] = useState<"monthly" | "quarterly" | "semi-annually" | "annually">("monthly");
  const [paymentDay, setPaymentDay] = useState("25"); // Default Day 25
  const [roundingRule, setRoundingRule] = useState<"1" | "1000">("1000"); // Default 1.000 VND

  // Modal State
  const [showModal, setShowModal] = useState(false);

  // Computed states
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [summary, setSummary] = useState({
    maxPayment: 0,
    minPayment: 0,
    totalInterest: 0,
    totalRepayment: 0,
  });

  // Errors
  const [errors, setErrors] = useState<{
    loanAmount?: string;
    term?: string;
    rate?: string;
  }>({});

  // Helper formatting
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatNumberInput = (numStr: string) => {
    const cleaned = numStr.replace(/\D/g, "");
    if (!cleaned) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(cleaned, 10));
  };

  // Helper date parsing/generation
  const formatDateToVietnamese = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const generatePaymentDate = (disbDateStr: string, periodIndex: number, cycleMonths: number, selectedPayDay: number) => {
    const disbDate = new Date(disbDateStr);
    if (isNaN(disbDate.getTime())) return "";

    const monthsToAdd = periodIndex * cycleMonths;
    // Calculate target year and month
    let targetYear = disbDate.getFullYear();
    let targetMonth = disbDate.getMonth() + monthsToAdd; // 0-indexed

    // Year adjustment
    targetYear += Math.floor(targetMonth / 12);
    targetMonth = targetMonth % 12;

    // Days in target month
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    // Clip target payment day to maximum days of month (e.g. if Feb has 28 days and selectedDay is 31)
    const targetDay = Math.min(selectedPayDay, daysInMonth);

    const payDate = new Date(targetYear, targetMonth, targetDay);
    
    // Format as DD/MM/YYYY
    const d = String(payDate.getDate()).padStart(2, "0");
    const m = String(payDate.getMonth() + 1).padStart(2, "0");
    const y = payDate.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Core business calculation
  useEffect(() => {
    const newErrors: { loanAmount?: string; term?: string; rate?: string } = {};
    const amount = parseFloat(loanAmountRaw);
    const term = parseInt(loanTerm, 10);
    const rate = parseFloat(annualRate);

    if (!loanAmountRaw || isNaN(amount) || amount <= 0) {
      newErrors.loanAmount = "Vui lòng nhập số tiền vay hợp lệ.";
    }
    if (!loanTerm || isNaN(term) || term <= 0) {
      newErrors.term = "Vui lòng nhập thời hạn vay hợp lệ.";
    }
    if (!annualRate || isNaN(rate) || rate < 0) {
      newErrors.rate = "Vui lòng nhập lãi suất hợp lệ.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Determine cycle multiplier in months
      let cycleMonths = 1;
      let cycleRateDivisor = 12;
      if (repaymentCycle === "quarterly") {
        cycleMonths = 3;
        cycleRateDivisor = 4;
      } else if (repaymentCycle === "semi-annually") {
        cycleMonths = 6;
        cycleRateDivisor = 2;
      } else if (repaymentCycle === "annually") {
        cycleMonths = 12;
        cycleRateDivisor = 1;
      }

      // Total cycles
      const totalCycles = Math.ceil(term / cycleMonths);
      const periodicInterestRate = (rate / cycleRateDivisor) / 100;

      // Base principal per period
      const basePrincipal = amount / totalCycles;

      const scheduleRows: ScheduleRow[] = [];
      let currentStartBalance = amount;
      let accumulatedPrincipalPaid = 0;

      const payDayInt = parseInt(paymentDay, 10);

      for (let i = 1; i <= totalCycles; i++) {
        const paymentDateStr = generatePaymentDate(disbursementDate, i, cycleMonths, payDayInt);

        // Principal calculation
        let principalRow = 0;
        if (i < totalCycles) {
          if (roundingRule === "1000") {
            principalRow = Math.round(basePrincipal / 1000) * 1000;
          } else {
            principalRow = Math.round(basePrincipal);
          }
        } else {
          // Adjust rounding differences in the last period
          principalRow = amount - accumulatedPrincipalPaid;
        }

        accumulatedPrincipalPaid += principalRow;

        // Interest calculation
        let interestRow = currentStartBalance * periodicInterestRate;
        if (roundingRule === "1000") {
          interestRow = Math.round(interestRow / 1000) * 1000;
        } else {
          interestRow = Math.round(interestRow);
        }

        const totalRow = principalRow + interestRow;
        const currentEndBalance = Math.max(0, currentStartBalance - principalRow);

        scheduleRows.push({
          period: i,
          paymentDate: paymentDateStr,
          startBalance: currentStartBalance,
          principal: principalRow,
          interest: interestRow,
          total: totalRow,
          endBalance: currentEndBalance,
        });

        currentStartBalance = currentEndBalance;
      }

      // Calculations for summary card
      if (scheduleRows.length > 0) {
        const firstPaymentTotal = scheduleRows[0].total;
        const lastPaymentTotal = scheduleRows[scheduleRows.length - 1].total;
        const totalInterest = scheduleRows.reduce((acc, row) => acc + row.interest, 0);
        const totalRepayment = amount + totalInterest;

        setSchedule(scheduleRows);
        setSummary({
          maxPayment: firstPaymentTotal,
          minPayment: lastPaymentTotal,
          totalInterest,
          totalRepayment,
        });
      }
    } else {
      setSchedule([]);
      setSummary({ maxPayment: 0, minPayment: 0, totalInterest: 0, totalRepayment: 0 });
    }
  }, [
    loanAmountRaw,
    loanTerm,
    annualRate,
    disbursementDate,
    repaymentCycle,
    paymentDay,
    roundingRule,
  ]);

  const handleReset = () => {
    setPropertyValueRaw("33333333333");
    setLoanAmountRaw("6666666667");
    setLoanTerm("240");
    setAnnualRate("8");
    setDisbursementDate("2026-06-16");
    setRepaymentCycle("monthly");
    setPaymentDay("25");
    setRoundingRule("1000");
  };

  const handleDownloadCSV = () => {
    // Generate CSV string
    const headers = ["Stt", "Ngay Tra No", "Du No Dau Ky (VND)", "Goc Tra (VND)", "Lai Tra (VND)", "Tong Tra (VND)", "Du No Cuoi Ky (VND)"];
    const rows = schedule.map(row => [
      row.period,
      row.paymentDate,
      Math.round(row.startBalance),
      Math.round(row.principal),
      Math.round(row.interest),
      Math.round(row.total),
      Math.round(row.endBalance)
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for Vietnamese character display in Excel
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lich_tra_no_VietinBank_${loanAmountRaw}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[580px] flex flex-col" id="loan-calculator-root">
      
      {/* Module Banner Header */}
      <div className="bg-gradient-to-r from-[#0072B8] to-[#005B94] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/20">
            <Calculator className="w-6 h-6 text-[#E2F1FC]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tính lịch trả nợ hằng tháng</h2>
            <p className="text-xs text-[#E2F1FC]/90">Phương thức dư nợ giảm dần (Gốc trả đều, Lãi tính trên dư nợ thực tế)</p>
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
            
            {/* COLUMN 1: Inputs Panel (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <h3 className="text-sm font-bold text-[#0072B8] uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#0072B8]" />
                  <span>Cấu hình khoản vay</span>
                </h3>
                <button 
                  onClick={handleReset}
                  className="text-xs flex items-center gap-1 text-slate-500 hover:text-[#E31A22] font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Đặt lại
                </button>
              </div>

              {/* Form elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Value (Optional backdrop info) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Giá trị tài sản mua (VND)</label>
                  <input
                    type="text"
                    value={formatNumberInput(propertyValueRaw)}
                    onChange={(e) => setPropertyValueRaw(e.target.value.replace(/\D/g, ""))}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                    placeholder="Không bắt buộc"
                  />
                </div>

                {/* Loan Amount */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Số tiền vay (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formatNumberInput(loanAmountRaw)}
                    onChange={(e) => setLoanAmountRaw(e.target.value.replace(/\D/g, ""))}
                    className={`block w-full rounded-xl border ${errors.loanAmount ? "border-red-400" : "border-slate-300"} bg-white px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]`}
                    placeholder="Nhập số tiền giải ngân mong muốn"
                    id="loan-amount-input"
                  />
                  {errors.loanAmount && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.loanAmount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Loan Term (Months) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Thời gian vay (Tháng) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                    placeholder="Số tháng (ví dụ: 240)"
                    id="loan-term-input"
                    min="1"
                  />
                  {errors.term && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.term}</p>
                  )}
                </div>

                {/* Annual Rate (%) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Lãi suất vay (%/Năm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                    placeholder="Phần trăm (ví dụ: 8)"
                    id="loan-rate-input"
                    step="0.01"
                    min="0"
                  />
                  {errors.rate && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.rate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Disbursement Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Ngày giải ngân</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={disbursementDate}
                      onChange={(e) => setDisbursementDate(e.target.value)}
                      className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                    />
                  </div>
                </div>

                {/* Repayment Cycle */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Chu kỳ trả nợ</label>
                  <select
                    value={repaymentCycle}
                    onChange={(e) => setRepaymentCycle(e.target.value as any)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                  >
                    <option value="monthly">Hằng tháng</option>
                    <option value="quarterly">Hằng quý</option>
                    <option value="semi-annually">6 tháng/lần</option>
                    <option value="annually">Hằng năm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment Day of month */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Ngày trả nợ cố định định kỳ</label>
                  <select
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={String(day)}>Ngày {day} hằng tháng</option>
                    ))}
                  </select>
                </div>

                {/* Rounding Rule */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Quy tắc làm tròn dư nợ</label>
                  <select
                    value={roundingRule}
                    onChange={(e) => setRoundingRule(e.target.value as any)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8]"
                  >
                    <option value="1000">Làm tròn đến 1.000 đồng (Khuyên dùng)</option>
                    <option value="1">Làm tròn chính xác đến 1 đồng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Output Summary (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E31A22] p-2.5 rounded-xl shadow-lg shadow-red-900/30">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ước tính nợ giảm dần</h4>
                    <h3 className="text-base font-bold text-[#E2F1FC]">Bảng tính trả góp định kỳ</h3>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4">
                  {/* Monthly Payment Range */}
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Số tiền trả hàng kỳ giảm dần:</span>
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <span className="text-slate-400 text-xs">Từ</span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#10B981] font-mono">
                        {summary.maxPayment > 0 ? formatVND(summary.maxPayment) : "0 ₫"}
                      </span>
                      <span className="text-slate-400 text-xs">đến</span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#10B981] font-mono">
                        {summary.minPayment > 0 ? formatVND(summary.minPayment) : "0 ₫"}
                      </span>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Tổng lãi phải trả:</span>
                      <span className="text-sm sm:text-base font-bold font-mono text-amber-400">
                        {summary.totalInterest > 0 ? formatVND(summary.totalInterest) : "0 ₫"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Tổng gốc + lãi vay:</span>
                      <span className="text-sm sm:text-base font-bold font-mono text-[#E2F1FC]">
                        {summary.totalRepayment > 0 ? formatVND(summary.totalRepayment) : "0 ₫"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={schedule.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-[#0072B8] hover:bg-[#005B94] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0072B8]/20 disabled:opacity-40 disabled:pointer-events-none active:scale-98"
                  id="loan-view-details-btn"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem chi tiết lịch trả nợ</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center italic">
                  * Hệ thống tự động phân bổ phần sai lệch do làm tròn vào kỳ trả cuối.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons at bottom */}
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

      {/* DETAILED AMORTIZATION SCHEDULE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-scale-up" id="loan-modal-content">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0072B8] to-[#005B94] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E2F1FC]" />
                <div>
                  <h3 className="font-bold text-lg leading-tight">Bảng tính lịch trả nợ vay</h3>
                  <p className="text-xs text-[#E2F1FC]/80">Chi tiết phương án trả nợ theo gốc trả đều, lãi giảm dần</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Stats details */}
            <div className="p-4 bg-slate-50 border-b border-slate-150 flex flex-wrap gap-4 justify-between items-center text-xs text-slate-600 font-medium">
              <div>
                Số tiền vay: <span className="font-bold text-slate-800 font-mono">{formatVND(parseFloat(loanAmountRaw))}</span>
              </div>
              <div>
                Thời gian: <span className="font-bold text-slate-800">{loanTerm} tháng</span>
              </div>
              <div>
                Lãi suất: <span className="font-bold text-slate-800 font-mono">{annualRate}%/năm</span>
              </div>
              <div>
                Giải ngân: <span className="font-bold text-slate-800 font-mono">{formatDateToVietnamese(disbursementDate)}</span>
              </div>
              <div>
                Kỳ đầu thanh toán: <span className="font-bold text-[#E31A22] font-mono">{schedule[0]?.paymentDate}</span>
              </div>
              
              {/* CSV Export Button */}
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất file Excel (CSV)
              </button>
            </div>

            {/* Amortization Schedule Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6" id="amortization-table-container">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 text-center">Stt</th>
                    <th className="py-3 px-4">Kỳ trả nợ</th>
                    <th className="py-3 px-4 text-right">Số gốc còn lại (Dư đầu)</th>
                    <th className="py-3 px-4 text-right">Gốc trả định kỳ</th>
                    <th className="py-3 px-4 text-right">Lãi trả định kỳ</th>
                    <th className="py-3 px-4 text-right">Tổng Gốc + Lãi trả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-mono">
                  {/* Row 0: Initial Balance */}
                  <tr className="bg-amber-50/40 text-slate-500 font-semibold italic border-b border-slate-150">
                    <td className="py-2.5 px-4 text-center">0</td>
                    <td className="py-2.5 px-4">{formatDateToVietnamese(disbursementDate)}</td>
                    <td className="py-2.5 px-4 text-right">{formatVND(parseFloat(loanAmountRaw))}</td>
                    <td className="py-2.5 px-4 text-right">-</td>
                    <td className="py-2.5 px-4 text-right">-</td>
                    <td className="py-2.5 px-4 text-right">-</td>
                  </tr>

                  {schedule.map((row) => (
                    <tr 
                      key={row.period} 
                      className={`hover:bg-[#E2F1FC]/20 transition-colors ${row.period % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 text-center text-slate-500 font-medium font-sans">{row.period}</td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-800">{row.paymentDate}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-600">{formatVND(row.startBalance)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-700">{formatVND(row.principal)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-amber-600">{formatVND(row.interest)}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#E31A22]">{formatVND(row.total)}</td>
                    </tr>
                  ))}
                  
                  {/* Total sum summary row */}
                  <tr className="bg-slate-100 text-[#0072B8] font-bold text-xs uppercase font-sans border-t-2 border-slate-300">
                    <td className="py-3.5 px-4 text-center" colSpan={2}>TỔNG CỘNG</td>
                    <td className="py-3.5 px-4 text-right font-mono">-</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatVND(parseFloat(loanAmountRaw))}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatVND(summary.totalInterest)}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatVND(summary.totalRepayment)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-150 p-4 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 italic">
                * Bảng tính mang tính chất tham khảo, thực tế giao dịch tại quầy có thể sai khác nhẹ phụ thuộc ngày giải ngân thực tế.
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
