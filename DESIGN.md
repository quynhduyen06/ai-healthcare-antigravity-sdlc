# DESIGN.md

## 1. Mục đích tài liệu
Tài liệu này định nghĩa quy chuẩn thiết kế giao diện cho dự án AI Healthcare Assistant.
Tài liệu được dùng để hướng dẫn Google Antigravity và thành viên trong nhóm khi tạo hoặc chỉnh sửa giao diện. Mục tiêu là đảm bảo UI nhất quán, chuyên nghiệp, phù hợp lĩnh vực healthcare và bám đúng phạm vi hệ thống đã mô tả trong `docs/03-system-design.md`.
Đây không phải một design system đầy đủ cho sản phẩm thật, mà là tài liệu định hướng giao diện cho bản demo/MVP.

## 2. Định hướng thiết kế
Giao diện cần tạo cảm giác sạch, rõ ràng, đáng tin cậy và phù hợp với hệ thống hỗ trợ y tế.
Thiết kế tập trung vào hai vai trò chính là Patient và Doctor. UI cần giúp người dùng hoàn thành các tác vụ chính như nhập triệu chứng, nhận lời khuyên chung từ AI, đặt lịch khám, quản lý appointment, cập nhật trạng thái appointment và xem bệnh án.
Giao diện nên hiện đại, nhẹ nhàng và chỉn chu, nhưng không quá phức tạp, không quá màu mè và không mang phong cách marketing. Sự rõ ràng, dễ dùng và dễ demo được ưu tiên hơn hiệu ứng thị giác.

## 3. Chủ đề và cảm giác giao diện

### 3.1 Từ khóa thiết kế
Clean, calm, professional, trustworthy, healthcare-oriented, premium, structured, easy to use.

### 3.2 Cần tránh
Tránh dark mode mặc định, màu neon, gradient nặng, glassmorphism, hình minh họa quá vui nhộn, bo góc quá lớn, dashboard phức tạp, animation không cần thiết và các phong cách không phù hợp với hệ thống healthcare.

## 4. Bảng màu và vai trò màu

### 4.1 Định hướng màu sắc
Bảng màu của hệ thống sử dụng trục chính là xanh dương y tế, đi từ pastel nhẹ đến xanh đậm. Màu xanh dương tạo cảm giác tin cậy, chuyên nghiệp và phù hợp với lĩnh vực healthcare.
Bên cạnh đó, hệ thống dùng thêm mint/teal nhẹ làm màu nhấn phụ để tạo cảm giác sạch, an toàn và gần gũi. Các màu trung tính như trắng, xám nhạt và slate được dùng để giữ giao diện sang, nhẹ và dễ đọc.

### 4.2 Color Tokens

| Token | Giá trị đề xuất | Vai trò |
|---|---|---|
| Primary Deep | `#1E3A8A` | Màu xanh đậm cho điểm nhấn mạnh, tiêu đề quan trọng hoặc active state |
| Primary | `#2563EB` | CTA chính, button chính, navigation active |
| Primary Hover | `#1D4ED8` | Hover/pressed state của primary action |
| Primary Soft | `#DBEAFE` | Nền xanh pastel cho selected state, info card hoặc section nhẹ |
| Primary Pale | `#EFF6FF` | Nền xanh rất nhạt cho page block hoặc highlight nhẹ |
| Secondary | `#0F766E` | Teal/mint đậm cho điểm nhấn healthcare phụ |
| Secondary Soft | `#CCFBF1` | Nền mint pastel cho success/info surface |
| Background | `#F8FAFC` | Nền chính của page |
| Surface | `#FFFFFF` | Card, form, table, modal |
| Surface Alt | `#F1F5F9` | Section phụ, block lồng bên trong |
| Text | `#0F172A` | Text chính |
| Muted | `#64748B` | Text phụ, metadata, helper text |
| Border | `#E2E8F0` | Border và divider |
| Success | `#15803D` | Trạng thái thành công hoặc hoàn thành |
| Warning | `#D97706` | Trạng thái chờ hoặc cần chú ý |
| Danger | `#DC2626` | Lỗi, hủy hoặc hành động nguy hiểm |
| Neutral | `#64748B` | Trạng thái phụ, không hoạt động hoặc No-show |

### 4.3 Status Colors

| Appointment Status | Color Role | Gợi ý hiển thị |
|---|---|---|
| Pending | Warning | Nền vàng nhạt, chữ vàng đậm |
| Confirmed | Primary | Nền xanh dương nhạt, chữ xanh dương đậm |
| Rescheduled | Secondary | Nền mint nhạt, chữ teal đậm |
| In Progress | Warning | Nền cam/vàng nhạt, chữ cam đậm |
| Completed | Success | Nền xanh lá nhạt, chữ xanh lá đậm |
| Cancelled | Danger | Nền đỏ nhạt, chữ đỏ đậm |
| No-show | Neutral | Nền xám nhạt, chữ xám đậm |

