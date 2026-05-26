"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

type BloodType = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";

interface MedicalRecord {
  condition: string;
  diagnosed: string;
  medication: string;
  notes: string;
}

interface AppointmentHistory {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  note: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Nam" | "Nữ";
  phone: string;
  email: string;
  address: string;
  dob: string;
  bloodType: BloodType;
  weight: string;
  height: string;
  allergies: string;
  tags: string[];
  record: MedicalRecord;
  history: AppointmentHistory[];
}

const statusLabel: Record<AppointmentStatus, string> = {
  confirmed:   "Đã xác nhận",
  pending:     "Chờ xác nhận",
  completed:   "Hoàn thành",
  cancelled:   "Đã huỷ",
  rescheduled: "Đã dời lịch",
};

export default function DoctorPatientsClient({ initialPatients }: { initialPatients: Patient[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(initialPatients[0] || null);
  const [activeTab, setActiveTab] = useState<"record" | "history">("record");

  const filteredPatients = initialPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) =>
    name
      .split(" ")
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Helper to generate dynamic premium patient initials and colors
  const getPatientStyles = (name: string) => {
    const colors = [
      { color: "#1e40af", bg: "#dbeafe" }, // blue
      { color: "#065f46", bg: "#d1fae5" }, // emerald
      { color: "#5b21b6", bg: "#ede9fe" }, // purple
      { color: "#b45309", bg: "#fef3c7" }, // amber
      { color: "#b91c1c", bg: "#fee2e2" }, // red
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  // Stats calculations based on current dynamic data
  const totalPatients = initialPatients.length;
  const totalHistory = initialPatients.reduce((sum, p) => sum + (p.history?.length || 0), 0);
  const allergicPatients = initialPatients.filter(p => p.allergies && p.allergies.toLowerCase() !== "không" && p.allergies.toLowerCase() !== "không rõ" && p.allergies.toLowerCase() !== "không có").length;
  const selectedName = selected ? selected.name : "Chưa chọn";

  return (
    <div className="app-layout">
      <Sidebar role="doctor" />
      <main className="main-content page-bg-premium" style={{ position: "relative", overflowX: "hidden" }}>
        
        {/* Ambient premium glowing meshes from design preview */}
        <div style={{ position: "absolute", top: 0, left: "15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,127,255,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }}></div>
        <div style={{ position: "absolute", top: "300px", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }}></div>

        {/* Page Header */}
        <header className="page-header page-header-premium" style={{ position: "relative", zIndex: 10 }}>
          <div className="page-header-left">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.06)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "8px", textTransform: "uppercase" }}>
              <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--azure)" }}></span>
              HỒ SƠ LÂM SÀNG
            </div>
            <h1 className="page-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a" }}>Danh sách bệnh nhân</h1>
            <p className="page-subtitle" style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Quản lý bệnh án, chỉ số sinh tồn và lịch sử khám lâm sàng</p>
          </div>
          <div className="page-header-right">
            <Link href="/doctor/appointments">
              <button className="btn-azure" style={{ borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Quản lý lịch hẹn
              </button>
            </Link>
          </div>
        </header>

        <div className="page-body" style={{ position: "relative", zIndex: 10 }}>
          
          {/* Stats Grid with dynamic premium styles (No Emojis) */}
          <div className="stat-grid" style={{ marginBottom: "24px" }}>
            {[
              {
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: "blue",
                value: totalPatients,
                label: "Tổng bệnh nhân"
              },
              {
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                color: "green",
                value: totalHistory,
                label: "Lịch sử khám bệnh"
              },
              {
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
                color: "yellow",
                value: allergicPatients,
                label: "Số ca bệnh dị ứng"
              },
              {
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                color: "purple",
                value: selectedName.split(" ").slice(-2).join(" "),
                label: "Bệnh nhân đang chọn"
              }
            ].map((s, idx) => (
              <div key={idx} style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 4px 20px -6px rgba(0, 127, 255, 0.03)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div className={`stat-icon ${s.color}`} style={{ width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <div className="stat-body" style={{ minWidth: 0 }}>
                  <div className="stat-value" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", fontFamily: "Space Grotesk, var(--font-display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
                  <div className="stat-label" style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Layout Bento: Dual columns */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            {/* LEFT COLUMN: Patient list bento sidebar */}
            <div style={{ width: "340px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                <div>
                  <h3 style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>Danh sách hồ sơ</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Chọn bệnh nhân để xem chi tiết bệnh án lâm sàng.</p>
                </div>

                {/* Premium Search Input */}
                <div style={{ position: "relative", width: "100%" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                    <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    id="search-patients"
                    type="text"
                    placeholder="Tìm bệnh nhân..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      border: "1.5px solid var(--gray-200)",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      outline: "none",
                      background: "#ffffff",
                      transition: "border-color 0.15s, box-shadow 0.15s"
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--azure)"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 127, 255, 0.06)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* List items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "600px", overflowY: "auto" }}>
                  {filteredPatients.map((p) => {
                    const isSel = selected?.id === p.id;
                    const col = getPatientStyles(p.name);
                    const pInitials = initials(p.name);
                    return (
                      <button
                        key={p.id}
                        id={`btn-patient-${p.id}`}
                        onClick={() => { setSelected(p); setActiveTab("record"); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px",
                          borderRadius: "16px",
                          border: `1.5px solid ${isSel ? "var(--azure)" : "rgba(0, 127, 255, 0.06)"}`,
                          background: isSel ? "rgba(0, 127, 255, 0.03)" : "#ffffff",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                          boxShadow: isSel ? "0 4px 12px rgba(0, 127, 255, 0.05)" : "none",
                          width: "100%",
                          outline: "none"
                        }}
                        onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "rgba(0, 127, 255, 0.01)"; }}
                        onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "#ffffff"; }}
                      >
                        <div
                          style={{
                            width: "36px", height: "36px",
                            borderRadius: "10px",
                            background: col.bg,
                            color: col.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, fontSize: "0.75rem",
                            flexShrink: 0,
                          }}
                        >
                          {pInitials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px", fontWeight: 500 }}>
                            {p.id.slice(-6).toUpperCase()} · {p.age} tuổi · {p.gender}
                          </div>
                        </div>
                        {isSel && (
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--azure)" }}></div>
                        )}
                      </button>
                    );
                  })}

                  {filteredPatients.length === 0 && (
                    <div style={{ padding: "40px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.06)", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Không tìm thấy</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Vui lòng kiểm tra lại từ khóa tìm kiếm.</div>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Clinical records detail panel */}
            <div style={{ flex: "1 1 0%", minWidth: "600px" }}>
              {!selected ? (
                <div style={{ padding: "80px 24px", textAlign: "center", background: "#ffffff", borderRadius: "24px", border: "1px solid rgba(0, 127, 255, 0.08)", boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "14px", 
                    background: "rgba(0, 127, 255, 0.06)", 
                    color: "var(--azure)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: "16px"
                  }}>
                    <svg style={{ width: "28px", height: "28px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Chưa chọn bệnh nhân</h3>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Vui lòng chọn một bệnh nhân từ danh sách để xem hồ sơ y tế.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {/* Premium Clinical Profile Card */}
                  <div style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid rgba(0, 127, 255, 0.08)",
                    boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                  }}>
                    
                    {/* Profile Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "16px",
                          background: getPatientStyles(selected.name).bg,
                          color: getPatientStyles(selected.name).color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          fontFamily: "Space Grotesk, var(--font-display)"
                        }}>
                          {initials(selected.name)}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <h2 style={{ margin: 0, fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>{selected.name}</h2>
                            <span className="code-pill" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>#{selected.id.slice(-6).toUpperCase()}</span>
                          </div>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>
                            {selected.gender} · {selected.age} tuổi (Sinh ngày {new Date(selected.dob).toLocaleDateString("vi-VN")})
                          </p>
                        </div>
                      </div>

                      {/* Patient tags like Allergies, Blood Type as badges */}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span className="badge-premium status-confirmed" style={{ padding: "6px 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Nhóm máu: {selected.bloodType || "Chưa rõ"}
                        </span>
                        {selected.allergies && selected.allergies.toLowerCase() !== "không rõ" && selected.allergies.toLowerCase() !== "không" && (
                          <span className="badge-premium status-cancelled" style={{ padding: "6px 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Dị ứng: {selected.allergies}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vitals Grid (NHS style indicators) */}
                    <div>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg style={{ width: "14px", height: "14px", color: "var(--azure)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Chỉ số sinh tồn lâm sàng (gần nhất)
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
                        {[
                          { label: "Huyết áp", value: "125/82 mmHg", color: "#2563eb", bg: "rgba(37,99,235,0.04)" },
                          { label: "Nhịp tim", value: "76 bpm", color: "#dc2626", bg: "rgba(220,38,38,0.04)" },
                          { label: "Nhiệt độ", value: "36.7 °C", color: "#d97706", bg: "rgba(217,119,6,0.04)" },
                          { label: "Chỉ số SpO₂", value: "98%", color: "#059669", bg: "rgba(5,150,105,0.04)" }
                        ].map((v, i) => (
                          <div key={i} style={{
                            background: v.bg,
                            border: `1px solid ${v.color}22`,
                            borderRadius: "16px",
                            padding: "16px",
                            textAlign: "center"
                          }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>{v.label}</div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: v.color, fontFamily: "Space Grotesk, var(--font-display)" }}>{v.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Patient detail fields */}
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "20px" }}>
                      <h4 style={{ margin: "0 0 16px 0", fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg style={{ width: "14px", height: "14px", color: "var(--azure)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Thông tin hành chính
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px 24px" }}>
                        {[
                          { label: "Chiều cao / Cân nặng", value: `${selected.height || "Chưa rõ"} / ${selected.weight || "Chưa rõ"}` },
                          { label: "Số điện thoại liên hệ", value: selected.phone || "Chưa rõ" },
                          { label: "Địa chỉ Email", value: selected.email || "Chưa rõ" },
                          { label: "Địa chỉ thường trú", value: selected.address || "Chưa rõ" }
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{row.label}</span>
                            <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 700 }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Tabs & Records Bento Card */}
                  <div style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid rgba(0, 127, 255, 0.08)",
                    boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                  }}>
                    
                    {/* Tab Navigation header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "16px" }}>
                      
                      {/* Segmented Control for Tabs */}
                      <div style={{ display: "flex", background: "rgba(241, 245, 249, 0.8)", padding: "4px", borderRadius: "12px", gap: "4px" }}>
                        <button
                          id="tab-record"
                          onClick={() => setActiveTab("record")}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            background: activeTab === "record" ? "#ffffff" : "transparent",
                            color: activeTab === "record" ? "var(--azure)" : "#64748b",
                            fontSize: "0.8rem",
                            fontWeight: activeTab === "record" ? 700 : 500,
                            boxShadow: activeTab === "record" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Hồ sơ y tế hiện tại
                        </button>
                        <button
                          id="tab-history"
                          onClick={() => setActiveTab("history")}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            background: activeTab === "history" ? "#ffffff" : "transparent",
                            color: activeTab === "history" ? "var(--azure)" : "#64748b",
                            fontSize: "0.8rem",
                            fontWeight: activeTab === "history" ? 700 : 500,
                            boxShadow: activeTab === "history" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Lịch sử khám lâm sàng
                        </button>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>
                        {activeTab === "record" ? `Cập nhật: ${new Date(selected.record.diagnosed).toLocaleDateString("vi-VN")}` : `${selected.history?.length || 0} lượt khám`}
                      </div>
                    </div>

                    {/* Tab Contents */}
                    <div>
                      {activeTab === "record" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            
                            <div style={{ background: "rgba(248,250,252,0.6)", border: "1px solid rgba(0,0,0,0.02)", borderRadius: "16px", padding: "16px" }}>
                              <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "6px" }}>Bệnh lý chẩn đoán</div>
                              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{selected.record.condition}</div>
                            </div>

                            <div style={{ background: "rgba(248,250,252,0.6)", border: "1px solid rgba(0,0,0,0.02)", borderRadius: "16px", padding: "16px" }}>
                              <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "6px" }}>Đơn thuốc đang điều trị</div>
                              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{selected.record.medication || "Không ghi nhận đơn thuốc"}</div>
                            </div>

                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ghi chú lâm sàng chi tiết</div>
                            <div style={{
                              background: "rgba(248, 250, 252, 0.8)",
                              border: "1px solid rgba(0, 127, 255, 0.05)",
                              borderRadius: "16px",
                              padding: "20px",
                              fontSize: "0.85rem",
                              color: "#334155",
                              lineHeight: 1.6,
                              fontWeight: 500,
                              whiteSpace: "pre-line"
                            }}>
                              {selected.record.notes || "Chưa có ghi chú lâm sàng nào được ghi nhận cho đợt chẩn đoán này."}
                            </div>
                          </div>

                        </div>
                      )}

                      {activeTab === "history" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {selected.history && selected.history.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                              {selected.history.map((h) => {
                                const dateObj = new Date(h.date);
                                return (
                                  <div key={h.id} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "16px 20px",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(0, 127, 255, 0.05)",
                                    background: "#ffffff",
                                    gap: "16px"
                                  }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                                      {/* Date marker block */}
                                      <div style={{
                                        background: "rgba(0, 127, 255, 0.06)",
                                        color: "var(--azure)",
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0
                                      }}>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>{String(dateObj.getDate()).padStart(2, "0")}</div>
                                        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" }}>T{dateObj.getMonth() + 1}</div>
                                      </div>

                                      <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.reason}</div>
                                        {h.note && (
                                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <svg style={{ width: "12px", height: "12px", flexShrink: 0, color: "#94a3b8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.note}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                                      <span className={`badge-premium status-${h.status}`} style={{ padding: "4px 8px", fontSize: "0.65rem" }}>
                                        {statusLabel[h.status]}
                                      </span>
                                      <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>
                                        {h.time}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ padding: "32px 16px", textAlign: "center", color: "#64748b", background: "rgba(248, 250, 252, 0.6)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.02)", fontSize: "0.8rem", fontWeight: 500 }}>
                              Chưa ghi nhận lịch sử khám bệnh.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
