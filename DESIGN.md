# DESIGN.md

## 1. Mục đích tài liệu
Tài liệu này định nghĩa quy chuẩn thiết kế giao diện cho dự án AI Healthcare Assistant.
Mục tiêu là đảm bảo UI nhất quán, chuyên nghiệp, phù hợp với định hướng **High-end healthcare SaaS** và bám đúng phạm vi hệ thống đã mô tả trong `docs/03-system-design.md`.
Đây là tài liệu gốc mang tính định hướng thiết kế cao cấp cho bản demo/MVP. Khi thực hiện thay đổi (redesign), **tuyệt đối không sửa logic của các tính năng R01-R04**.

## 2. Định hướng thiết kế (Design Direction)
Giao diện tuân theo phong cách **High-end healthcare SaaS**:
*   Sạch sẽ, tươi sáng, sang trọng và mang tính lâm sàng (clinical) nhưng không hề lạnh lẽo.
*   Tập trung vào trải nghiệm cao cấp, chuyên nghiệp và đáng tin cậy.
*   Sự rõ ràng, dễ dùng và cấu trúc thông tin (typography, spacing) được đặt lên hàng đầu.

## 3. Quy tắc cốt lõi cần tránh (Do Not Use)
Để giữ sự sang trọng và tính High-end SaaS, **nghiêm cấm** sử dụng:
1.  **Glassmorphism:** Không lạm dụng nền mờ đục hoặc hiệu ứng kính phức tạp.
2.  **Gradient sến:** Tránh các dải màu gradient sặc sỡ, nhiều màu.
3.  **Màu Neon:** Không dùng màu phát sáng rực rỡ, chói mắt.
4.  **Shadow lớn:** Không dùng các bóng đổ quá dày, quá tối (chỉ dùng shadow cực mượt, tinh tế).
5.  **Emoji làm icon chính:** Tuyệt đối không dùng emoji thay cho icon (khuyến khích dùng thư viện icon duotone/line xịn như Phosphor/Lucide).
6.  **Dark mode mặc định:** Hệ thống mặc định phải là Light mode sáng sủa.

## 4. Bảng màu (Color Palette)
Hệ thống sử dụng nền sáng tinh khiết kết hợp với màu nhấn y tế cao cấp:

*   **Background (Nền):** Trắng (White) hoặc Off-white cực nhạt (VD: `#fafcff`, `#f8fafc`) để tạo không gian mở, rộng rãi và sạch sẽ.
*   **Primary (Màu chính):** **Azure Blue** (Xanh dương tươi sáng). Tượng trưng cho công nghệ, sự thông minh và y tế hiện đại. Dùng cho CTA chính, active state, điểm nhấn thương hiệu.
*   **Secondary (Màu phụ):** **Mint Green** (Xanh ngọc). Phối hợp tương phản với Azure để tạo cảm giác tươi mát, thành công và an toàn y tế.
*   **Surface:** Trắng tinh (`#ffffff`) cho các thẻ (card), form, table.
*   **Text:** Màu slate/xám đậm (`#0f172a`, `#475569`) cho độ tương phản êm mắt, tránh dùng màu đen tuyền (`#000000`).
*   **Border:** Xám siêu nhạt (`#e2e8f0` hoặc nhạt hơn) làm ranh giới tinh tế.

## 5. Typography (Nghệ thuật xếp chữ)
Phân cấp Typography là yếu tố quyết định sự cao cấp của giao diện:

*   **Sans-serif (Chủ đạo):** 
    *   Sử dụng **Space Grotesk** kết hợp với **Inter** (hoặc system-ui) cho tính hiện đại, sắc nét.
    *   Heading cần cứng cáp, tracking hẹp (tight letter-spacing) để tạo cảm giác cấu trúc vững chãi.
