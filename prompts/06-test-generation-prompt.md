 prompts/06-test-generation-prompt.md

## 1. Mục đích tài liệu

Tài liệu này cung cấp prompt chuẩn để AI tạo test case , acceptance test, test data, bug report và demo testing checklist cho dự án AI Healthcare Assistant.

Prompt này được dùng sau khi AI đã được cung cấp các tài liệu requirement, system design, database specification, AI governance và test plan của dự án.

Mục tiêu là giúp AI tạo bộ kiểm thử đúng phạm vi MVP, không tự thêm tính năng ngoài scope và đảm bảo các luồng chính của hệ thống có thể được kiểm thử rõ ràng.

---

## 2. Tài liệu cần feed kèm

Khi sử dụng prompt này, nên cung cấp cho AI các file sau:

## 1. `docs/01-business-requirements.md`
## 2. `docs/03-system-design.md`
## 3. `docs/04-database-spec.md`
## 4. `docs/05-ai-governance.md`
## 5. `docs/06-test-plan.md`
## 6. `AGENTS.md`
## 7. `DESIGN.md`

Nếu thiếu một số tài liệu, AI phải ghi rõ assumption và không được tự mở rộng scope hệ thống.

---

## 3. Scope hệ thống cần test

Hệ thống **AI Healthcare Assistant** trong phạm vi demo/MVP chỉ có 2 role chính:

## 1. **Patient**
## 2. **Doctor**

Hệ thống có 4 module chính:

## 1. **Patient AI Assistant**
## 2. **Patient Appointment**
## 3. **Doctor Appointment**
## 4. **Doctor Patient**

Hệ thống sử dụng **Prisma + SQLite local database** để demo dữ liệu được tạo và cập nhật thật.

`Appointment` là entity trung tâm kết nối:

```text
Patient → Appointment ← Doctor
Appointment → Department
Patient → MedicalRecord
Patient → AIAdvice
```

---

## 4. Requirement cần tạo test

 R01 — Patient Appointment Management

Kiểm thử chức năng Patient quản lý lịch hẹn.

Các chức năng cần test:

- Search/filter appointment.
- Book appointment.
- Reschedule appointment.
- Cancel appointment.
- Kiểm tra dữ liệu được tạo/cập nhật trong bảng `Appointment`.

R02 — Doctor Appointment Management

Kiểm thử chức năng Doctor quản lý appointment thuộc về mình.

Các chức năng cần test:

- Doctor xem danh sách appointment của mình.
- Search/filter appointment.
- Update appointment status.
- Kiểm tra Doctor không thấy appointment của Doctor khác.
- Kiểm tra status được cập nhật trong database.

R03 — Doctor Patient Management

Kiểm thử chức năng Doctor xem bệnh nhân liên quan.

Các chức năng cần test:

- Doctor xem danh sách Patient có appointment với mình.
- Search/filter Patient.
- Xem Patient info.
- Xem appointment history.
- Xem medical record.
- Kiểm tra Doctor không xem được Patient không liên quan.

R04 — Patient AI Assistant

Kiểm thử AI Assistant tiếp nhận triệu chứng và phản hồi an toàn.

Các chức năng cần test:

- Nhập triệu chứng.
- Nhận lời khuyên tham khảo.
- Nhận khoa khám gợi ý.
- Xử lý triệu chứng nguy hiểm.
- Từ chối chẩn đoán bệnh.
- Từ chối kê đơn thuốc.
- Hiển thị disclaimer y tế bắt buộc.

---
## 5. Ngoài phạm vi test

AI không được tạo test cho các chức năng ngoài phạm vi MVP sau:

- Đăng ký tài khoản.
- Đăng nhập thật.
- Guest role.
- Admin module.
- Staff module.
- Doctor Scheduling module riêng.
- Tạo lịch làm việc phức tạp cho bác sĩ.
- Slot management phức tạp.
- Payment.
- Insurance.
- Video call.
- Cloud database.
- AI chẩn đoán bệnh thật.
- AI kê đơn thuốc.
- Production deployment.
- Phân quyền authentication production.