### 4.4 Color Rules
Primary là màu thương hiệu chính của giao diện. Secondary chỉ dùng làm màu nhấn phụ trong các khu vực healthcare hoặc trạng thái tích cực.
Nên ưu tiên nền sáng, card trắng, border xám nhạt và các mảng màu pastel nhẹ. Màu đậm chỉ nên dùng cho CTA chính, trạng thái active, tiêu đề quan trọng hoặc icon cần nhấn mạnh.
Không dùng quá nhiều màu nổi trong cùng một màn hình. Nếu một page đã có nhiều status badge, các phần còn lại nên giữ màu trung tính để giao diện không bị rối.

## 5. Quy tắc typography

### 5.1 Font Stack
Sử dụng font stack:
`Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.`

### 5.2 Type Scale

| Token | Size / Weight / Line Height | Mục đích |
|---|---|---|
| Page Title | 32px / 700 / 1.2 | Tiêu đề chính của page |
| Section Title | 24px / 600 / 1.25 | Tiêu đề section lớn |
| Card Title | 20px / 600 / 1.3 | Tiêu đề card |
| Body | 16px / 400 / 1.5 | Nội dung chính |
| Body Small | 14px / 400 / 1.5 | Nội dung phụ |
| Label / Button | 14px / 500 / 1.4 | Label, button, tab |
| Caption | 12px / 400 / 1.4 | Metadata, helper text |

### 5.3 Quy tắc typography
Heading cần rõ ràng nhưng không quá lớn. Body text nên nằm trong khoảng 14px đến 16px để dễ đọc.
Không dùng font trang trí, font quá mảnh, all-caps heading hoặc letter spacing quá mạnh. Text hiển thị trên UI nên ngắn gọn, rõ nghĩa và dùng tiếng Việt.

## 6. Spacing, radius và sizing

### 6.1 Spacing Scale
Sử dụng base grid 8px.
Các giá trị spacing thường dùng: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px.

### 6.2 Radius Scale

| Thành phần | Radius |
|---|---|
| Card | 12px |
| Input | 8px |
| Button | 8px |
| Badge / Pill | 999px |
| Modal | 16px |

### 6.3 Sizing Rules
Input và button nên cao khoảng 40px đến 44px.
Card nên có padding 24px trên desktop và 16px trên màn hình nhỏ hơn.
Nội dung cần có khoảng cách hợp lý, không bị dày đặc hoặc quá sát mép.

## 7. Nguyên tắc layout
Mỗi page nên tập trung vào một tác vụ chính. Ví dụ: Patient AI Assistant tập trung vào nhập triệu chứng, Patient Appointment tập trung vào quản lý lịch khám, Doctor Appointment tập trung vào quản lý appointment và Doctor Patient tập trung vào xem thông tin bệnh nhân.
Ứng dụng nên có top navigation hoặc navbar đơn giản. Nội dung chính đặt trong page container rõ ràng.
Ưu tiên card, table và form đơn giản thay vì dashboard phức tạp. Dùng khoảng trắng để tách section trước khi thêm màu sắc hoặc border.
Không tạo dashboard riêng cho Patient hoặc Doctor vì không nằm trong scope hệ thống.

## 8. Cấu trúc điều hướng
Navigation cần đơn giản và bám theo các module chính.

| Route | Tên hiển thị | Mục đích |
|---|---|---|
| `/` | Home | Trang vào hệ thống và điều hướng module |
| `/patient/assistant` | AI Assistant | Bệnh nhân nhập triệu chứng và nhận lời khuyên chung |
| `/patient/appointments` | Patient Appointments | Bệnh nhân quản lý appointment |
| `/doctor/appointments` | Doctor Appointments | Bác sĩ quản lý appointment và trạng thái |
| `/doctor/patients` | Patients | Bác sĩ xem thông tin bệnh nhân và bệnh án |

Nếu chia nhóm navigation, dùng hai nhóm: Patient gồm AI Assistant và Appointments; Doctor gồm Appointments và Patients.

## 9. Yêu cầu thiết kế từng page

### 9.1 Home Page
Home Page là trang vào hệ thống đơn giản, không phải dashboard.
Trang này cần có tên hệ thống, mô tả ngắn và các button/link điều hướng đến Patient AI Assistant, Patient Appointments, Doctor Appointments và Doctor Patients.

