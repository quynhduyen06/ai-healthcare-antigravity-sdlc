# Báo Cáo Thiết Kế: "Bright Glassmorphic Clinic SaaS" (v6.0)

Tài liệu này đề xuất hệ thống thiết kế mới (v6.0) cho chủ đề **Healthcare Clinic SaaS Service**. Ngôn ngữ thiết kế này được xây dựng dựa trên sự giao thoa giữa cấu trúc Thụy Sĩ chặt chẽ (Swiss System), tính thẩm mỹ cao cấp (Quiet Luxury), và hiệu ứng thủy tinh hiện đại (Glassmorphic Refraction) kết hợp chuyển động mượt mà.

---

## 1. Hệ Thống Token Màu Sắc (Bright & Saturated Palette)

Để phá bỏ sự khô khan và tối của phiên bản trước, chúng tôi đề xuất hệ thống màu sắc tươi sáng, tương phản cao, tập trung vào sự tin cậy của y tế kết hợp với tính hiện đại của SaaS:

```css
:root {
  /* Nền tảng (Sáng & Tinh Khiết) */
  --bg-base: #ffffff;
  --bg-mesh-1: rgba(0, 127, 255, 0.08); /* Azure Glow */
  --bg-mesh-2: rgba(16, 185, 129, 0.06); /* Mint/Teal Glow */
  
  /* Bề mặt Glassmorphism (Frosted Glass) */
  --surface-glass: rgba(255, 255, 255, 0.65);
  --surface-solid: #ffffff;
  
  /* Viền Phản Chiếu Thủy Tinh (Refraction Border) */
  --border-glass: rgba(255, 255, 255, 0.4);
  --border-glass-outer: rgba(226, 232, 240, 0.8);
  --border-solid: #e2e8f0;

  /* Màu Chủ Đạo (Vibrant Primary) */
  --azure: #007fff; /* Xanh Azure Y Tế */
  --azure-rgb: 0, 127, 255;
  --azure-hover: #0066cc;

  /* Màu Phụ Trợ / Thành Công (Saturated Secondary) */
  --mint: #10b981; /* Xanh Mint/Emerald Tương Hợp */
  --mint-rgb: 16, 185, 129;
  
  /* Trạng Thái Lâm Sàng */
  --critical: #ef4444; /* Đỏ ruby cảnh báo cấp cứu */
  --warning: #f59e0b;  /* Vàng hổ phách chờ xử lý */
  --info: #007fff;     /* Thông tin liên kết */

  /* Phân Cấp Chữ */
  --text-primary: #0f172a;   /* Slate-900 */
  --text-secondary: #475569; /* Slate-600 */
  --text-muted: #94a3b8;     /* Slate-400 */

  /* Bo Góc Công Nghệ */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-xl: 32px;
}
```

---

## 2. Phân Cấp Typography

Chúng tôi áp dụng cặp font chữ đặc trưng của các sản phẩm B2B SaaS cao cấp toàn cầu:
*   **Font Tiêu Đề (Display H1, H2, H3):** `Space Grotesk` (Geometric Sans-Serif) – tạo nét đĩnh đạc, hiện đại, có chiều rộng ký tự lớn giúp tiêu đề không bị bó hẹp.
*   **Font Nội Dung (Body, Labels, Tables):** `Inter` – tiêu chuẩn vàng cho giao diện hiển thị thông tin lâm sàng dày đặc nhờ khả năng hiển thị rõ nét ở mọi cỡ chữ nhỏ.

---

## 3. Kiến Trúc Hiệu Ứng Visual (Materiality & Blur)

1.  **Liquid Glass Refraction (Khúc Xạ Thủy Tinh Lỏng):**
    Các tấm thẻ (Cards) hoặc panel chức năng được áp dụng thuộc tính Glassmorphism nâng cao để tránh hiện tượng phẳng lì chán mắt:
    *   `backdrop-blur-md` kết hợp `bg-white/65`.
    *   Viền trong suốt kép: `border border-slate-200/80` và một shadow khúc xạ bên trong `shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]`.
