CÂU LỆNH PROMPT TẠO DATABASE (03-database-prompt)
## 1. Mục đích tài liệu
Tài liệu này lưu trữ nguyên văn câu lệnh (Prompt) chuẩn kỹ thuật. Người thực hiện (Prompt Engineer) sẽ copy toàn bộ nội dung phần câu lệnh dưới đây để ném vào khung chat của Google Antigravity (hoặc AI IDE tương đương). Mục tiêu là ép AI Agent tự động đọc hiểu file thiết kế tài liệu số 4 (04-database-spec) nằm trong thư mục tài liệu để tự sinh ra mã nguồn cấu hình cơ sở dữ liệu Prisma Schema một cách chính xác mà không để con người phải gõ mã code bằng tay.
## 2. Nội dung câu lệnh mẫu
Nhiệm vụ của bạn: Hãy đóng vai một Kỹ sư dữ liệu (Data Engineer) cao cấp. Tôi muốn bạn thiết lập cấu trúc cơ sở dữ liệu cho dự án AI Healthcare Assistant của nhóm chúng tôi bằng công cụ Prisma ORM nối với cơ sở dữ liệu SQLite.
Yêu cầu thực hiện:
* Bước 1: Hãy di chuyển vào thư mục tài liệu của dự án trên hệ thống, tìm và đọc kỹ nội dung file đặc tả cấu trúc dữ liệu có tên là docs/04-database-spec.md.
* Bước 2: Dựa vào thông tin các bảng dữ liệu, các cột dữ liệu, kiểu dữ liệu và mối quan hệ giữa các bảng (Bảng Doctor và Bảng Appointment) đã được định nghĩa trong file đặc tả đó, hãy tự động tạo ra file cấu hình schema.prisma hoàn chỉnh cho dự án.
* Bước 3: Đảm bảo thiết lập đúng khóa chính, khóa ngoại liên kết trường doctorId, kiểu dữ liệu tự động tăng cho id của bác sĩ, chuỗi UUID ngẫu nhiên cho id của lịch hẹn, và các giá trị trạng thái mặc định như mô tả.
* Bước 4: Sau khi sinh mã xong, hãy chạy các lệnh kiểm tra trong terminal local để khởi tạo file cơ sở dữ liệu SQLite và cập nhật cấu trúc dữ liệu thật.

