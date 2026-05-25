prompts/05-code-generation-prompt.md
## 1. Prompt Name
Code Generation Prompt

## 2. Mục đích
Prompt này dùng để yêu cầu Google Antigravity triển khai logic và database cho dự án AI Healthcare Assistant sau khi UI đã được tạo.
Mục tiêu là làm cho các flow chính có thể thao tác được và ghi dữ liệu thật vào SQLite local database thông qua Prisma.
Các flow cần hoạt động gồm: nhập triệu chứng, nhận lời khuyên chung, gợi ý khoa khám, đặt lịch, đổi lịch, hủy lịch, doctor cập nhật trạng thái appointment và doctor xem thông tin bệnh nhân/bệnh án.
Prompt này thuộc bước Code Implementation trong SDLC workflow của nhóm.

## 3. Tài liệu cần đọc trước khi làm
Trước khi generate code logic, Google Antigravity phải đọc các tài liệu sau:
/read docs/01-business-requirements.md /read docs/03-system-design.md /read docs/04-database-spec.md /read DESIGN.md /read AGENTS.md /read DECISIONS.md
Sau đó kiểm tra cấu trúc project hiện tại:
/inspect
Nếu slash command /read hoặc /inspect không hoạt động, hãy mở file thủ công và kiểm tra cấu trúc project trước khi chỉnh sửa.
Nếu docs/04-database-spec.md chưa tồn tại, hãy dựa vào docs/03-system-design.md để đề xuất schema Prisma phù hợp, sau đó ghi decision vào DECISIONS.md.

## 4. Vai trò của AI Agent
Bạn là một senior full-stack implementation agent.
Nhiệm vụ của bạn là triển khai logic demo và local database cho hệ thống AI Healthcare Assistant theo đúng requirement, system design, database relationship và UI đã có.
Bạn cần ưu tiên code đơn giản, dễ hiểu, dễ chạy, dễ demo và dễ kiểm tra bằng Prisma Studio.
Không over-engineering. Không thêm cloud database, login thật, backend phức tạp hoặc AI API thật nếu chưa được yêu cầu.

## 5. Scope cần triển khai
Chỉ triển khai logic và database cho các module sau:
Patient AI Assistant: nhập triệu chứng, nhận lời khuyên chung, gợi ý khoa khám, có thể lưu AI advice nếu phù hợp. Patient Appointment: search appointment, book appointment, reschedule, cancel. Doctor Appointment: search appointment, update appointment status. Doctor Patient: xem thông tin bệnh nhân và bệnh án.
Không triển khai login thật, dashboard riêng, Admin, Staff, payment, insurance, video call, cloud database, AI diagnosis hoặc prescription.

## 6. Database Requirements
Sử dụng Prisma + SQLite local database.
Yêu cầu bắt buộc:
* Cài đặt Prisma nếu project chưa có.
* Tạo prisma/schema.prisma.
* Tạo SQLite database local.
* Tạo migration.
* Tạo seed data.
* Tạo hoặc cập nhật Prisma client.
* Cho phép mở Prisma Studio để xem data.
* Các thao tác chính trên UI phải ghi thay đổi vào database.
Các bảng/entity tối thiểu:
Entity
Mục đích
Patient
Lưu thông tin bệnh nhân
Doctor
Lưu thông tin bác sĩ
Department
Lưu khoa khám
Appointment
Lưu lịch hẹn
MedicalRecord
Lưu bệnh án
AIAdvice
Lưu kết quả AI Assistant nếu cần
Quan hệ dữ liệu bắt buộc:
Patient → Appointment ← Doctor Appointment → Department Patient → MedicalRecord Patient → AIAdvice
Appointment là entity trung tâm nối Patient, Doctor và Department.

