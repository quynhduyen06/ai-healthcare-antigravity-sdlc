prompts/04-ui-generation-prompt.md
## 1. Prompt Name
UI Generation Prompt

## 2. Mục đích
Prompt này dùng để yêu cầu Google Antigravity tạo giao diện cho dự án AI Healthcare Assistant dựa trên các tài liệu spec đã chuẩn bị trước.
Mục tiêu của prompt không chỉ là tạo giao diện đẹp, mà là tạo giao diện đúng requirement, đúng system design, đúng design guideline và đúng phạm vi demo/MVP.
Prompt này thuộc bước UI Design / UI Implementation trong SDLC workflow của nhóm.

## 3. Tài liệu cần đọc trước khi làm
Trước khi generate UI, Google Antigravity phải đọc các tài liệu sau:
/read docs/01-business-requirements.md /read docs/03-system-design.md /read DESIGN.md /read AGENTS.md
Nếu slash command /read không hoạt động trong môi trường hiện tại, hãy mở và đọc thủ công các file trên trước khi chỉnh sửa code.

## 4. Vai trò của AI Agent
Bạn là một senior frontend UI implementation agent.
Nhiệm vụ của bạn là tạo giao diện web cho dự án AI Healthcare Assistant theo đúng các tài liệu requirement, system design và design guideline đã đọc.
Bạn không được tự quyết định lại scope hệ thống. Mọi quyết định UI phải bám theo tài liệu đã có.
Ưu tiên chính: UI rõ ràng, đúng flow, dễ demo, dễ kiểm tra, dễ bảo trì và phù hợp lĩnh vực healthcare.

## 5. Bối cảnh dự án
Dự án là một bản demo/MVP cho hệ thống AI Healthcare Assistant.
Hệ thống có 2 role chính:
Patient: sử dụng AI Assistant và quản lý appointment. Doctor: quản lý appointment và xem thông tin bệnh nhân/bệnh án.
Trong bản demo, hệ thống không có login thật, không có dashboard riêng cho Patient/Doctor, không có Admin/Staff module và không dùng cloud database.
Tuy nhiên, hệ thống cần sử dụng local database bằng SQLite thông qua Prisma ở bước code để có thể demo data được cập nhật thật. Vì vậy, UI cần được thiết kế theo hướng sẵn sàng kết nối database, không chỉ là giao diện tĩnh.

## 6. Scope cần triển khai UI
Chỉ tạo UI cho các module sau:
Patient AI Assistant: bệnh nhân nhập triệu chứng, nhận lời khuyên chung và khoa khám gợi ý. Patient Appointment: bệnh nhân tìm kiếm appointment, book appointment, reschedule và cancel. Doctor Appointment: bác sĩ tìm kiếm appointment và cập nhật trạng thái appointment. Doctor Patient: bác sĩ xem thông tin bệnh nhân và bệnh án.
Không tạo UI cho login thật, dashboard riêng, Admin, Staff, payment, insurance, video call, AI diagnosis hoặc prescription.

## 7. Route cần có
Tạo hoặc chỉnh UI theo các route sau:
Route
Mục đích
/
Home, điều hướng vào các module chính
/patient/assistant
Patient AI Assistant
/patient/appointments
Patient Appointment Management
/doctor/appointments
Doctor Appointment Management
/doctor/patients
Doctor Patient Records
Home chỉ là trang điều hướng đơn giản, không phải dashboard thống kê.

## 8. UI Design Rules
Giao diện phải tuân thủ DESIGN.md.
Quy tắc chính:
Dùng light mode mặc định. Dùng bảng màu healthcare nhẹ nhàng, trung tính, xanh dương pastel đến xanh dương đậm. Dùng card trắng trên nền xám rất nhạt. Dùng table cho appointment list. Dùng modal cho Book Appointment và Reschedule. Dùng confirmation dialog cho Cancel Appointment. Dùng badge màu cho appointment status. Dùng tiếng Việt cho text hiển thị trên UI.
Không dùng dark mode, neon color, gradient nặng, glassmorphism hoặc animation không cần thiết.

