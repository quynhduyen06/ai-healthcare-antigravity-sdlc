# ĐẶC TẢ CƠ SỞ DỮ LIỆU (04-database-spec)

## 1. Mục đích tài liệu
Tài liệu này định nghĩa cấu trúc dữ liệu lưu trữ (Schema) cho hệ thống AI Healthcare Assistant demo. Cấu trúc này sử dụng công nghệ Prisma kết hợp cơ sở dữ liệu SQLite chạy cục bộ (local) để phục vụ cho mục đích chạy thử phần mềm (demo MVP).

## 2. Thiết kế các bảng dữ liệu (Database Entities)

### 2.1 Patient (Bệnh nhân)
* **Purpose (Mục đích):** Lưu trữ thông tin cá nhân của bệnh nhân.
* **Key fields (Trường chính):** `id` (UUID), `name`, `age`, `gender`, `email`, `phone`.
* **Relationships (Quan hệ):** Một Patient có nhiều Appointment, nhiều MedicalRecord, nhiều AIAdvice.
* **Supported Requirements:** R01, R03, R04.

### 2.2 Doctor (Bác sĩ)
* **Purpose (Mục đích):** Lưu thông tin danh sách các bác sĩ trong phòng khám.
* **Key fields (Trường chính):** `id` (UUID), `name`, `specialty`, `availableHours`, `departmentId`.
* **Relationships (Quan hệ):** Một Doctor có nhiều Appointment, thuộc về một Department.
* **Supported Requirements:** R01, R02, R03.

### 2.3 Department (Khoa khám)
* **Purpose (Mục đích):** Lưu danh sách các khoa khám chuyên môn.
* **Key fields (Trường chính):** `id` (UUID), `name`, `description`.
* **Relationships (Quan hệ):** Một Department có nhiều Doctor, nhiều Appointment.
* **Supported Requirements:** R01, R04.

### 2.4 Appointment (Lịch hẹn)
* **Purpose (Mục đích):** Lưu thông tin các ca đặt lịch hẹn khám của bệnh nhân.
* **Key fields (Trường chính):** `id` (UUID), `appointmentDate`, `appointmentTime`, `status` (Pending, Confirmed, Rescheduled, Cancelled, Completed).
* **Relationships (Quan hệ):** Thuộc về một Patient, một Doctor và một Department.
* **Supported Requirements:** R01, R02, R03.

### 2.5 MedicalRecord (Hồ sơ bệnh án)
* **Purpose (Mục đích):** Lưu trữ hồ sơ bệnh án và lịch sử khám của bệnh nhân.
* **Key fields (Trường chính):** `id` (UUID), `symptoms`, `pastHistory`, `doctorNotes`, `createdAt`.
* **Relationships (Quan hệ):** Thuộc về một Patient.
* **Supported Requirements:** R03.

### 2.6 AIAdvice hoặc SymptomCheck (Kết quả kiểm tra triệu chứng)
* **Purpose (Mục đích):** Lưu lịch sử bệnh nhân chat với AI và lời khuyên được gợi ý.
* **Key fields (Trường chính):** `id` (UUID), `reportedSymptoms`, `recommendedSpecialty`, `generalAdvice`, `createdAt`.
* **Relationships (Quan hệ):** Thuộc về một Patient.
* **Supported Requirements:** R04.

## 3. Quy tắc toàn vẹn dữ liệu
* Việc đặt lịch (R01) yêu cầu dữ liệu liên kết giữa Patient, Doctor, Department và Appointment.
* Việc quản lý bệnh nhân (R03) yêu cầu bác sĩ chỉ được xem MedicalRecord của Patient thông qua các Appointment đã được liên kết trực tiếp với bác sĩ đó.
