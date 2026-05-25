# Session 07: R04 Patient AI Assistant - Code Generation

## 1. Mục tiêu
Thực thi bản kế hoạch R04: Refactor giao diện Trợ lý AI thành mô hình Server/Client Component để xử lý logic lưu trữ và khôi phục lịch sử tư vấn (với bảng `AIAdvice`) trong khi vẫn giữ nguyên các cơ chế an toàn AI (Mock Rule-based).

## 2. Các thay đổi chính
1. **`app/actions/patient.ts`**:
   - Thêm Server Action `getPatientAIAdvices` để query bảng `AIAdvice` trong Database và lấy về lịch sử hội thoại của bệnh nhân.
   
2. **`app/patient/assistant/client.tsx`**:
   - Được đổi tên từ `page.tsx` cũ.
   - Component được nâng cấp để nhận `patientId` và `initialMessages` (đã nạp lịch sử từ DB) qua Props.
   - Thêm logic bất đồng bộ: Khi AI trả lời xong, gọi hàm `saveAIAdvice` từ Server Action để lưu trữ 100% dữ liệu hội thoại (symptom, department, advice, disclaimer) xuống Prisma.

3. **`app/patient/assistant/page.tsx`**:
   - Tạo file Server Component mới.
   - Giả lập phiên đăng nhập bệnh nhân thông qua `prisma.patient.findFirst()`.
   - Tải lịch sử thông qua `getPatientAIAdvices(patient.id)`, sau đó biến đổi (map) dữ liệu từ Model `AIAdvice` thành cấu trúc mảng `Message[]` phù hợp cho `client.tsx` render.

## 3. Quá trình kiểm tra an toàn (AI Governance)
- **Không chẩn đoán, Không kê đơn:** Giao diện sử dụng nguyên vẹn logic rule-based regex của TasteSkill, không tự phát sinh rủi ro y khoa mới.
- **Có Disclaimer:** Tuyên bố miễn trừ trách nhiệm y tế (`DEPT_DISCLAIMER`) hiển thị rõ ràng trên UI và được đính kèm vào mỗi bản ghi `AIAdvice` được lưu.
- **Khẩn cấp (Emergency):** Lời khuyên 115 hoặc cấp cứu được kích hoạt đúng theo template.

## 4. Xác nhận phạm vi mã nguồn
- Hoàn toàn KHÔNG sửa/chạm vào các thư mục thuộc R01, R02, R03.
- KHÔNG cài thêm bất kỳ NPM package nào.
- KHÔNG gọi API bên thứ ba (OpenAI, Gemini,...). Mọi tác vụ được giả lập bằng Rule-based nội bộ hoàn toàn khép kín.