## 7. Prisma Schema Requirements
Schema Prisma cần thể hiện các quan hệ chính sau:
Một Patient có nhiều Appointment. Một Doctor có nhiều Appointment. Một Department có nhiều Doctor. Một Department có nhiều Appointment. Một Appointment thuộc về một Patient. Một Appointment thuộc về một Doctor. Một Appointment thuộc về một Department. Một Patient có nhiều MedicalRecord. Một Patient có thể có nhiều AIAdvice.
Bảng Appointment cần có tối thiểu:
id, patientId, doctorId, departmentId, date, time, status, symptoms, note, createdAt, updatedAt.
Bảng Patient cần có tối thiểu:
id, name, age, gender, phone, email, createdAt, updatedAt.
Bảng Doctor cần có tối thiểu:
id, name, departmentId, experience, bio, availableTime, createdAt, updatedAt.
Bảng Department cần có tối thiểu:
id, name, description.
Bảng MedicalRecord cần có tối thiểu:
id, patientId, symptoms, pastHistory, doctorNotes, createdAt, updatedAt.
Bảng AIAdvice nếu triển khai lưu kết quả AI cần có tối thiểu:
id, patientId, symptomsInput, advice, suggestedDepartment, disclaimer, createdAt.
Status appointment cần hỗ trợ:
Pending, Confirmed, Rescheduled, In Progress, Completed, Cancelled, No-show.

## 8. Seed Data Requirements
Tạo seed data đủ để demo.
Seed data cần gồm:
Departments: Nội tổng quát, Tim mạch, Da liễu, Thần kinh, Nhi khoa, Tai mũi họng, Cơ xương khớp. Doctors: ít nhất 5 bác sĩ, mỗi bác sĩ thuộc một department. Patients: ít nhất 5 bệnh nhân. Appointments: ít nhất 5 appointment liên kết đúng patient, doctor và department. MedicalRecords: ít nhất 3 medical record liên kết với patient. AIAdvice: có thể tạo sample nếu phù hợp.
Seed data phải giúp demo được:
Book appointment tạo record mới. Reschedule cập nhật record. Cancel đổi status thành Cancelled. Doctor update status. Doctor xem patient qua appointment. Doctor xem medical record theo patient.

## 9. Data Access Requirements
Sử dụng Next.js API routes hoặc server actions để đọc/ghi database.
Cần có logic cho các thao tác sau:
Get appointments. Search/filter appointments. Create appointment. Update appointment date/time. Update appointment status. Cancel appointment. Get doctors by department hoặc search doctor. Get patients related to doctor. Get medical records by patient.
Không truy cập Prisma trực tiếp từ client component nếu điều đó không phù hợp với cấu trúc Next.js.
Code phải rõ ràng, dễ hiểu và không nhét toàn bộ logic vào một file quá dài.

## 10. AI Assistant Logic
Triển khai logic nhận input triệu chứng và trả về lời khuyên chung, khoa khám gợi ý và disclaimer y tế.
Có thể dùng keyword-based logic.
Mapping đề xuất:
Nhóm triệu chứng
Khoa gợi ý
Sốt, ho, đau họng, cảm
Nội tổng quát
Đau ngực, tim, huyết áp
Tim mạch
Nổi mẩn, ngứa, dị ứng, mụn
Da liễu
Đau đầu, chóng mặt
Thần kinh
Triệu chứng ở trẻ em
Nhi khoa
Tai, mũi, họng
Tai mũi họng
Đau lưng, đau khớp, đau xương
Cơ xương khớp
Nếu không match keyword, mặc định gợi ý khoa Nội tổng quát.
Không tạo logic chẩn đoán bệnh, không kê đơn thuốc, không đưa phác đồ điều trị.
Disclaimer bắt buộc:
“Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.”
Nếu có lưu kết quả AI, lưu vào bảng AIAdvice.

## 11. Patient Appointment Logic
Triển khai các logic sau:
Search appointment theo tên bác sĩ, khoa khám, ngày khám hoặc trạng thái. Book appointment bằng modal/form. Khi submit form, tạo record mới trong bảng Appointment với status mặc định là Pending. Reschedule appointment bằng modal/form. Khi xác nhận reschedule, cập nhật date, time, updatedAt và status thành Rescheduled hoặc Pending. Cancel appointment bằng confirmation dialog. Khi xác nhận cancel, cập nhật status thành Cancelled.
Mọi thay đổi phải được ghi vào SQLite database thông qua Prisma.

## 12. Doctor Appointment Logic
Triển khai logic cho bác sĩ:
Search appointment theo tên bệnh nhân, ngày khám, giờ khám, khoa khám hoặc trạng thái. Chỉ hiển thị appointment thuộc về doctor hiện tại trong database. Cho phép cập nhật trạng thái appointment bằng dropdown/select. Khi doctor đổi status, cập nhật record trong bảng Appointment.
Status cần hỗ trợ: Pending, Confirmed, Rescheduled, In Progress, Completed, Cancelled, No-show.