## 9. Database-aware UI Requirement
Ở bước UI, có thể dùng placeholder data hoặc mock display data để dựng giao diện ban đầu.
Tuy nhiên, UI phải được thiết kế để bước code có thể kết nối với Prisma + SQLite local database.
Các phần UI cần sẵn sàng hiển thị dữ liệu động từ database:
Appointment table. Doctor list trong Book Appointment modal. Patient list trong Doctor Patient page. Medical record card. Appointment history section. AI advice result nếu được lưu vào database.
Không hard-code UI theo cách khiến dữ liệu không thể thay đổi sau khi kết nối database.

## 10. Page Requirements
10.1 Home Page
Home Page cần có tên hệ thống, mô tả ngắn và các nút điều hướng đến Patient AI Assistant, Patient Appointments, Doctor Appointments và Doctor Patients.
Không tạo dashboard, biểu đồ hoặc thống kê không cần thiết.

10.2 Patient AI Assistant Page
Trang này cần có page title, mô tả ngắn về chức năng, textarea nhập triệu chứng, button gửi triệu chứng, card hiển thị lời khuyên chung, card hiển thị khoa khám gợi ý và disclaimer y tế.
AI response phải được trình bày như lời khuyên tham khảo, không phải chẩn đoán.

10.3 Patient Appointments Page
Trang này cần có page title, search/filter appointment, bảng danh sách appointment, button nhỏ + Book Appointment, action Reschedule và Cancel cho từng appointment.
Book Appointment và Reschedule phải mở modal/form. Cancel phải có confirmation dialog.
Appointment table cần được thiết kế để sau này lấy dữ liệu từ bảng Appointment.

10.4 Book Appointment Modal
Modal đặt lịch cần có thông tin bệnh nhân, triệu chứng ngắn, chọn khoa khám, tìm kiếm bác sĩ, card thông tin sơ bộ của bác sĩ, chọn ngày khám, chọn giờ khám, ghi chú thêm, button xác nhận và button hủy.
Form phải rõ ràng, ngắn gọn, dễ demo và không yêu cầu quá nhiều thông tin không cần thiết.
Các field trong form phải phù hợp để tạo record mới trong bảng Appointment, liên kết với Patient, Doctor và Department.

10.5 Reschedule Modal
Modal đổi lịch cần có appointment đang chọn, ngày mới, giờ mới, button xác nhận và button hủy.
Modal chỉ tập trung vào việc đổi thời gian appointment. UI cần phù hợp để cập nhật date, time, status và updatedAt của appointment trong database ở bước code.

10.6 Cancel Confirmation Dialog
Cancel appointment phải có confirmation dialog rõ ràng trước khi hủy.
Dialog cần thông báo rằng appointment sẽ bị hủy và cung cấp hai hành động: xác nhận hủy và quay lại.
UI cần phù hợp để bước code cập nhật status của appointment thành Cancelled trong database.

10.7 Doctor Appointments Page
Trang này cần có page title, search/filter appointment, bảng appointment của doctor, badge trạng thái appointment, dropdown/select để cập nhật trạng thái và button/link xem bệnh nhân.
Doctor chỉ thấy appointment thuộc về mình.
UI cần phù hợp để bước code cập nhật status của appointment trong database.

10.8 Doctor Patients Page
Trang này cần có search/filter patient, danh sách bệnh nhân, patient info card, medical record card và appointment history section.
Chỉ hiển thị bệnh nhân có appointment với doctor hiện tại.
UI cần phù hợp để bước code truy xuất Patient thông qua Appointment của Doctor và hiển thị MedicalRecord theo patientId.

## 11. Component Requirements
Có thể tạo hoặc sử dụng các component sau:
Layout: Navbar, PageContainer. Common: Button, Card, Table, Badge, SearchInput, Select, Modal, FormInput. Patient: AIAssistantForm, AIAdviceCard, PatientAppointmentTable, BookAppointmentModal, DoctorSearchBox, DoctorInfoCard, RescheduleModal, CancelAppointmentDialog. Doctor: DoctorAppointmentTable, AppointmentStatusSelect, PatientInfoCard, MedicalRecordCard, PatientSearchBox.
Component cần rõ ràng, dễ tái sử dụng và không nhồi quá nhiều logic vào một component.
Các component liên quan đến dữ liệu như appointment table, doctor card, patient card và medical record card cần nhận data qua props hoặc data source rõ ràng, không hard-code toàn bộ nội dung bên trong component.

