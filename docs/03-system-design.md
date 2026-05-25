# 03. System Design

## 1. Mục đích tài liệu
Tài liệu này mô tả thiết kế hệ thống tổng thể của dự án AI Healthcare Assistant.
Mục đích của tài liệu là xác định vai trò người dùng, module chức năng, luồng xử lý chính, cấu trúc dữ liệu tổng quan và phạm vi triển khai của hệ thống trong bản demo/MVP.
Tài liệu này được sử dụng làm cơ sở để Google Antigravity hiểu đúng phạm vi hệ thống trước khi hỗ trợ tạo giao diện, viết code, kết nối database local, kiểm thử và debug.

## 2. Tổng quan hệ thống
AI Healthcare Assistant là hệ thống web hỗ trợ quy trình khám bệnh cơ bản giữa bệnh nhân và bác sĩ.
Hệ thống có hai vai trò chính:
* Patient / Bệnh nhân
* Doctor / Bác sĩ

Bệnh nhân có thể sử dụng AI Assistant để nhập triệu chứng, nhận lời khuyên sức khỏe chung và được gợi ý khoa khám phù hợp. Ngoài ra, bệnh nhân có thể tìm kiếm lịch khám, đặt lịch, đổi lịch hoặc hủy lịch.
Bác sĩ có thể quản lý các lịch hẹn của mình, tìm kiếm appointment, cập nhật trạng thái appointment, xem thông tin bệnh nhân và xem bệnh án liên quan.
Trong bản demo, hệ thống không triển khai đăng nhập thật. Người dùng truy cập trực tiếp vào các khu vực chức năng tương ứng với từng vai trò.

## 3. Phạm vi hệ thống

### 3.1 Phạm vi có trong demo
| Role | Module | Chức năng chính |
|---|---|---|
| Patient | AI Assistant | Nhập triệu chứng, nhận lời khuyên chung, được gợi ý khoa khám |
| Patient | Appointment | Tìm kiếm appointment, đặt lịch, đổi lịch, hủy lịch |
| Doctor | Appointment | Tìm kiếm appointment, cập nhật trạng thái appointment |
| Doctor | Patient | Xem thông tin bệnh nhân, xem bệnh án |

### 3.2 Phạm vi không triển khai
Các chức năng sau không thuộc phạm vi bản demo: đăng nhập thật, dashboard riêng cho từng role, Staff module, Admin module, thanh toán, bảo hiểm, video call, AI chẩn đoán bệnh thật, AI kê đơn thuốc và deploy production.
Hệ thống không sử dụng cloud database hoặc backend phức tạp. Tuy nhiên, hệ thống sử dụng local database bằng SQLite thông qua Prisma để lưu và cập nhật dữ liệu thật trong quá trình demo.

## 4. Giả định thiết kế
| Hạng mục | Giả định |
|---|---|
| Frontend | Next.js / React / TypeScript / Tailwind CSS |
| Database | SQLite local database managed by Prisma |
| Data Access | Next.js API routes hoặc server actions |
| Authentication | Không có login thật |
| AI | AI giả lập hoặc rule-based logic |
| Ngôn ngữ UI | Tiếng Việt |
| Vai trò chính | Patient và Doctor |
| Demo database | Dùng Prisma Studio để show dữ liệu được cập nhật |

## 5. Kiến trúc tổng quan
Trong bản demo, hệ thống được thiết kế theo hướng web application đơn giản, gồm frontend, application logic và local database.

```text
Người dùng
↓
Giao diện web
↓
Application logic
↓
Next.js API routes / server actions
↓
Prisma ORM
↓
SQLite local database
```

Người dùng thao tác trực tiếp trên giao diện web. Các thao tác như nhập triệu chứng, đặt lịch, đổi lịch, hủy lịch, cập nhật trạng thái appointment và xem bệnh án được xử lý qua application logic.
Dữ liệu bệnh nhân, bác sĩ, khoa khám, lịch hẹn, bệnh án và kết quả AI Assistant được lưu trong SQLite local database. Prisma được sử dụng để định nghĩa schema, seed dữ liệu mẫu và đọc/ghi dữ liệu.
AI Assistant không gọi AI y khoa thật, mà sử dụng logic giả lập để đưa ra lời khuyên chung và gợi ý khoa khám.