## 13. Doctor Patient Logic
Triển khai logic cho Doctor Patient:
Hiển thị danh sách bệnh nhân có appointment với doctor hiện tại. Cho phép search/filter bệnh nhân. Khi chọn bệnh nhân, hiển thị patient info, appointment history và medical record. Không hiển thị bệnh nhân không có appointment với doctor hiện tại.
Dữ liệu phải được truy xuất từ database thông qua quan hệ Doctor → Appointment → Patient.

## 14. State Management
Dữ liệu chính phải được lưu trong SQLite database.
Frontend chỉ dùng state cho UI tạm thời như symptoms input, selectedDepartment, selectedDoctor, selectedAppointment, modal open/close, search keyword, loading state và form state.
Không dùng Redux/Zustand nếu không thật sự cần thiết.

## 15. Validation Requirements
Cần có validation cơ bản:
Không submit AI Assistant khi chưa nhập triệu chứng. Không book appointment nếu thiếu thông tin bắt buộc. Không reschedule nếu chưa chọn ngày giờ mới. Không cancel nếu user chưa xác nhận. Không update status nếu appointment không tồn tại. Không tạo appointment nếu doctor hoặc department không hợp lệ.
Validation message dùng tiếng Việt, ngắn gọn và dễ hiểu.

## 16. UI Feedback Requirements
Sau mỗi thao tác thành công, UI cần có phản hồi rõ ràng.
Cần xử lý các feedback sau: đặt lịch thành công, đổi lịch thành công, hủy lịch thành công, cập nhật trạng thái thành công, không tìm thấy appointment, không tìm thấy bác sĩ phù hợp, chưa có bệnh án, chưa nhập triệu chứng và lỗi khi ghi database.
Có thể dùng toast, alert, inline message hoặc state message đơn giản.

## 17. Code Organization
Tổ chức code rõ ràng.
Gợi ý:
Prisma schema đặt trong prisma/schema.prisma. Seed data đặt trong prisma/seed.ts hoặc file seed phù hợp. Prisma client đặt trong lib/prisma.ts. Data access/helper logic đặt trong lib/ hoặc services/. Component đặt trong components/. Page đặt đúng route theo App Router nếu dùng Next.js. API routes hoặc server actions đặt theo cấu trúc phù hợp của project.
Không nhét toàn bộ logic database vào component UI.

## 18. Safety Rules
AI Assistant luôn phải hiển thị disclaimer.
Không dùng wording như “Bạn bị bệnh X”, “Chẩn đoán là X” hoặc “Bạn nên dùng thuốc X”.
Chỉ dùng wording dạng “Hệ thống gợi ý bạn nên cân nhắc khám khoa...”, “Bạn nên đặt lịch khám để được bác sĩ tư vấn chính xác hơn” hoặc “Nội dung này chỉ mang tính tham khảo”.
Không tạo chức năng kê đơn thuốc hoặc hướng dẫn điều trị chuyên sâu.

## 19. Requirement Traceability
Khi hoàn thành logic, hãy ghi mapping giữa requirement và phần đã implement.
Mẫu:
Requirement: Patient can book appointment. Implemented in: liệt kê file/component/page/API route/server action. Database evidence: record mới được tạo trong bảng Appointment. Status: Done / Partial / Not Done.
Nếu có file test hoặc test plan, hãy ghi chú requirement này có thể test bằng test case nào.

## 20. Decision Log Requirement
Sau khi hoàn thành code logic, cập nhật DECISIONS.md.
Mẫu decision:
Decision: Sử dụng Prisma + SQLite local database để demo data update thật. Reason: Nhóm cần trình bày được dữ liệu thay đổi trong database khi thao tác trên UI, nhưng không cần cloud database hoặc backend phức tạp. Related files: liệt kê file đã chỉnh. Requirement mapping: Patient Appointment / Doctor Appointment.
Nếu phát hiện UI hiện tại chưa phù hợp và cần chỉnh, hãy ghi rõ lý do trong decision log.

