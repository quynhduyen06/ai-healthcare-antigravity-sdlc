"use client";

import { useState, useTransition } from "react";
import Sidebar from "@/components/Sidebar";
import { updateAppointmentStatus, saveAppointmentNotes } from "@/app/actions/appointment";
import { useRouter } from "next/navigation";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";

interface Appt {
  id: string; date: string; time: string;
  patientName: string; patientAge: number; department: string;
  reason: string; status: AppointmentStatus; notes: string;
}

const statusLabel: Record<AppointmentStatus, string> = {
  confirmed: "Đã xác nhận", pending: "Chờ xác nhận",
  completed: "Hoàn thành",  cancelled: "Đã huỷ",  rescheduled: "Đã dời lịch",
};
const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "pending",     label: "Chờ xác nhận" },
  { value: "confirmed",   label: "Đã xác nhận"  },
  { value: "completed",   label: "Hoàn thành"   },
  { value: "rescheduled", label: "Đã dời lịch"  },
  { value: "cancelled",   label: "Đã huỷ"       },
];

export default function DoctorAppointmentsClient({
  doctorId, doctorName, deptName, initialAppointments,
}: {
  doctorId: string; doctorName: string; deptName: string;
  initialAppointments: Appt[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate,   setFilterDate]   = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [editNotes,    setEditNotes]     = useState("");
  const [actionMsg,    setActionMsg]     = useState("");

  const showMsg = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3000); };

  const filtered = initialAppointments.filter((a) => {
    const matchSearch = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search);
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchDate   = !filterDate || a.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    startTransition(async () => {
      await updateAppointmentStatus(id, newStatus.toUpperCase() as never);
      router.refresh();
    });
  };

  const saveNotes = () => {
    if (!selectedId) return;
    startTransition(async () => {
      await saveAppointmentNotes(selectedId, editNotes);
      setShowNotesModal(false);
      setSelectedId(null);
      showMsg("Ghi chú lâm sàng đã được cập nhật thành công.");
      router.refresh();
    });
  };

  // Stats calculation
  const total       = initialAppointments.length;
  const pending   = initialAppointments.filter((a) => a.status === "pending").length;
  const confirmed = initialAppointments.filter((a) => a.status === "confirmed").length;
  const completed = initialAppointments.filter((a) => a.status === "completed").length;
  const rescheduled = initialAppointments.filter((a) => a.status === "rescheduled").length;
  const cancelled = initialAppointments.filter((a) => a.status === "cancelled").length;

  // Identify clinical priority cases
  const priorityCases = initialAppointments.filter(a => {
    const reason = (a.reason || "").toLowerCase();
    return reason.includes("đau ngực") || reason.includes("tức ngực") || reason.includes("khó thở") || reason.includes("sốt cao");
  });

  // Calculate doctor initials
  const initials = doctorName.replace("BS. ", "").split(" ").map(w => w[0]).join("").toUpperCase();

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

  return (
    <div className="app-layout">
      <Sidebar role="doctor" />
      <main className="main-content page-bg-premium" style={{ position: "relative", overflowX: "hidden" }}>
        {/* Ambient premium glowing meshes from design preview */}
        <div style={{ position: "absolute", top: 0, left: "15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,127,255,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }}></div>
        <div style={{ position: "absolute", top: "300px", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }}></div>

        <header className="page-header page-header-premium" style={{ position: "relative", zIndex: 10 }}>
          <div className="page-header-left">
            <h1 className="page-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a" }}>Quản lý lịch hẹn</h1>
            <p className="page-subtitle" style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>{doctorName} – Khoa {deptName}</p>
          </div>
          <div className="page-header-right">
            <span className="count-chip" style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
              Hôm nay: {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </header>

        <div className="page-body" style={{ position: "relative", zIndex: 10 }}>
          {actionMsg && (
            <div className="alert-premium alert-success">
              <span style={{ fontSize: "0.85rem", fontWeight: 700, marginRight: "4px" }}>✓</span> {actionMsg}
            </div>
          )}

          {/* Stats Grid with outline SVGs (No Emojis) */}
          <div className="stat-grid" style={{ marginBottom: "24px" }}>
            {[
              { 
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ), 
                color: "blue", 
                value: total, 
                label: "Tổng lịch hẹn" 
              },
              { 
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                color: "yellow", 
                value: pending, 
                label: "Chờ xác nhận"  
              },
              { 
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                color: "blue", 
                value: confirmed, 
                label: "Đã xác nhận"   
              },
              { 
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18M19 6l-7-3-7 3v7l7-3 7 3V6z" />
                  </svg>
                ), 
                color: "green", 
                value: completed, 
                label: "Hoàn thành"    
              },
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
                <div className="stat-body">
                  <div className="stat-value" style={{ fontSize: "1.45rem", fontWeight: 700, color: "#0f172a", fontFamily: "Space Grotesk, var(--font-display)" }}>{s.value}</div>
                  <div className="stat-label" style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* BENTO DUAL COLUMN LAYOUT */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            {/* LEFT COLUMN: Appointments Table & Data Stream */}
            <div style={{ flex: "1 1 0%", minWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Premium Bento Card for List */}
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
                {/* Card Header */}
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.06)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "12px", textTransform: "uppercase" }}>
                    <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--azure)" }}></span>
                    Luồng xử lý lâm sàng
                  </div>
                  <h2 style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Danh sách bệnh nhân đăng ký khám</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Xem, lọc và cập nhật bệnh án & trạng thái khám bệnh của bệnh nhân.</p>
                </div>

                {/* Premium Filter/Toolbar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "rgba(248, 250, 252, 0.6)", padding: "12px 16px", borderRadius: "16px", border: "1px solid rgba(0, 0, 0, 0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flex: 1 }}>
                    
                    {/* Search Input */}
                    <div style={{ position: "relative", width: "190px" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        id="search-appointments"
                        type="text"
                        placeholder="Tìm bệnh nhân..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px 8px 34px",
                          border: "1.5px solid var(--gray-200)",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          outline: "none",
                          background: "#ffffff",
                          transition: "border-color 0.15s, box-shadow 0.15s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--azure)"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 127, 255, 0.06)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>

                    {/* Filter Status */}
                    <select
                      id="filter-status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: "8px 32px 8px 12px",
                        border: "1.5px solid var(--gray-200)",
                        borderRadius: "10px",
                        fontSize: "0.8rem",
                        color: "#475569",
                        background: "#ffffff",
                        outline: "none",
                        cursor: "pointer",
                        appearance: "none",
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        backgroundSize: "14px",
                        transition: "border-color 0.15s, box-shadow 0.15s"
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "var(--azure)"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 127, 255, 0.06)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>

                    {/* Filter Date */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        id="filter-date"
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{
                          padding: "8px 12px",
                          border: "1.5px solid var(--gray-200)",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          color: "#475569",
                          background: "#ffffff",
                          outline: "none",
                          cursor: "pointer",
                          transition: "border-color 0.15s, box-shadow 0.15s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--azure)"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 127, 255, 0.06)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                      />
                      {filterDate && (
                        <button
                          className="btn-action-ghost danger"
                          onClick={() => setFilterDate("")}
                          style={{ borderRadius: "8px", padding: "8px 12px", display: "inline-flex", alignItems: "center", fontSize: "0.75rem" }}
                        >
                          ✕ Xoá
                        </button>
                      )}
                    </div>

                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                    Hiển thị: <span style={{ color: "var(--azure)" }}>{filtered.length}</span>/{total} ca
                  </div>
                </div>

                {/* Premium Table (With robust horizontal scroll handling inside table border) */}
                <div className="table-premium" style={{ border: "1px solid rgba(0,0,0,0.04)", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto", width: "100%", display: "block" }}>
                    <table style={{ width: "100%", minWidth: "1080px", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "110px" }} />
                        <col style={{ width: "180px" }} />
                        <col style={{ width: "75px" }} />
                        <col style={{ width: "220px" }} />
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "165px" }} />
                      </colgroup>
                      <thead style={{ background: "rgba(248, 250, 252, 0.8)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <tr>
                          <th style={{ padding: "14px 16px 14px 24px" }}>Mã</th>
                          <th style={{ padding: "14px 16px" }}>Ngày giờ</th>
                          <th style={{ padding: "14px 16px" }}>Bệnh nhân</th>
                          <th style={{ padding: "14px 16px" }}>Tuổi</th>
                          <th style={{ padding: "14px 16px" }}>Lý do khám</th>
                          <th style={{ padding: "14px 16px" }}>Ghi chú BS</th>
                          <th style={{ padding: "14px 16px" }}>Trạng thái</th>
                          <th style={{ padding: "14px 24px 14px 16px" }}>Cập nhật TT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((a) => {
                          const col = getPatientStyles(a.patientName);
                          const pInitials = a.patientName.replace("BS. ", "").split(" ").slice(-2).map(w => w[0]).join("").toUpperCase();

                          return (
                            <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                              
                              {/* ID Code Pill (With safe left padding) */}
                              <td style={{ padding: "12px 16px 12px 24px", whiteSpace: "nowrap" }}>
                                <span className="code-pill">
                                  {a.id.slice(-6).toUpperCase()}
                                </span>
                              </td>

                              {/* Date & Time (Clean vector clock icon) */}
                              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#334155" }}>
                                  {new Date(a.date + "T00:00:00").toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                                  <svg style={{ width: "11px", height: "11px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{a.time}</span>
                                </div>
                              </td>

                              {/* Patient Info with premium initials avatar */}
                              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: col.bg,
                                    color: col.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.72rem",
                                    fontWeight: 800,
                                    flexShrink: 0
                                  }}>
                                    {pInitials}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{a.patientName}</div>
                                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px", fontWeight: 500 }}>
                                      {a.department}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Age */}
                              <td style={{ padding: "12px 16px", whiteSpace: "nowrap", color: "#475569", fontWeight: 600 }}>
                                {a.patientAge} tuổi
                              </td>

                              {/* Reason with soft wrap */}
                              <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#64748b", maxWidth: "220px", whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.4 }}>
                                {a.reason || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>Không ghi nhận</span>}
                              </td>

                              {/* Doctor Notes (No Emojis) */}
                              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                <button
                                  className="btn-action-ghost"
                                  id={`btn-notes-${a.id}`}
                                  onClick={() => { setSelectedId(a.id); setEditNotes(a.notes); setShowNotesModal(true); }}
                                  style={{ padding: "6px 12px", fontSize: "0.75rem", borderRadius: "8px", fontWeight: 600 }}
                                >
                                  {a.notes ? "Xem ghi chú" : "Thêm ghi chú"}
                                </button>
                              </td>

                              {/* Status Badge */}
                              <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                <span className={`badge-premium status-${a.status}`} style={{ padding: "4px 10px", fontSize: "0.7rem" }}>
                                  {statusLabel[a.status]}
                                </span>
                              </td>

                              {/* Update Status Dropdown (Premium styled) */}
                              <td style={{ padding: "12px 24px 12px 16px", whiteSpace: "nowrap" }}>
                                <select
                                  id={`status-select-${a.id}`}
                                  value={a.status}
                                  onChange={(e) => handleStatusChange(a.id, e.target.value as AppointmentStatus)}
                                  disabled={a.status === "cancelled" || isPending}
                                  style={{
                                    padding: "8px 28px 8px 12px",
                                    border: "1.5px solid var(--gray-200)",
                                    borderRadius: "10px",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    color: "#475569",
                                    background: "#ffffff",
                                    cursor: a.status === "cancelled" ? "not-allowed" : "pointer",
                                    appearance: "none",
                                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E\")",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 10px center",
                                    backgroundSize: "14px",
                                    transition: "all 0.15s ease",
                                    outline: "none",
                                    opacity: a.status === "cancelled" ? 0.6 : 1
                                  }}
                                  onFocus={(e) => { if (a.status !== "cancelled") { e.target.style.borderColor = "var(--azure)"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 127, 255, 0.06)"; } }}
                                  onBlur={(e) => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                                >
                                  {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                  ))}
                                </select>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div style={{ padding: "40px 16px", textAlign: "center", background: "#ffffff" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                          <div style={{ 
                            width: "48px", 
                            height: "48px", 
                            borderRadius: "12px", 
                            background: "rgba(0, 127, 255, 0.06)", 
                            color: "var(--azure)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                          }}>
                            <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Không tìm thấy lịch hẹn nào</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Dữ liệu cập nhật liên tục bởi hệ thống
                  </div>
                  <div>
                    <button style={{ background: "transparent", border: "none", color: "var(--azure)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg style={{ width: "14px", height: "14px", transition: "transform 0.3s ease" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(180deg)"} onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
                      </svg>
                      Tải lại danh sách
                    </button>
                  </div>
                </div>
              </div>

              {/* Data stream bento marquee */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.06)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    DÒNG DỮ LIỆU LUÂN CHUYỂN THỰC TẾ
                  </div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>TIẾN TRÌNH AI</div>
                </div>
                
                <div style={{ overflow: "hidden", whiteSpace: "nowrap", padding: "8px 0", position: "relative", maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
                  <style>{`
                    @keyframes stream {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    @keyframes pulse {
                      0%, 100% { opacity: 1; transform: scale(1); }
                      50% { opacity: 0.4; transform: scale(1.15); }
                    }
                    .data-stream {
                      display: inline-flex;
                      gap: 12px;
                      animation: stream 15s linear infinite;
                    }
                    .data-stream:hover {
                      animation-play-state: paused;
                    }
                  `}</style>
                  <div className="data-stream">
                    {[1, 2].map((i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", paddingRight: "12px" }}>
                        <div style={{ background: "#fef2f2", color: "#dc2626", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626", marginRight: "8px", boxShadow: "0 0 0 2px rgba(220,38,38,0.2)" }}></span>
                          BN-1299 (Đau tức ngực dữ dội) → HỆ THỐNG PHÁT BÁO ĐỘNG ĐỎ LÂM SÀNG
                        </div>
                        <div style={{ background: "#f8fafc", color: "#475569", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--azure)", marginRight: "8px" }}></span>
                          BN-4928 (Khám sức khỏe) → Chờ xử lý AI
                        </div>
                        <div style={{ background: "#fffbeb", color: "#d97706", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", marginRight: "8px" }}></span>
                          BN-7712 (Khó nuốt) → Phân luồng TMH
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "12px" }}>
                  <span>Rà quét tự động bởi Aura Triager Engine</span>
                  <span>Tải hệ thống: 8%</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Featured Doctor, Clinical Case Summary, Clinical Priority */}
            <div style={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Doctor Profile Card */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    BÁC SĨ TRỰC BAN
                  </div>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }}></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#eff6ff", color: "var(--azure)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 800, border: "1px solid rgba(0,127,255,0.1)", fontFamily: "Space Grotesk, var(--font-display)" }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>{doctorName}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>Khoa {deptName}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "16px", marginBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>Mã chứng chỉ:</span>
                  <span style={{ fontWeight: 700, color: "#334155" }}>CCHN-2026</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>Số ca quản lý:</span>
                  <span style={{ fontWeight: 700, color: "#334155" }}>{total} ca hôm nay</span>
                </div>
              </div>

              {/* Read-Only clinical summary dashboard */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.08)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  </span>
                  TỔNG QUAN CA KHÁM HÔM NAY
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Chờ xác nhận", count: pending, badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                    { label: "Đã xác nhận", count: confirmed, badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                    { label: "Đã dời lịch", count: rescheduled, badge: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
                    { label: "Hoàn thành", count: completed, badge: "bg-blue-500/10 text-[#007fff] border-blue-500/20" },
                    { label: "Đã huỷ", count: cancelled, badge: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                      <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>{item.label}</span>
                      <span className={`inline-flex items-center justify-center font-bold px-3 py-1 rounded-full text-xs border ${item.badge}`} style={{ minWidth: "32px", fontSize: "0.75rem" }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 700 }}>Tổng số ca phục vụ</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--azure)", fontFamily: "Space Grotesk, var(--font-display)" }}>
                      {total} ca
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Priority Recommendations Card */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(239, 68, 68, 0.08)", color: "#dc2626", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <svg style={{ width: "12px", height: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  GỢI Ý ƯU TIÊN LÂM SÀNG
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "240px", overflowY: "auto" }}>
                  {priorityCases.length > 0 ? (
                    priorityCases.map((a) => (
                      <div key={a.id} style={{ padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(245, 158, 11, 0.2)", background: "rgba(245, 158, 11, 0.04)", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0f172a" }}>{a.patientName}</span>
                          <span className="code-pill" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>#{a.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                          Khung giờ: <strong style={{ color: "#334155" }}>{a.time}</strong>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 500 }}>
                          Lý do: {a.reason}
                        </div>
                        <div style={{ alignSelf: "flex-end", display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(239, 68, 68, 0.08)", color: "#dc2626", padding: "4px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 700 }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626", animation: "pulse 1.5s infinite" }}></span>
                          Cảnh báo triệu chứng
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "24px 16px", textAlign: "center", color: "#059669", background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "14px", fontSize: "0.8rem", fontWeight: 600 }}>
                      Chưa ghi nhận ca triệu chứng khẩn cấp
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "12px", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.4 }}>
                  * Lưu ý: Đây là chỉ báo tự động hỗ trợ sắp xếp ưu tiên dựa trên từ khoá triệu chứng sơ bộ, không phải chẩn đoán y khoa chính thức.
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="modal-backdrop-premium" onClick={() => setShowNotesModal(false)}>
          <div className="modal-premium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: "1px solid rgba(0, 127, 255, 0.05)", paddingBottom: "20px" }}>
              <span className="modal-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <svg style={{ width: "18px", height: "18px", color: "var(--azure)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Ghi chú bác sĩ
              </span>
              <button className="modal-close" onClick={() => setShowNotesModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ paddingTop: "24px", paddingBottom: "24px" }}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="doctor-notes" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>
                  Ghi chú / Nhận xét lâm sàng
                </label>
                <textarea
                  id="doctor-notes"
                  className="form-textarea-premium"
                  placeholder="Nhập ghi chú về bệnh nhân, chẩn đoán sơ bộ, hướng điều trị…"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ minHeight: "140px" }}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: "1px solid rgba(0, 127, 255, 0.05)", paddingTop: "20px" }}>
              <button className="btn btn-ghost" onClick={() => setShowNotesModal(false)}>Huỷ</button>
              <button id="btn-save-notes" className="btn-azure" onClick={saveNotes} disabled={isPending} style={{ opacity: isPending ? 0.7 : 1, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
