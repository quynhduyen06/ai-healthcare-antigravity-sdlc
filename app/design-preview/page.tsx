"use client";

import React, { useState } from "react";

/* ═══════════════════════════════════════════════════════
   Design Preview v6.0 — "Bright Glassmorphic Clinic SaaS"
   Inspired by: Modern B2B SaaS (Vercel, CarePulse)
   Primary: Azure Blue (#007fff) · Secondary: Mint Green (#10b981)
   Typography: Space Grotesk (Display) + Inter (Body)
   Layout: Gapless Bento Grid, Ambient Blurred Mesh, Glassmorphism
   ═══════════════════════════════════════════════════════ */

// ── SVG Duotone Icons (Phosphor style: Zero Emojis) ───────────────────────────
function IconStethoscope({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M184,80H152V64a8,8,0,0,1,8-8h16a8,8,0,0,0,0-16H160a24,24,0,0,0-24,24V80H64A32,32,0,0,0,32,112v40a64.07,64.07,0,0,0,64,64H160a64.07,64.07,0,0,0,64-64V112A32,32,0,0,0,184,80ZM96,200a48.05,48.05,0,0,1-48-48V112a16,16,0,0,1,16-16H176v56A48.05,48.05,0,0,1,128,200ZM208,152a48.05,48.05,0,0,1-48,48v-8H184a8,8,0,0,0,0-16H160v-8h24a8,8,0,0,0,0-16H160v-8h24a8,8,0,0,0,0-16H160v-8a16,16,0,0,1,16-16h8a16,16,0,0,1,16,16Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M184,72H152V64a8,8,0,0,1,8-8h16a8,8,0,0,0,0-16H160a24,24,0,0,0-24,24V72H64A40,40,0,0,0,24,112v40a72.08,72.08,0,0,0,72,72H160a72.08,72.08,0,0,0,72-72V112A40,40,0,0,0,184,72Zm-88,136a56.06,56.06,0,0,1-56-56V112a24,24,0,0,1,24-24H160v64A56.06,56.06,0,0,1,96,208Zm120-56a56.06,56.06,0,0,1-56,56v-16h24a8,8,0,0,0,0-16H160v-16h24a8,8,0,0,0,0-16H160v-16h24a8,8,0,0,0,0-16H160v-16a24,24,0,0,1,24-24h8a24,24,0,0,1,24,24Z" />
    </svg>
  );
}

function IconCalendar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,40H48A16,16,0,0,0,32,56V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A24,24,0,0,0,24,56V208a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V56A24,24,0,0,0,208,32Zm8,176a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80H216Zm0-144H40V56a8,8,0,0,1,8-8H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24a8,8,0,0,1,8,8Z" />
    </svg>
  );
}

function IconRobot({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,80H48A16,16,0,0,0,32,96v80a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M208,72H168V48h16a8,8,0,0,0,0-16H72a8,8,0,0,0,0,16H88V72H48A24,24,0,0,0,24,96v80a24,24,0,0,0,24,24H88v16a8,8,0,0,0,16,0V200h48v16a8,8,0,0,0,16,0V200h40a24,24,0,0,0,24-24V96A24,24,0,0,0,208,72Zm8,104a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8ZM104,48V72H152V48ZM84,128a12,12,0,1,1,12,12A12,12,0,0,1,84,128Zm64,0a12,12,0,1,1,12,12A12,12,0,0,1,148,128Z" />
    </svg>
  );
}

function IconUser({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0A87.83,87.83,0,0,1,74.08,197.5Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a87.6,87.6,0,0,1-44.06-11.83,72,72,0,0,1,88.12,0A87.6,87.6,0,0,1,128,216ZM80,128a48,48,0,1,1,48,48A48.05,48.05,0,0,1,80,128Zm80,0a32,32,0,1,0-32,32A32,32,0,0,0,160,128Z" />
    </svg>
  );
}

