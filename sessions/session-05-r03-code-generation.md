# Session 05: R03 Doctor Patient Management - Code Generation

## 1. Mục tiêu
Thực thi bản kế hoạch R03 (tách giao diện tĩnh hiện tại và đấu nối với Database thông qua Prisma) mà không làm ảnh hưởng đến R01/R02.

## 2. Các file đã sửa/tạo
1. **`app/doctor/patients/client.tsx`**:
   - Được đổi tên từ `page.tsx` cũ.
   - Xóa bỏ biến mock data tĩnh `const patients = [...]`.
   - Refactor Component thành `DoctorPatientsClient({ initialPatients })` để nhận dữ liệu động từ Server.
   - Xử lý mượt mà (Graceful Degradation) trường hợp danh sách bệnh nhân rỗng (thêm giao diện Fallback `Chưa chọn bệnh nhân`) thay vì bị crash ứng dụng do lỗi `null`.

2. **`app/doctor/patients/page.tsx`**:
   - Tạo mới file dưới dạng Server Component.
   - Gọi cơ sở dữ liệu để mock phiên đăng nhập của bác sĩ đầu tiên (`prisma.doctor.findFirst()`).
   - Gọi `getDoctorPatients(doctorId)` từ `app/actions/patient.ts` để lấy danh sách các bệnh nhân hợp lệ (Access Control).
   - Truy vấn từng bệnh nhân bằng hàm `getMedicalRecords` và `getPatientHistory` để gộp dữ liệu đầy đủ trả về cho Client Component.

## 3. Quá trình kiểm tra TypeScript
Lệnh đã chạy: `npx tsc --noEmit`
- Các lỗi Type liên quan đến component `client.tsx` (như `selected possibly null`) và `page.tsx` (như `gender` casting type) đã được fix triệt để.
- Các lỗi TS còn lại (`TS5097`) nằm trong các file `app/actions/appointment.ts`, `lib/prisma.ts`, `prisma.config.ts` thuộc phạm vi R01/R02 và file cấu hình chung, do đó cố tình **bỏ qua để đảm bảo không vi phạm scope R03**.

## 4. Xác nhận
- **KHÔNG** sửa bất kỳ file application code nào của các Phase trước (R01/R02).
- **KHÔNG** cài thêm package.
- **KHÔNG** sửa `prisma/schema.prisma`.
- Mọi logic Access Control / Privacy Guard đã được giữ nguyên và tích hợp thành công.
