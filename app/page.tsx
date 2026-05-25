"use client";

import Link from "next/link";


export default function RoleSelectionPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
        padding: "24px",
      }}
    >
      {/* Logo header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
            boxShadow: "0 8px 32px rgba(37,99,235,.25)",
          }}
        >
          🏥
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#1e3a8a",
            marginBottom: "8px",
            lineHeight: 1.2,
          }}
        >
          HealthCare AI
        </h1>
        <p style={{ color: "#475569", fontSize: "1rem" }}>
          Hệ thống quản lý y tế thông minh
        </p>
      </div>

      {/* Role selection */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,.6)",
            border: "1px solid #bfdbfe",
            borderRadius: "999px",
            padding: "6px 16px",
            fontSize: ".82rem",
            color: "#1e40af",
            fontWeight: 500,
            marginBottom: "20px",
          }}
        >
          🔐 Chọn vai trò để tiếp tục
        </div>
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "4px",
          }}
        >
          Bạn đang sử dụng với vai trò nào?
        </h2>
        <p style={{ color: "#64748b", fontSize: ".88rem" }}>
          Đây là bản demo — không yêu cầu đăng nhập
        </p>
      </div>

      {/* Role cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          maxWidth: "640px",
          width: "100%",
        }}
      >
        {/* Patient card */}
        <Link
          href="/patient/appointments"
          id="role-patient"
          style={{
            display: "block",
            background: "#ffffff",
            border: "2px solid #bfdbfe",
            borderRadius: "20px",
            padding: "32px 24px",
            textAlign: "center",
            textDecoration: "none",
            transition: "all .2s",
            boxShadow: "0 4px 16px rgba(37,99,235,.08)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3b82f6";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(37,99,235,.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#bfdbfe";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(37,99,235,.08)";
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 16px",
            }}
          >
            👤
          </div>
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            Bệnh nhân
          </div>
          <div
            style={{
              fontSize: ".82rem",
              color: "#64748b",
              lineHeight: 1.5,
              marginBottom: "20px",
            }}
          >
            Xem &amp; đặt lịch hẹn khám bệnh, tương tác với trợ lý AI sức khỏe
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "999px",
              fontSize: ".85rem",
              fontWeight: 600,
            }}
          >
            Vào giao diện Bệnh nhân →
          </div>
        </Link>

        {/* Doctor card */}
        <Link
          href="/doctor/appointments"
          id="role-doctor"
          style={{
            display: "block",
            background: "#ffffff",
            border: "2px solid #bbf7d0",
            borderRadius: "20px",
            padding: "32px 24px",
            textAlign: "center",
            textDecoration: "none",
            transition: "all .2s",
            boxShadow: "0 4px 16px rgba(16,185,129,.08)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#10b981";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(16,185,129,.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#bbf7d0";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(16,185,129,.08)";
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 16px",
            }}
          >
            🩺
          </div>
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            Bác sĩ
          </div>
          <div
            style={{
              fontSize: ".82rem",
              color: "#64748b",
              lineHeight: 1.5,
              marginBottom: "20px",
            }}
          >
            Quản lý lịch hẹn, xem hồ sơ và cập nhật tình trạng bệnh nhân
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "999px",
              fontSize: ".85rem",
              fontWeight: 600,
            }}
          >
            Vào giao diện Bác sĩ →
          </div>
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "40px",
          color: "#94a3b8",
          fontSize: ".75rem",
          textAlign: "center",
        }}
      >
        HealthCare AI v2.0 · Hệ thống quản lý y tế · Chỉ dùng cho mục đích demo
      </p>
    </div>
  );
}
