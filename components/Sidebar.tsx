"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  const navItems = role === "patient" ? patientNav : doctorNav;
  const userInfo =
    role === "patient"
      ? { name: "Nguyễn Thị Lan",   role: "Bệnh nhân",       initials: "NL" }
      : { name: "BS. Trần Minh Khoa", role: "Bác sĩ nội khoa", initials: "TK" };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏥</div>
        <div>
          <div className="sidebar-logo-text">HealthCare AI</div>
          <div className="sidebar-logo-sub">Trợ lý sức khỏe thông minh</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">
          {role === "patient" ? "Bệnh nhân" : "Bác sĩ"}
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User info + Logout */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">{userInfo.initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{userInfo.name}</div>
          <div className="sidebar-user-role">{userInfo.role}</div>
        </div>
        <button
          id="btn-logout"
          onClick={handleLogout}
          title="Đăng xuất"
          style={{
            marginLeft: "auto",
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