Nếu cần kiểm thử quyền truy cập, chỉ kiểm thử ở mức logic demo, ví dụ:

- Doctor chỉ thấy appointment thuộc về mình.
- Doctor chỉ thấy Patient có appointment với mình.
- Doctor không thấy MedicalRecord của Patient không liên quan.

---

## 6. Nguyên tắc bắt buộc khi tạo test

AI phải tuân thủ các nguyên tắc sau:

## 1. Không tự thêm tính năng ngoài requirement.
## 2. Không tạo test cho login thật, Admin, Staff, Guest hoặc Doctor Scheduling.
## 3. Test case phải cụ thể, có thể chạy thủ công hoặc chuyển thành automated test.
## 4. Mỗi test case phải có đầy đủ:
   - Test Case ID
   - Requirement ID
   - Title
   - Priority
   - Pre-condition
   - Test data
   - Steps
   - Expected result
   - Type
## 5. Phải có test cho happy path, negative path và edge case.
## 6. Với các flow ghi dữ liệu, phải có expected result liên quan đến database.
## 7. Với AI Assistant, bắt buộc kiểm tra:
   - AI không chẩn đoán bệnh.
   - AI không kê đơn thuốc.
   - AI không thay thế bác sĩ.
   - AI cảnh báo cấp cứu khi có triệu chứng nguy hiểm.
   - AI luôn hiển thị disclaimer y tế.
## 8. Với dữ liệu bệnh nhân, phải kiểm tra:
   - Doctor chỉ thấy Patient có appointment với mình.
   - Doctor không thấy MedicalRecord của Patient không liên quan.
## 9. Nếu requirement chưa rõ, AI phải ghi rõ assumption thay vì tự suy diễn.
## 10. Nếu dùng Prisma + SQLite, nên có bước kiểm tra bằng Prisma Studio.

---

## 7. Disclaimer y tế chuẩn cần kiểm tra

Mọi phản hồi liên quan đến triệu chứng sức khỏe phải hiển thị disclaimer sau:

> “Lưu ý: Đây là thông tin tham khảo tự động hỗ trợ điều hướng khoa khám. Để có chẩn đoán chính xác và phác đồ điều trị phù hợp, xin vui lòng đặt lịch hẹn trực tiếp với bác sĩ chuyên khoa.”

AI không được tự sửa, rút gọn hoặc thay disclaimer bằng câu khác nếu tài liệu governance yêu cầu dùng nguyên văn.

---

## 8. Prompt tạo test case đầy đủ

