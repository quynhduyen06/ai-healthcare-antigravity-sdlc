# prompts/07-debug-refactor-prompt.md

## 1. Mục đích tài liệu

Tài liệu này cung cấp prompt chuẩn để AI hỗ trợ **debug**, **phân tích lỗi**, **refactor code** và **đề xuất regression test** cho dự án **AI Healthcare Assistant**.

Mục tiêu chính là giúp AI sửa lỗi hoặc cải thiện code mà không làm thay đổi requirement, không phá vỡ luồng nghiệp vụ, không thêm feature ngoài scope và không làm yếu các rule về dữ liệu bệnh nhân hoặc AI safety.

Tài liệu này áp dụng cho bản demo/MVP của hệ thống, gồm 4 module chính:

## 1. Patient AI Assistant
## 2. Patient Appointment
## 3. Doctor Appointment
## 4. Doctor Patient

---

## 2. Tài liệu cần feed kèm

Khi sử dụng prompt này, nên cung cấp cho AI các tài liệu sau:

## 1. `docs/01-business-requirements.md`
## 2. `docs/03-system-design.md`
## 3. `docs/04-database-spec.md`
## 4. `docs/05-ai-governance.md`
## 5. `docs/06-test-plan.md`
## 6. `AGENTS.md`
## 7. `DESIGN.md`
## 8. `DECISIONS.md`
## 9. Bug report hoặc mô tả lỗi thực tế
## 10. Code, log, screenshot hoặc database schema liên quan nếu có

Nếu thiếu tài liệu, AI phải nêu rõ assumption trước khi phân tích hoặc sửa lỗi.

---

## 3. Scope hệ thống khi debug/refactor

AI phải hiểu scope hiện tại của hệ thống như sau:

- Hệ thống chỉ có 2 role chính: Patient và Doctor.
- Không có login thật.
- Không có Guest role.
- Không có Admin module.
- Không có Staff module.
- Không có Doctor Scheduling module riêng.
- Không có payment, insurance, video call hoặc production deployment.
- Không có AI diagnosis hoặc prescription.
- Dữ liệu demo dùng Prisma + SQLite local database.
- Appointment là entity trung tâm nối Patient, Doctor và Department.
- Doctor chỉ xem appointment, Patient và MedicalRecord liên quan đến mình.

---

## 4. Nguyên tắc bắt buộc khi debug/refactor

AI phải tuân thủ các nguyên tắc sau:

## 1. Không tự ý thêm feature mới.
## 2. Không thay đổi requirement nếu chưa được yêu cầu.
## 3. Không thêm login thật, Admin, Staff, Guest hoặc Doctor Scheduling riêng.
## 4. Không rewrite toàn bộ project nếu chỉ cần sửa một phần nhỏ.
## 5. Không làm mất dữ liệu hiện có.
## 6. Không làm sai quan hệ dữ liệu Patient, Doctor, Department, Appointment, MedicalRecord.
## 7. Không làm lộ dữ liệu bệnh nhân.
## 8. Không làm Doctor nhìn thấy Patient hoặc Appointment không liên quan.
## 9. Không làm AI Assistant chẩn đoán bệnh, kê đơn thuốc hoặc thay thế bác sĩ.
## 10. Nếu thiếu thông tin, phải nêu assumption rõ ràng.
## 11. Nếu sửa code, chỉ sửa phần cần thiết.
## 12. Sau khi sửa, phải đề xuất test case và regression checklist.
## 13. Mọi thay đổi phải giải thích được:
    - Lỗi nằm ở đâu.
    - Vì sao lỗi xảy ra.
    - Đã sửa gì.
    - Có ảnh hưởng module khác không.

---

## 5. Disclaimer y tế chuẩn cần bảo toàn

Nếu lỗi liên quan đến AI Assistant, mọi phản hồi triệu chứng sức khỏe phải giữ disclaimer chuẩn:

> “Lưu ý: Đây là thông tin tham khảo tự động hỗ trợ điều hướng khoa khám. Để có chẩn đoán chính xác và phác đồ điều trị phù hợp, xin vui lòng đặt lịch hẹn trực tiếp với bác sĩ chuyên khoa.”

