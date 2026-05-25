# 08. Quy tắc cho AGENTS (AGENTS.md)

## 1. Mục đích tài liệu
Tài liệu này định nghĩa các quy tắc dành cho AI Agent và Google Antigravity khi sinh mã nguồn, giao diện hoặc cấu trúc hệ thống cho dự án AI Healthcare Assistant.
Mục tiêu là đảm bảo tính nhất quán của mã nguồn, giữ đúng phạm vi hệ thống, tránh thiết kế quá mức cần thiết và giúp AI Agent tạo mã nguồn ổn định, dễ bảo trì và phù hợp với phiên bản demo/MVP của hệ thống healthcare.

## 2. Nguyên tắc cốt lõi
AI Agent cần ưu tiên tính dễ đọc, tính dễ bảo trì, cấu trúc rõ ràng và sự ổn định cho môi trường demo.
Mã nguồn được tạo ra phải bám sát phạm vi hệ thống thay vì tự mở rộng thêm tính năng ngoài yêu cầu. AI Agent cần ưu tiên sự đơn giản, rõ ràng và nhất quán hơn việc tạo ra kiến trúc quá phức tạp.

## 3. Quy tắc về phạm vi hệ thống
AI Agent chỉ được phép tạo các module thuộc phạm vi của hệ thống gồm 4 module sau: 
* Trợ lý AI cho bệnh nhân
* Quản lý lịch hẹn bệnh nhân
* Quản lý lịch hẹn bác sĩ
* Quản lý bệnh nhân dành cho bác sĩ

Mọi tính năng ngoài phạm vi trên đều được xem là ngoài phạm vi của phiên bản MVP.

## 4. Các tính năng bị nghiêm cấm
AI Agent không được tạo các tính năng như hệ thống xác thực sản phẩm hoàn chỉnh, thanh toán, bảo hiểm, gọi video, hệ thống kê đơn thuốc, hệ thống chẩn đoán bằng AI, dashboard quản trị, giao diện nhân viên, kiến trúc thời gian thực phức tạp, microservices hoặc hạ tầng DevOps cấp doanh nghiệp. Hệ thống chỉ phục vụ mục tiêu demo và minh họa workflow healthcare cơ bản.

## 5. Quy tắc giao diện người dùng
Frontend phải tuân thủ DESIGN.md và sử dụng phong cách giao diện healthcare thống nhất.
Giao diện cần sử dụng chế độ sáng mặc định, bảng màu xanh y tế, card trắng trên nền sáng, form đơn giản, table rõ ràng và model cho các chức năng đặt lịch hoặc đổi lịch. Nội dung hiển thị trên giao diện phải dùng tiếng Việt. Không sử dụng phong cách glass morphism, màu neon, animation dư thừa hoặc dashboard quá phức tạp.

## 6. Quy tắc backend
Backend cần ưu tiên cấu trúc đơn giản, API REST rõ ràng và kiến trúc dễ hiểu. Nên sử dụng mô hình controller/service/repository cơ bản và cấu trúc phù hợp cho demo hoặc dữ liệu mô phỏng. Không thiết kế kiến trúc quá phức tạp hoặc vượt quá nhu cầu thực tế của MVP.

## 7. Quy tắc dữ liệu mô phỏng
Toàn bộ dữ liệu bệnh nhân, bác sĩ, lịch hẹn và hồ sơ bệnh án trong hệ thống demo phải là dữ liệu mô phỏng. Không sử dụng dữ liệu thật hoặc dữ liệu nhạy cảm trong môi trường demo, public repository hoặc mock API.

## 8. Quy tắc cho AI Assistant
AI Assistant phải tuân thủ tài liệu 05 đặc biệt là các quy tắc không chẩn đoán y khoa, không kê đơn thuốc, hiển thị tuyên bố miễn trừ trách nhiệm và xử lý tình huống khẩn cấp. AI Agent không được tạo tính năng chẩn đoán bệnh, kê đơn thuốc hoặc đề xuất điều trị chuyên sâu.

## 9. Quy tắc sinh giao diện
Khi tạo giao diện, AI Agent phải tuân thủ DESIGN.md để đảm bảo tính nhất quán trên toàn hệ thống. Giao diện cần có spacing hợp lý, kiểu chữ rõ ràng, table dễ quan sát và badge trạng thái dễ nhận biết. Hệ thống nên ưu tiên sự rõ ràng và dễ sử dụng hơn hiệu ứng thị giác. Không được tạo dashboard phân tích phức tạp, biểu đồ KPI không cần thiết hoặc landing page mang phong cách marketing.

## 10. Quy tắc chất lượng mã nguồn
Mã nguồn cần dễ đọc, dễ bảo trì, chia component hợp lý và tránh lặp logic. Nếu sử dụng TypeScript, cần định nghĩa kiểu dữ liệu rõ ràng. Tên biến, tên hàm và cấu trúc file cần nhất quán và dễ hiểu. Không tạo abstraction quá mức, không viết mã nguồn thông minh và không thêm dependency không cần thiết cho MVP.

## 11. Quy tắc đặt tên
Tên file, component, biến và hàm cần sử dụng tiếng Anh để đảm bảo tính nhất quán trong mã nguồn. Nội dung hiển thị trên giao diện sử dụng tiếng Việt để phù hợp với bối cảnh healthcare demo tại Việt Nam.

## 12. Quy tắc responsive
Hệ thống ưu tiên desktop và laptop vì đây là môi trường demo chính. Tablet và mobile chỉ cần responsive ở mức cơ bản. Không cần tối ưu mobile quá sâu cho phiên bản MVP.

## 13. Quy tắc bảo mật và quyền riêng tư
AI Agent không được hardcode secret, để lộ API key, ghi log dữ liệu nhạy cảm hoặc lưu thông tin định danh cá nhân thật. Nếu cần cấu hình môi trường, nên sử dụng env file hoặc abstraction phù hợp.

## 14. Quy tắc tài liệu hóa
Khi sinh mã nguồn, AI Agent cần giữ cấu trúc rõ ràng và thêm comment ngắn trong các đoạn logic quan trọng nếu cần thiết. Không comment dư thừa cho mọi dòng mã nguồn.

## 15. Tóm tắt
Tài liệu 08. AGENTS định nghĩa các quy tắc hành vi dành cho AI Agent khi sinh giao diện và mã nguồn cho AI Healthcare Assistant. Mục tiêu chính là giữ tính nhất quán, tránh vượt phạm vi hệ thống, tránh thiết kế quá mức cần thiết, giữ đúng phong cách healthcare và đảm bảo AI Assistant tuân thủ các quy tắc an toàn y tế trong toàn bộ hệ thống MVP.
