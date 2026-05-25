# Session 01: Project Planning

## 1. Hiểu biết hiện tại về repository
- **Tech stack hiện tại:** Next.js (16.2.6), React 19, Tailwind CSS v4, TypeScript, Prisma ORM, SQLite.
- **Cấu trúc app hiện tại:** Sử dụng App Router với thư mục chính `app/`. Đã chia sẵn các route như `app/patient/appointments`, `app/patient/assistant`, `app/doctor/` (và các component/layout cơ bản). Đã có global CSS.
- **Các module/page hiện có:** Giao diện chủ yếu là các khung xương (skeleton), chưa có logic phức tạp. Các route đã sẵn sàng cho 4 module chính.
- **Cấu trúc Prisma/database:** Có file `schema.prisma` đầy đủ các model: `Department`, `Doctor`, `Patient`, `Appointment`, `MedicalRecord`, `AIAdvice`. Sử dụng SQLite (`dev.db`). Đã có file seed `seed.ts`.

## 2. Hiểu biết về tài liệu
- **Mapping R01-R04 cuối cùng:**
  - **R01:** Patient Appointment Management (đặt, đổi, hủy lịch).
  - **R02:** Doctor Appointment Management (xem lịch, cập nhật trạng thái).
  - **R03:** Doctor Patient Management (xem thông tin, lịch sử bệnh án).
  - **R04:** Patient AI Assistant (nhập triệu chứng, nhận lời khuyên cơ bản).
- **Scope chính:** Hỗ trợ quy trình đặt lịch và điều hướng y tế cho Bệnh nhân và Bác sĩ. 
- **Các phần ngoài scope:** Không Admin UI, không Đăng nhập bảo mật phức tạp, không Thanh toán, không Gọi Video, không Chẩn đoán/Kê đơn bệnh thật.
- **Quy tắc AI governance:** Tuyệt đối KHÔNG khẳng định bệnh, KHÔNG kê đơn thuốc. Phải hiển thị "Medical Disclaimer" và xử lý đúng nếu gặp triệu chứng khẩn cấp (nhóm Red Flags).
- **Quy tắc test/metric:** Kiểm thử dựa trên `docs/06-test-plan.md`, tính completion rate theo thang điểm 1.0 (Pass) / 0.5 (Partial) / 0 (Fail).

## 3. Kế hoạch sử dụng agent skills
- **OpenSpec:** Dùng khi bắt đầu thiết kế chi tiết một Phase, khi phân rã task trước khi code, hoặc khi yêu cầu logic/database cần sửa đổi.
- **TasteSkill:** Dùng để sinh code giao diện (Frontend) nhằm duy trì chuẩn mực cao cấp, sạch sẽ, tuân thủ chặt chẽ `DESIGN.md`.
- **Superpowers:** Dùng bắt buộc trong giai đoạn Execution: viết Test trước khi code (TDD), gỡ lỗi có hệ thống, và duyệt (review) code.
- **DESIGN.md:** Làm kim chỉ nam duy nhất cho UI/UX: dùng màu Medical Blue, font chữ rõ ràng, form thẻ trắng, không lạm dụng hiệu ứng.

## 4. Gap analysis

| Requirement ID | Hành vi mong đợi theo docs | Trạng thái hiện tại | Thiếu gì? | Mức độ rủi ro | Hành động đề xuất |
|---|---|---|---|---|---|
| **R01** | Bệnh nhân tìm, đặt, đổi, hủy lịch khám | Đã có thư mục route, database model đã hỗ trợ | Thiếu UI form đặt lịch, logic đổi/hủy lịch, Mock API, Test cases. | Trung bình | Xây dựng theo TDD bằng Superpowers, tạo giao diện với TasteSkill. |
| **R02** | Bác sĩ xem và cập nhật trạng thái hẹn | Đã có route doctor, database hỗ trợ status enum | Thiếu giao diện danh sách lịch, Dropdown update trạng thái, logic bảo mật xem đúng bệnh nhân. | Thấp | Dùng TasteSkill xây table đơn giản, test kỹ update API. |
| **R03** | Bác sĩ xem bệnh án và lịch sử | Đã có model `MedicalRecord` | Thiếu UI xem chi tiết bệnh nhân, truy vấn Access Control (chỉ bệnh nhân của mình). | Trung bình | Phân quyền truy vấn database (chỉ fetch patient có link qua appointment). |
| **R04** | AI nhận triệu chứng & tư vấn | Đã có model `AIAdvice` | Thiếu tích hợp System Prompt, kết nối LLM, UI Chat, cờ khẩn cấp, Disclaimer. | Cao (An toàn y tế) | Review chặt chẽ Prompt AI dựa trên `05-ai-governance.md`, bắt buộc hiện Disclaimer. |

## 5. Câu hỏi cần con người chốt trước khi implement
1. **Scope:** Dữ liệu mẫu (mock data) hiện có trong `seed.ts` đã đủ để làm nền tảng demo chưa hay cần tôi tự sinh thêm dữ liệu thực tế hơn?
2. **Database:** Có cần tôi giữ nguyên cấu trúc `schema.prisma` hiện tại 100% không, hay có quyền tạo thêm các trường/bảng phụ trợ nếu thấy cần thiết?
3. **UI Flow:** Đối với form đặt lịch (Book Appointment) và đổi lịch (Reschedule), bạn muốn sử dụng Modal, Dialog hay một Page riêng biệt?
4. **An toàn AI assistant:** SDK tích hợp AI (ví dụ: Vercel AI SDK) và mô hình (như OpenAI/Anthropic/Gemini) nào sẽ được sử dụng? Bạn đã cấu hình API Key trong môi trường chưa?
5. **Test/scoring:** Chúng ta sẽ test bằng E2E (Playwright) hay Unit Test (Vitest) cho Frontend để chấm điểm R01-R04?
6. **Cấu trúc app:** Có đồng ý giữ nguyên mô hình Next.js App Router hiện tại không?

## 6. Kế hoạch triển khai đề xuất
- **Phase 1:** Kiểm tra repo, docs, skills, lập kế hoạch và chốt yêu cầu *(Chúng ta đang ở cuối phase này)*.
- **Phase 2:** Căn chỉnh Database, hoàn thiện `seed.ts` để nạp đủ dữ liệu demo và viết bộ test nền tảng.
- **Phase 3:** Xây dựng **R01** - Patient Appointment Management (UI, Logic, Test).
- **Phase 4:** Xây dựng **R02** - Doctor Appointment Management (UI, Logic, Test).
- **Phase 5:** Xây dựng **R03** - Doctor Patient Management (UI, Logic, Kiểm soát quyền, Test).
- **Phase 6:** Xây dựng **R04** - Patient AI Assistant (Tích hợp Prompt y tế an toàn, Disclaimer, UI).
- **Phase 7:** Kiểm thử toàn diện (QA), chạy test tự động, debug các lỗi phát sinh, đánh giá điểm Completion Rate và hoàn thiện.

## 7. Decision đề xuất (sẽ cập nhật vào DECISIONS.md sau khi chốt)
1. Quyết định rõ **Testing Framework** (Playwright hay Vitest/Jest) để hỗ trợ quá trình TDD của Agent.
2. Quyết định **AI Provider / SDK** sẽ dùng để xử lý tính năng R04 (Vercel AI SDK + tên mô hình cụ thể).
3. Lựa chọn về **UI Framework**: Tiếp tục code thuần CSS/Tailwind theo DESIGN.md hay được phép sử dụng shadcn/ui để tiết kiệm thời gian dựng Component.