2.  **Ambient Blur Backgrounds:**
    Sử dụng các thẻ định vị `absolute` với bộ lọc `blur-[120px]` chứa các đốm màu Azure Blue (`rgba(0,127,255,0.12)`) và Mint Green (`rgba(16,185,129,0.08)`) chuyển động chậm, tạo nền đa chiều sâu mà vẫn giữ được sự tinh khiết của tông màu sáng.

---

## 4. Tích Hợp Thư Viện Chuyển Động & Icons

Bản preview hệ thống thiết kế sẽ tích hợp sẵn cấu trúc mã nguồn để người dùng dễ dàng gắn các thư viện cao cấp này vào ứng dụng chính thức:

### A. Framer Motion (Spring Physics & Orchestration)
*   **Spring Physics:** Sử dụng thông số spring chuẩn y tế (không giật giật, không quá nhanh): `{ type: "spring", stiffness: 100, damping: 20 }`.
*   **Staggered Reveals:** Các danh sách lịch khám hoặc thẻ kết quả xét nghiệm sẽ thác nước chảy xuống lần lượt thông qua thuộc tính `variants` của Framer Motion.
*   **Layout Transitions (`layoutId`):** Khi chuyển tab giữa các view lịch khám (Ngày/Tuần/Tháng), thanh chỉ báo sẽ trượt mượt mà thay vì nhảy vị trí đột ngột.

### B. GSAP + ScrollTrigger (Scrolltelling & Scrubbing)
*   **Word-by-word Reveal:** Đối với phần giới thiệu công nghệ AI Assist, độ mờ (opacity) của từng từ trong đoạn văn sẽ chuyển từ `0.1` lên `1.0` dựa trên vị trí cuộn trang của người dùng.
*   **Card Stacking:** Khi cuộn xuống phần Quản lý bệnh án, các thẻ hồ sơ bệnh nhân cũ sẽ dừng lại ở đầu trang và các thẻ mới sẽ trượt đè lên (stacking effect) một cách tự nhiên.

### C. Lenis (Smooth Scroll Engine)
*   Tích hợp bộ khởi tạo Lenis ở gốc ứng dụng (`Layout`) giúp triệt tiêu hiện tượng giật cục của thanh cuộn mặc định trên Windows/Chrome, mang lại trải nghiệm cuộn trơn mượt như lướt trên trackpad macOS.

### D. Phosphor Icons Duotone System (Zero Emojis)
*   Sử dụng hệ thống icon duotone đồng bộ của `@phosphor-icons/react` với độ dày nét `weight="duotone"` và `strokeWidth={1.5}`. Tuyệt đối cấm sử dụng Emoji để bảo đảm tính chuyên nghiệp, trang trọng của sản phẩm y khoa.

---

## 5. Cập Nhật Bản Preview `app/design-preview/page.tsx`

Chúng tôi tiến hành nâng cấp toàn bộ trang preview để hiển thị trực quan ngôn ngữ thiết kế **v6.0 Bright Glassmorphic** này:
- **Hero Asymmetric** thời thượng với headings 3 hàng, lồng ghép các **Pill-shaped Inline Images** tinh tế và các thẻ Glassmorphic bay lơ lửng.
- **Bento Grid 4 khu vực** quản lý thông tin với mật độ khoa học, hoàn hảo về tỉ lệ, không có ô trống chết.
- **Chat Bot AI Sàng Lọc Lâm Sàng** với hiệu ứng Glassmorphism tuyệt đối, bảng Cảnh Báo Khẩn Cấp được tinh chỉnh màu ruby sang trọng.
- **Bảng dữ liệu lịch hẹn chuẩn SaaS** với hover màu azure nhạt cực kỳ nịnh mắt.
- **Thanh Navigation Dock** dạng kính mờ (Floating Pill) nằm ngang phía trên trang web.

*Hãy khởi động trình duyệt và xem sự lột xác ngoạn mục tại: `http://localhost:3000/design-preview`*
