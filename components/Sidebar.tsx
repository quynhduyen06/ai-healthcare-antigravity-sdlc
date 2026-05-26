"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  role: "patient" | "doctor";
}

const patientNav: NavItem[] = [
  { href: "/patient/appointments", label: "Lịch hẹn của tôi", icon: "📅" },
  { href: "/patient/assistant",    label: "Trợ lý AI",        icon: "🤖" },
];

const doctorNav: NavItem[] = [
  { href: "/doctor/appointments", label: "Quản lý lịch hẹn",   icon: "📅" },
  { href: "/doctor/patients",     label: "Danh sách bệnh nhân", icon: "👥" },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      document.documentElement.style.setProperty('--sidebar-width', '80px');
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '240px');
    }
    // Cleanup on unmount
    return () => document.documentElement.style.removeProperty('--sidebar-width');
  }, [isCollapsed]);

  const navItems = role === "patient" ? patientNav : doctorNav;
  const userInfo =
    role === "patient"
      ? { name: "Nguyễn Thị Lan",   role: "Bệnh nhân",       initials: "NL" }
      : { name: "BS. Trần Minh Khoa", role: "Bác sĩ nội khoa", initials: "TK" };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="sidebar" style={{ transition: "width 0.3s ease" }}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        style={{
          position: "absolute",
          right: "-14px",
          top: "40px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#fff",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 110,
          color: "var(--color-text-muted)",
          fontSize: "0.8rem",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        {isCollapsed ? "❯" : "❮"}
      </button>

      {/* Logo */}
      <div className="sidebar-logo" style={{ padding: isCollapsed ? "var(--space-6) 0" : "var(--space-6)", justifyContent: isCollapsed ? "center" : "flex-start" }}>
        <div className="sidebar-logo-icon">🏥</div>
        {!isCollapsed && (
          <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
            <div className="sidebar-logo-text">HealthCare AI</div>
            <div className="sidebar-logo-sub">Trợ lý sức khỏe thông minh</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sidebar-section">
        {!isCollapsed && (
          <div className="sidebar-section-label">
            {role === "patient" ? "Bệnh nhân" : "Bác sĩ"}
          </div>
        )}
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
                style={{ justifyContent: isCollapsed ? "center" : "flex-start", padding: isCollapsed ? "12px 0" : "var(--space-2) var(--space-3)" }}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="nav-icon" style={{ margin: isCollapsed ? 0 : undefined }}>{item.icon}</span>
                {!isCollapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User info + Logout */}
      <div className="sidebar-user" style={{ padding: isCollapsed ? "var(--space-4) 0" : "var(--space-3) var(--space-4)", flexDirection: isCollapsed ? "column" : "row", justifyContent: isCollapsed ? "center" : "flex-start" }}>
        <div className="sidebar-avatar">{userInfo.initials}</div>
        {!isCollapsed && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userInfo.name}</div>
            <div className="sidebar-user-role">{userInfo.role}</div>
          </div>
        )}
        <button
          id="btn-logout"
          onClick={handleLogout}
          title="Đăng xuất"
          style={{
            marginLeft: isCollapsed ? "0" : "auto",
            marginTop: isCollapsed ? "12px" : "0",
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: "1.15rem",
            padding: "4px 6px",
            borderRadius: "var(--radius-sm)",
            transition: "background .15s, color .15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-danger-light)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-danger)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
          }}
        >
          🚪
        </button>
      </div>
    </aside>
  );
}
