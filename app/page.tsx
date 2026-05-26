"use client";

import Link from "next/link";
import React from "react";

// ── Simple SVG Icons ─────────────────────────────────────────────────────────

const IconHeartbeat = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M240,96a56.06,56.06,0,0,0-56-56C161.41,40,140.75,54.67,128,70.11,115.25,54.67,94.59,40,72,40A56.06,56.06,0,0,0,16,96c0,35.48,27.16,63.15,62.83,99.37A206.13,206.13,0,0,0,121,228.1a10.23,10.23,0,0,0,14,0,206.13,206.13,0,0,0,42.17-32.73C212.84,159.15,240,131.48,240,96Zm-16,0c0,27.24-23.77,51.81-56.12,84.72A190.22,190.22,0,0,1,128,210.82a190.22,190.22,0,0,1-39.88-30.1C55.77,147.81,32,123.24,32,96A40,40,0,0,1,72,56c18,0,34.46,12.38,43.78,30.34a8,8,0,0,0,14.44,0C139.54,68.38,156,56,174,56A40,40,0,0,1,224,96Z"></path>
  </svg>
);

const IconUser = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
  </svg>
);

const IconStethoscope = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M208,32H168a32,32,0,0,0-32,32V96a32,32,0,0,0,32,32h40a32,32,0,0,0,32-32V64A32,32,0,0,0,208,32ZM168,48h40a16,16,0,0,1,16,16v8H152V64A16,16,0,0,1,168,48Zm40,64H168a16,16,0,0,1-16-16V88h72v8A16,16,0,0,1,208,112ZM128,104a8,8,0,0,1-8-8V64a40,40,0,0,0-80,40v40a64,64,0,0,0,119.5,31.79l36.32,60.54A24,24,0,1,0,216.4,224H128a8,8,0,0,1,0-16h88.4a8,8,0,1,1-6.86-12.12l-37.16-61.94A64.08,64.08,0,0,0,128,104ZM56,104a24,24,0,0,1,48,0v40a48,48,0,0,1-96,0V104Z"></path>
  </svg>
);

const IconCalendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48Zm136,160H48V96H208V208Z"></path>
  </svg>
);

const IconRobot = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M224,96V200a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V96A16,16,0,0,1,48,80H72V56a16,16,0,0,1,16-16h80a16,16,0,0,1,16,16V80h24A16,16,0,0,1,224,96ZM88,80h80V56H88V80Zm120,16V200H48V96ZM100,128a12,12,0,1,0,12,12A12,12,0,0,0,100,128Zm56,0a12,12,0,1,0,12,12A12,12,0,0,0,156,128Zm-5.35,46.59a8,8,0,0,0-10.61-4,16.29,16.29,0,0,1-12,0,8,8,0,0,0-6.14,14.77,32.22,32.22,0,0,0,24.84,0A8,8,0,0,0,150.65,174.59Z"></path>
  </svg>
);

const IconArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={className}>
    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function RoleSelectionPage() {
  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `tailwind.config = { corePlugins: { preflight: false } }` }}></script>
      
      {/* Cấu hình Typography trực tiếp (chỉ cho riêng trang này) để đảm bảo không phụ thuộc layout ngoài */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
          
          .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
          .font-body { font-family: 'Inter', system-ui, sans-serif; }
          .font-accent { font-family: 'Playfair Display', Georgia, serif; font-style: italic; }
        `
      }} />

      <div className="min-h-screen bg-[#fafcff] flex flex-col items-center justify-center p-6 font-body text-slate-800 selection:bg-blue-100">
        
        {/* Header / Brand */}
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_4px_20px_rgba(37,99,235,0.15)] text-white">
            <IconHeartbeat className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 mb-3">
            HealthCare AI
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
            Hệ thống quản lý y khoa thông minh, nâng tầm trải nghiệm lâm sàng.
          </p>
        </header>

        {/* 3 Highlights */}
        <section className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
          <div className="flex items-center gap-2 text-[13px] md:text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors hover:border-slate-300">
            <IconCalendar className="w-4 h-4 text-blue-500" />
            <span>Đặt lịch nhanh</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] md:text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors hover:border-slate-300">
            <IconStethoscope className="w-4 h-4 text-emerald-500" />
            <span>Quản lý lịch hẹn</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] md:text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-colors hover:border-slate-300">
            <IconRobot className="w-4 h-4 text-blue-500" />
            <span>Trợ lý AI <span className="font-accent text-emerald-600">an toàn</span></span>
          </div>
        </section>

        {/* Role Cards Container */}
        <main className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 font-display">
              Vui lòng chọn vai trò
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Card */}
            <Link 
              href="/patient/appointments"
              className="group flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <IconUser className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Bệnh nhân</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                Đặt lịch khám nhanh chóng, xem hồ sơ bệnh án và nhận hỗ trợ từ AI thông minh.
              </p>
              <div className="inline-flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-md transition-all duration-300">
                Truy cập cổng bệnh nhân
                <IconArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            {/* Doctor Card */}
            <Link 
              href="/doctor/appointments"
              className="group flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <IconStethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Bác sĩ</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                Quản lý lịch khám, cập nhật trạng thái bệnh nhân chuyên nghiệp và dễ dàng.
              </p>
              <div className="inline-flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white group-hover:shadow-md transition-all duration-300">
                Truy cập cổng bác sĩ
                <IconArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            HealthCare AI v2.0 · Bản Demo Nội Bộ
          </p>
        </footer>

      </div>
    </>
  );
}