## 12. Data Display Requirement
Ở bước UI, có thể dùng sample data để hiển thị giao diện. Tuy nhiên, sample data phải phản ánh đúng cấu trúc database dự kiến.
Data hiển thị nên có các nhóm chính:
Patients. Doctors. Departments. Appointments. MedicalRecords. AIAdvice nếu cần.
Quan hệ dữ liệu cần thể hiện trong UI:
Patient → Appointment ← Doctor Appointment → Department Patient → MedicalRecord Patient → AIAdvice
Appointment là entity trung tâm nối Patient, Doctor và Department.

## 13. Scope Guard
Không được tự tạo thêm các phần sau: login thật, dashboard riêng cho Patient hoặc Doctor, Admin UI, Staff UI, payment, insurance, video call, AI diagnosis, prescription, cloud database hoặc backend phức tạp.
Nếu thấy cần thêm chức năng ngoài scope, chỉ ghi vào phần “Future Improvement”, không implement.

## 14. Decision Log Requirement
Sau khi hoàn thành UI, hãy ghi lại ngắn gọn các quyết định đã thực hiện vào DECISIONS.md.
Mẫu ghi decision:
Decision: Tạo Book Appointment bằng modal thay vì page riêng. Reason: Giúp demo nhanh, giảm route không cần thiết và giữ flow đơn giản. Related files: liệt kê file đã chỉnh. Requirement mapping: Patient Appointment.
Nếu DECISIONS.md chưa tồn tại, hãy tạo file này.

## 15. Output Evidence
Sau khi hoàn thành, hãy tóm tắt kết quả theo format:
Đã tạo/chỉnh các page nào. Đã tạo/chỉnh các component nào. UI đã bám theo requirement nào. Có phần nào dùng sample/mock data tạm thời. Có component nào đã chuẩn bị để kết nối Prisma + SQLite ở bước code. Có phần nào chưa làm và lý do. Cách chạy project.
Mục tiêu là để nhóm có bằng chứng trình bày với thầy rằng UI được tạo theo spec, không phải prompt cảm tính.

## 16. Execution Instruction
Hãy thực hiện trực tiếp trong workspace hiện tại.
Không tạo project mới nếu project đã tồn tại. Không hỏi xác nhận từng bước. Không tự browser testing. Không dùng Playwright/Cypress nếu chưa được yêu cầu. Không tự thêm chức năng ngoài scope.
Sau khi hoàn thành, chỉ tóm tắt ngắn gọn các file, page và component đã tạo hoặc chỉnh sửa.

## 17. Final Prompt to Run
/read docs/01-business-requirements.md /read docs/03-system-design.md /read DESIGN.md /read AGENTS.md
Bạn là senior frontend UI implementation agent. Hãy tạo UI cho dự án AI Healthcare Assistant theo đúng các tài liệu đã đọc.
Chỉ triển khai UI cho 4 module: Patient AI Assistant, Patient Appointment, Doctor Appointment và Doctor Patient.
Không tạo login thật, dashboard riêng, Admin, Staff, payment, insurance, video call, AI diagnosis hoặc prescription.
UI phải dùng tiếng Việt, light mode, phong cách healthcare nhẹ nhàng, chuyên nghiệp, bảng màu xanh dương pastel đến xanh dương đậm, card trắng, nền xám rất nhạt, table rõ ràng, modal cho book/reschedule và confirmation dialog cho cancel.
Lưu ý quan trọng: ở bước UI có thể dùng sample/mock data tạm thời, nhưng component và page phải được thiết kế để bước code có thể kết nối với Prisma + SQLite local database. Appointment table, doctor list, patient list, medical record card và appointment history không được hard-code theo cách khó thay dữ liệu.
Sau khi hoàn thành, hãy cập nhật DECISIONS.md với các quyết định UI chính và tóm tắt các file đã chỉnh.


