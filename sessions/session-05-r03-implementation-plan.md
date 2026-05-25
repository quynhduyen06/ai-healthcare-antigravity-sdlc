# Session 05: R03 Doctor Patient Management Implementation Plan

## 1. Yêu cầu R03 (Doctor Patient Management)
Theo tài liệu, R03 có các Acceptance Criteria sau:
* **Doctor view patient info:** Bác sĩ xem được danh sách bệnh nhân và thông tin chi tiết.
* **Doctor view history & records:** Bác sĩ xem được lịch sử khám và hồ sơ bệnh án (Medical Record).
* **Access Control:** Bác sĩ CHỈ được xem thông tin những bệnh nhân đang có lịch hẹn với mình.

## 2. Kiểm tra app hiện tại
* **Routes/Pages:** Đã có `app/doctor/patients/page.tsx`. Tuy nhiên, trang này hiện đang là **Client Component với dữ liệu hardcode tĩnh** (mock data).
* **API/Server Actions:** Đã có `app/actions/patient.ts` cung cấp đầy đủ các hàm truy vấn:
  * `getDoctorPatients(doctorId)` (Access Control chuẩn)
  * `getMedicalRecords(patientId)`
  * `getPatientHistory(patientId, doctorId)` (Access Control chuẩn)
* **UI hiện tại:** Giao diện Patient Dashboard chia 2 cột (Sidebar list + Detail view) rất trực quan, có Tab Hồ sơ y tế / Lịch sử khám. Rất phù hợp với định hướng TasteSkill.

## 3. Gap Analysis cho R03
| Feature | Expected behavior | Current implementation | Missing UI | Missing logic | Missing validation/guard | Risk | Proposed fix |
|---|---|---|---|---|---|---|---|
| **View patient list** | Fetch từ Prisma, chỉ hiển thị BN của bác sĩ. | **Hardcode array (`const patients`)**. | Không | Tích hợp Server Action vào Page. | Không | Cao (UI không hiển thị dữ liệu thật) | Chuyển dữ liệu tĩnh thành Server Component fetching. |
| **View history & record** | Lấy data từ bảng `MedicalRecord` và `Appointment`. | Đang hiển thị mock data. | Không | Gắn data thật từ Prisma vào Client Component. | Không | Cao | Fetch data đồng bộ lúc render hoặc Server Action. |
| **Access Control** | Chỉ lấy BN của bác sĩ. | Action `getDoctorPatients` đã có. | Không | Chưa gọi action. | Không | Thấp | Gọi đúng `doctorId` trong Server Component. |

## 4. Đề xuất Implementation Plan
Để đảm bảo đúng chuẩn Next.js App Router (giống cách R01/R02 đã làm):
1. **Data/query layer:** Giữ nguyên `app/actions/patient.ts`. Các hàm đã chuẩn.
2. **Page/route:**
   - **Tách file:** Đổi tên `app/doctor/patients/page.tsx` hiện tại thành `client.tsx`.
   - **Xóa Hardcode:** Sửa `client.tsx` để nhận tham số `initialPatients` (dữ liệu thật) thay vì mảng mock.
   - **Tạo Server Component:** Viết mới `app/doctor/patients/page.tsx` (Server Component). Lấy `doctor.id`, gọi `getDoctorPatients(doctorId)`, lặp qua danh sách để lấy thêm `getMedicalRecords` và `getPatientHistory` cho từng bệnh nhân.
3. **UI/table/detail view:** Đảm bảo `client.tsx` map đúng dữ liệu (chú ý chuyển đổi định dạng ngày tháng từ Date Object sang String).
4. **Privacy/access guard:** `getPatientHistory` và `getDoctorPatients` đều phải truyền đúng `doctorId` đang giả lập.
5. **Manual acceptance test:** Truy cập giao diện bệnh nhân, kiểm tra danh sách có hiển thị đúng người, đúng lịch sử khám thật.
6. **Session log:** Ghi kết quả vào `sessions/session-05-r03-validation.md`.

## 5. Đề xuất các file có thể cần sửa
- Cần sửa/chia nhỏ: `app/doctor/patients/page.tsx`
- Cần tạo mới: `app/doctor/patients/client.tsx`
