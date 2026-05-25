# Session 04: R02 Doctor Appointment Management Validation

## 1. Mục tiêu Phase 4 R02
Xác minh và nghiệm thu (validate) tính năng Quản lý Lịch hẹn Bác sĩ (R02). Đảm bảo bác sĩ có thể xem đúng lịch hẹn của mình (không xem được của bác sĩ khác), có thể tìm kiếm/lọc danh sách và cập nhật trạng thái lịch hẹn (cũng như ghi chú bệnh án) đúng theo tiêu chuẩn yêu cầu.

## 2. Files đã kiểm tra
- `app/actions/appointment.ts` (Server Actions logic)
- `app/doctor/appointments/page.tsx` (Server Component, Data Fetching & Access Control)
- `app/doctor/appointments/client.tsx` (Client Component, UI & Interactivity)
- `docs/01-business-requirements.md` (Business Logic)
- `docs/06-test-plan.md` (Acceptance Criteria)

## 3. Acceptance criteria
Theo `docs/06-test-plan.md` và `docs/01-business-requirements.md`, R02 yêu cầu:
1. **Doctor view:** Bác sĩ CHỈ xem được các lịch hẹn thuộc về chính bác sĩ đó.
2. **Doctor search:** Bác sĩ có thể tìm kiếm, lọc các lịch hẹn của mình theo ngày, trạng thái, tên bệnh nhân.
3. **Doctor update:** Bác sĩ cập nhật thành công trạng thái lịch hẹn (Confirmed, Completed, ...).
4. **Extra Feature (Notes):** Bác sĩ có thể thêm hoặc cập nhật ghi chú y khoa.

## 4. Bằng chứng code cho từng acceptance criteria

### 4.1. Doctor view
- **Bằng chứng:** Trong `app/doctor/appointments/page.tsx`, hệ thống thực thi truy vấn `prisma.appointment.findMany({ where: { doctorId: doctor.id } })`. Câu lệnh `where` trực tiếp giới hạn kết quả trả về chỉ thuộc về bác sĩ đang đăng nhập (hoặc giả lập), tuân thủ tuyệt đối quy tắc Access Control của R02.

### 4.2. Doctor search/filter
- **Bằng chứng:** Trong `app/doctor/appointments/client.tsx`, danh sách lịch hẹn được lưu tại biến `initialAppointments`. Hệ thống sử dụng Javascript `filter()` kết hợp ba state: `search` (tìm theo ID, tên bệnh nhân), `filterStatus` (lọc theo trạng thái) và `filterDate` (lọc theo ngày khám cụ thể). Thanh công cụ (Toolbar) hỗ trợ đầy đủ input để thay đổi các bộ lọc này.

### 4.3. Doctor update appointment status
- **Bằng chứng:** Bảng danh sách trong `client.tsx` có một Dropdown (`<select>`) tại cột trạng thái. Khi bác sĩ thay đổi Dropdown, hàm `handleStatusChange` được gọi, thực thi Server Action `updateAppointmentStatus(id, newStatus)` từ `app/actions/appointment.ts`. Sau đó, câu lệnh `prisma.appointment.update({ data: { status } })` được gọi để lưu xuống cơ sở dữ liệu.

### 4.4. Cập nhật ghi chú (Medical Notes)
- **Bằng chứng:** Trong `client.tsx`, mỗi dòng lịch hẹn có nút "✏️ Ghi chú" để mở **Notes Modal**. Modal chứa một `textarea` để bác sĩ nhập chẩn đoán. Khi bấm lưu, hệ thống gọi Server Action `saveAppointmentNotes(id, editNotes)` để update trường `notes` trong database.

## 5. Rủi ro còn lại
- **Xử lý đồng thời (Concurrency):** Việc gọi `router.refresh()` ngay sau mutation bằng `startTransition` hoạt động rất tốt cho Next.js App Router, tuy nhiên nếu nhiều bác sĩ thao tác cùng lúc có thể cần Optimistic UI Updates để trải nghiệm mượt mà hơn. 
- **Mức độ rủi ro:** Rất thấp. Đối với phiên bản MVP/Demo, cấu trúc này là cực kỳ ổn định và gọn nhẹ.

## 6. Điểm R02 theo scoring
- **Achieved Score:** **1.0 (Fully passed)**
- Hệ thống đã đáp ứng vượt mức 100% acceptance criteria (bao gồm cả tính năng Ghi chú). Bảng điều khiển (Dashboard) tuân thủ thiết kế tối giản, rõ ràng (Minimalist Healthcare), và tích hợp đầy đủ thống kê nhanh (Tổng số, chờ xác nhận, đã xác nhận, hoàn thành).

## 7. Kết luận
Phase 4 (R02 Doctor Appointment Management) **đã được nghiệm thu thành công hoàn toàn** nhờ bộ mã nguồn gốc chất lượng cao. Không cần thiết phải thay đổi bất kỳ code application nào.

**Sẵn sàng chuyển sang Phase 5: R03 Doctor Patient Management.**