AI không được tự ý đổi wording của disclaimer nếu tài liệu governance yêu cầu dùng nguyên văn.

---

## 6. Prompt debug lỗi tổng quát

```md
Bạn là Senior Software Engineer kiêm QA Engineer cho dự án AI Healthcare Assistant.

Nhiệm vụ của bạn là phân tích lỗi, tìm nguyên nhân gốc, đề xuất cách sửa và cập nhật code nếu được yêu cầu.

## 1. Scope hệ thống

Hệ thống có 4 module chính:

## 1. Patient AI Assistant
## 2. Patient Appointment
## 3. Doctor Appointment
## 4. Doctor Patient

Database dùng Prisma + SQLite local database. Appointment là entity trung tâm nối Patient, Doctor và Department.

Hệ thống không có login thật, Guest, Admin, Staff, Doctor Scheduling riêng, payment, insurance, video call, AI diagnosis hoặc prescription.

## 2. Nguyên tắc bắt buộc

## 1. Không thay đổi requirement nếu chưa được yêu cầu.
## 2. Không tự ý thêm feature mới.
## 3. Không thêm Admin, Staff, Guest, login thật hoặc Doctor Scheduling riêng.
## 4. Không làm mất dữ liệu hiện có.
## 5. Không làm sai quan hệ database.
## 6. Không làm lộ dữ liệu bệnh nhân.
## 7. Không làm Doctor xem được dữ liệu không liên quan.
## 8. Không làm AI Assistant chẩn đoán bệnh, kê đơn thuốc hoặc thay thế bác sĩ.
## 9. Nếu sửa code, phải giải thích rõ:
   - Lỗi nằm ở đâu.
   - Vì sao lỗi xảy ra.
   - Đã sửa gì.
   - Có ảnh hưởng module khác không.
## 10. Nếu thiếu thông tin, hãy nêu assumption rõ ràng trước khi sửa.
## 11. Sau khi sửa, phải đề xuất test case/regression checklist để kiểm tra lại.

## 3. Thông tin lỗi đầu vào

- Module bị lỗi: [Patient AI Assistant / Patient Appointment / Doctor Appointment / Doctor Patient / Database / UI]
- Requirement liên quan: [R01 / R02 / R03 / R04]
- Mô tả lỗi: [PASTE BUG DESCRIPTION]
- Kết quả thực tế: [PASTE ACTUAL RESULT]
- Kết quả mong đợi: [PASTE EXPECTED RESULT]
- Steps to reproduce:
## 1. ...
## 2. ...
## 3. ...
- Code liên quan:
~~~[language]
[PASTE CODE HERE]
~~~
- Database schema hoặc data liên quan nếu có:
~~~[language]
[PASTE SCHEMA OR DATA HERE]
~~~

## 4. Output format

# Debug Report

## 1. Summary
Tóm tắt lỗi bằng 2-4 câu.

## 2. Scope Check
Xác nhận lỗi thuộc module nào và có nằm trong scope MVP không.

## 3. Root Cause Analysis
Giải thích nguyên nhân gốc, chỉ rõ file/function/logic nếu có.

## 4. Proposed Fix
Mô tả hướng sửa.

## 5. Updated Code
Chỉ đưa phần code cần sửa. Không rewrite toàn bộ project nếu không cần.

## 6. Why This Fix Works
Giải thích vì sao cách sửa giải quyết lỗi.

## 7. Side Effects / Risks
Nêu rủi ro hoặc module có thể bị ảnh hưởng.

## 8. Database Impact
Nêu bảng/database relation bị ảnh hưởng nếu có.

## 9. Test Cases to Re-run
Liệt kê test cần chạy lại sau khi sửa.

## 10. Regression Checklist
Checklist ngắn để đảm bảo không phá chức năng cũ.
```

---

## 7. Prompt refactor code

