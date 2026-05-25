# 06. Test Plan

## 1. Mục đích tài liệu
Tài liệu này mô tả kế hoạch kiểm thử cho hệ thống **AI Healthcare Assistant** trong phạm vi demo/MVP. Trọng tâm là đảm bảo các luồng chức năng (R01-R04) hoạt động đúng, dữ liệu cập nhật chính xác và AI tuân thủ nghiêm ngặt quy tắc an toàn.

## 2. Tiêu chí nghiệm thu (Acceptance Criteria)

### R01 — Patient Appointment Management
* **Patient search:** Bệnh nhân có thể tìm kiếm các lịch hẹn.
* **Patient book:** Bệnh nhân đặt lịch mới thành công, bản ghi mới được tạo vào bảng Appointment.
* **Patient reschedule:** Bệnh nhân cập nhật thành công ngày giờ và trạng thái lịch hẹn.
* **Patient cancel:** Bệnh nhân hủy lịch và đổi trạng thái lịch hẹn thành Cancelled.

### R02 — Doctor Appointment Management
* **Doctor search:** Bác sĩ có thể tìm kiếm các lịch hẹn của mình.
* **Doctor view:** Bác sĩ CHỈ xem được các lịch hẹn thuộc về chính bác sĩ đó.
* **Doctor update:** Bác sĩ cập nhật thành công trạng thái lịch hẹn (VD: Confirmed, Completed).

### R03 — Doctor Patient Management
* **View patient info:** Bác sĩ xem được thông tin chi tiết của bệnh nhân.
* **View history & records:** Bác sĩ xem được lịch sử khám và hồ sơ bệnh án (Medical Record).
* **Access Control:** Bác sĩ CHỈ được xem thông tin những bệnh nhân đang có lịch hẹn với mình.

### R04 — Patient AI Assistant
* **Receive symptoms & advice:** AI nhận triệu chứng và cung cấp lời khuyên sức khỏe chung.
* **Suggest department:** AI gợi ý đúng khoa khám/chuyên khoa phù hợp.
* **Safety & Disclaimer:** AI tuyệt đối KHÔNG chẩn đoán bệnh, KHÔNG kê đơn thuốc và BẮT BUỘC hiển thị medical disclaimer.

## 3. Thang điểm đánh giá (Scoring System)

Mỗi Requirement sẽ được đánh giá theo thang điểm tiêu chuẩn sau:
* **1.0 = Fully passed:** Requirement vượt qua toàn bộ các tiêu chí nghiệm thu quan trọng.
* **0.5 = Partially passed:** Requirement hoạt động được một phần nhưng vẫn còn lỗi hoặc thiếu sót một số tiêu chí.
* **0 = Missing or failed:** Requirement bị thiếu hoàn toàn hoặc không thể sử dụng được.

### Công thức tính tỷ lệ hoàn thành (Completion Rate)
`Completion rate = (Total achieved score / Total possible score) * 100%`

### Bảng chấm điểm mẫu (Sample Scoring Table)

| Requirement | Tên chức năng | Max Score | Achieved Score | Ghi chú |
|---|---|---|---|---|
| R01 | Patient Appointment Management | 1.0 | 1.0 | Pass toàn bộ acceptance criteria |
| R02 | Doctor Appointment Management | 1.0 | 0.5 | Tính năng update trạng thái thỉnh thoảng lỗi database |
| R03 | Doctor Patient Management | 1.0 | 1.0 | Pass toàn bộ test về access control |
| R04 | Patient AI Assistant | 1.0 | 0 | AI chưa hiện Disclaimer và vi phạm kê đơn |
| **Tổng cộng** | | **4.0** | **2.5** | **Completion Rate: 62.5%** |
