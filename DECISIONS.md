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

### D009: Dữ liệu mẫu / seed.ts
* **Date:** 2026-05-25
* **Decision:** Cho phép AG mở rộng seed data nếu cần, nhưng tất cả dữ liệu phải là dữ liệu giả lập. Tuyệt đối không dùng dữ liệu bệnh nhân thật.
* **Rationale:** Cần đủ dữ liệu để xây dựng giao diện và test luồng, đồng thời đảm bảo an toàn dữ liệu y tế (data privacy/HIPAA).
* **Alternatives considered:** Dùng dữ liệu thật đã ẩn danh (phức tạp, vẫn có rủi ro rò rỉ). Dùng dữ liệu tĩnh quá cơ bản (không đủ để test các flow phức tạp).
* **Impact on implementation:** Agent/Team được tự do cập nhật file `seed.ts` để sinh dữ liệu mock phức tạp hơn phục vụ demo.

### D010: Prisma schema management
* **Date:** 2026-05-25
* **Decision:** Ưu tiên giữ schema hiện tại. AG chỉ được thêm/sửa field nếu cần để đáp ứng `docs/04-database-spec.md`. Mọi thay đổi phải có lý do rõ ràng và được ghi nhận.
* **Rationale:** Hạn chế rủi ro phá vỡ cấu trúc cơ sở dữ liệu nền tảng, tránh over-engineering cho hệ thống MVP.
* **Alternatives considered:** Refactor lại toàn bộ kiến trúc Database (tốn thời gian, không mang lại giá trị tương xứng cho MVP).
* **Impact on implementation:** Các bản cập nhật UI/Logic chủ yếu dựa vào schema hiện có, giảm scope công việc cho Phase 2.

### D011: UI flow for main actions
* **Date:** 2026-05-25
* **Decision:** Dùng trang riêng (dedicated page) cho các flow chính như tạo lịch hẹn và đổi lịch hẹn. Dùng modal/dialog cho thao tác nhỏ như xác nhận hủy lịch hoặc cập nhật trạng thái.
* **Rationale:** Giữ luồng người dùng rõ ràng cho tác vụ lớn và tối ưu thao tác nhanh cho tác vụ nhỏ, bám sát chuẩn `DESIGN.md`.
* **Alternatives considered:** Gom tất cả vào một trang (gây rối UI) hoặc dùng modal cho mọi thao tác (khó quản lý form nhập liệu lớn).
* **Impact on implementation:** Agent phải tạo file route `page.tsx` riêng cho luồng book/reschedule và sử dụng component Modal cho thao tác nhỏ.

### D012: Patient AI Assistant in MVP
* **Date:** 2026-05-25
* **Decision:** Dùng rule-based/mock AI response thay vì kết nối API AI thật. AI chỉ gợi ý khoa khám, đưa lời khuyên chung, không chẩn đoán, không kê đơn và phải hiển thị disclaimer.
* **Rationale:** Đảm bảo an toàn y tế tuyệt đối, tránh lộ API key, tối ưu chi phí và kiểm soát 100% output để vượt qua các bộ test an toàn.
* **Alternatives considered:** Tích hợp OpenAI/Gemini thật (rủi ro sinh thông tin sai lệch y khoa, tốn kém chi phí token).
* **Impact on implementation:** Không cần tích hợp AI SDK phức tạp, thay vào đó tập trung xây dựng logic mock response chuẩn xác và UI chat mượt mà.

### D013: Testing strategy for MVP
* **Date:** 2026-05-25
* **Decision:** Trọng tâm là manual acceptance test và lightweight validation. Nếu còn thời gian mới bổ sung Playwright cho các flow chính.
* **Rationale:** Ưu tiên tốc độ hoàn thành MVP, tránh mất thời gian setup môi trường Automation Test E2E cồng kềnh ngay từ đầu.
* **Alternatives considered:** Bắt buộc 100% Automation Test bằng Playwright/Cypress (bị loại vì quá nặng cho quy mô MVP).
* **Impact on implementation:** Đẩy nhanh tiến độ code, Agent tự kiểm tra thủ công qua UI hoặc script đơn giản để đảm bảo pass các tiêu chí trong `06-test-plan.md`.

### D014: UI framework usage
* **Date:** 2026-05-25
* **Decision:** Dùng Tailwind CSS thuần trước. Chỉ thêm shadcn/ui nếu thật sự cần thiết và phải được con người duyệt trước.
* **Rationale:** Giữ codebase nhẹ, sạch và tuân thủ chặt chẽ định hướng thiết kế (TasteSkill) của dự án y tế.
* **Alternatives considered:** Cài đặt toàn bộ UI Library như MUI/AntD ngay từ đầu (gây phình code, khó tùy chỉnh chính xác theo DESIGN.md).
* **Impact on implementation:** Agent sẽ tự xây dựng các UI component (Button, Card, Modal) cơ bản bằng Tailwind hoặc tái sử dụng code tĩnh, hạn chế phụ thuộc lib ngoài.

### D015: Token-saving tools (RTK/Caveman)
* **Date:** 2026-05-25
* **Decision:** RTK và Caveman chưa cài ở thời điểm này. Chỉ cân nhắc sau Pha 1 hoặc trước implementation/debug. Caveman chỉ bật cho task ngắn/debug, không dùng cho planning/decision/audit.
* **Rationale:** Giữ log trong suốt ở các khâu lập kế hoạch, tránh mất thông tin ngữ cảnh quan trọng.
* **Alternatives considered:** Cài đặt và bật mặc định toàn dự án (bị loại do có thể cắt bớt log cần thiết cho việc phân tích dự án).
* **Impact on implementation:** Các khâu phân tích tiếp tục chạy bình thường, Agent sẽ đề xuất bật tool giảm token chỉ khi output terminal quá dài lúc code/test.

### D016: Implementation strategy phases
* **Date:** 2026-05-25
* **Decision:** Triển khai theo thứ tự tuyến tính: Phase 2 (DB/Mock data) -> Phase 3 (R01) -> Phase 4 (R02) -> Phase 5 (R03) -> Phase 6 (R04) -> Phase 7 (QA/Final report).
* **Rationale:** Cách tiếp cận gia tăng (incremental) giúp đảm bảo phần móng (dữ liệu) vững chắc trước khi đi vào từng luồng nghiệp vụ từ dễ đến khó.
* **Alternatives considered:** Làm song song mọi phase cùng lúc (dễ gây conflict code, sai lệch database).
* **Impact on implementation:** Agent phải hoàn thành và validation xong từng Requirement trước khi nhảy sang Requirement tiếp theo.
