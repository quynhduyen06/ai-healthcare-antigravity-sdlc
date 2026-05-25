# Session 02: Database Alignment & Mock Data

## 1. Mục tiêu Phase 2
- Rà soát sự tương thích giữa Database Spec (`docs/04-database-spec.md`) và Schema thực tế (`prisma/schema.prisma`).
- Kiểm tra tính đầy đủ của dữ liệu mẫu (`prisma/seed.ts`) để đảm bảo đủ dữ kiện test cho các kịch bản R01, R02, R03, R04.
- Đồng bộ hóa Prisma Client và khởi tạo lại Database cục bộ (SQLite) nhằm chuẩn bị hạ tầng hoàn hảo cho Phase 3.

## 2. Files đã kiểm tra
- `docs/04-database-spec.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`

## 3. Files đã sửa
- `prisma/seed.ts`: Bổ sung thêm 2 bản ghi (records) vào bảng `AIAdvice`.
  - Record 1: Giả lập bệnh nhân khai báo ho kéo dài, AI gợi ý khoa Hô hấp.
  - Record 2: Giả lập bệnh nhân khai báo đau nhói ngực trái, AI gợi ý khoa Tim mạch.
  - Cả 2 record đều tuân thủ chặt chẽ nguyên tắc AI Governance: đưa lời khuyên chung chung, không chẩn đoán, không kê đơn và **kèm theo Disclaimer y tế**.

## 4. Lệnh đã chạy
```bash
npx prisma generate && npm run db:seed
```

## 5. Kết quả
Lệnh chạy thành công hoàn toàn mà không gặp lỗi.
- Prisma Client (7.8.0) đã được generate.
- Database `dev.db` đã được làm sạch và nạp lại dữ liệu thành công với các bản ghi:
  - 5 departments
  - 5 doctors
  - 3 patients
  - 10 appointments
  - 3 medical records
  - 3 AI advice entries

## 6. Gap còn lại
- Hoàn toàn không còn Gap giữa Database Schema và tài liệu đặc tả.
- Dữ liệu mẫu (mock data) hiện đã ở trạng thái dồi dào, chuẩn chỉnh và phong phú về mặt cấu trúc để cung cấp cho Front-end.

## 7. Xác nhận
- **Schema:** Tôi xác nhận file `prisma/schema.prisma` **KHÔNG** bị sửa đổi.
- **Application Code:** Tôi xác nhận **KHÔNG** tác động hay sửa chữa bất kỳ file code nào trong các thư mục `app/`, `components/`, hay `lib/`.
