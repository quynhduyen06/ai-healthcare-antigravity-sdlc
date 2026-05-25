# 02. Agile SDLC Methodology

## 1. Mục đích tài liệu

Tài liệu này mô tả phương pháp phát triển hệ thống được áp dụng cho dự án **AI Healthcare Assistant**.  
Mục tiêu là xác định rõ nhóm sử dụng mô hình SDLC nào, quy trình làm việc ra sao, vai trò của con người và AI trong từng giai đoạn, cũng như cách kiểm soát chất lượng đầu ra khi sử dụng AI để hỗ trợ phát triển phần mềm.

Dự án này không áp dụng mô hình Waterfall truyền thống, mà sử dụng hướng tiếp cận Agile SDLC kết hợp AI-assisted development. Điều này giúp nhóm có thể phát triển nhanh, chia nhỏ chức năng, kiểm thử liên tục và điều chỉnh sản phẩm dựa trên phản hồi trong quá trình làm demo.

## 2. Lý do chọn Agile SDLC

Dự án **AI Healthcare Assistant** là một hệ thống có nhiều chức năng liên quan đến nhiều nhóm người dùng khác nhau, bao gồm:

* Bệnh nhân đặt lịch khám.
* Bác sĩ quản lý lịch làm việc, danh sách bệnh nhân
* Hệ thống quản lý thông tin lịch hẹn.
* AI assistant hỗ trợ phân tích triệu chứng ở mức tham khảo.
* Giao diện quản lý và demo workflow.

Do đó, yêu cầu của hệ thống có thể thay đổi trong quá trình phát triển, đặc biệt khi nhóm cần điều chỉnh giao diện, dữ liệu, logic đặt lịch hoặc cách trình bày demo. Agile phù hợp với dự án vì cho phép nhóm:

* Phát triển theo từng phần nhỏ.
* Ưu tiên các tính năng quan trọng trước.
* Dễ dàng sửa đổi khi phát hiện lỗi hoặc yêu cầu chưa hợp lý.
* Kết hợp AI vào từng giai đoạn như phân tích, thiết kế, code, test và debug.
* Có thể tạo sản phẩm demo hoạt động được trong thời gian ngắn.

## 3. Mô hình SDLC được áp dụng

Nhóm sử dụng mô hình:

**Agile SDLC + Spec-Driven AI Development**

Trong đó:

* Agile SDLC giúp chia dự án thành các sprint nhỏ, mỗi sprint tập trung vào một nhóm chức năng cụ thể.
* Spec-Driven Development giúp đảm bảo AI không tự tạo chức năng tùy ý mà phải dựa trên tài liệu đặc tả đã được nhóm chuẩn bị.
* AI-assisted Development cho phép sử dụng Google Antigravity hoặc AI coding agent để hỗ trợ tạo UI, database, code, test case và debug.

### Quy trình tổng quát:

```text
Business Requirement
        ↓
System Design
        ↓
Database Specification
        ↓
UI Generation
        ↓
Code Generation
        ↓
Testing
        ↓
Debug / Refactor
        ↓
Final Demo
```
