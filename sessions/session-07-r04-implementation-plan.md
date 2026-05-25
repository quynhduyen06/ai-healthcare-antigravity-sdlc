# Session 07: R04 Patient AI Assistant Implementation Plan

## 1. Yêu cầu R04 (Patient AI Assistant)
Theo tài liệu (đặc biệt `docs/05-ai-governance.md` và `docs/01-business-requirements.md`):
* **Tính năng chính:** Nhập triệu chứng -> Gợi ý khoa khám và đưa ra lời khuyên chung.
* **Safety Rules:** KHÔNG chẩn đoán, KHÔNG kê đơn thuốc.
* **Disclaimer:** Hiển thị tuyên bố miễn trừ trách nhiệm y tế rõ ràng.
* **Emergency:** Nếu phát hiện triệu chứng nghiêm trọng (đau ngực, khó thở nặng), yêu cầu gọi 115 hoặc đi cấp cứu.
* **Data Storage:** Lưu lại lịch sử sử dụng AI vào bảng `AIAdvice`.

## 2. Kiểm tra app hiện tại
* **Routes/Pages:** Đã có `app/patient/assistant/page.tsx` làm giao diện chính.
* **AI Logic & Safety:** Cơ chế Mock AI (dùng Regex đơn giản) đã được tích hợp ngay trong file Client. Các nguyên tắc an toàn, khuyên đi cấp cứu (115) và hiển thị disclaimer (`DEPT_DISCLAIMER`) **đã được tuân thủ 100%**.
* **API/Server Actions:** Hàm `saveAIAdvice` đã tồn tại trong `app/actions/patient.ts`.
* **Vấn đề:** Giao diện đang là 100% Client Component, không lấy `patientId` thực tế, không tải lịch sử hội thoại cũ từ Database, và khi có câu trả lời mới từ AI cũng không gọi `saveAIAdvice` để lưu vào Prisma.

## 3. Gap Analysis cho R04
| Feature | Expected behavior | Current implementation | Missing UI | Missing logic | Missing validation/guard | Risk | Proposed fix |
|---|---|---|---|---|---|---|---|
| **AI Symptom Check** | Nhận triệu chứng, trả về khoa khám. | Đã làm bằng Mock Rule-based. | Không | Không | Không | Thấp | Giữ nguyên Mock Rule-based để an toàn cho demo. |
| **Safety & Disclaimer** | Không chẩn đoán, có disclaimer, gọi 115 khi khẩn cấp. | Đã đáp ứng đầy đủ trong `buildAIResponse`. | Không | Không | Không | Thấp | Giữ nguyên. |
| **Save AI Advice** | Lưu vào CSDL Prisma. | Chưa lưu. Mất dữ liệu khi tải lại trang. | Không | Chưa gọi `saveAIAdvice` server action. | Không | Cao (Vi phạm requirement) | Thêm logic gọi server action. |
| **Load History** | Tải lịch sử chat cũ khi vào trang. | Luôn bắt đầu bằng mảng rỗng `INITIAL_MESSAGES`. | Không | Chưa fetch từ Prisma. | Không | Trung bình | Tách thành Server/Client component. |

## 4. Đề xuất Implementation Plan (MVP)
Chúng ta sẽ áp dụng pattern tách Server/Client Component giống hệt R01/R02/R03:
1. **Data/query layer:** 
   - Hàm `saveAIAdvice` đã có sẵn.
   - Viết thêm hàm `getPatientAIAdvices(patientId)` (nếu chưa có) để tải lịch sử chat.
2. **Page/route:** 
   - Đổi `app/patient/assistant/page.tsx` thành `client.tsx`.
   - Tạo `page.tsx` mới (Server Component). Lấy mock `patientId` (như `prisma.patient.findFirst()`). Fetch lịch sử `AIAdvice` truyền xuống Client dưới dạng `initialMessages`.
3. **UI/client interaction:** 
   - Trong `client.tsx`, khi AI trả lời xong, gọi hàm `saveAIAdvice` truyền nội dung (Symptom, Suggested Dept, Response Text, Disclaimer) lên Server để lưu vào DB.
   - Giao diện vẫn giữ nguyên thiết kế TasteSkill đẹp mắt hiện có.

## 5. Đề xuất các file có thể cần sửa
- Cần sửa/chia nhỏ: `app/patient/assistant/page.tsx`
- Cần tạo mới: `app/patient/assistant/client.tsx`
- Thêm query: `app/actions/patient.ts` (thêm hàm fetch lịch sử AI).
