# 10. DECISIONS

## 1. Mục đích tài liệu
Tài liệu này dùng để ghi lại các quyết định kỹ thuật, quyết định thiết kế và định hướng triển khai cốt lõi trong dự án AI Healthcare Assistant, đóng vai trò như một Single Source of Truth cho các tranh luận về sau.

## 2. Danh sách các Quyết định (Decision Records)

### D001: Final R01-R04 requirement mapping
* **Trạng thái:** Approved
* **Nội dung quyết định:** Thống nhất danh sách yêu cầu chuẩn toàn cục gồm: R01 (Patient Appointment Management), R02 (Doctor Appointment Management), R03 (Doctor Patient Management), và R04 (Patient AI Assistant).
* **Lý do lựa chọn:** Đảm bảo toàn bộ hệ thống từ Business Requirements, UI, Database, Prompts đến Test Plan không bị mâu thuẫn.

### D002: Main scope is Patient + Doctor; Admin/Staff is out of scope
* **Trạng thái:** Approved
* **Nội dung quyết định:** Hệ thống chỉ tập trung vào 2 vai trò là Bệnh nhân (Patient) và Bác sĩ (Doctor). Các role Admin và Staff là tùy chọn hoặc hoàn toàn nằm ngoài phạm vi.
* **Lý do lựa chọn:** Giữ phạm vi dự án MVP nhỏ gọn, khả thi để nhóm hoàn thành và demo trong thời gian ngắn.

### D003: Humans act as Product Owner / Engineering Manager; AI generates code
* **Trạng thái:** Approved
* **Nội dung quyết định:** Con người sẽ quản lý requirement, giám sát quy trình và kiến trúc. Các AI Agent (như Google Antigravity) đóng vai trò thợ viết mã nguồn (code generation).
* **Lý do lựa chọn:** Tối ưu hóa phương pháp Agile SDLC kết hợp Spec-Driven AI Development.

### D004: GitHub repository is the project source of truth
* **Trạng thái:** Approved
* **Nội dung quyết định:** Mọi tài liệu và source code chuẩn mực nhất của toàn bộ dự án phải được lưu trữ trên GitHub.
* **Lý do lựa chọn:** Giúp theo dõi phiên bản, quản lý đồng bộ và tránh sự phân mảnh thông tin hoặc mất mát tài liệu.

### D005: Tech stack follows current app: Next.js, React, TypeScript, Prisma, SQLite
* **Trạng thái:** Approved
* **Nội dung quyết định:** Dự án sẽ sử dụng Next.js, React, TypeScript, kết hợp với Prisma ORM và SQLite cục bộ.
* **Lý do lựa chọn:** Giảm thiểu sự phức tạp về hạ tầng mạng, không cần Cloud database. Dữ liệu chạy hoàn toàn local có thể dễ dàng kiểm chứng qua Prisma Studio khi demo.

### D006: Requirement completion is measured by acceptance test pass rate
* **Trạng thái:** Approved
* **Nội dung quyết định:** Đo lường tiến độ và độ hoàn thiện dự án thông qua hệ thống tính điểm theo các mốc 1.0, 0.5, 0 dựa trên mức độ pass của Acceptance Criteria.
* **Lý do lựa chọn:** Tạo ra các số liệu metric định lượng, minh bạch và có thể theo dõi sự cải thiện khách quan qua từng sprint.

### D007: Patient AI Assistant must not diagnose, prescribe, or replace professional medical advice
* **Trạng thái:** Approved
* **Nội dung quyết định:** AI chỉ hỗ trợ điều hướng chuyên khoa và tư vấn sức khỏe chung. Bắt buộc từ chối chẩn đoán, từ chối kê đơn và luôn hiển thị Disclaimer y tế.
* **Lý do lựa chọn:** Đảm bảo tuân thủ các nguyên tắc đạo đức và an toàn y khoa tuyệt đối (AI Governance) cho dự án Healthcare.

### D008: Database spec must support traceability from requirement to entity
* **Trạng thái:** Approved
* **Nội dung quyết định:** Mỗi bảng trong Database Specification bắt buộc phải định nghĩa rõ nó đang phục vụ cho Requirement nào (từ R01 đến R04).
* **Lý do lựa chọn:** Đảm bảo hệ thống không tạo ra các bảng thừa (over-engineering), và ngược lại, không bị sót thiết kế dữ liệu khi thực thi các yêu cầu nghiệp vụ.