```md
Bạn là QA Engineer cho dự án AI Healthcare Assistant.

Nhiệm vụ của bạn là tạo bộ test case dựa trên requirement và tài liệu được cung cấp.

## 1. Bối cảnh hệ thống

AI Healthcare Assistant là hệ thống demo/MVP hỗ trợ quy trình khám bệnh cơ bản giữa bệnh nhân và bác sĩ.

Hệ thống có 2 role chính:

## 1. Patient:
   - Dùng AI Assistant.
   - Tìm kiếm appointment.
   - Đặt lịch khám.
   - Đổi lịch khám.
   - Hủy lịch khám.

## 2. Doctor:
   - Xem appointment thuộc về mình.
   - Tìm kiếm appointment.
   - Cập nhật trạng thái appointment.
   - Xem thông tin bệnh nhân có appointment với mình.
   - Xem medical record liên quan.

Hệ thống không có login thật, Guest, Admin, Staff, payment, insurance, video call hoặc Doctor Scheduling module riêng.

Database demo dùng Prisma + SQLite local database. Appointment là entity trung tâm nối Patient, Doctor và Department.

## 2. Requirement cần test

Tạo test cho 4 nhóm requirement:

## 1. R01 — Patient Appointment Management:
   Patient search, book, reschedule và cancel appointment.

## 2. R02 — Doctor Appointment Management:
   Doctor search appointment, xem appointment của mình và update appointment status.

## 3. R03 — Doctor Patient Management:
   Doctor xem patient info, appointment history và medical record của bệnh nhân có appointment với mình.

## 4. R04 — Patient AI Assistant:
   AI tiếp nhận triệu chứng, gợi ý khoa khám, đưa lời khuyên chung, không chẩn đoán, không kê đơn và hiển thị disclaimer y tế.

## 3. Yêu cầu bắt buộc

## 1. Không tự thêm tính năng ngoài requirement.
## 2. Không tạo test cho login thật, Admin, Staff, Guest hoặc Doctor Scheduling riêng.
## 3. Mỗi test case phải có đầy đủ:
   - Test Case ID
   - Requirement ID
   - Title
   - Priority
   - Pre-condition
   - Test data
   - Steps
   - Expected result
   - Type: Unit / Integration / UI / Acceptance / Security / Safety / Validation
## 4. Phải có test cho happy path, negative path và edge case.
## 5. Với các flow ghi dữ liệu, phải có expected result liên quan đến database.
## 6. Với R04, phải kiểm tra:
   - AI không chẩn đoán bệnh.
   - AI không kê đơn thuốc.
   - AI không thay thế bác sĩ.
   - AI khuyến nghị cấp cứu khi có triệu chứng nguy hiểm.
   - AI hiển thị disclaimer y tế chuẩn.
## 7. Với R03, phải kiểm tra Doctor không xem được Patient không liên quan.
## 8. Nếu thiếu thông tin kỹ thuật, ghi rõ assumption.

## 4. Output format

# Test Suite: [Tên module]

## 1. Assumptions
Liệt kê các giả định nếu requirement chưa nói rõ.

## 2. Test Case Summary

| ID | Requirement | Title | Priority | Type |
|---|---|---|---|---|

## 3. Detailed Test Cases

### TC-[REQ]-[number]: [Title]

- Requirement: Rxx
- Priority: High / Medium / Low
- Type: Unit / Integration / UI / Acceptance / Security / Safety / Validation
- Pre-condition:
- Test data:
- Steps:
## 1. ...
## 2. ...
## 3. ...
- Expected result:
  - ...
  - ...

## 4. Database Verification
Liệt kê bảng cần kiểm tra trong Prisma Studio nếu có.

## 5. Edge Cases
Liệt kê các edge case quan trọng.

## 6. Regression Checklist
Liệt kê checklist cần chạy lại sau khi sửa bug hoặc refactor.

## 7. Risk Notes
Nêu các rủi ro kiểm thử, đặc biệt là rủi ro dữ liệu bệnh nhân và an toàn AI.

## 5. Input cần xử lý

Dưới đây là requirement hoặc module cần tạo test:

[PASTE REQUIREMENT OR MODULE DESCRIPTION HERE]
```

---

## 9. Prompt tạo acceptance test bằng Gherkin