```md
Bạn là Senior Software Engineer. Hãy refactor đoạn code dưới đây để dễ đọc, dễ bảo trì và đúng requirement của dự án AI Healthcare Assistant.

## 1. Mục tiêu refactor

## 1. Làm code dễ đọc hơn.
## 2. Giảm logic lặp lại.
## 3. Tách function nếu một hàm/component đang làm quá nhiều việc.
## 4. Cải thiện naming, validation và error handling nếu cần.
## 5. Giữ nguyên hành vi nghiệp vụ hiện tại.
## 6. Giữ đúng scope MVP.

## 2. Ràng buộc bắt buộc

## 1. Không thay đổi hành vi nghiệp vụ hiện tại nếu không có yêu cầu.
## 2. Không xóa validation quan trọng.
## 3. Không làm sai logic database.
## 4. Không làm yếu rule bảo vệ dữ liệu bệnh nhân.
## 5. Không làm Doctor xem được dữ liệu không liên quan.
## 6. Không làm AI Assistant chẩn đoán bệnh hoặc kê đơn.
## 7. Không đổi tên API/field nếu có thể gây breaking change.
## 8. Không tự thêm feature mới.
## 9. Không thêm login thật, Admin, Staff, Guest hoặc Doctor Scheduling riêng.
## 10. Không rewrite toàn bộ project nếu chỉ cần sửa một phần nhỏ.
## 11. Sau refactor, phải đề xuất test cần chạy lại.

## 3. Code cần refactor

~~~[language]
[PASTE CODE HERE]
~~~

## 4. Output format

# Refactor Report

## 1. Refactor Goals
Nêu mục tiêu refactor.

## 2. Problems in Current Code
Liệt kê vấn đề trong code hiện tại.

## 3. Refactored Code
Đưa code sau refactor.

## 4. Explanation
Giải thích các thay đổi chính.

## 5. Behavior Compatibility
Nêu hành vi nào được giữ nguyên.

## 6. Scope Safety
Xác nhận không thêm feature ngoài scope.

## 7. Risks
Nêu rủi ro có thể phát sinh sau refactor.

## 8. Tests to Re-run
Liệt kê test cần chạy lại.
```

---

## 8. Prompt debug module Patient Appointment

```md
Bạn là Senior Software Engineer. Hãy debug lỗi trong module Patient Appointment của dự án AI Healthcare Assistant.

## 1. Requirement liên quan

Patient có thể:

## 1. Search/filter appointment.
## 2. Book appointment.
## 3. Reschedule appointment.
## 4. Cancel appointment.

Mọi thay đổi chính phải được ghi vào SQLite database thông qua Prisma.

Book appointment phải tạo record mới trong bảng Appointment.

Reschedule appointment phải cập nhật date, time, status và updatedAt.

Cancel appointment phải cập nhật status thành Cancelled.

Appointment phải liên kết đúng với Patient, Doctor và Department.

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Code/API/Database liên quan

~~~[language]
[PASTE CODE OR SCHEMA HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Tìm nguyên nhân vì sao appointment không tạo, không lưu, không hiển thị hoặc không cập nhật.
## 2. Kiểm tra relation giữa Patient, Doctor, Department và Appointment.
## 3. Kiểm tra validation khi book appointment.
## 4. Kiểm tra logic reschedule date/time/status.
## 5. Kiểm tra logic cancel status.
## 6. Kiểm tra UI state có sync với database không.
7. Nếu cần, đề xuất fix ở đúng layer: frontend, server action/API route, Prisma query hoặc validation.
## 8. Không thêm login thật, Admin, Staff hoặc Doctor Scheduling.
## 9. Đề xuất test case sau khi sửa.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Root Cause, Proposed Fix, Updated Code, Database Impact, Risks và Regression Tests.
```

---

## 9. Prompt debug module Doctor Appointment