## 6. Vai trò người dùng

### 6.1 Patient / Bệnh nhân
Bệnh nhân là người sử dụng hệ thống để nhận hỗ trợ sức khỏe ban đầu và quản lý lịch khám.
Chức năng chính: sử dụng AI Assistant, nhập triệu chứng, nhận lời khuyên chung, nhận gợi ý khoa khám, tìm kiếm appointment, đặt lịch khám, xem thông tin sơ bộ của bác sĩ, đổi lịch khám và hủy lịch khám.

### 6.2 Doctor / Bác sĩ
Bác sĩ là người quản lý lịch khám và xem thông tin bệnh nhân thuộc lịch khám của mình.
Chức năng chính: tìm kiếm appointment, xem danh sách appointment của mình, cập nhật trạng thái appointment, xem thông tin bệnh nhân và xem bệnh án của bệnh nhân.
Bác sĩ chỉ được xem bệnh nhân có appointment với mình.

## 7. Module Patient

### 7.1 Patient AI Assistant
Patient AI Assistant cho phép bệnh nhân nhập triệu chứng bằng văn bản. Hệ thống xử lý thông tin này bằng logic giả lập để đưa ra lời khuyên sức khỏe chung và gợi ý khoa khám phù hợp.
Chức năng chính: nhận triệu chứng từ bệnh nhân, phân tích triệu chứng bằng logic giả lập, đưa ra lời khuyên sức khỏe chung, gợi ý khoa khám phù hợp và hiển thị disclaimer an toàn y tế.
AI Assistant không được chẩn đoán bệnh chính thức, không kê đơn thuốc, không đưa ra phác đồ điều trị và không thay thế bác sĩ.

### 7.2 Logic gợi ý khoa khám
Trong bản demo, AI Assistant có thể sử dụng keyword-based logic để gợi ý khoa khám.

| Nhóm triệu chứng | Khoa gợi ý |
|---|---|
| Sốt, ho, đau họng, cảm | Nội tổng quát |
| Đau ngực, tim, huyết áp | Tim mạch |
| Nổi mẩn, ngứa, dị ứng, mụn | Da liễu |
| Đau đầu, chóng mặt | Thần kinh |
| Triệu chứng ở trẻ em | Nhi khoa |
| Tai, mũi, họng | Tai mũi họng |
| Đau lưng, đau khớp, đau xương | Cơ xương khớp |

Nếu không nhận diện được triệu chứng cụ thể, hệ thống mặc định gợi ý khoa Nội tổng quát và khuyên bệnh nhân đặt lịch khám để được bác sĩ tư vấn chính xác hơn.
Kết quả AI Assistant có thể được lưu vào bảng AIAdvice để phục vụ demo data relationship nếu cần.

### 7.3 Patient Appointment
Patient Appointment là module để bệnh nhân quản lý lịch khám.
Chức năng chính: tìm kiếm appointment, xem danh sách appointment, đặt lịch khám, đổi lịch khám và hủy lịch khám.
Appointment hiển thị dạng bảng để dễ tìm kiếm và thao tác. Thông tin appointment gồm Appointment ID, tên bác sĩ, khoa khám, ngày khám, giờ khám, trạng thái và action buttons.

### 7.4 Book Appointment
Bệnh nhân đặt lịch bằng nút + Book Appointment. Khi bấm vào nút này, hệ thống hiển thị form hoặc modal đặt lịch.
Form đặt lịch gồm họ tên bệnh nhân, số điện thoại hoặc email, triệu chứng ngắn, khoa khám, bác sĩ, thông tin sơ bộ của bác sĩ, ngày khám, giờ khám, ghi chú thêm và nút xác nhận đặt lịch.
Khi bệnh nhân xác nhận, hệ thống tạo một record mới trong bảng Appointment. Record này phải liên kết với Patient, Doctor và Department.