### 9.2 Patient AI Assistant Page
Trang này tập trung vào việc nhập triệu chứng và hiển thị phản hồi từ AI.
Thành phần chính gồm page title, mô tả ngắn, textarea nhập triệu chứng, button gửi, card lời khuyên chung, card khoa khám gợi ý và disclaimer y tế.
Kết quả AI phải được trình bày như nội dung hỗ trợ tham khảo, không được tạo cảm giác đây là chẩn đoán chính thức.

### 9.3 Patient Appointment Page
Trang này cho phép bệnh nhân tìm kiếm, đặt lịch, đổi lịch và hủy lịch khám.
Thành phần chính gồm page title, search/filter, bảng appointment, status badge, button nhỏ + Book Appointment, action Reschedule và Cancel trong từng dòng appointment.
Button + Book Appointment nên đặt gần góc phải phía trên bảng. Book và Reschedule nên mở modal thay vì chuyển sang page mới.

### 9.4 Book Appointment Modal
Book Appointment Modal dùng để bệnh nhân đặt lịch khám.
Form gồm thông tin bệnh nhân, mô tả triệu chứng ngắn, chọn khoa khám, tìm bác sĩ, card thông tin sơ bộ của bác sĩ, chọn ngày khám, chọn giờ khám, ghi chú thêm, button xác nhận và button hủy.
Form cần rõ ràng, không quá dài và chia theo thứ tự tự nhiên. Thông tin bác sĩ nên ngắn gọn, dễ scan.

### 9.5 Reschedule Modal
Reschedule Modal dùng để đổi lịch hẹn.
Modal cần hiển thị appointment đang chọn, ngày mới, giờ mới, button xác nhận và button hủy.
Modal này chỉ tập trung vào việc đổi thời gian appointment, không thêm thông tin không cần thiết.

### 9.6 Cancel Confirmation Dialog
Cancel appointment phải có confirmation dialog.
Dialog cần thông báo rõ rằng appointment sẽ bị hủy và cung cấp hai hành động: xác nhận hủy và quay lại.

### 9.7 Doctor Appointment Page
Trang này cho phép bác sĩ tìm kiếm appointment và cập nhật trạng thái lịch khám.
Thành phần chính gồm page title, search/filter, bảng appointment, status badge, dropdown/select cập nhật trạng thái và button/link xem bệnh nhân.
Bác sĩ chỉ thấy appointment thuộc về mình. Bảng cần dễ scan, trạng thái phải rõ ràng và thao tác cập nhật trạng thái phải dễ dùng.

### 9.8 Doctor Patient Page
Trang này cho phép bác sĩ xem thông tin bệnh nhân và bệnh án.
Thành phần chính gồm search/filter patient, danh sách bệnh nhân, patient info card, medical record card và appointment history section.
Chỉ hiển thị bệnh nhân có appointment với bác sĩ. Thông tin bệnh nhân và bệnh án cần trình bày rõ ràng, không quá dày đặc. Dữ liệu y tế trong demo phải là mock data.

## 10. Component Styling

### 10.1 Buttons
Primary button dùng cho hành động chính như Submit, Confirm, Book. Secondary button dùng cho hành động phụ như Cancel hoặc Back. Danger button dùng cho hành động nguy hiểm như Cancel Appointment. Small button dùng cho action trong table như Reschedule hoặc View.
Button text cần ngắn, rõ nghĩa và dùng thống nhất ngôn ngữ với UI.

### 10.2 Inputs and Forms
Input dùng nền trắng, border 1px, radius 8px và focus state rõ ràng.
Label đặt phía trên input. Helper text và validation message dùng màu Muted hoặc màu trạng thái phù hợp.
Form nên một cột trên màn hình nhỏ và tối đa hai cột trên desktop. Không yêu cầu người dùng nhập quá nhiều thông tin trong demo.

### 10.3 Cards and Panels
Card dùng cho AI advice, suggested department, doctor information, patient information, medical record và appointment detail.
Card sử dụng nền Surface, radius 12px, border nhẹ và shadow tinh tế. Tiêu đề card cần rõ ràng, metadata nên hiển thị nhẹ hơn nội dung chính.

### 10.4 Badges and Status Indicators
Badge dùng để hiển thị trạng thái appointment.
Các status cần hỗ trợ gồm Pending, Confirmed, Rescheduled, In Progress, Completed, Cancelled và No-show.
Badge nên dùng dạng pill, màu nền nhẹ và text rõ ràng. Không chỉ dựa vào màu sắc để truyền đạt trạng thái.

### 10.5 Tables and Record Lists
Table dùng cho appointment list và patient list.
Table cần có header rõ ràng, search/filter phía trên, status badge, action buttons ở cột cuối và không hiển thị quá nhiều cột không cần thiết.
Trên màn hình nhỏ, table có thể scroll ngang hoặc chuyển sang dạng stacked card nếu phù hợp.