*   **Serif Accent (Điểm nhấn):** 
    *   Sử dụng **Playfair Display** (hoặc font serif tương tự) có định dạng *italic* để làm điểm nhấn mềm mại cho một vài từ khóa quan trọng bên trong các tiêu đề (Hero, Title lớn).
    *   Sự kết hợp giữa font sans-serif cứng cáp và serif italic mềm mại tạo ra sự thanh lịch và khác biệt chuẩn High-end.

## 6. Sizing, Spacing & Layout
*   **Spacing rộng rãi:** Tận dụng tối đa khoảng trắng (white space). Khoảng cách giữa các section (padding/margin) phải đủ lớn để người dùng "thở".
*   **Bento Grid:** Ưu tiên sắp xếp content theo dạng lưới hộp (bento) phẳng, gọn gàng và toán học.
*   **Borders & Radius:** Bo góc tinh tế, vừa phải (VD: 8px - 14px cho input/card, 24px+ cho section/modal).

## 7. Component Styling (CSS Tailwind Thuần)
Giao diện yêu cầu sử dụng **Tailwind CSS thuần**, thiết lập class rõ ràng, không phụ thuộc framework UI cồng kềnh.

*   **Cards:** Nền trắng tĩnh, viền mỏng 1px màu xám cực nhạt, padding rộng rãi, không lạm dụng shadow (chỉ dùng shadow siêu nhẹ `shadow-sm` hoặc `shadow-md` siêu nhạt).
*   **Buttons:** Rõ ràng, cứng cáp. Primary action dùng nền Azure, hover mượt mà. Phải có độ tương phản tốt và phân cấp chính/phụ rõ ràng.
*   **Tables:** Sạch sẽ, không có đường kẻ dọc (chỉ kẻ ngang nhạt), padding rộng, header phân biệt rõ với body. Text trong table phải ngắn gọn, dễ scan.
*   **Forms:** Input box đơn giản, viền mảnh, focus state rõ ràng nhưng tinh tế (VD: viền Azure). Label nhỏ và đậm. 
*   **Badges (Status):** Dạng pill (bo tròn hoàn toàn), màu sắc nhã nhặn (nền pastel nhạt + text đậm màu). Ví dụ: Mint cho Confirmed/Completed, Amber cho Pending.
*   **Sidebar / Navigation:** Đơn giản, mỏng, không chiếm quá nhiều diện tích màn hình. Trạng thái active phải trực quan, dễ nhận biết.

## 8. Nguyên tắc hiển thị AI Chat (Patient AI Assistant)
*   Giao diện trò chuyện phải tạo cảm giác **đáng tin cậy và y khoa**.
*   Phân biệt rõ ràng giữa tin nhắn bệnh nhân và phản hồi từ AI (qua màu nền nhạt, avatar tinh tế).
*   **Disclaimer y tế (Bắt buộc):** Luôn hiển thị dòng chữ cảnh báo y tế rõ ràng (Nội dung AI chỉ mang tính tham khảo, không thay thế bác sĩ).

## 9. Giới hạn sửa đổi Logic
*   Tất cả những thay đổi về Redesign, áp dụng giao diện theo tài liệu này **chỉ được phép can thiệp vào tầng Presentation (giao diện, CSS, Layout)**.
*   Tuyệt đối **KHÔNG** làm thay đổi logic hoạt động cốt lõi của các chức năng nghiệp vụ từ R01 đến R04 (Quản lý bệnh nhân, Lịch khám bệnh nhân/bác sĩ, AI Assistant logic).

## 10. Summary
Phiên bản thiết kế High-end Healthcare SaaS này tập trung vào sự sang trọng, đơn giản và chuẩn mực y khoa thông qua việc kiểm soát gắt gao màu sắc (Azure & Mint trên nền Trắng), Typography (Space Grotesk/Inter mix với Playfair Display) và Spacing. Giao diện được code bằng Tailwind thuần, loại bỏ hoàn toàn các yếu tố làm rối mắt (gradient, glassmorphism, neon, emoji lớn) để mang lại trải nghiệm chuyên nghiệp nhất.