```md
Bạn là QA Engineer. Hãy tạo acceptance test bằng Gherkin cho dự án AI Healthcare Assistant.

## 1. Requirement cần kiểm thử

## 1. R01 — Patient Appointment Management
## 2. R02 — Doctor Appointment Management
## 3. R03 — Doctor Patient Management
## 4. R04 — Patient AI Assistant

## 2. Yêu cầu bắt buộc

## 1. Mỗi requirement có ít nhất 3 scenario.
## 2. Mỗi requirement phải có happy path, negative path và edge case.
## 3. Với R01, cần có scenario cho book, reschedule và cancel appointment.
## 4. Với R02, cần có scenario cho Doctor xem appointment của mình và update status.
## 5. Với R03, cần có scenario cho Doctor xem Patient liên quan và không xem Patient không liên quan.
## 6. Với R04, bắt buộc có scenario kiểm tra:
   - AI không chẩn đoán.
   - AI không kê đơn.
   - AI khuyến nghị cấp cứu với triệu chứng nguy hiểm.
   - AI hiển thị disclaimer.
## 7. Gherkin phải dễ hiểu cho business stakeholder.
## 8. Không dùng thông tin y khoa như một kết luận chẩn đoán.
## 9. Không tạo scenario cho login thật, Admin, Staff, Guest hoặc Doctor Scheduling.

## 3. Output format

# Acceptance Tests

## 1. R01 — Patient Appointment Management

~~~gherkin
Feature: Patient Appointment Management

Scenario: Patient books a new appointment successfully
Given ...
When ...
Then ...
~~~

## 2. R02 — Doctor Appointment Management

~~~gherkin
Feature: Doctor Appointment Management

Scenario: Doctor updates appointment status successfully
Given ...
When ...
Then ...
~~~

## 3. R03 — Doctor Patient Management

~~~gherkin
Feature: Doctor Patient Management

Scenario: Doctor views patient records related to their appointments
Given ...
When ...
Then ...
~~~

## 4. R04 — Patient AI Assistant

~~~gherkin
Feature: Patient AI Assistant

Scenario: AI gives safe informational guidance
Given ...
When ...
Then ...
~~~
```

---

## 10. Prompt tạo test data mẫu

```md
Bạn là QA Engineer. Hãy tạo test data mẫu cho dự án AI Healthcare Assistant.

## 1. Bối cảnh dữ liệu

Hệ thống demo dùng Prisma + SQLite local database.

Các entity chính gồm:

## 1. Patient
## 2. Doctor
## 3. Department
## 4. Appointment
## 5. MedicalRecord
## 6. AIAdvice nếu cần

Appointment là entity trung tâm nối Patient, Doctor và Department.

## 2. Nhóm dữ liệu cần tạo

## 1. Patient:
   - Tên bệnh nhân
   - Tuổi
   - Giới tính
   - Email
   - Số điện thoại giả
   - Ghi chú demo

## 2. Department:
   - Nội tổng quát
   - Tim mạch
   - Da liễu
   - Thần kinh
   - Nhi khoa
   - Tai mũi họng
   - Cơ xương khớp

## 3. Doctor:
   - Tên bác sĩ
   - Department
   - Kinh nghiệm
   - Bio ngắn
   - Available time dạng mô phỏng

## 4. Appointment:
   - Patient
   - Doctor
   - Department
   - Ngày
   - Giờ
   - Status: Pending, Confirmed, Rescheduled, In Progress, Completed, Cancelled, No-show
   - Symptoms
   - Note

## 5. MedicalRecord:
   - Patient
   - Symptoms
   - Past history
   - Doctor notes
   - Created date

## 6. Symptom checker input:
   - Triệu chứng nhẹ
   - Triệu chứng thiếu thông tin
   - Triệu chứng nguy hiểm
   - Yêu cầu kê đơn thuốc
   - Triệu chứng cần gợi ý từng khoa khám

## 3. Ràng buộc dữ liệu

## 1. Dữ liệu phải là dữ liệu giả.
## 2. Không dùng thông tin cá nhân thật.
## 3. Không tạo Admin, Staff, Guest hoặc user account login thật.
## 4. Dữ liệu phải đủ để test happy path, negative path và edge case.
## 5. Dữ liệu phải giúp test được:
   - Patient book appointment.
   - Patient reschedule appointment.
   - Patient cancel appointment.
   - Doctor update appointment status.
   - Doctor view related Patient.
   - Doctor view MedicalRecord.
   - AI Assistant suggest Department.

## 4. Output format

Trả kết quả bằng Markdown table, chia theo từng nhóm dữ liệu.
```

---

## 11. Prompt tạo bug report từ lỗi phát hiện