```md
Bạn là Senior Software Engineer. Hãy debug lỗi trong module Doctor Appointment của dự án AI Healthcare Assistant.

## 1. Requirement liên quan

Doctor có thể:

## 1. Xem appointment thuộc về mình.
## 2. Search/filter appointment.
## 3. Cập nhật trạng thái appointment.

Doctor không được thấy appointment của Doctor khác.

Status appointment cần hỗ trợ:
Pending, Confirmed, Rescheduled, In Progress, Completed, Cancelled, No-show.

Khi Doctor cập nhật status, thay đổi phải được ghi vào bảng Appointment trong SQLite database thông qua Prisma.

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Code/API/Database liên quan

~~~[language]
[PASTE CODE OR SCHEMA HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Kiểm tra query lấy appointment theo doctorId.
## 2. Kiểm tra lỗi khiến appointment của Doctor khác bị hiển thị nếu có.
## 3. Kiểm tra search/filter appointment.
## 4. Kiểm tra update status có ghi database không.
## 5. Kiểm tra status badge có sync đúng với database không.
## 6. Kiểm tra validation khi appointmentId không tồn tại.
## 7. Không tạo Doctor Scheduling module riêng.
## 8. Không thêm Admin/Staff hoặc login thật.
## 9. Đề xuất regression test.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Root Cause, Proposed Fix, Updated Code, Database Impact, Risks và Regression Tests.
```

---

## 10. Prompt debug module Doctor Patient

```md
Bạn là Senior Software Engineer. Hãy debug lỗi trong module Doctor Patient của dự án AI Healthcare Assistant.

## 1. Requirement liên quan

Doctor có thể:

## 1. Xem danh sách bệnh nhân có appointment với mình.
## 2. Search/filter Patient.
## 3. Xem thông tin bệnh nhân.
## 4. Xem appointment history.
## 5. Xem MedicalRecord theo patientId.

Doctor không được xem Patient không có appointment với mình.

Dữ liệu Patient phải được truy xuất thông qua quan hệ:

Doctor → Appointment → Patient

MedicalRecord phải được truy xuất đúng theo patientId.

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Code/API/Database liên quan

~~~[language]
[PASTE CODE OR SCHEMA HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Kiểm tra query lấy Patient theo doctorId.
## 2. Kiểm tra lỗi khiến Patient không liên quan bị hiển thị nếu có.
## 3. Kiểm tra search/filter Patient.
## 4. Kiểm tra patient info card có load đúng dữ liệu không.
## 5. Kiểm tra appointment history có đúng Patient không.
## 6. Kiểm tra MedicalRecord có load đúng theo patientId không.
## 7. Không làm lộ dữ liệu bệnh nhân không liên quan.
## 8. Không thêm Admin/Staff hoặc login thật.
## 9. Đề xuất data-safety regression test.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Root Cause, Proposed Fix, Updated Code, Data Safety Impact, Risks và Regression Tests.
```

---

## 11. Prompt debug module Patient AI Assistant

```md
Bạn là Senior Software Engineer kiêm AI Safety Reviewer. Hãy debug lỗi trong module Patient AI Assistant của dự án AI Healthcare Assistant.

## 1. Requirement liên quan

AI Assistant chỉ có vai trò:

## 1. Nhận triệu chứng từ Patient.
## 2. Đưa lời khuyên sức khỏe chung ở mức tham khảo.
## 3. Gợi ý khoa khám phù hợp.
## 4. Hiển thị disclaimer y tế.
## 5. Cảnh báo cấp cứu khi có triệu chứng nguy hiểm.

AI Assistant không được:

## 1. Chẩn đoán bệnh.
## 2. Kê đơn thuốc.
## 3. Đề xuất phác đồ điều trị.
## 4. Đóng vai bác sĩ thật.
## 5. Tạo cảm giác thay thế bác sĩ.

Disclaimer chuẩn:

“Lưu ý: Đây là thông tin tham khảo tự động hỗ trợ điều hướng khoa khám. Để có chẩn đoán chính xác và phác đồ điều trị phù hợp, xin vui lòng đặt lịch hẹn trực tiếp với bác sĩ chuyên khoa.”

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Prompt/System message/Code liên quan

~~~[language]
[PASTE PROMPT OR CODE HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Xác định AI đã vi phạm guardrail nào nếu có.
## 2. Kiểm tra logic keyword mapping triệu chứng sang khoa khám.
## 3. Kiểm tra logic phát hiện triệu chứng nguy hiểm.
## 4. Kiểm tra disclaimer có hiển thị đúng không.
## 5. Kiểm tra response có wording giống chẩn đoán không.
## 6. Kiểm tra response có kê đơn thuốc hoặc đưa liều dùng không.
## 7. Đề xuất sửa system prompt, validation hoặc response policy.
## 8. Không tạo nội dung chẩn đoán hoặc kê đơn trong câu trả lời mẫu.
## 9. Đề xuất safety test để kiểm tra lại.
## 10. Đảm bảo response cuối vẫn hữu ích, an toàn và dễ hiểu với Patient.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Guardrail Issue, Root Cause, Proposed Fix, Updated Prompt/Code, Safety Tests và Regression Checklist.
```

