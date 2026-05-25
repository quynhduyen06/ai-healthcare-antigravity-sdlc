# YÊU CẦU NGHIỆP VỤ (01-business-requirements)

## 1. Mục tiêu dự án
Xây dựng hệ thống AI Healthcare Assistant nhằm hỗ trợ phòng khám và bệnh viện tối ưu hóa quy trình tiếp đón, phân luồng bệnh nhân và tự động hóa việc đặt lịch. Mục tiêu cốt lõi là giảm tải áp lực cho nhân viên y tế vào giờ cao điểm và nâng cao trải nghiệm của bệnh nhân.

## 2. Các yêu cầu chức năng cốt lõi (Requirements - R)
* **R01 — Patient Appointment Management:** Bệnh nhân có thể tìm kiếm, đặt lịch, đổi lịch, và hủy lịch khám.
* **R02 — Doctor Appointment Management:** Bác sĩ có thể tìm kiếm lịch khám, xem các lịch hẹn của mình, và cập nhật trạng thái lịch hẹn.
* **R03 — Doctor Patient Management:** Bác sĩ có thể xem thông tin bệnh nhân, lịch sử khám bệnh và hồ sơ bệnh án (chỉ giới hạn đối với những bệnh nhân đã có lịch hẹn với bác sĩ đó).
* **R04 — Patient AI Assistant:** AI tiếp nhận triệu chứng, gợi ý khoa khám/chuyên khoa phù hợp, đưa ra lời khuyên sức khỏe chung. AI không được phép chẩn đoán bệnh, không kê đơn thuốc và bắt buộc hiển thị tuyên bố miễn trừ trách nhiệm y tế (medical disclaimer).

## 3. Đối tượng sử dụng (User Personas)
* **Patient (Bệnh nhân):** Người dùng cuối có nhu cầu sử dụng AI để tìm hiểu triệu chứng và đặt lịch khám bệnh.
* **Doctor (Bác sĩ):** Người quản lý các lịch hẹn của mình, theo dõi danh sách bệnh nhân và cập nhật trạng thái khám. (Admin/Staff không nằm trong phạm vi dự án).

## 4. Phạm vi giới hạn của dự án (Scope & Limitations)
* **Xác thực người dùng:** Không triển khai hệ thống đăng nhập bảo mật phức tạp (Oauth/JWT). Sử dụng cơ chế giả lập vai trò (chọn vai trò Bệnh nhân hoặc Bác sĩ từ màn hình chính) để thuận tiện cho việc demo.
* **Lưu trữ dữ liệu:** Tránh sử dụng Cloud Database phức tạp để tiết kiệm chi phí. Dữ liệu sẽ được lưu trữ cục bộ bằng Prisma và cơ sở dữ liệu SQLite để AI Agent dễ dàng thao tác và nhóm có thể trực tiếp quan sát luồng dữ liệu thay đổi.
