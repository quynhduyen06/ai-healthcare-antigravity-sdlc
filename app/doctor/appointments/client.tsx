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
      showMsg("📝 Ghi chú đã được lưu.");
      router.refresh();
    });
  };

  const total     = initialAppointments.length;
  const pending   = initialAppointments.filter((a) => a.status === "pending").length;
  const confirmed = initialAppointments.filter((a) => a.status === "confirmed").length;
  const completed = initialAppointments.filter((a) => a.status === "completed").length;

  return (
    <div className="app-layout">
      <Sidebar role="doctor" />
      <main className="main-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Quản lý lịch hẹn</h1>
            <p className="page-subtitle">{doctorName} – Khoa {deptName}</p>
          </div>
          <div className="page-header-right">
            <span style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>
              Hôm nay: {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </header>

        <div className="page-body">
          {actionMsg && (
            <div style={{ background: "var(--color-success-light)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-sm)", padding: "10px 16px", marginBottom: "16px", color: "#065f46", fontSize: ".88rem" }}>
              {actionMsg}
            </div>
          )}

          {/* Stats */}
          <div className="stat-grid" style={{ marginBottom: "24px" }}>
            {[
              { icon: "📋", color: "blue",   value: total,     label: "Tổng lịch hẹn" },
              { icon: "⏳", color: "yellow", value: pending,   label: "Chờ xác nhận"  },
              { icon: "✅", color: "blue",   value: confirmed, label: "Đã xác nhận"   },
              { icon: "🏁", color: "green",  value: completed, label: "Hoàn thành"    },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div className="stat-body">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input id="search-appointments" type="text" className="search-input"
                  placeholder="Tìm theo tên BN…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select id="filter-status" className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input id="filter-date" type="date" className="filter-select" value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ paddingRight: "12px", backgroundImage: "none" }} />
              {filterDate && <button className="btn btn-ghost btn-sm" onClick={() => setFilterDate("")}>✕ Xoá lọc ngày</button>}
            </div>
            <div className="toolbar-right">
              <span style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>{filtered.length}/{total} lịch hẹn</span>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã lịch</th><th>Ngày &amp; Giờ</th><th>Bệnh nhân</th>
                  <th>Tuổi</th><th>Lý do khám</th><th>Ghi chú BS</th>
                  <th>Trạng thái</th><th>Cập nhật TT</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--blue-700)", fontSize: ".8rem" }}>
                        {a.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 600, fontSize: ".88rem" }}>
                        {new Date(a.date + "T00:00:00").toLocaleDateString("vi-VN")}
                      </div>
                      <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>{a.time}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 600, fontSize: ".88rem" }}>{a.patientName}</div>
                      <div style={{ fontSize: ".75rem", color: "var(--color-text-muted)" }}>{a.department}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{a.patientAge} tuổi</td>
                    <td style={{ fontSize: ".82rem", maxWidth: "180px", wordBreak: "break-word" }}>{a.reason}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn btn-ghost btn-xs" id={`btn-notes-${a.id}`}
                        onClick={() => { setSelectedId(a.id); setEditNotes(a.notes); setShowNotesModal(true); }}
                        title={a.notes || "Thêm ghi chú"}>
                        {a.notes ? "📝 Xem" : "✏️ Ghi chú"}
                      </button>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <select id={`status-select-${a.id}`} className="filter-select" value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value as AppointmentStatus)}
                        style={{ fontSize: ".78rem", padding: "4px 28px 4px 8px", minWidth: "130px" }}
                        disabled={a.status === "cancelled" || isPending}>
                        {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">Không tìm thấy lịch hẹn</div>
                <div className="empty-desc">Thử thay đổi từ khoá hoặc bộ lọc.</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="modal-backdrop" onClick={() => setShowNotesModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📝 Ghi chú bác sĩ</span>
              <button className="modal-close" onClick={() => setShowNotesModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="doctor-notes">Ghi chú / Nhận xét lâm sàng</label>
                <textarea id="doctor-notes" className="form-textarea"
                  placeholder="Nhập ghi chú về bệnh nhân, chẩn đoán sơ bộ, hướng điều trị…"
                  value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                  style={{ minHeight: "140px" }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNotesModal(false)}>Huỷ</button>
              <button id="btn-save-notes" className="btn btn-primary" onClick={saveNotes}>💾 Lưu ghi chú</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