### 7.5 Reschedule Appointment
Bệnh nhân có thể đổi lịch hẹn đã đặt bằng cách chọn appointment, bấm Reschedule, chọn ngày giờ mới và xác nhận thay đổi.
Sau khi đổi lịch, hệ thống cập nhật date, time, updatedAt và status của appointment trong database. Trạng thái có thể chuyển thành Rescheduled hoặc Pending tùy theo logic demo.

### 7.6 Cancel Appointment
Bệnh nhân có thể hủy lịch hẹn bằng cách chọn appointment, bấm Cancel và xác nhận hủy.
Sau khi hủy, hệ thống cập nhật status của appointment thành Cancelled trong database.

## 8. Module Doctor

### 8.1 Doctor Appointment
Doctor Appointment là module để bác sĩ quản lý các appointment thuộc về mình.
Chức năng chính: xem danh sách appointment, tìm kiếm appointment, xem chi tiết appointment và cập nhật trạng thái appointment.
Thông tin appointment hiển thị cho bác sĩ gồm Appointment ID, tên bệnh nhân, triệu chứng ngắn, khoa khám, ngày khám, giờ khám, trạng thái, nút xem bệnh nhân và chức năng cập nhật trạng thái.

### 8.2 Update Appointment Status
Bác sĩ có thể cập nhật trạng thái appointment.
Các trạng thái đề xuất:

| Trạng thái | Ý nghĩa |
|---|---|
| Pending | Lịch đang chờ xác nhận |
| Confirmed | Lịch đã được xác nhận |
| Rescheduled | Lịch đã được đổi |
| In Progress | Cuộc khám đang diễn ra |
| Completed | Cuộc khám đã hoàn thành |
| Cancelled | Lịch đã bị hủy |
| No-show | Bệnh nhân không đến khám |

Khi bác sĩ cập nhật trạng thái, hệ thống phải ghi thay đổi vào bảng Appointment trong database.

### 8.3 Doctor Patient
Doctor Patient là module để bác sĩ xem thông tin bệnh nhân và bệnh án.
Bác sĩ chỉ được xem những bệnh nhân có appointment với mình. Dữ liệu bệnh nhân được truy xuất thông qua quan hệ giữa Doctor, Appointment và Patient.
Thông tin bệnh nhân gồm họ tên, tuổi, giới tính, số điện thoại hoặc email, triệu chứng hiện tại, lịch hẹn hiện tại, lịch sử khám, bệnh án và ghi chú y tế.

### 8.4 Medical Record
Medical Record hiển thị hồ sơ/bệnh án cơ bản của bệnh nhân.
Thông tin bệnh án gồm thông tin cá nhân, triệu chứng hiện tại, lịch sử khám, tiền sử bệnh, ghi chú bác sĩ và kết quả từ AI Assistant nếu có.
Trong bản demo, bệnh án sử dụng dữ liệu mẫu trong database local và không chứa dữ liệu y tế thật.

## 9. User Flow chính

### 9.1 Patient Flow
Bệnh nhân mở AI Assistant, nhập triệu chứng và nhận lời khuyên chung cùng khoa khám gợi ý. Sau đó, bệnh nhân có thể chuyển sang module Appointment để tìm kiếm lịch khám, đặt lịch, đổi lịch hoặc hủy lịch.
Khi bệnh nhân book appointment, hệ thống tạo record mới trong database. Khi bệnh nhân reschedule hoặc cancel, hệ thống cập nhật record tương ứng trong database.

### 9.2 Doctor Flow
Bác sĩ mở module Appointment để xem và tìm kiếm các lịch hẹn của mình. Bác sĩ có thể cập nhật trạng thái appointment, và thay đổi này được ghi nhận trong database.
Bác sĩ có thể mở thông tin bệnh nhân để xem hồ sơ/bệnh án liên quan. Dữ liệu bệnh nhân được lấy thông qua appointment của bác sĩ.

## 10. Cấu trúc page đề xuất
Cấu trúc page tập trung trực tiếp vào các module chính, không cần dashboard.

| Route | Mục đích |
|---|---|
| `/` | Home |
| `/patient/assistant` | AI Assistant của bệnh nhân |
| `/patient/appointments` | Quản lý appointment của bệnh nhân |
| `/doctor/appointments` | Quản lý appointment của bác sĩ |
| `/doctor/patients` | Xem thông tin bệnh nhân và bệnh án |