### 10.6 Modals and Dialogs
Modal dùng cho Book Appointment và Reschedule. Dialog dùng cho xác nhận Cancel Appointment.
Modal phải có title rõ ràng, nội dung vừa đủ, button xác nhận và button hủy. Không nhồi quá nhiều thông tin trong một modal.

## 11. Elevation and Borders
Giao diện nên dùng border nhẹ làm cấu trúc chính, shadow chỉ dùng để tạo độ nổi vừa phải cho card, modal hoặc surface quan trọng.
Card nên dùng border màu Border và shadow nhẹ. Tránh shadow quá đậm, hiệu ứng glow, glassmorphism hoặc floating style quá mạnh.
Shadow đề xuất:
* Default card: `0 1px 2px rgba(15, 23, 42, 0.04)`
* Elevated surface: `0 8px 24px rgba(15, 23, 42, 0.06)`

## 12. Responsive Behavior
Giao diện cần hoạt động tốt trên laptop và desktop vì đây là môi trường demo chính.

| Breakpoint | Hành vi đề xuất |
|---|---|
| 1280px+ | Layout desktop thoải mái, có thể dùng nhiều cột |
| 1024px | Giảm mật độ ngang, giữ card dễ đọc |
| 768px | Chuyển dần sang một cột |
| 480px | Spacing gọn hơn, action xếp chồng nếu cần |

Button và input nên có kích thước đủ lớn để thao tác. Modal không được vượt quá chiều cao màn hình. Table có thể scroll ngang nếu cần.
Không cần tối ưu mobile quá sâu trong bản demo.

## 13. Accessibility and Content
UI cần đảm bảo text có độ tương phản rõ ràng, focus state dễ thấy và trạng thái không chỉ được truyền đạt bằng màu sắc.
Nội dung hiển thị nên ngắn gọn, trực tiếp và dễ hiểu. Ngôn ngữ UI là tiếng Việt. Tên component, biến và file trong code nên dùng tiếng Anh.
Không dùng quá nhiều thuật ngữ kỹ thuật trên UI nếu không cần thiết.

## 14. Medical Safety UI Rules
Vì hệ thống có AI Assistant liên quan đến triệu chứng sức khỏe, UI phải có cảnh báo an toàn rõ ràng.
Disclaimer bắt buộc:
*“Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.”*
Quy tắc: không dùng từ ngữ khẳng định bệnh, không hiển thị AI như bác sĩ thật, không tạo cảm giác AI có thể thay thế bác sĩ, không tạo chức năng kê đơn thuốc và không đưa lời khuyên điều trị chuyên sâu.

## 15. Do and Do Not

### 15.1 Do
Dùng light mode mặc định, UI sạch và chuyên nghiệp, màu xanh y tế làm màu chính, card trắng trên nền xám rất nhạt, table cho appointment list, modal cho book/reschedule, confirmation dialog cho cancel, badge cho appointment status và disclaimer cho AI Assistant.
Bám sát scope gồm Patient AI Assistant, Patient Appointment, Doctor Appointment và Doctor Patient.

### 15.2 Do Not
Không tạo login thật, dashboard riêng cho Patient/Doctor, Admin UI, Staff UI, payment, insurance, video call, AI diagnosis, prescription feature hoặc các module ngoài system design.
Không dùng dark mode mặc định, neon color, gradient nặng, glassmorphism, animation không cần thiết hoặc giao diện quá giống marketing website.

## 16. Agent Prompt Guide
Khi yêu cầu Google Antigravity generate UI, có thể dùng hướng dẫn ngắn sau:
*Build a clean, calm and professional healthcare web UI for AI Healthcare Assistant using light mode, a soft-to-deep medical blue palette, subtle mint/teal accents, white cards, light gray background, clear tables, simple forms, appointment status badges, modal-based booking/rescheduling, and Vietnamese UI text. Follow docs/03-system-design.md and do not create login, dashboards, Admin, Staff, payment, insurance, video call, or real medical diagnosis features.*

Khi generate frontend code, Google Antigravity cần đọc:
* `docs/03-system-design.md`
* `DESIGN.md`
* `AGENTS.md`

## 17. Summary
DESIGN.md định nghĩa quy chuẩn giao diện cho AI Healthcare Assistant.
Giao diện cần sạch, sáng, nhẹ nhàng, chuyên nghiệp, phù hợp lĩnh vực healthcare và bám sát bốn module chính: Patient AI Assistant, Patient Appointment, Doctor Appointment và Doctor Patient.
Thiết kế cần hỗ trợ demo rõ ràng, tránh over-engineering và giúp Google Antigravity tạo UI nhất quán trên toàn bộ hệ thống.
