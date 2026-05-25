import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthCare AI – Trợ lý sức khỏe thông minh",
  description:
    "Hệ thống quản lý y tế hiện đại với trợ lý AI, đặt lịch khám và quản lý hồ sơ bệnh nhân.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