```md
Bạn là QA Engineer. Hãy chuyển thông tin lỗi dưới đây thành bug report rõ ràng cho dự án AI Healthcare Assistant.

## 1. Thông tin lỗi đầu vào

- Module bị lỗi: [Patient Appointment / Doctor Appointment / Doctor Patient / AI Assistant / Database / UI]
- Requirement liên quan: [R01 / R02 / R03 / R04]
- Mô tả lỗi: [PASTE BUG DESCRIPTION]
- Kết quả thực tế: [PASTE ACTUAL RESULT]
- Kết quả mong đợi: [PASTE EXPECTED RESULT]
- Steps to reproduce:
## 1. ...
## 2. ...
## 3. ...
- Evidence/Screenshot/Log nếu có: [PASTE HERE]
- Database evidence nếu có: [PASTE HERE]

## 2. Yêu cầu bug report

Bug report phải có:

## 1. Bug ID
## 2. Title
## 3. Module
## 4. Requirement liên quan
## 5. Severity
## 6. Priority
## 7. Environment
## 8. Steps to reproduce
## 9. Actual result
## 10. Expected result
## 11. Evidence
## 12. Database evidence nếu có
## 13. Possible root cause nếu có
## 14. Suggested test to verify fix

## 3. Output format

# Bug Report

## 1. Bug Summary

## 2. Module and Requirement

## 3. Environment

## 4. Steps to Reproduce

## 5. Actual Result

## 6. Expected Result

## 7. Severity and Priority

## 8. Evidence

## 9. Database Evidence

## 10. Possible Root Cause

## 11. Suggested Verification Test
```

---

## 12. Prompt tạo checklist test nhanh trước demo

```md
Bạn là QA Engineer. Hãy tạo checklist test nhanh trước demo cho dự án AI Healthcare Assistant.

## 1. Scope demo

Hệ thống có 4 module:

## 1. Patient AI Assistant
## 2. Patient Appointment
## 3. Doctor Appointment
## 4. Doctor Patient

Database dùng Prisma + SQLite. Nhóm cần demo được dữ liệu thay đổi trong Prisma Studio.

## 2. Yêu cầu checklist

Checklist cần ngắn gọn, dễ chạy thủ công, tập trung vào flow demo chính:

## 1. Patient nhập triệu chứng và nhận gợi ý khoa khám.
## 2. Patient book appointment.
## 3. Patient reschedule appointment.
## 4. Patient cancel appointment.
## 5. Doctor update appointment status.
## 6. Doctor xem Patient liên quan.
## 7. Doctor xem MedicalRecord.
## 8. Kiểm tra dữ liệu thay đổi trong Prisma Studio.
## 9. Kiểm tra AI không chẩn đoán/kê đơn.
## 10. Kiểm tra UI không có login thật, Admin, Staff hoặc dashboard thừa.

## 3. Output format

# Demo Testing Checklist

## 1. Patient AI Assistant
- [ ] ...

## 2. Patient Appointment
- [ ] ...

## 3. Doctor Appointment
- [ ] ...

## 4. Doctor Patient
- [ ] ...

## 5. Database Evidence
- [ ] ...

## 6. AI Safety
- [ ] ...

## 7. Final Sign-off
- [ ] ...
```

---

## 13. Ghi chú sử dụng

## 1. Dùng prompt ở mục 8 khi cần tạo test case đầy đủ cho một module.
## 2. Dùng prompt ở mục 9 khi cần viết acceptance test bằng Gherkin.
## 3. Dùng prompt ở mục 10 khi cần tạo test data mẫu.
## 4. Dùng prompt ở mục 11 khi phát hiện lỗi và cần chuẩn hóa bug report.
## 5. Dùng prompt ở mục 12 trước khi quay video demo hoặc trình bày.
6. Khi AI trả kết quả, người dùng cần kiểm tra lại với requirement thật để tránh test bị lệch phạm vi.
7. Không dùng prompt này để tạo test cho Admin, Staff, login thật hoặc Doctor Scheduling nếu các module đó không nằm trong scope hiện tại.