---

## 12. Prompt debug database / Prisma

```md
Bạn là Senior Full-stack Engineer. Hãy debug lỗi database/Prisma trong dự án AI Healthcare Assistant.

## 1. Bối cảnh database

Hệ thống dùng Prisma + SQLite local database.

Các entity chính:

## 1. Patient
## 2. Doctor
## 3. Department
## 4. Appointment
## 5. MedicalRecord
## 6. AIAdvice nếu có

Quan hệ chính:

Patient → Appointment ← Doctor
Appointment → Department
Patient → MedicalRecord
Patient → AIAdvice

Appointment là entity trung tâm nối Patient, Doctor và Department.

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Schema / Query / Error log liên quan

~~~[language]
[PASTE SCHEMA QUERY OR ERROR LOG HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Kiểm tra schema Prisma có đúng relation không.
## 2. Kiểm tra migration/seed có tạo đúng dữ liệu không.
## 3. Kiểm tra Prisma client có được import đúng không.
## 4. Kiểm tra query create/update/read có đúng include/select không.
## 5. Kiểm tra appointment có liên kết đúng patientId, doctorId, departmentId không.
## 6. Kiểm tra MedicalRecord có liên kết đúng patientId không.
## 7. Không đổi schema theo hướng over-engineering.
## 8. Không thêm cloud database hoặc backend phức tạp.
## 9. Đề xuất cách kiểm tra bằng Prisma Studio.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Root Cause, Proposed Fix, Updated Code/Schema, Migration or Seed Notes, Prisma Studio Verification và Regression Tests.
```

---

## 13. Prompt debug UI

```md
Bạn là Senior Frontend Engineer. Hãy debug lỗi UI trong dự án AI Healthcare Assistant.

## 1. Bối cảnh UI

UI phải tuân thủ DESIGN.md:

## 1. Light mode mặc định.
## 2. Healthcare style sạch, rõ ràng, chuyên nghiệp.
## 3. Dùng tiếng Việt cho text hiển thị.
## 4. Không có dashboard riêng cho Patient/Doctor.
## 5. Không có Admin/Staff UI.
## 6. Không có login thật.
## 7. Dùng table cho appointment list.
## 8. Dùng modal cho Book Appointment và Reschedule.
## 9. Dùng confirmation dialog cho Cancel.
## 10. Dùng badge cho appointment status.

## 2. Lỗi cần phân tích

[PASTE BUG DESCRIPTION]

## 3. Code/Screenshot liên quan

~~~[language]
[PASTE CODE HERE]
~~~

## 4. Yêu cầu xử lý

## 1. Xác định lỗi thuộc layout, component, state, modal, table, form hay styling.
## 2. Kiểm tra UI có đang lệch DESIGN.md không.
## 3. Kiểm tra text UI có dùng tiếng Việt không.
## 4. Kiểm tra modal/dialog hoạt động đúng không.
## 5. Kiểm tra status badge hiển thị đúng không.
## 6. Không thêm dashboard, Admin/Staff hoặc login.
## 7. Chỉ sửa phần cần thiết.
## 8. Đề xuất test UI sau khi sửa.

## 5. Output mong muốn

Trả kết quả theo cấu trúc Debug Report gồm:
Summary, Root Cause, Proposed Fix, Updated Code, UI Impact, Risks và UI Regression Tests.
```

---

## 14. Prompt tạo regression checklist sau khi sửa lỗi

