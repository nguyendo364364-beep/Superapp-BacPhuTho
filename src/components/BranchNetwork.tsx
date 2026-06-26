import React, { useState } from "react";
import { MapPin, Search, Phone, Clock, Navigation, ExternalLink, Calendar, MapPinOff } from "lucide-react";
import contentData from "../data/contentData.json";

interface BranchNetworkProps {
  onBackToMainMenu: () => void;
  onEndChat: () => void;
}

export default function BranchNetwork({ onBackToMainMenu, onEndChat }: BranchNetworkProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<number>(1); // Defaults to Head office (ID 1)

  // Filter branches based on search input
  const filteredBranches = contentData.branches.filter(branch => {
    const s = searchTerm.toLowerCase();
    return (
      branch.name.toLowerCase().includes(s) ||
      branch.address.toLowerCase().includes(s) ||
      (branch.phone && branch.phone.includes(s))
    );
  });

  // Get currently selected branch
  const selectedBranch = contentData.branches.find(b => b.id === selectedBranchId) || contentData.branches[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[580px] flex flex-col" id="branch-network-root">
      
      {/* Module Banner Header */}
      <div className="bg-gradient-to-r from-[#0072B8] to-[#005B94] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/20">
            <MapPin className="w-6 h-6 text-[#E2F1FC]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tra cứu mạng lưới chi nhánh & PGD</h2>
            <p className="text-xs text-[#E2F1FC]/90">Mạng lưới giao dịch VietinBank tại Phú Thọ kèm bản đồ định vị</p>
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
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: LIST & SEARCH (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-4 max-h-[500px]">
              
              {/* Search Bar */}
              <div className="relative rounded-xl shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-[#0072B8] font-medium"
                  placeholder="Tìm kiếm chi nhánh, PGD, địa chỉ..."
                  id="branch-search-input"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Xoá
                  </button>
                )}
              </div>

              {/* Branch list with scroll box */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-2" id="branch-list-container">
                {filteredBranches.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <MapPinOff className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-500">Không tìm thấy địa điểm phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng thử từ khoá tìm kiếm khác.</p>
                  </div>
                ) : (
                  filteredBranches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between hover:shadow-sm ${
                        selectedBranchId === branch.id
                          ? "border-[#0072B8] bg-[#E2F1FC]/25 shadow-sm"
                          : "border-slate-150 bg-white hover:border-[#0072B8]/40"
                      }`}
                      id={`branch-card-${branch.id}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                            {branch.name}
                          </h4>
                          {branch.id === 1 && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-[#E31A22] px-1.5 py-0.5 rounded">
                              Trụ sở chính
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {branch.address}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {branch.phone && branch.phone !== "N/A" ? branch.phone : "Tổng đài: 1900 558 868"}
                        </span>
                        <span className={`text-[10px] font-bold ${selectedBranchId === branch.id ? "text-[#0072B8]" : "text-slate-400"}`}>
                          Xem bản đồ →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: MAP & DETAILS (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              {/* Branch Detailed Details */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0072B8] bg-[#E2F1FC] px-2 py-0.5 rounded">
                        CHI NHÁNH BẮC PHÚ THỌ
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">{selectedBranch.name}</h3>
                  </div>
                  {selectedBranch.phone && selectedBranch.phone !== "N/A" && (
                    <a
                      href={`tel:${selectedBranch.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:border-[#0072B8] text-xs font-bold text-slate-700 rounded-lg transition-colors shadow-sm"
                    >
                      <Phone className="w-3 h-3 text-[#0072B8]" />
                      <span>{selectedBranch.phone}</span>
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <strong>Địa chỉ: </strong>
                  {selectedBranch.address}
                </p>

                {/* Working Hours Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-500 border-t border-slate-200/65">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0072B8] shrink-0" />
                    <div>
                      <span className="block font-bold text-slate-700">Thời gian giao dịch:</span>
                      <span className="text-[11px] font-medium text-slate-500">{contentData.businessHours.weekdays}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E31A22] shrink-0" />
                    <div>
                      <span className="block font-bold text-slate-700">Thứ 7 & Chủ Nhật:</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{contentData.businessHours.weekends}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Google Maps Container */}
              <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner overflow-hidden min-h-[300px] relative group">
                <iframe
                  src={selectedBranch.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Maps - ${selectedBranch.name}`}
                  className="w-full h-full min-h-[300px] rounded-2xl shadow-sm transition-transform duration-300"
                  id="google-maps-iframe"
                ></iframe>
                
                {/* Floating Navigation Trigger (External Google maps link) */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.name + " " + selectedBranch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-[#0072B8] text-white hover:bg-[#005B94] px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ đường trên Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Footer actions */}
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