## 11. Component đề xuất
Các component chính nên được chia theo nhóm để dễ bảo trì.
* **Layout:** Navbar, PageContainer.
* **Common component:** Button, Card, Table, Badge, SearchInput, Select, Modal, FormInput.
* **Patient component:** AIAssistantForm, AIAdviceCard, PatientAppointmentTable, BookAppointmentModal, DoctorSearchBox, DoctorInfoCard, RescheduleModal, CancelAppointmentDialog.
* **Doctor component:** DoctorAppointmentTable, AppointmentStatusSelect, PatientInfoCard, MedicalRecordCard, PatientSearchBox.

## 12. Dữ liệu chính trong hệ thống
Hệ thống sử dụng SQLite local database thông qua Prisma.
Các entity chính:

| Entity | Mô tả |
|---|---|
| Patient | Lưu thông tin bệnh nhân |
| Doctor | Lưu thông tin bác sĩ |
| Department | Lưu thông tin khoa khám |
| Appointment | Lưu thông tin lịch hẹn |
| MedicalRecord | Lưu hồ sơ/bệnh án của bệnh nhân |
| AIAdvice | Lưu kết quả tư vấn từ AI Assistant nếu cần |

## 13. Quan hệ dữ liệu tổng quan
Quan hệ dữ liệu quan trọng nhất là Appointment kết nối Patient, Doctor và Department.
* Một Patient có nhiều Appointment.
* Một Doctor có nhiều Appointment.
* Một Department có nhiều Doctor và nhiều Appointment.
* Một Appointment thuộc về một Patient, một Doctor và một Department.
* Một Patient có thể có nhiều MedicalRecord.
* Một Patient có thể có nhiều AIAdvice.

Mô hình quan hệ chính khi demo database:
`Patient → Appointment ← Doctor`
`Appointment → Department`
`Patient → MedicalRecord`
`Patient → AIAdvice`

Điều này cho thấy bệnh nhân đặt lịch thông qua Appointment. Appointment lưu thông tin bệnh nhân, bác sĩ và khoa khám liên quan. Bác sĩ xem được bệnh nhân thông qua các appointment của mình.

## 14. Database Demo Requirement
Vì nhóm cần trình bày dữ liệu được cập nhật như thế nào trong database, bản demo phải hỗ trợ kiểm tra database bằng Prisma Studio.
Các thao tác cần ghi nhận trong database:

| Thao tác trên UI | Thay đổi trong database |
|---|---|
| Patient book appointment | Tạo record mới trong bảng Appointment |
| Patient reschedule appointment | Cập nhật date/time/status của Appointment |
| Patient cancel appointment | Cập nhật status thành Cancelled |
| Doctor update appointment status | Cập nhật status của Appointment |
| Doctor view patient | Truy xuất Patient thông qua Appointment của Doctor |
| Doctor view medical record | Truy xuất MedicalRecord theo patientId |

Khi demo, nhóm có thể mở web app và Prisma Studio song song để cho thấy dữ liệu thay đổi sau mỗi thao tác.

## 15. Appointment Status Design

| Status | Người thao tác | Ý nghĩa |
|---|---|---|
| Pending | Patient/System | Lịch mới được tạo, đang chờ xác nhận |
| Confirmed | Doctor | Lịch đã được bác sĩ xác nhận |
| Rescheduled | Patient/System | Lịch đã được đổi sang thời gian mới |
| In Progress | Doctor | Cuộc khám đang diễn ra |
| Completed | Doctor | Cuộc khám đã hoàn thành |
| Cancelled | Patient/Doctor | Lịch đã bị hủy |
| No-show | Doctor | Bệnh nhân không đến khám |

## 16. Application State và Data Access
Trong bản demo, dữ liệu chính được lưu trong SQLite local database. Frontend có thể sử dụng state để quản lý UI tạm thời như form input, selected item, modal open/close và search keyword.
Các state UI chính gồm: `symptoms`, `aiAdviceResult`, `selectedDepartment`, `selectedDoctor`, `selectedAppointment`, `searchKeyword`, `modalState` và `formState`.
Các dữ liệu bền vững như `patients`, `doctors`, `departments`, `appointments` và `medicalRecords` phải được đọc/ghi thông qua Prisma.