function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,40,128,24,48,40V112c0,61.76,34.35,101.44,80,120,45.65-18.56,80-58.24,80-120Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M208,32H48a8,8,0,0,0-7.85,6.43C34.78,72.48,32,106.84,32,112c0,70,41,114.73,88.46,134.82a24.23,24.23,0,0,0,15.08,0C183,226.73,224,182,224,112c0-5.16-2.78-39.52-8.15-73.57A8,8,0,0,0,208,32Zm-8,80c0,59.39-33.86,97.16-72,114.67-38.14-17.51-72-55.28-72-114.67,0-3.3,1.69-26.68,5.43-56H194.57C198.31,85.32,200,108.7,200,112Z" />
    </svg>
  );
}

function IconSparkle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24,152,104,232,128,152,152,128,232,104,152,24,128,104,104Z" opacity="0.2" className="text-[#007fff]" />
      <path d="M128,16a8,8,0,0,0-7.46,5.12L101.4,85.4,37.12,104.54a8,8,0,0,0,0,14.92l64.28,19.14,19.14,64.28a8,8,0,0,0,14.92,0l19.14-64.28,64.28-19.14a8,8,0,0,0,0-14.92L154.6,85.4l-19.14-64.28A8,8,0,0,0,128,16Zm41.1,100L128,128.9,86.9,116l24.78-8.26L120,83l8.32,24.78Z" />
    </svg>
  );
}

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconAlert({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Section H2 Title ───────────────────────────────────────
function SectionTitle({ label, title, description }: { label?: string; title: React.ReactNode; description?: string }) {
  return (
    <header className="mb-10">
      {label && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#007fff] mb-2">{label}</p>}
      <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.03em] text-slate-900 leading-none" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h2>
      {description && <p className="text-base text-slate-500 mt-3 max-w-2xl leading-relaxed">{description}</p>}
    </header>
  );
}

export default function DesignPreviewPage() {
  // ── Client side states for interactive simulator ──
  const [selectedScheduleTab, setSelectedScheduleTab] = useState<"today" | "tomorrow" | "week">("today");
  const [symptomInput, setSymptomInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "ai" | "user"; text: string; emergency?: boolean }>>([
    { role: "ai", text: "Xin chào! Tôi là trợ lý sàng lọc lâm sàng AI. Tôi hỗ trợ thu thập triệu chứng để chuẩn bị trước hồ sơ khám bệnh của bạn. Lưu ý quan trọng: Tôi không có chức năng chẩn đoán y khoa thay thế bác sĩ." },
  ]);

  const handleSendChat = () => {
    if (!symptomInput.trim()) return;
    const userMsg = symptomInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setSymptomInput("");

    // Trigger intelligent clinical triaging simulation
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      if (lower.includes("đau ngực") || lower.includes("đau tức ngực") || lower.includes("khó thở") || lower.includes("nhồi máu")) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Dựa trên triệu chứng đau tức ngực dữ dội kèm theo khó thở mà bạn mô tả, đây có thể là biểu hiện của một cơn đau thắt ngực không ổn định hoặc nhồi máu cơ tim cấp tính.",
          },
          {
            role: "ai",
            text: "CẢNH BÁO KHẨN CẤP: Đây là tình trạng đe dọa trực tiếp đến tính mạng. Hãy gọi số cấp cứu khẩn cấp hoặc di chuyển đến bệnh viện gần nhất ngay lập tức!",
            emergency: true,
          },
        ]);
      } else if (lower.includes("sốt") || lower.includes("ho") || lower.includes("đau đầu")) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Bạn ghi nhận triệu chứng sốt và nhức đầu nhẹ. Tôi đã lưu thông tin này vào hồ sơ sàng lọc ban đầu. Hãy uống nhiều nước và lựa chọn một lịch hẹn phù hợp tại chuyên khoa Nội của phòng khám.",
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `Tôi đã nhận thông tin triệu chứng: "${userMsg}". Thông tin này đã được phân tích và lưu chuyển tới bác sĩ trực khám chuyên khoa phù hợp nhất. Bạn có muốn đặt lịch khám trực tiếp ngay lúc này không?`,
          },
        ]);
      }
    }, 800);
  };

  const scheduleData = {
    today: [
      { id: "BN-0912", name: "Lâm Minh Khang", time: "08:00 – 08:30", symptom: "Khám định kỳ tim mạch", dept: "Khoa Tim Mạch", status: "Đã xác nhận", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
      { id: "BN-2048", name: "Hoàng Vy Thảo", time: "09:30 – 10:00", symptom: "Đau đầu dữ dội, mờ mắt", dept: "Khoa Thần Kinh", status: "Chờ xác nhận", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
      { id: "BN-7712", name: "Nguyễn Vũ Long", time: "11:00 – 11:30", symptom: "Khó nuốt, đau rát họng", dept: "Khoa Tai Mũi Họng", status: "Đã xác nhận", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    ],
    tomorrow: [
      { id: "BN-3392", name: "Phạm Hải Đăng", time: "08:30 – 09:00", symptom: "Đau thắt cơ ngực trái", dept: "Khoa Tim Mạch", status: "Chờ xác nhận", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
      { id: "BN-4401", name: "Đỗ Bảo Trâm", time: "10:30 – 11:00", symptom: "Tê bì chân tay kéo dài", dept: "Khoa Thần Kinh", status: "Đã hủy", badge: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    ],
    week: [
      { id: "BN-1120", name: "Vũ Khánh Linh", time: "Thứ Năm - 09:00", symptom: "Sốt cao liên tục 3 ngày", dept: "Khoa Nội", status: "Đã xác nhận", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
      { id: "BN-5582", name: "Trần Anh Tú", time: "Thứ Sáu - 14:00", symptom: "Ho khan kéo dài, tức ngực", dept: "Khoa Hô Hấp", status: "Chờ xác nhận", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    ],
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-display: 'Space Grotesk', system-ui, sans-serif;
          --font-body: 'Inter', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --font-accent: 'Playfair Display', Georgia, serif;
        }
        body {
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          background-color: #ffffff;
        }
        .font-display { font-family: var(--font-display); }
        .font-mono { font-family: var(--font-mono); }
        .font-accent { font-family: var(--font-accent); font-style: italic; }
        
        /* Premium Frosted Glass Effect */
        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.02),
            inset 0 1px 1px rgba(255, 255, 255, 0.45);
        }
        .glass-pill {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }
        .glass-dock {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 
            0 20px 40px -15px rgba(0, 127, 255, 0.05),
            inset 0 1px 1px rgba(255, 255, 255, 0.5);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 
            0 8px 30px -10px rgba(0, 0, 0, 0.03),
            inset 0 1px 1px rgba(255, 255, 255, 0.45);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(0, 127, 255, 0.25);
          box-shadow: 
            0 20px 40px -15px rgba(0, 127, 255, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.6);
        }
        
        /* Seamless Marquee Animation */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Ambient floating grid dots */
        .bg-dots {
          background-image: radial-gradient(rgba(0, 127, 255, 0.05) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }
      `}} />

      <main className="relative overflow-x-hidden w-full max-w-full min-h-[100dvh] bg-dots text-slate-800 selection:bg-[#007fff]/10 selection:text-[#007fff]">
        
        {/* ═══ HIGH-END AMBIENT BACKGROUND GLOWS ═══ */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#007fff]/8 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-[800px] right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-[#10b981]/6 to-transparent rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[400px] left-1/3 w-[800px] h-[800px] bg-gradient-to-bl from-[#007fff]/5 via-[#10b981]/4 to-transparent rounded-full blur-[150px] pointer-events-none -z-10"></div>

        {/* ═══ NAVIGATION DOCK ═══ */}
        <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
          <nav className="glass-dock max-w-5xl w-full px-6 py-3.5 rounded-[2rem] flex items-center justify-between transition-all duration-300">
            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007fff] to-[#00bfff] flex items-center justify-center shadow-[0_4px_12px_rgba(0,127,255,0.2)]">
                <IconStethoscope className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 leading-none tracking-tight font-display">
                AuraSaaS
              </span>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <a href="#" className="text-[#007fff] transition-colors">Hệ Thống Mới</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Tính năng B2B</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Tài liệu API</a>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#007fff] bg-[#007fff]/10 border border-[#007fff]/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007fff] animate-pulse"></span>
                v6.0 Bright Glass
              </span>
              <a 
                href="#bento"
                className="bg-[#007fff] hover:bg-[#0066cc] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(0,127,255,0.15)] flex items-center gap-1.5"
              >
                Cận cảnh
                <IconArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>

        {/* ═══ ATTENTION (HERO SECTION) ═══ */}
        <section className="relative max-w-[1400px] mx-auto px-6 md:px-16 pt-36 md:pt-48 pb-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Asymmetric wide typography) */}
            <div className="lg:col-span-8 space-y-8 text-left">
              {/* Premium Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#007fff] bg-[#007fff]/8 rounded-full border border-[#007fff]/15 backdrop-blur-sm">
                <IconSparkle className="w-3.5 h-3.5 text-[#007fff] animate-spin-slow" />
                CLINICAL SYSTEM DESIGN v6.0 · HIGH-END PREMIUM
              </div>

              {/* H1 Heading - Flows horizontally in exactly 2-3 lines */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.02] text-slate-900 font-display max-w-4xl">
                Transforming Clinic{" "}
                <span 
                  className="inline-block w-16 sm:w-24 h-8 sm:h-11 rounded-full align-middle bg-cover bg-center mx-2 border border-white/30 shadow-md transform hover:scale-110 transition-transform duration-500 cursor-pointer"
                  style={{ backgroundImage: "url('https://picsum.photos/seed/clinic/400/200')" }}
                ></span>{" "}
                <span className="font-accent font-normal text-[#007fff]">workflows</span> with liquid{" "}
                <span className="font-accent font-normal text-[#10b981]">intelligence</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
                Ngôn ngữ thiết kế tối giản, ngập tràn ánh sáng và các bề mặt kính mờ tinh tế. Mang lại trải nghiệm lâm sàng trơn tru, yên bình và chuyên nghiệp tuyệt đối cho bệnh nhân & bác sĩ.
              </p>

              {/* Action Buttons with high contrast */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#bento"
                  className="bg-[#007fff] hover:bg-[#0066cc] active:scale-[0.98] text-white text-sm font-bold px-7 py-4 rounded-xl transition-all duration-300 flex items-center gap-2.5 shadow-[0_6px_20px_rgba(0,127,255,0.2)]"
                >
                  Khám phá Bento Hub
                  <IconArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#motion"
                  className="glass-panel hover:bg-white/80 text-slate-800 text-sm font-semibold px-7 py-4 rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  Công nghệ chuyển động
                  <IconArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Right Asset (Floating Glassmorphic widget) */}
            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative w-full max-w-[340px]">
                {/* Decorative blob behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#007fff]/20 to-[#10b981]/20 rounded-[2.5rem] blur-xl -z-10 rotate-6"></div>
                
                {/* Real-time Widget card */}
                <div className="glass-panel rounded-[2rem] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] border border-white/40 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái phòng khám</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 rounded-full border border-[#10b981]/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                      Trực tuyến
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold tracking-tight text-slate-900 font-display">48 bệnh nhân</p>
                      <p className="text-xs text-slate-400 mt-1">Đã phục vụ trong hôm nay</p>
                    </div>

                    {/* Progress indicator */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#007fff] to-[#10b981] w-[75%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Staggered mini list */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Khám tim mạch</span>
                      <span className="font-mono text-slate-400">12 ca</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Khám thần kinh</span>
                      <span className="font-mono text-slate-400">8 ca</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping secondary micro-widget */}
                <div className="absolute -bottom-8 -left-8 glass-panel rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-white/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                    <IconSparkle className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">AI Phân luồng</p>
                    <p className="text-[9px] text-[#10b981] font-semibold mt-0.5">Tiết kiệm 45% thời gian</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ COLOR SYSTEM SHOWCASE ═══ */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-16 py-16">
          <SectionTitle 
            label="1. Color System & Aesthetics" 
            title={<>Ngôn Ngữ <span className="font-accent font-normal text-[#007fff]">Màu Sắc</span> & Khúc Xạ Thủy Tinh</>} 
            description="Áp dụng bảng màu SaaS y tế cao cấp, loại bỏ sắc xám buồn tẻ và bổ sung sự tươi mới từ Azure Blue kết hợp Mint Green sáng rực rỡ." 
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "White Background", hex: "#FFFFFF", desc: "Nền chính thanh lịch", colorClass: "bg-white border border-slate-200" },
              { name: "Azure Blue", hex: "#007FFF", desc: "Thương hiệu y khoa", colorClass: "bg-[#007fff] text-white" },
              { name: "Teal Mint", hex: "#10B981", desc: "Thành công & Dịu mát", colorClass: "bg-[#10b981] text-white" },
              { name: "Glass Base", hex: "RGBA 65%", desc: "Frosted Glassmorphism", colorClass: "glass-panel" },
              { name: "Text Primary", hex: "#0F172A", desc: "Phông chính sâu sắc", colorClass: "bg-slate-900 text-white" },
              { name: "Ruby Alert", hex: "#EF4444", desc: "Khẩn cấp trang trọng", colorClass: "bg-[#ef4444] text-white" },
            ].map((color, i) => (
              <div key={i} className="glass-card overflow-hidden flex flex-col justify-between h-44 p-4">
                <div className={`w-full h-16 rounded-xl ${color.colorClass} flex items-center justify-center font-mono text-xs font-bold`}>
                  {color.hex}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-1">{color.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{color.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Saturated Badges & Interactive States */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Trạng thái Badges:</span>
            {[
              { label: "Đã xác nhận lâm sàng", bg: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" },
              { label: "Đang chờ điều phối", bg: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20" },
              { label: "Ca cấp cứu khẩn", bg: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20 animate-pulse" },
              { label: "Lịch hẹn hoàn thành", bg: "bg-[#007fff]/10 text-[#007fff] border-[#007fff]/20" },
            ].map((badge, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${badge.bg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {badge.label}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ INTEREST (GAPLESS BENTO GRID 2.0) ═══ */}
        <section id="bento" className="max-w-[1400px] mx-auto px-6 md:px-16 py-20 md:py-32">
          <SectionTitle 
            label="2. Clinic Management Bento Hub" 
            title={<>Bản Vẽ Bento Grid <span className="font-accent font-normal text-[#10b981]">Hoàn Hảo</span></>} 
            description="Mật độ thông tin chuẩn mực, không có ô trống thừa, liên kết trực quan giữa các tiến trình điều phối lịch hẹn và sàng lọc AI." 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
            
            {/* Card 1: Col-span-2, Row-span-2 - Intelligent Appointment Stream */}
            <div className="md:col-span-2 md:row-span-2 glass-card rounded-[2rem] p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#007fff] bg-[#007fff]/10 rounded-full border border-[#007fff]/15 uppercase tracking-wider mb-3">
                    <IconCalendar className="w-3 h-3" />
                    Quản lý luồng lịch hẹn
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 font-display">Danh sách lịch khám chuyên khoa</h3>
                </div>

                {/* Active Tabs selector */}
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
                  {[
                    { id: "today", label: "Hôm nay" },
                    { id: "tomorrow", label: "Ngày mai" },
                    { id: "week", label: "Tuần này" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedScheduleTab(tab.id as any)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all duration-300 ${
                        selectedScheduleTab === tab.id 
                          ? "bg-white text-[#007fff] shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bệnh nhân</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian / Lý do</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chuyên khoa</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData[selectedScheduleTab].map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-[#007fff]/5 transition-colors group">
                        <td className="py-3.5 pr-3">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-[#007fff] transition-colors">{row.name}</p>
                          <p className="font-mono text-[10px] text-slate-400 mt-0.5">{row.id}</p>
                        </td>
                        <td className="py-3.5 pr-3">
                          <p className="text-xs text-slate-600 font-medium">{row.symptom}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><IconClock className="w-3 h-3 text-[#007fff]" /> {row.time}</p>
                        </td>
                        <td className="py-3.5 pr-3 text-xs text-slate-600 font-semibold">{row.dept}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.badge}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grid actions */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                <span className="text-xs text-slate-400">Dữ liệu giả lập thời gian thực</span>
                <button className="text-xs font-bold text-[#007fff] hover:underline flex items-center gap-1">
                  Quản lý chuyên sâu
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Col-span-1, Row-span-1 - Doctor Console */}
            <div className="md:col-span-1 md:row-span-1 glass-card rounded-[2rem] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 rounded-full border border-[#10b981]/15 uppercase tracking-wider">
                  <IconUser className="w-3.5 h-3.5" />
                  Bác sĩ trực ban
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
              </div>

              <div className="flex items-center gap-4 my-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#007fff]/20 to-[#10b981]/20 p-0.5">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-bold text-[#007fff] font-display">
                    TM
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">ThS. BS. Trần Minh</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Trưởng Khoa Tim Mạch</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã chứng chỉ:</span>
                  <span className="font-mono font-semibold text-slate-700">CCHN-2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số lịch hẹn:</span>
                  <span className="font-semibold text-slate-700">14 ca hôm nay</span>
                </div>
              </div>
            </div>

            {/* Card 3: Col-span-1, Row-span-2 - Patient AI Assistant & Emergency Alert */}
            <div className="md:col-span-1 md:row-span-2 glass-card rounded-[2rem] p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#007fff] bg-[#007fff]/10 rounded-full border border-[#007fff]/15 uppercase tracking-wider mb-4">
                  <IconRobot className="w-3.5 h-3.5" />
                  AI Sàng Lọc Lâm Sàng
                </div>
                
                {/* Active Chat Simulator */}
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/50 space-y-4 max-h-[300px] overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col space-y-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.role === "user" 
                          ? "bg-[#007fff] text-white rounded-tr-none" 
                          : msg.emergency 
                          ? "bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-tl-none"
                          : "bg-white border border-slate-200/80 text-slate-600 rounded-tl-none"
                      }`}>
                        {msg.emergency && (
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#ef4444] mb-1">
                            <IconAlert className="w-3.5 h-3.5 text-[#ef4444]" />
                            Khẩn Cấp (115)
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input simulator */}
              <div className="space-y-3">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Mô tả triệu chứng (Ví dụ: đau ngực)..." 
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-4 pr-10 py-3 outline-none focus:border-[#007fff] focus:ring-4 focus:ring-[#007fff]/10 transition-all placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSendChat}
                    className="absolute right-2 p-2 rounded-lg text-[#007fff] hover:bg-[#007fff]/10 transition-colors"
                  >
                    <IconSend className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSymptomInput("Tôi bị sốt cao kèm đau họng"); }}
                    className="text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200/70 px-2 py-1 rounded-md transition-colors"
                  >
                    + Triệu chứng sốt
                  </button>
                  <button 
                    onClick={() => { setSymptomInput("Tôi đau nhói vùng ngực trái"); }}
                    className="text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200/70 px-2 py-1 rounded-md transition-colors"
                  >
                    + Triệu chứng đau ngực
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Col-span-2, Row-span-1 - Live Queue Alert with Infinite Marquee */}
            <div className="md:col-span-2 md:row-span-1 glass-card rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#007fff] bg-[#007fff]/10 rounded-full border border-[#007fff]/15 uppercase tracking-wider">
                  <IconShield className="w-3.5 h-3.5" />
                  Dòng dữ liệu luân chuyển thực tế
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiến trình AI</span>
              </div>

              {/* Loop Infinite Marquee */}
              <div className="relative w-full overflow-hidden py-3">
                <div className="flex gap-6 animate-marquee whitespace-nowrap">
                  {[
                    "BN-8920 (Đau vai gáy) → Phân luồng khoa Nội thần kinh",
                    "BN-1299 (Đau tức ngực dữ dội) → HỆ THỐNG PHÁT BÁO ĐỘNG ĐỎ LÂM SÀNG",
                    "BN-4928 (Khám sức khỏe tổng quát) → Chờ điều phối viên duyệt phòng",
                    "BN-0041 (Ù tai kéo dài) → Đã xếp lịch khám Tai Mũi Họng 10:30",
                    "BN-8920 (Đau vai gáy) → Phân luồng khoa Nội thần kinh",
                    "BN-1299 (Đau tức ngực dữ dội) → HỆ THỐNG PHÁT BÁO ĐỘNG ĐỎ LÂM SÀNG",
                    "BN-4928 (Khám sức khỏe tổng quát) → Chờ điều phối viên duyệt phòng",
                    "BN-0041 (Ù tai kéo dài) → Đã xếp lịch khám Tai Mũi Họng 10:30",
                  ].map((text, idx) => (
                    <span 
                      key={idx} 
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border ${
                        text.includes("BÁO ĐỘNG ĐỎ") 
                          ? "bg-[#ef4444]/15 border-[#ef4444]/35 text-[#ef4444]" 
                          : "bg-white border-slate-200 text-slate-600 shadow-sm"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${text.includes("BÁO ĐỘNG ĐỎ") ? "bg-[#ef4444] animate-ping" : "bg-[#007fff]"}`}></span>
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Rà quét tự động bởi Aura Triager Engine</span>
                <span className="font-mono">Tải hệ thống: 8%</span>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ DESIRE (MOTION & HIGH-END SHOWCASE) ═══ */}
        <section id="motion" className="max-w-[1400px] mx-auto px-6 md:px-16 py-20 md:py-32 border-t border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side: Editorial tech specs */}
            <div className="lg:col-span-5 space-y-8">
              <SectionTitle 
                label="3. Tech Integration Suite" 
                title={<>Sẵn Sàng Cho Thư Viện <span className="font-accent font-normal text-[#007fff]">Chuyển Động</span></>} 
                description="Hệ thống thiết kế v6.0 thiết lập sẵn cấu trúc token để các kỹ sư dễ dàng tích hợp các thư viện chuyển động tốt nhất hiện nay nhằm thổi bừng sức sống cho các giao diện y khoa." 
              />

              <div className="space-y-6">
                {[
                  { title: "Framer Motion — Spring Physics", desc: "Sử dụng độ nhạy lò xo đàn hồi (type: 'spring', stiffness: 100, damping: 20) để các panel, modal mở ra mượt mà tự nhiên thay vì chuyển động tuyến tính chán mắt." },
                  { title: "GSAP + ScrollTrigger — Text Scrubbing", desc: "Khi cuộn màn hình, độ mờ của từng từ (opacity) trong phần tóm tắt chẩn đoán sẽ sáng lên từ 0.1 sang 1.0, tương tác chặt chẽ theo nhịp tay cuộn của người dùng." },
                  { title: "Lenis Smooth Scroll Engine", desc: "Triệt tiêu độ giật của chuột lăn trên Windows, biến trải nghiệm cuộn trang web thành dòng chảy êm ru tựa như sử dụng bàn rê Trackpad trên macOS." },
                  { title: "Zero Emojis — Duotone Icon System", desc: "Trực quan hóa hệ thống icon 2 màu tinh xảo đại diện cho từng tiến trình lâm sàng, mang lại sự trang trọng và an tâm cho người bệnh." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-7 h-7 rounded-lg bg-[#007fff]/10 flex items-center justify-center shrink-0 mt-1 font-bold text-xs text-[#007fff] font-display">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Mock GSAP word opacity scrubbing reveal + Card Stacking visual */}
            <div className="lg:col-span-7 space-y-8">
              {/* Opacity Word Reveal Demo */}
              <div className="glass-panel rounded-[2rem] p-8 border border-white/50 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#007fff]">
                  Mô phỏng GSAP Scroll Scrubbing
                </span>
                <h4 className="text-xl font-bold tracking-tight text-slate-800 font-display">Chẩn đoán tổng quan nâng cao bởi AI</h4>
                
                {/* Scrubbing Text visual */}
                <div className="text-sm md:text-base leading-relaxed text-slate-900 font-medium">
                  {/* Words with gradual opacity simulation representing scroll position */}
                  {[
                    { w: "Trợ", op: "opacity-100" }, { w: "lý", op: "opacity-100" },
                    { w: "AI", op: "opacity-100" }, { w: "sàng", op: "opacity-100" },
                    { w: "lọc", op: "opacity-100" }, { w: "được", op: "opacity-100" },
                    { w: "tích", op: "opacity-100" }, { w: "hợp", op: "opacity-90" },
                    { w: "chặt", op: "opacity-80" }, { w: "chẽ", op: "opacity-70" },
                    { w: "với", op: "opacity-60" }, { w: "bảng", op: "opacity-50" },
                    { w: "lịch", op: "opacity-40" }, { w: "hẹn", op: "opacity-30" },
                    { w: "bác", op: "opacity-25" }, { w: "sĩ,", op: "opacity-20" },
                    { w: "tự", op: "opacity-10" }, { w: "động", op: "opacity-10" },
                    { w: "tối", op: "opacity-10" }, { w: "ưu", op: "opacity-10" },
                    { w: "quy", op: "opacity-10" }, { w: "trình", op: "opacity-10" },
                    { w: "khám", op: "opacity-10" }, { w: "chuyên", op: "opacity-10" },
                    { w: "khoa.", op: "opacity-10" }
                  ].map((item, idx) => (
                    <span key={idx} className={`${item.op} mr-1.5 transition-all duration-700`}>
                      {item.w}
                    </span>
                  ))}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-[#007fff] w-[45%]"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                  <span>Vị trí cuộn trang giả định: 45%</span>
                  <span>ScrollTrigger Active</span>
                </div>
              </div>

              {/* Card Stacking simulator */}
              <div className="glass-panel rounded-[2rem] p-8 border border-white/50 relative overflow-hidden h-[280px] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981]">
                    Mô phỏng Card Stacking (Framer Motion / GSAP)
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-slate-800 font-display mt-2">Xếp chồng hồ sơ xét nghiệm</h4>
                </div>

                {/* Overlapping stack elements with styling */}
                <div className="relative h-28 mt-4">
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm transform scale-95 origin-bottom opacity-60">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Phiếu siêu âm mạch máu</span>
                      <span className="font-mono text-[10px] text-slate-400">12/05/2026</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 h-20 bg-white border border-[#007fff]/30 rounded-2xl p-4 shadow-sm transform scale-98 origin-bottom opacity-85">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Điện tâm đồ ECG định kỳ</span>
                      <span className="font-mono text-[10px] text-[#007fff] font-bold">18/05/2026</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 h-20 bg-white border border-[#10b981]/30 rounded-2xl p-4 shadow-md transform scale-100 origin-bottom">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Xét nghiệm công thức máu toàn phần</span>
                      <span className="font-mono text-[10px] text-[#10b981] font-bold">Hôm nay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ ACTION (CONVERSION CTA & FOOTER) ═══ */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-16 py-20 md:py-32">
          
          {/* Stunning CTA glassmorphic block */}
          <div className="relative glass-panel rounded-[2.5rem] p-8 md:p-16 text-center overflow-hidden border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,127,255,0.1)]">
            {/* Ambient gradients within card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#007fff]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#10b981]/8  rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#007fff] bg-[#007fff]/10 border border-[#007fff]/15">
                Bắt đầu ngay hôm nay
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 font-display">
                Đưa Phòng Khám Của Bạn <br className="hidden sm:block" />Lên Một Đẳng Cấp Mới
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Tối ưu hóa năng lực sàng lọc y khoa với AI, số hóa lịch đặt hẹn, và nâng cao vị thế thương hiệu phòng khám với AuraSaaS.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                <button className="bg-[#007fff] hover:bg-[#0066cc] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(0,127,255,0.2)]">
                  Đăng ký dùng thử miễn phí
                </button>
                <button className="glass-panel hover:bg-white/80 text-slate-700 text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-300">
                  Liên hệ chuyên viên tư vấn
                </button>
              </div>
            </div>
          </div>

          {/* Clean split Footer */}
          <footer className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#007fff] flex items-center justify-center text-white font-bold text-[10px]">A</div>
              <span>&copy; 2026 AuraSaaS System Inc. Đã bảo lưu mọi quyền.</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-slate-600 transition-colors">Điều khoản hệ thống</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Bảo mật thông tin lâm sàng</a>
              <span className="text-[#007fff] font-semibold">Design System v6.0</span>
            </div>
          </footer>

        </section>

      </main>
    </>
  );
}
