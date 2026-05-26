"use client";

import { useState, useTransition } from "react";
import Sidebar from "@/components/Sidebar";
import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "@/app/actions/appointment";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────
type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorId: string;
  doctorName: string;
  department: string;
  departmentId: string;
  location: string;
  status: AppointmentStatus;
  reason: string;
}

interface DoctorOption {
  id: string;
  name: string;
  department: string;
  departmentId: string;
  specialty: string;
  experience: string;
  bio: string;
}

const DOCTOR_COLORS: Record<string, { color: string; bg: string; initials: string }> = {
  "Nội khoa":   { color: "#1e40af", bg: "#dbeafe", initials: "NK" },
  "Tim mạch":   { color: "#991b1b", bg: "#fee2e2", initials: "TM" },
  "Thần kinh":  { color: "#5b21b6", bg: "#ede9fe", initials: "TK" },
  "Nội tiết":   { color: "#065f46", bg: "#d1fae5", initials: "NT" },
  "Hô hấp":     { color: "#92400e", bg: "#fef3c7", initials: "HH" },
};

const statusLabel: Record<AppointmentStatus, string> = {
  confirmed:   "Đã xác nhận",
  pending:     "Chờ xác nhận",
  completed:   "Hoàn thành",
  cancelled:   "Đã huỷ",
  rescheduled: "Đã dời lịch",
};

const TIME_SLOTS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00","15:30","16:00"];