## 17. Quy tắc cho Google Antigravity khi generate code
Khi Google Antigravity đọc tài liệu này và generate code, cần tuân thủ:
* Chỉ tập trung vào hai role chính: Patient và Doctor.
* Không tạo login thật.
* Không tạo dashboard riêng cho Patient hoặc Doctor.
* Không tự thêm Admin hoặc Staff.
* Không tạo cloud database hoặc backend phức tạp.
* Sử dụng Prisma + SQLite local database để demo data update thật.
* Tạo Prisma schema, migration và seed data nếu chưa có.
* Appointment phải là entity trung tâm nối Patient, Doctor và Department.
* Patient có thể search, book, reschedule và cancel appointment.
* Doctor có thể search appointment và cập nhật trạng thái appointment.
* Doctor chỉ xem bệnh nhân có appointment với mình.
* Doctor có thể xem thông tin bệnh nhân và bệnh án.
* AI Assistant chỉ đưa lời khuyên chung và gợi ý khoa khám.
* Không để AI chẩn đoán bệnh hoặc kê đơn thuốc.
* UI dùng tiếng Việt.
* Ưu tiên demo chạy được, flow rõ ràng và có thể show database update bằng Prisma Studio.

## 18. Yêu cầu phi chức năng

### 18.1 Usability
Giao diện cần dễ dùng cho cả bệnh nhân và bác sĩ. Các thao tác chính như Book Appointment, Reschedule, Cancel, View Patient và Update Status phải rõ ràng.

### 18.2 Safety
AI Assistant phải có disclaimer rõ ràng. AI không được trình bày như bác sĩ thật.

### 18.3 Maintainability
Code nên chia rõ theo role, module và component. Tên file và component nên dùng tiếng Anh, nội dung hiển thị trên UI dùng tiếng Việt.

### 18.4 Performance
Ứng dụng demo cần chạy ổn định trên localhost. SQLite database và seed data không nên quá phức tạp.

### 18.5 Expandability
Thiết kế hiện tại có thể mở rộng trong tương lai với login thật, backend API riêng, cloud database, Staff module, Admin module và AI API thật.

## 19. Kịch bản demo đề xuất
* Mở website AI Healthcare Assistant.
* Mở Prisma Studio để quan sát database.
* Vào Patient AI Assistant.
* Nhập triệu chứng mẫu.
* Hệ thống hiển thị lời khuyên chung và khoa khám gợi ý.
* Vào Patient Appointment.
* Bấm + Book Appointment.
* Chọn khoa khám, tìm bác sĩ, chọn ngày giờ và xác nhận đặt lịch.
* Refresh Prisma Studio để show record mới trong bảng Appointment.
* Thử reschedule appointment và show date/time/status thay đổi trong database.
* Thử cancel appointment và show status chuyển thành Cancelled.
* Vào Doctor Appointment.
* Tìm kiếm appointment và cập nhật trạng thái.
* Refresh Prisma Studio để show status được cập nhật.
* Vào Doctor Patient.
* Xem thông tin bệnh nhân và bệnh án được liên kết thông qua appointment.

## 20. Tóm tắt
AI Healthcare Assistant là hệ thống demo hỗ trợ quy trình khám bệnh cơ bản giữa bệnh nhân và bác sĩ.
Bệnh nhân có thể sử dụng AI Assistant để nhận lời khuyên chung, được gợi ý khoa khám, tìm kiếm appointment, đặt lịch, đổi lịch và hủy lịch.
Bác sĩ có thể tìm kiếm appointment của mình, cập nhật trạng thái appointment, xem thông tin bệnh nhân và xem bệnh án liên quan.
Thiết kế hệ thống ưu tiên phạm vi gọn, không login thật, không dashboard thừa, dễ code, dễ demo và có thể trình bày được data flow thông qua local database. Hệ thống sử dụng Prisma + SQLite để lưu và cập nhật dữ liệu thật trong quá trình demo, giúp nhóm có thể mở Prisma Studio để chứng minh dữ liệu thay đổi sau từng thao tác trên UI.
