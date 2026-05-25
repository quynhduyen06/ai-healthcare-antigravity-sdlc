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

const DOCTOR_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  "Nội khoa":   { color: "#1e40af", bg: "#dbeafe", icon: "🧑‍⚕️" },
  "Tim mạch":   { color: "#991b1b", bg: "#fee2e2", icon: "👩‍⚕️" },
  "Thần kinh":  { color: "#5b21b6", bg: "#ede9fe", icon: "🧑‍⚕️" },
  "Nội tiết":   { color: "#065f46", bg: "#d1fae5", icon: "👩‍⚕️" },
  "Hô hấp":     { color: "#92400e", bg: "#fef3c7", icon: "🧑‍⚕️" },
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
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${open ? "var(--color-primary)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-sm)", background: "var(--color-surface)",
          cursor: "pointer", textAlign: "left",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: ".88rem", boxShadow: open ? "0 0 0 3px rgba(37,99,235,.1)" : "none",
        }}
      >
        {selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{DOCTOR_COLORS[selected.department]?.icon ?? "🧑‍⚕️"}</span>
            <span>
              <strong>{selected.name}</strong>
              <span style={{ color: "var(--color-text-muted)", marginLeft: "8px", fontSize: ".8rem" }}>
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
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          zIndex: 300, background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)", overflow: "hidden",
        }}>
          <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid var(--color-border)" }}>
            <input
              id="doctor-search" type="text" autoFocus
              placeholder="🔍 Tìm theo tên, khoa..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: ".85rem", outline: "none" }}
            />
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "8px" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: ".85rem" }}>
                Không tìm thấy bác sĩ
              </div>
            )}
            {filtered.map((doc) => {
              const col = DOCTOR_COLORS[doc.department] ?? { color: "#1e40af", bg: "#dbeafe", icon: "🧑‍⚕️" };
              const isSel = selected?.id === doc.id;
              return (
                <button key={doc.id} type="button" id={`doctor-option-${doc.id}`}
                  onClick={() => { onSelect(doc); setOpen(false); setSearch(""); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "10px 12px", marginBottom: "4px",
                    border: `1.5px solid ${isSel ? "var(--color-primary)" : "transparent"}`,
                    borderRadius: "var(--radius-md)", background: isSel ? "var(--color-primary-light)" : "var(--gray-50)",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: col.bg, color: col.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                    {col.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                      <span style={{ fontWeight: 600, fontSize: ".88rem" }}>{doc.name}</span>
                      {isSel && <span style={{ fontSize: ".72rem", background: "var(--color-primary)", color: "#fff", padding: "2px 8px", borderRadius: "999px" }}>✓ Đã chọn</span>}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "3px" }}>
                      <span style={{ fontSize: ".75rem", color: col.color, background: col.bg, padding: "1px 7px", borderRadius: "999px", fontWeight: 500 }}>{doc.department}</span>
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
      <main className="main-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Lịch hẹn của tôi</h1>
            <p className="page-subtitle">Xem và quản lý các buổi hẹn khám bệnh</p>
          </div>
          <div className="page-header-right">
            <button id="btn-book-appointment" className="btn btn-primary btn-sm" onClick={() => setShowBook(true)}>
              + Đặt lịch khám
            </button>
          </div>
        </header>

        <div className="page-body">
          {actionMsg && (
            <div style={{ background: "var(--color-success-light)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-sm)", padding: "10px 16px", marginBottom: "16px", color: "#065f46", fontSize: ".88rem" }}>
              {actionMsg}
            </div>
          )}

          <div className="toolbar">
            <div className="toolbar-left">
              <select id="filter-status" className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="rescheduled">Đã dời lịch</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>
            <div className="toolbar-right">
              <span style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>{filtered.length} lịch hẹn</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã lịch hẹn</th>
                  <th>Ngày &amp; Giờ</th>
                  <th>Bác sĩ</th>
                  <th>Khoa</th>
                  <th>Phòng khám</th>
                  <th>Lý do khám</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--blue-700)", fontSize: ".8rem" }}>{a.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 600, fontSize: ".88rem" }}>{new Date(a.date + "T00:00:00").toLocaleDateString("vi-VN")}</div>
                      <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>{a.time}</div>
                    </td>
                    <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{a.doctorName}</td>
                    <td style={{ whiteSpace: "nowrap" }}><span className="badge badge-tag">{a.department}</span></td>
                    <td style={{ fontSize: ".82rem", color: "var(--color-text-muted)", minWidth: "140px" }}>{a.location}</td>
                    <td style={{ fontSize: ".82rem", maxWidth: "160px", wordBreak: "break-word" }}>{a.reason}</td>
                    <td style={{ whiteSpace: "nowrap" }}><span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span></td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {canAct(a.status) ? (
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-xs" id={`btn-reschedule-${a.id}`} onClick={() => { setSelectedId(a.id); setShowReschedule(true); }}>📆 Dời</button>
                          <button className="btn btn-danger btn-xs"    id={`btn-cancel-${a.id}`}     onClick={() => { setSelectedId(a.id); setShowCancel(true); }}>✕ Huỷ</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: ".78rem", color: "var(--color-text-subtle)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-title">Không có lịch hẹn</div>
                <div className="empty-desc">Chưa có lịch hẹn phù hợp với bộ lọc.</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── BOOK MODAL ── */}
      {showBook && (
        <div className="modal-backdrop" onClick={() => setShowBook(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📅 Đặt lịch khám mới</span>
              <button className="modal-close" onClick={() => setShowBook(false)}>✕</button>
            </div>
            <div className="modal-body">
              {bookError && (
                <div style={{ background: "var(--color-danger-light)", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: "16px", fontSize: ".85rem" }}>
                  ⚠️ {bookError}
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="doctor-picker-trigger">
                  Chọn bác sĩ <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <DoctorPicker doctors={doctors} selected={bookForm.selectedDoctor} onSelect={(d) => setBookForm({ ...bookForm, selectedDoctor: d })} />
                {bookForm.selectedDoctor && (
                  <div className="form-hint">Khoa: {bookForm.selectedDoctor.department} · {bookForm.selectedDoctor.specialty}</div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="book-date">Ngày khám <span style={{ color: "var(--color-danger)" }}>*</span></label>
                  <input id="book-date" type="date" className="form-input" min={new Date().toISOString().split("T")[0]} value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="book-time">Giờ khám <span style={{ color: "var(--color-danger)" }}>*</span></label>
                  <select id="book-time" className="form-select" value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}>
                    <option value="">-- Chọn giờ --</option>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="book-reason">Lý do khám</label>
                <textarea id="book-reason" className="form-textarea" placeholder="Mô tả triệu chứng hoặc lý do..." value={bookForm.reason} onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })} style={{ minHeight: "80px" }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowBook(false)}>Huỷ</button>
              <button id="btn-confirm-book" className="btn btn-primary" onClick={handleBook} disabled={isPending}>
                {isPending ? "Đang xử lý..." : "✅ Xác nhận đặt lịch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESCHEDULE MODAL ── */}
      {showReschedule && (
        <div className="modal-backdrop" onClick={() => setShowReschedule(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📆 Dời lịch hẹn</span>
              <button className="modal-close" onClick={() => setShowReschedule(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="reschedule-date">Ngày mới *</label>
                <input id="reschedule-date" type="date" className="form-input" min={new Date().toISOString().split("T")[0]} value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reschedule-time">Giờ mới *</label>
                <select id="reschedule-time" className="form-select" value={rescheduleForm.time} onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}>
                  <option value="">-- Chọn giờ --</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowReschedule(false)}>Huỷ</button>
              <button id="btn-confirm-reschedule" className="btn btn-primary" onClick={handleReschedule} disabled={isPending || !rescheduleForm.date || !rescheduleForm.time}>
                📅 Xác nhận dời lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL DIALOG ── */}
      {showCancel && (
        <div className="modal-backdrop" onClick={() => setShowCancel(false)}>
          <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-body">
              <div className="confirm-icon">⚠️</div>
              <h2 className="modal-title">Huỷ lịch hẹn?</h2>
              <p>Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => setShowCancel(false)}>Không, giữ lại</button>
              <button id="btn-confirm-cancel" className="btn btn-danger" onClick={handleCancel} disabled={isPending}>
                {isPending ? "Đang xử lý..." : "✕ Huỷ lịch hẹn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