// ── Doctor Picker ──────────────────────────────────────────────
function DoctorPicker({ doctors, selected, onSelect }: {
  doctors: DoctorOption[];
  selected: DoctorOption | null;
  onSelect: (d: DoctorOption) => void;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        id="doctor-picker-trigger"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", padding: "12px 16px",
          border: `1.5px solid ${open ? "var(--azure)" : "var(--color-border)"}`,
          borderRadius: "12px", background: open ? "var(--color-surface)" : "var(--gray-50)",
          cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: ".88rem", boxShadow: open ? "0 0 0 4px rgba(0, 127, 255, 0.08)" : "none",
          transition: "border-color .15s, box-shadow .15s, background .15s",
        }}
      >
        {selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: DOCTOR_COLORS[selected.department]?.bg ?? "#dbeafe", color: DOCTOR_COLORS[selected.department]?.color ?? "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 700, flexShrink: 0 }}>{DOCTOR_COLORS[selected.department]?.initials ?? "BS"}</span>
            <span>
              <strong style={{ color: "#0f172a" }}>{selected.name}</strong>
              <span style={{ color: "var(--azure)", marginLeft: "8px", fontSize: ".75rem", background: "var(--azure-light)", padding: "2px 8px", borderRadius: "999px", fontWeight: 600 }}>
                {selected.department}
              </span>
            </span>
          </span>
        ) : (
          <span style={{ color: "var(--color-text-subtle)" }}>— Chọn bác sĩ —</span>
        )}
        <span style={{ color: "var(--color-text-muted)" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          zIndex: 300, background: "var(--color-surface)",
          border: "1px solid rgba(0, 127, 255, 0.1)", borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0, 127, 255, 0.08)", overflow: "hidden",
        }}>
          <div style={{ padding: "12px", borderBottom: "1px solid rgba(0, 127, 255, 0.05)", background: "rgba(248, 250, 252, 0.5)" }}>
            <input
              id="doctor-search" type="text" autoFocus
              placeholder="Tìm theo tên, khoa..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--gray-200)", borderRadius: "10px", fontSize: ".85rem", outline: "none", background: "var(--color-surface)" }}
            />
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "8px" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: ".85rem" }}>
                Không tìm thấy bác sĩ
              </div>
            )}
            {filtered.map((doc) => {
              const col = DOCTOR_COLORS[doc.department] ?? { color: "#1e40af", bg: "#dbeafe", initials: "BS" };
              const isSel = selected?.id === doc.id;
              return (
                <button key={doc.id} type="button" id={`doctor-option-${doc.id}`}
                  onClick={() => { onSelect(doc); setOpen(false); setSearch(""); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "12px", marginBottom: "4px",
                    border: `1.5px solid ${isSel ? "var(--azure)" : "transparent"}`,
                    borderRadius: "12px", background: isSel ? "var(--azure-light)" : "transparent",
                    cursor: "pointer", textAlign: "left",
                    transition: "background .12s, border-color .12s",
                  }}
                  onMouseEnter={(e) => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 127, 255, 0.02)"; }}
                  onMouseLeave={(e) => { if (!isSel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: col.bg, color: col.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".78rem", fontWeight: 700, flexShrink: 0, letterSpacing: ".02em", boxShadow: "0 4px 10px -2px rgba(0,0,0,0.02)" }}>
                    {col.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                      <span style={{ fontWeight: 600, fontSize: ".88rem", color: "#0f172a" }}>{doc.name}</span>
                      {isSel && <span style={{ fontSize: ".68rem", background: "var(--azure)", color: "#fff", padding: "2px 10px", borderRadius: "999px", fontWeight: 600, letterSpacing: ".03em" }}>Đã chọn</span>}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "3px" }}>
                      <span style={{ fontSize: ".75rem", color: col.color, background: col.bg, padding: "1px 7px", borderRadius: "6px", fontWeight: 600 }}>{doc.department}</span>
                      <span style={{ fontSize: ".75rem", color: "var(--color-text-muted)" }}>· {doc.experience}</span>
                    </div>
                    {doc.bio && <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)", marginTop: "3px", lineHeight: 1.4 }}>{doc.bio}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

}

// ── Main Client Component ──────────────────────────────────────
export default function PatientAppointmentsClient({
  patientId,
  initialAppointments,
  doctors,
}: {
  patientId: string;
  initialAppointments: Appointment[];
  doctors: DoctorOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showBook,    setShowBook]    = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel,  setShowCancel]  = useState(false);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [bookError,   setBookError]   = useState("");
  const [actionMsg,   setActionMsg]   = useState("");

  // Book form
  const [bookForm, setBookForm] = useState({
    selectedDoctor: null as DoctorOption | null,
    date: "", time: "", reason: "",
  });
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "" });

  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{role: 'ai'|'user', content: string}[]>([
    { role: 'ai', content: 'Xin chào! Tôi là trợ lý sàng lọc lâm sàng AI. Tôi hỗ trợ thu thập triệu chứng để chuẩn bị trước hồ sơ khám bệnh của bạn. Lưu ý quan trọng: Tôi không có chức năng chẩn đoán y khoa thay thế bác sĩ.' }
  ]);

  const handleSendAi = (text?: string) => {
    const msg = text || aiInput;
    if (!msg.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', content: msg }]);
    setAiInput("");
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'ai', content: "Hệ thống đã ghi nhận triệu chứng. Vui lòng đặt lịch để bác sĩ chuyên khoa có thể tư vấn thêm." }]);
    }, 600);
  };

  const filtered = filterStatus === "all"
    ? initialAppointments
    : initialAppointments.filter((a) => a.status === filterStatus);

  const canAct = (s: AppointmentStatus) => s === "confirmed" || s === "pending";

  const showMsg = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const handleBook = () => {
    if (!bookForm.selectedDoctor || !bookForm.date || !bookForm.time) {
      setBookError("Vui lòng chọn bác sĩ, ngày và giờ khám.");
      return;
    }
    setBookError("");
    startTransition(async () => {
      await bookAppointment({
        patientId,
        doctorId:     bookForm.selectedDoctor!.id,
        departmentId: bookForm.selectedDoctor!.departmentId,
        date:         bookForm.date,
        time:         bookForm.time,
        reason:       bookForm.reason || undefined,
      });
      setShowBook(false);
      setBookForm({ selectedDoctor: null, date: "", time: "", reason: "" });
      showMsg("✅ Đặt lịch thành công! Chờ bác sĩ xác nhận.");
      router.refresh();
    });
  };

  const handleReschedule = () => {
    if (!selectedId || !rescheduleForm.date || !rescheduleForm.time) return;
    startTransition(async () => {
      await rescheduleAppointment(selectedId, rescheduleForm.date, rescheduleForm.time);
      setShowReschedule(false);
      setRescheduleForm({ date: "", time: "" });
      setSelectedId(null);
      showMsg("📅 Dời lịch thành công!");
      router.refresh();
    });
  };

  const handleCancel = () => {
    if (!selectedId) return;
    startTransition(async () => {
      await cancelAppointment(selectedId);
      setShowCancel(false);
      setSelectedId(null);
      showMsg("Lịch hẹn đã được huỷ.");
      router.refresh();
    });
  };

  return (
    <div className="app-layout">
      <Sidebar role="patient" />
      <main className="main-content page-bg-premium" style={{ position: "relative", overflowX: "hidden" }}>
        {/* Ambient premium glowing meshes from design preview */}
        <div style={{ position: "absolute", top: 0, left: "15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,127,255,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }}></div>
        <div style={{ position: "absolute", top: "300px", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }}></div>

        <header className="page-header page-header-premium" style={{ position: "relative", zIndex: 10 }}>
          <div className="page-header-left">
            <h1 className="page-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a" }}>Lịch hẹn của tôi</h1>
            <p className="page-subtitle" style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Xem và quản lý các buổi hẹn khám bệnh</p>
          </div>
          <div className="page-header-right">
            <button id="btn-book-appointment" className="btn-azure" onClick={() => setShowBook(true)} style={{ borderRadius: "9999px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, marginRight: "4px" }}>+</span> Đặt lịch khám
            </button>
          </div>
        </header>

        <div className="page-body" style={{ position: "relative", zIndex: 10 }}>
          {actionMsg && (
            <div className="alert-premium alert-success">
              <span style={{ fontSize: "1rem", fontWeight: 700 }}>✓</span> {actionMsg}
            </div>
          )}

          {/* BENTO GRID LAYOUT */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            {/* LEFT COLUMN */}
            <div style={{ flex: "1 1 0%", minWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Premium Bento Card for Table */}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.06)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "12px", textTransform: "uppercase" }}>
                      <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--azure)" }}></span>
                      Quản lý luồng lịch hẹn
                    </div>
                    <h2 style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Danh sách lịch khám chuyên khoa</h2>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Theo dõi và cập nhật trạng thái các buổi hẹn với bác sĩ.</p>
                  </div>

                  {/* Segmented Control for Tabs */}
                  <div style={{ display: "flex", background: "rgba(241, 245, 249, 0.8)", padding: "4px", borderRadius: "12px", gap: "4px" }}>
                    {[
                      { value: "all", label: "Tất cả" },
                      { value: "pending", label: "Chờ xác nhận" },
                      { value: "confirmed", label: "Đã xác nhận" },
                      { value: "completed", label: "Hoàn thành" }
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setFilterStatus(tab.value)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "none",
                          background: filterStatus === tab.value ? "#ffffff" : "transparent",
                          color: filterStatus === tab.value ? "var(--azure)" : "#64748b",
                          fontSize: "0.8rem",
                          fontWeight: filterStatus === tab.value ? 700 : 500,
                          boxShadow: filterStatus === tab.value ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Area */}
                <div className="table-premium" style={{ border: "1px solid rgba(0,0,0,0.04)", borderRadius: "16px", overflow: "hidden", margin: "8px 0 0 0" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead style={{ background: "rgba(248, 250, 252, 0.6)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <tr>
                          <th style={{ padding: "16px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Bác sĩ</th>
                          <th style={{ padding: "16px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Thời gian / Lý do</th>
                          <th style={{ padding: "16px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Chuyên khoa</th>
                          <th style={{ padding: "16px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Trạng thái</th>
                          <th style={{ padding: "16px 20px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((a) => {
                          const col = DOCTOR_COLORS[a.department] ?? { bg: "var(--gray-100)", color: "var(--gray-600)", initials: "BS" };
                          return (
                            <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248, 250, 252, 0.4)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                              <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", whiteSpace: "nowrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: col.bg, color: col.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>{col.initials}</div>
                                  <div>
                                    <div style={{ color: "#0f172a" }}>{a.doctorName}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500, marginTop: "2px", fontFamily: "monospace" }}>#{a.id.slice(-6).toUpperCase()}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#334155" }}>{a.reason || "Không có lý do khám"}</div>
                                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span style={{ display: "inline-flex", width: "16px", height: "16px", borderRadius: "4px", background: "rgba(0,127,255,0.08)", color: "var(--azure)", alignItems: "center", justifyContent: "center", fontSize: "0.6rem" }}>🕒</span>
                                  {a.time} - {new Date(a.date + "T00:00:00").toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                                </div>
                              </td>
                              <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                <span style={{ color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>
                                  Khoa {a.department}
                                </span>
                              </td>
                              <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                <span className={`badge-premium status-${a.status}`}>{statusLabel[a.status]}</span>
                              </td>
                              <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                {canAct(a.status) ? (
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => { setSelectedId(a.id); setShowReschedule(true); }} style={{ padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, color: "#475569", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--azure)"; e.currentTarget.style.color = "var(--azure)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}>Dời lịch</button>
                                    <button onClick={() => { setSelectedId(a.id); setShowCancel(true); }} style={{ padding: "6px 12px", background: "transparent", border: "none", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>Huỷ</button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: "0.78rem", color: "#cbd5e1", fontStyle: "italic" }}>Không khả dụng</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div style={{ padding: "60px 24px", textAlign: "center", background: "#ffffff" }}>
                        <div style={{ fontSize: "2.5rem", opacity: 0.2, color: "var(--azure)", marginBottom: "16px" }}>🏥</div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Không tìm thấy lịch hẹn</div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Chưa có lịch hẹn nào phù hợp với điều kiện lọc hiện tại.</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Card Footer */}
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                    Dữ liệu giả lập thời gian thực
                  </div>
                  <div>
                    <button onClick={() => setShowBook(true)} style={{ background: "transparent", border: "none", color: "var(--azure)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}>
                      Quản lý chuyên sâu →
                    </button>
                  </div>
                </div>
              </div>

              {/* Data stream card (Dòng dữ liệu luân chuyển thực tế) */}
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
                    <span style={{ display: "inline-block", width: "12px", height: "14px", display: "flex", alignItems: "center" }}>🛡️</span>
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

            {/* RIGHT COLUMN */}
            <div style={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Featured Doctor Card (Bác sĩ trực ban) */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <span style={{ display: "inline-flex", width: "12px", height: "14px", alignItems: "center" }}>👨‍⚕️</span>
                    BÁC SĨ TRỰC BAN
                  </div>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }}></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#eff6ff", color: "var(--azure)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, border: "1px solid rgba(0,127,255,0.1)" }}>TM</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>ThS. BS. Trần Minh</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>Trưởng Khoa Tim Mạch</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "16px", marginBottom: "8px" }}>
                  <span style={{ color: "#94a3b8" }}>Mã chứng chỉ:</span>
                  <span style={{ fontWeight: 700, color: "#334155" }}>CCHN-2826</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>Số lịch hẹn:</span>
                  <span style={{ fontWeight: 700, color: "#334155" }}>14 ca hôm nay</span>
                </div>
              </div>

              {/* AI Assistant Card (AI Sàng lọc lâm sàng) */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                minHeight: "440px"
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 127, 255, 0.08)", color: "var(--azure)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start" }}>
                  <span style={{ display: "inline-flex", width: "12px", height: "14px", alignItems: "center" }}>🤖</span>
                  AI SÀNG LỌC LÂM SÀNG
                </div>
                
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                  {aiMessages.map((msg, i) => (
                    <div key={i} style={{ 
                      alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                      background: msg.role === 'ai' ? "#f8fafc" : "var(--azure)",
                      color: msg.role === 'ai' ? "#475569" : "#fff",
                      padding: "12px 16px", 
                      borderRadius: "16px",
                      borderBottomLeftRadius: msg.role === 'ai' ? "4px" : "16px",
                      borderBottomRightRadius: msg.role === 'user' ? "4px" : "16px",
                      fontSize: "0.85rem", 
                      lineHeight: 1.5, 
                      border: msg.role === 'ai' ? "1px solid rgba(0,0,0,0.03)" : "none",
                      maxWidth: "90%"
                    }}>
                      {msg.content}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <div style={{ position: "relative", marginBottom: "12px" }}>
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                          handleSendAi();
                        }
                      }}
                      placeholder="Mô tả triệu chứng..." 
                      style={{ width: "100%", padding: "12px 16px", paddingRight: "44px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }} 
                    />
                    <button onClick={() => handleSendAi()} style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--azure)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span onClick={() => handleSendAi("Tôi có triệu chứng sốt")} style={{ background: "#f1f5f9", color: "#475569", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}>+ Bị sốt</span>
                    <span onClick={() => handleSendAi("Tôi cảm thấy đau ngực")} style={{ background: "#f1f5f9", color: "#475569", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}>+ Đau ngực</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>

      {/* ── BOOK MODAL ── */}
      {showBook && (
        <div className="modal-backdrop-premium" onClick={() => setShowBook(false)}>
          <div className="modal-premium modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: "1px solid rgba(0, 127, 255, 0.05)", paddingBottom: "20px" }}>
              <span className="modal-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Đặt lịch khám mới</span>
              <button className="modal-close" onClick={() => setShowBook(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ paddingTop: "24px", paddingBottom: "24px" }}>
              {bookError && (
                <div className="alert-premium alert-error">
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>!</span> {bookError}
                </div>
              )}
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="doctor-picker-trigger" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>
                  Chọn bác sĩ <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <DoctorPicker doctors={doctors} selected={bookForm.selectedDoctor} onSelect={(d) => setBookForm({ ...bookForm, selectedDoctor: d })} />
                {bookForm.selectedDoctor && (
                  <div className="form-hint" style={{ fontSize: "0.75rem", color: "var(--azure)", marginTop: "8px", fontWeight: 500 }}>Khoa: {bookForm.selectedDoctor.department} · {bookForm.selectedDoctor.specialty}</div>
                )}
              </div>
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="book-date" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>Ngày khám <span style={{ color: "var(--color-danger)" }}>*</span></label>
                  <input id="book-date" type="date" className="form-input-premium" min={new Date().toISOString().split("T")[0]} value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="book-time" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>Giờ khám <span style={{ color: "var(--color-danger)" }}>*</span></label>
                  <select id="book-time" className="form-select-premium" value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}>
                    <option value="">-- Chọn giờ --</option>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="book-reason" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>Lý do khám</label>
                <textarea id="book-reason" className="form-textarea-premium" placeholder="Mô tả triệu chứng hoặc lý do khám..." value={bookForm.reason} onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })} style={{ minHeight: "90px" }} />
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: "1px solid rgba(0, 127, 255, 0.05)", paddingTop: "20px" }}>
              <button className="btn btn-ghost" onClick={() => setShowBook(false)}>Huỷ</button>
              <button id="btn-confirm-book" className="btn-azure" onClick={handleBook} disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
                {isPending ? "Đang xử lý..." : "Xác nhận đặt lịch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESCHEDULE MODAL ── */}
      {showReschedule && (
        <div className="modal-backdrop-premium" onClick={() => setShowReschedule(false)}>
          <div className="modal-premium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: "1px solid rgba(0, 127, 255, 0.05)", paddingBottom: "20px" }}>
              <span className="modal-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>Dời lịch hẹn</span>
              <button className="modal-close" onClick={() => setShowReschedule(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ paddingTop: "24px", paddingBottom: "24px" }}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="reschedule-date" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>Ngày mới *</label>
                <input id="reschedule-date" type="date" className="form-input-premium" min={new Date().toISOString().split("T")[0]} value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reschedule-time" style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#475569", marginBottom: "8px", display: "block" }}>Giờ mới *</label>
                <select id="reschedule-time" className="form-select-premium" value={rescheduleForm.time} onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}>
                  <option value="">-- Chọn giờ --</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: "1px solid rgba(0, 127, 255, 0.05)", paddingTop: "20px" }}>
              <button className="btn btn-ghost" onClick={() => setShowReschedule(false)}>Huỷ</button>
              <button id="btn-confirm-reschedule" className="btn-azure" onClick={handleReschedule} disabled={isPending || !rescheduleForm.date || !rescheduleForm.time} style={{ opacity: (isPending || !rescheduleForm.date || !rescheduleForm.time) ? 0.5 : 1 }}>
                Xác nhận dời lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL DIALOG ── */}
      {showCancel && (
        <div className="modal-backdrop-premium" onClick={() => setShowCancel(false)}>
          <div className="modal-premium confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: "32px 24px" }}>
            <div className="confirm-body" style={{ padding: 0 }}>
              <div className="confirm-icon" style={{ background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "1.3rem", fontWeight: 700, width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>!</div>
              <h2 className="modal-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Huỷ lịch hẹn?</h2>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Hành động này không thể hoàn tác. Bạn có chắc chắn?</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: "center", borderTop: "none", padding: "24px 0 0 0", gap: "12px" }}>
              <button className="btn btn-ghost" onClick={() => setShowCancel(false)}>Không, giữ lại</button>
              <button id="btn-confirm-cancel" className="btn btn-danger" onClick={handleCancel} disabled={isPending} style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600, border: "none", cursor: "pointer", background: "#ef4444", color: "#fff", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")} onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}>
                {isPending ? "Đang xử lý..." : "Huỷ lịch hẹn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