## 21. Database Demo Evidence
Sau khi hoàn thành, hãy cung cấp hướng dẫn demo database:
Cách chạy migration. Cách chạy seed data. Cách chạy web app. Cách mở Prisma Studio. Bảng nào cần mở khi demo. Thao tác nào trên UI sẽ thay đổi bảng nào trong database.
Các demo evidence bắt buộc:
Patient book appointment → bảng Appointment có record mới. Patient reschedule → Appointment cập nhật date/time/status. Patient cancel → Appointment status thành Cancelled. Doctor update status → Appointment status thay đổi. Doctor view patient → Patient được truy xuất thông qua Appointment. Doctor view medical record → MedicalRecord được truy xuất theo patientId.

## 22. Output Evidence
Sau khi hoàn thành, tóm tắt kết quả theo format:
Logic đã thêm. Database schema đã tạo/chỉnh. Migration/seed đã tạo. File đã chỉnh. Requirement đã đáp ứng. Cách chạy project. Cách mở Prisma Studio. Cách test nhanh bằng tay. Phần chưa làm và lý do.
Mục tiêu là để nhóm có bằng chứng trình bày rằng code được triển khai theo spec, requirement và có thể chứng minh bằng database update thật.

## 23. Output Requirements
Sau khi triển khai, cần đảm bảo:
Patient AI Assistant nhập triệu chứng và nhận kết quả được. Patient Appointment search được. Book Appointment tạo được record mới trong database. Reschedule cập nhật được ngày giờ appointment trong database. Cancel đổi status thành Cancelled trong database. Doctor Appointment search được appointment của doctor. Doctor update được appointment status trong database. Doctor Patient chỉ hiển thị bệnh nhân liên quan đến doctor. Doctor xem được thông tin bệnh nhân và bệnh án từ database. Có thể mở Prisma Studio để kiểm tra dữ liệu. Không có login thật, dashboard riêng, Admin hoặc Staff module. UI vẫn dùng tiếng Việt. Project chạy được bằng lệnh dev hiện có.

## 24. Execution Instruction
Hãy chỉnh sửa trực tiếp trong workspace hiện tại.
Không tạo project mới nếu project đã tồn tại. Không hỏi xác nhận từng bước. Không tự thêm cloud database, login thật, AI API thật hoặc module ngoài scope. Không tự browser testing nếu chưa được yêu cầu. Không dùng Playwright/Cypress nếu chưa được yêu cầu.
Sau khi hoàn thành, chỉ tóm tắt ngắn gọn những logic đã thêm, database đã tạo, file đã chỉnh, requirement đã đáp ứng, cách chạy project và cách kiểm tra bằng Prisma Studio.

## 25. Final Prompt to Run
/read docs/01-business-requirements.md /read docs/03-system-design.md /read docs/04-database-spec.md /read DESIGN.md /read AGENTS.md /read DECISIONS.md /inspect
Bạn là senior full-stack implementation agent. Hãy triển khai logic demo và local database cho AI Healthcare Assistant theo đúng tài liệu đã đọc.
Chỉ triển khai cho Patient AI Assistant, Patient Appointment, Doctor Appointment và Doctor Patient.
Yêu cầu bắt buộc:
* Dùng Prisma + SQLite local database.
* Tạo schema, migration, seed data và Prisma client nếu chưa có.
* Các thao tác book appointment, reschedule, cancel và doctor update status phải ghi vào database thật.
* Appointment là entity trung tâm nối Patient, Doctor và Department.
* Doctor chỉ xem bệnh nhân có appointment với mình.
* Có thể mở Prisma Studio để kiểm tra database update khi demo.
Không tạo login thật, dashboard riêng, Admin, Staff, payment, insurance, video call, cloud database, AI diagnosis hoặc prescription.
AI Assistant chỉ đưa lời khuyên chung và gợi ý khoa khám, không chẩn đoán bệnh, không kê đơn thuốc và phải luôn hiển thị disclaimer y tế.
Sau khi hoàn thành, hãy cập nhật DECISIONS.md, ghi requirement mapping, tóm tắt file đã chỉnh, logic đã thêm, database schema/migration/seed đã tạo, cách chạy project và cách demo database bằng Prisma Studio.