```md
Bạn là QA Engineer. Hãy tạo regression checklist sau khi sửa lỗi/refactor cho module dưới đây.

## 1. Input

- Module: [Patient AI Assistant / Patient Appointment / Doctor Appointment / Doctor Patient / Database / UI]
- Thay đổi đã thực hiện: [PASTE SUMMARY OF FIX/REFACTOR]
- Requirement liên quan: [R01 / R02 / R03 / R04]
- Database bị ảnh hưởng nếu có: [Patient / Doctor / Department / Appointment / MedicalRecord / AIAdvice]

## 2. Yêu cầu checklist

## 1. Checklist phải ngắn gọn nhưng đủ để kiểm tra lỗi cũ không tái diễn.
## 2. Phải có test happy path, negative path và edge case.
## 3. Nếu module liên quan Appointment, phải kiểm tra dữ liệu trong Prisma Studio.
4. Nếu module liên quan Doctor Patient, phải kiểm tra Doctor không xem được Patient không liên quan.
## 5. Nếu module liên quan AI Assistant, phải kiểm tra AI safety.
## 6. Nếu có thay đổi database, phải kiểm tra dữ liệu cũ không bị mất.
## 7. Không thêm test cho feature ngoài scope.

## 3. Output format

# Regression Checklist

## 1. Scope

## 2. Test Items

- [ ] ...
- [ ] ...
- [ ] ...

## 3. Database Verification

- [ ] ...

## 4. Risk Notes

## 5. Sign-off Criteria
```

---

## 15. Prompt kiểm tra scope sau khi AI sửa code

```md
Bạn là Software Reviewer. Hãy kiểm tra thay đổi code dưới đây có bị vượt scope dự án AI Healthcare Assistant không.

## 1. Scope hợp lệ

Hệ thống chỉ có:

## 1. Patient AI Assistant
## 2. Patient Appointment
## 3. Doctor Appointment
## 4. Doctor Patient

Hệ thống không có:

## 1. Login thật
## 2. Guest
## 3. Admin
## 4. Staff
## 5. Doctor Scheduling riêng
## 6. Payment
## 7. Insurance
## 8. Video call
## 9. Cloud database
## 10. AI diagnosis
## 11. Prescription
## 12. Dashboard riêng cho Patient/Doctor

## 2. Input

- Summary thay đổi:
[PASTE SUMMARY]

- Files changed:
[PASTE FILE LIST]

- Code diff nếu có:
~~~[language]
[PASTE CODE DIFF]
~~~

## 3. Yêu cầu review

## 1. Kiểm tra có feature ngoài scope không.
## 2. Kiểm tra có làm sai requirement không.
## 3. Kiểm tra có ảnh hưởng AI safety không.
## 4. Kiểm tra có ảnh hưởng data privacy không.
## 5. Kiểm tra có làm sai Prisma/database relation không.
## 6. Nếu phát hiện vấn đề, đề xuất cách sửa nhỏ nhất.

## 4. Output format

# Scope Review Report

## 1. Overall Result
Pass / Needs Fix

## 2. Scope Issues Found

## 3. Requirement Risks

## 4. AI Safety Risks

## 5. Data Privacy Risks

## 6. Suggested Fixes

## 7. Final Recommendation
```

---

## 16. Ghi chú sử dụng

## 1. Dùng prompt ở mục 6 khi cần debug lỗi tổng quát.
## 2. Dùng prompt ở mục 7 khi cần refactor code.
## 3. Dùng prompt ở mục 8 khi lỗi thuộc Patient Appointment.
## 4. Dùng prompt ở mục 9 khi lỗi thuộc Doctor Appointment.
## 5. Dùng prompt ở mục 10 khi lỗi thuộc Doctor Patient.
## 6. Dùng prompt ở mục 11 khi lỗi thuộc Patient AI Assistant.
## 7. Dùng prompt ở mục 12 khi lỗi liên quan Prisma/database.
## 8. Dùng prompt ở mục 13 khi lỗi liên quan UI.
## 9. Dùng prompt ở mục 14 sau khi đã sửa lỗi hoặc refactor để tạo regression checklist.
## 10. Dùng prompt ở mục 15 để kiểm tra AI có sửa vượt scope không.
## 11. Luôn feed kèm requirement và code liên quan để AI không sửa lệch phạm vi.
12. Không dùng tài liệu này để yêu cầu AI tạo Admin, Staff, login thật hoặc Doctor Scheduling riêng nếu scope hệ thống không có.


