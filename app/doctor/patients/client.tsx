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

  return (
    <div className="app-layout">
      <Sidebar role="doctor" />

      <main className="main-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Danh sách bệnh nhân</h1>
            <p className="page-subtitle">Hồ sơ và lịch sử khám bệnh</p>
          </div>
          <div className="page-header-right">
            <Link href="/doctor/appointments">
              <button className="btn btn-secondary btn-sm">📅 Quản lý lịch hẹn</button>
            </Link>
          </div>
        </header>

        <div className="page-body">
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
            {/* Patient list sidebar */}
            <div>
              <div className="search-input-wrap" style={{ marginBottom: "16px" }}>
                <span className="search-icon">🔍</span>
                <input
                  id="search-patients"
                  type="text"
                  className="search-input"
                  placeholder="Tìm bệnh nhân…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    id={`btn-patient-${p.id}`}
                    onClick={() => { setSelected(p); setActiveTab("record"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: `1.5px solid ${selected?.id === p.id ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: selected?.id === p.id ? "var(--color-primary-light)" : "var(--color-surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all .15s",
                      boxShadow: selected?.id === p.id ? "0 0 0 3px rgba(37,99,235,.08)" : "var(--shadow-xs)",
                    }}
                  >
                    <div
                      style={{
                        width: "40px", height: "40px",
                        borderRadius: "50%",
                        background: selected?.id === p.id
                          ? "linear-gradient(135deg,var(--blue-500),var(--blue-700))"
                          : "linear-gradient(135deg,var(--gray-300),var(--gray-400))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: ".85rem",
                        flexShrink: 0,
                      }}
                    >
                      {initials(p.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: ".72rem", color: "var(--color-text-muted)" }}>{p.id} · {p.age} tuổi · {p.gender}</div>
                    </div>
                  </button>
                ))}

                {filteredPatients.length === 0 && (
                  <div className="empty-state" style={{ padding: "32px 16px" }}>
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title" style={{ fontSize: ".88rem" }}>Không tìm thấy</div>
                  </div>
                )}
              </div>
            </div>

            {/* Patient detail */}
            <div>
              {selected ? (
                <div className="patient-profile-grid">
                  {/* Patient card */}
                  <div className="patient-card">
                    <div className="patient-card-header">
                      <div className="patient-avatar-lg">{initials(selected.name)}</div>
                      <div className="patient-name">{selected.name}</div>
                      <div className="patient-id">{selected.id}</div>
                      <div className="patient-tags">
                        {selected.tags.map((t) => (
                          <span key={t} className="badge badge-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="patient-info-list">
                      {[
                        { label: "Ngày sinh",  value: new Date(selected.dob).toLocaleDateString("vi-VN") },
                        { label: "Tuổi",       value: `${selected.age} tuổi` },
                        { label: "Giới tính",  value: selected.gender },
                        { label: "Nhóm máu",   value: selected.bloodType || "Chưa rõ" },
                        { label: "Cân nặng",   value: selected.weight || "Chưa rõ" },
                        { label: "Chiều cao",  value: selected.height || "Chưa rõ" },
                        { label: "Điện thoại", value: selected.phone || "Chưa rõ" },
                        { label: "Email",      value: selected.email || "Chưa rõ" },
                        { label: "Địa chỉ",   value: selected.address || "Chưa rõ" },
                        { label: "Dị ứng",    value: selected.allergies || "Không rõ" },
                      ].map((row) => (
                        <div key={row.label} className="patient-info-row">
                          <span className="patient-info-label">{row.label}</span>
                          <span className="patient-info-value" style={{ textAlign: "right", maxWidth: "55%" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                {/* Right panel */}
                <div>
                  {/* Tabs */}
                  <div className="tabs">
                    <button
                      id="tab-record"
                      className={`tab-btn ${activeTab === "record" ? "active" : ""}`}
                      onClick={() => setActiveTab("record")}
                    >
                      🗂 Hồ sơ y tế
                    </button>
                    <button
                      id="tab-history"
                      className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
                      onClick={() => setActiveTab("history")}
                    >
                      📅 Lịch sử khám
                    </button>
                  </div>

                  {/* Medical Record Tab */}
                  {activeTab === "record" && (
                    <div>
                      <div className="card" style={{ marginBottom: "16px" }}>
                        <div className="section-header" style={{ marginBottom: "16px" }}>
                          <div className="card-title">Hồ sơ y tế hiện tại</div>
                          <span className="badge badge-tag">
                            Chẩn đoán: {new Date(selected.record.diagnosed).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="medical-record-grid">
                          <div className="record-item">
                            <div className="record-label">Chẩn đoán</div>
                            <div className="record-value">{selected.record.condition}</div>
                          </div>
                          <div className="record-item">
                            <div className="record-label">Ngày chẩn đoán</div>
                            <div className="record-value">
                              {new Date(selected.record.diagnosed).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <div className="record-item" style={{ gridColumn: "1 / -1" }}>
                            <div className="record-label">Thuốc đang dùng</div>
                            <div className="record-value">{selected.record.medication}</div>
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <div className="form-label">Ghi chú lâm sàng</div>
                          <div
                            style={{
                              background: "var(--gray-50)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "var(--radius-sm)",
                              padding: "12px 14px",
                              fontSize: ".85rem",
                              color: "var(--color-text)",
                              lineHeight: 1.6,
                            }}
                          >
                            {selected.record.notes}
                          </div>
                        </div>
                      </div>

                      {/* Vitals quick view */}
                      <div className="card card-sm">
                        <div className="card-title" style={{ marginBottom: "12px" }}>Chỉ số sinh tồn (gần nhất)</div>
                        <div className="medical-record-grid">
                          {[
                            { label: "Huyết áp",       value: "125/82 mmHg" },
                            { label: "Nhịp tim",        value: "76 bpm" },
                            { label: "Nhiệt độ",        value: "36.7 °C" },
                            { label: "SpO₂",            value: "98%" },
                          ].map((v) => (
                            <div key={v.label} className="record-item">
                              <div className="record-label">{v.label}</div>
                              <div className="record-value" style={{ color: "var(--blue-700)" }}>{v.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* History Tab */}
                  {activeTab === "history" && (
                    <div>
                      <div className="section-header" style={{ marginBottom: "12px" }}>
                        <div className="section-title">Lịch sử khám bệnh</div>
                        <span className="badge badge-tag">{selected.history.length} lần khám</span>
                      </div>
                      <div className="appt-history">
                        {selected.history.map((h) => {
                          const d = new Date(h.date);
                          return (
                            <div key={h.id} className="appt-history-item">
                              <div className="appt-date">
                                <div className="appt-date-day">{String(d.getDate()).padStart(2, "0")}</div>
                                <div className="appt-date-month">
                                  T{d.getMonth() + 1}/{d.getFullYear()}
                                </div>
                              </div>
                              <div className="appt-divider" />
                              <div className="appt-info" style={{ flex: 1 }}>
                                <div className="appt-doctor">{h.reason}</div>
                                {h.note && (
                                  <div className="appt-dept" style={{ marginTop: "2px" }}>
                                    📝 {h.note}
                                  </div>
                                )}
                              </div>
                              <div className="appt-history-badge">
                                <span className={`badge badge-${h.status}`}>{statusLabel[h.status]}</span>
                                <span style={{ fontSize: ".72rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                                  {h.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              ) : (
                <div className="empty-state" style={{ padding: "48px", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                  <div className="empty-icon" style={{ fontSize: "2rem", marginBottom: "12px" }}>🧑‍⚕️</div>
                  <div className="empty-title">Chưa chọn bệnh nhân</div>
                  <div className="empty-desc" style={{ fontSize: ".85rem", color: "var(--color-text-muted)" }}>Vui lòng chọn một bệnh nhân từ danh sách để xem hồ sơ y tế.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
