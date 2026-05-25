# 07. Sprint Plan

## 1. Mục đích tài liệu
Tài liệu này mô tả kế hoạch triển khai dự án **AI Healthcare Assistant** theo mô hình Agile Sprint Breakdown, giúp nhóm định hướng rõ mục tiêu, yêu cầu và đầu ra của mỗi giai đoạn.

## 2. Kế hoạch Sprint (Agile Sprint Breakdown)

### Sprint 1: Documentation, requirement alignment, and repo setup
* **Goal:** Chuẩn hóa toàn bộ tài liệu và thiết lập môi trường phát triển cơ sở.
* **Requirements covered:** N/A (Foundation phase).
* **Main tasks:** Align toàn bộ tài liệu theo R01-R04, setup GitHub repo, cấu hình Next.js, TypeScript, Prisma và SQLite.
* **Expected artifacts:** 15 file Markdown hoàn thiện chuẩn xác, database schema cơ bản.
* **Validation method:** Review tài liệu chéo, đảm bảo lệnh Prisma format/generate chạy không lỗi.

### Sprint 2: R01 Patient Appointment Management
* **Goal:** Cung cấp khả năng quản lý lịch hẹn cho Bệnh nhân.
* **Requirements covered:** R01.
* **Main tasks:** Triển khai tính năng search, book, reschedule, và cancel appointment.
* **Expected artifacts:** Trang UI quản lý lịch hẹn bệnh nhân, các module liên kết Database Patient/Appointment.
* **Validation method:** Thực hiện đầy đủ luồng đặt lịch, đổi lịch, hủy lịch và kiểm chứng bằng Prisma Studio.

### Sprint 3: R02 Doctor Appointment Management
* **Goal:** Cung cấp khả năng quản lý lịch hẹn cho Bác sĩ.
* **Requirements covered:** R02.
* **Main tasks:** Xây dựng danh sách lịch hẹn riêng của bác sĩ, tính năng update status.
* **Expected artifacts:** Trang UI Doctor Appointments, logic cập nhật trạng thái appointment.
* **Validation method:** Bác sĩ cập nhật trạng thái và thay đổi phản ánh tức thì vào database. Đảm bảo bác sĩ không thấy lịch của người khác.

### Sprint 4: R03 Doctor Patient Management
* **Goal:** Bác sĩ có thể theo dõi và xem hồ sơ bệnh án của bệnh nhân.
* **Requirements covered:** R03.
* **Main tasks:** Hiển thị patient information, appointment history và MedicalRecord liên quan.
* **Expected artifacts:** Trang UI Doctor Patients, truy vấn nối Doctor -> Appointment -> Patient -> MedicalRecord.
* **Validation method:** Kiểm tra kỹ tính đóng gói (Access control): Bác sĩ không thể xem hồ sơ bệnh án nếu bệnh nhân đó không có lịch hẹn.

### Sprint 5: R04 Patient AI Assistant and AI governance validation
* **Goal:** Tích hợp bộ phận phân tích triệu chứng AI an toàn.
* **Requirements covered:** R04.
* **Main tasks:** Tích hợp prompt xử lý input triệu chứng, đưa ra lời khuyên/gợi ý khoa khám và áp dụng Disclaimer y tế bắt buộc.
* **Expected artifacts:** Trang UI AI Assistant, prompt engineering rules.
* **Validation method:** Tạo các prompt xấu (ép AI chẩn đoán hoặc kê đơn) để khẳng định AI từ chối và luôn xuất hiện Disclaimer.

### Sprint 6: QA, debugging, metrics, and final report
* **Goal:** Đánh giá chất lượng, tính điểm completion rate và chuẩn bị cho Demo.
* **Requirements covered:** R01, R02, R03, R04.
* **Main tasks:** Chạy bộ Acceptance test, chấm điểm 1.0 / 0.5 / 0, fix các bug cuối và tính toán completion rate.
* **Expected artifacts:** Báo cáo lỗi (Bug reports), bảng điểm Test Plan Scorecard.
* **Validation method:** Completion Rate đạt kỳ vọng cao nhất, hệ thống sẵn sàng deploy/demo cục bộ.
