// prisma/seed.ts – AI Healthcare Assistant Phase 2 Seed
// Run: npx tsx prisma/seed.ts

import { PrismaClient, AppointmentStatus } from "../app/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const dbPath = resolve(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
// @ts-expect-error Prisma 7 adapter typing
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ──────────────────────────────────
  await prisma.aIAdvice.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();

  // ── Departments ──────────────────────────────────────────
  const deptNoiKhoa  = await prisma.department.create({ data: { name: "Nội khoa",        description: "Khám và điều trị bệnh nội tổng quát",    icon: "🔬" } });
  const deptTimMach  = await prisma.department.create({ data: { name: "Tim mạch",         description: "Chuyên về bệnh tim và mạch máu",          icon: "🫀" } });
  const deptThanKinh = await prisma.department.create({ data: { name: "Thần kinh",        description: "Bệnh thần kinh, đau đầu, đột quỵ",        icon: "🧠" } });
  const deptNoiTiet  = await prisma.department.create({ data: { name: "Nội tiết",         description: "Đái tháo đường, tuyến giáp",               icon: "🧬" } });
  const deptHoHap    = await prisma.department.create({ data: { name: "Hô hấp",           description: "Phổi, viêm phế quản, hen suyễn",           icon: "🫁" } });

  // ── Doctors ──────────────────────────────────────────────
  const docKhoa = await prisma.doctor.create({ data: { name: "BS. Trần Minh Khoa",  specialty: "Nội tổng quát",   experience: "12 năm", bio: "Chuyên gia nội khoa, kinh nghiệm điều trị bệnh mãn tính.",       departmentId: deptNoiKhoa.id  } });
  const docHoa  = await prisma.doctor.create({ data: { name: "BS. Phạm Thị Hoa",    specialty: "Tim mạch học",    experience: "15 năm", bio: "Bác sĩ tim mạch có kinh nghiệm điều trị rối loạn nhịp tim.",    departmentId: deptTimMach.id  } });
  const docHung = await prisma.doctor.create({ data: { name: "BS. Lê Văn Hùng",     specialty: "Thần kinh học",   experience: "10 năm", bio: "Chuyên điều trị đau đầu, rối loạn giấc ngủ và đột quỵ.",         departmentId: deptThanKinh.id } });
  const docHa   = await prisma.doctor.create({ data: { name: "BS. Nguyễn Thu Hà",   specialty: "Nội tiết & ĐTĐ", experience: "9 năm",  bio: "Chuyên gia đái tháo đường và rối loạn tuyến giáp.",             departmentId: deptNoiTiet.id  } });
  const docNam  = await prisma.doctor.create({ data: { name: "BS. Võ Hoàng Nam",    specialty: "Hô hấp học",      experience: "8 năm",  bio: "Chuyên điều trị viêm phổi, hen suyễn, bệnh phổi tắc nghẽn.",   departmentId: deptHoHap.id    } });

  // ── Patients ─────────────────────────────────────────────
  const patientLan = await prisma.patient.create({
    data: { name: "Nguyễn Thị Lan",  dateOfBirth: new Date("1992-03-15"), gender: "Nữ",  phone: "0901234567", email: "lan.nguyen@email.com",  address: "123 Lê Lợi, Q.1, TP.HCM",       bloodType: "O+",  weight: "56 kg", height: "162 cm", allergies: "Penicillin"  },
  });
  const patientBinh = await prisma.patient.create({
    data: { name: "Lê Văn Bình",     dateOfBirth: new Date("1974-07-22"), gender: "Nam", phone: "0912345678", email: "binh.le@email.com",      address: "45 Nguyễn Trãi, Q.5, TP.HCM",  bloodType: "B+",  weight: "78 kg", height: "170 cm", allergies: "Không có"    },
  });
  const patientCuc = await prisma.patient.create({
    data: { name: "Phạm Thị Cúc",    dateOfBirth: new Date("1998-11-30"), gender: "Nữ",  phone: "0978901234", email: "cuc.pham@email.com",     address: "78 Hai Bà Trưng, Q.3, TP.HCM", bloodType: "A+",  weight: "50 kg", height: "158 cm", allergies: "Sulfonamide" },
  });

  // ── Appointments ─────────────────────────────────────────
  await prisma.appointment.createMany({
    data: [
      // Nguyễn Thị Lan
      { patientId: patientLan.id,  doctorId: docKhoa.id, departmentId: deptNoiKhoa.id,  date: new Date("2026-05-26"), time: "09:00", reason: "Kiểm tra huyết áp định kỳ", location: "Phòng 203 – Toà B", status: AppointmentStatus.CONFIRMED   },
      { patientId: patientLan.id,  doctorId: docHoa.id,  departmentId: deptTimMach.id,   date: new Date("2026-06-02"), time: "14:30", reason: "Đau ngực, khó thở nhẹ",     location: "Phòng 412 – Toà C", status: AppointmentStatus.PENDING     },
      { patientId: patientLan.id,  doctorId: docHung.id, departmentId: deptThanKinh.id,  date: new Date("2026-06-10"), time: "10:00", reason: "Đau đầu mãn tính",           location: "Phòng 305 – Toà A", status: AppointmentStatus.CONFIRMED   },
      { patientId: patientLan.id,  doctorId: docHa.id,   departmentId: deptNoiTiet.id,   date: new Date("2026-05-15"), time: "08:30", reason: "Kiểm tra đường huyết",        location: "Phòng 110 – Toà B", status: AppointmentStatus.COMPLETED   },
      { patientId: patientLan.id,  doctorId: docKhoa.id, departmentId: deptNoiKhoa.id,  date: new Date("2026-05-10"), time: "11:00", reason: "Khám tổng quát",              location: "Phòng 203 – Toà B", status: AppointmentStatus.CANCELLED   },
      { patientId: patientLan.id,  doctorId: docNam.id,  departmentId: deptHoHap.id,    date: new Date("2026-04-20"), time: "15:00", reason: "Ho kéo dài, khó thở",         location: "Phòng 208 – Toà A", status: AppointmentStatus.RESCHEDULED },
      // Lê Văn Bình
      { patientId: patientBinh.id, doctorId: docKhoa.id, departmentId: deptNoiKhoa.id,  date: new Date("2026-05-26"), time: "08:30", reason: "Mệt mỏi, đau ngực nhẹ",      location: "Phòng 203 – Toà B", status: AppointmentStatus.PENDING     },
      { patientId: patientBinh.id, doctorId: docHoa.id,  departmentId: deptTimMach.id,   date: new Date("2026-04-10"), time: "14:00", reason: "Tái khám tim mạch",           location: "Phòng 412 – Toà C", status: AppointmentStatus.COMPLETED, notes: "ECG bình thường, tiếp tục thuốc" },
      // Phạm Thị Cúc
      { patientId: patientCuc.id,  doctorId: docKhoa.id, departmentId: deptNoiKhoa.id,  date: new Date("2026-05-26"), time: "09:00", reason: "Sốt 3 ngày, ho khan",         location: "Phòng 203 – Toà B", status: AppointmentStatus.CONFIRMED   },
      { patientId: patientCuc.id,  doctorId: docNam.id,  departmentId: deptHoHap.id,    date: new Date("2026-05-20"), time: "11:00", reason: "Ho kéo dài 2 tuần",           location: "Phòng 208 – Toà A", status: AppointmentStatus.COMPLETED, notes: "Chẩn đoán viêm phế quản, kê đơn kháng sinh" },
    ],
  });

  // ── Medical Records ───────────────────────────────────────
  await prisma.medicalRecord.createMany({
    data: [
      { patientId: patientLan.id,   condition: "Tăng huyết áp độ 1",                    diagnosed: new Date("2024-08-10"), medication: "Amlodipine 5mg – 1 viên/ngày",       notes: "Bệnh nhân hợp tác tốt. Cần theo dõi huyết áp mỗi tháng." },
      { patientId: patientBinh.id,  condition: "Rối loạn nhịp tim, Đái tháo đường type 2", diagnosed: new Date("2023-01-05"), medication: "Metformin 500mg, Aspirin 81mg", notes: "Cần theo dõi ECG 3 tháng/lần." },
      { patientId: patientCuc.id,   condition: "Viêm phế quản cấp",                      diagnosed: new Date("2026-05-20"), medication: "Amoxicillin 500mg 3x/ngày, Bromhexine", notes: "Theo dõi 7 ngày." },
    ],
  });

  // ── AI Advice sample ─────────────────────────────────────
  await prisma.aIAdvice.createMany({
    data: [
      {
        patientId:    patientLan.id,
        symptomInput: "Tôi bị đau đầu và chóng mặt từ sáng hôm nay",
        suggestedDept: "Thần kinh",
        responseText:  "Đau đầu kèm chóng mặt có thể do nhiều nguyên nhân như căng thẳng, thiếu ngủ hoặc huyết áp thay đổi. Tôi gợi ý bạn đến khám tại khoa Thần kinh.",
        disclaimer:    "Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.",
      },
      {
        patientId:    patientBinh.id,
        symptomInput: "Tôi bị ho khan kéo dài và hơi khó thở khi đi bộ nhanh.",
        suggestedDept: "Hô hấp",
        responseText:  "Triệu chứng ho kéo dài và khó thở khi vận động có thể liên quan đến đường hô hấp. Bạn nên sắp xếp khám sớm với bác sĩ chuyên khoa Hô hấp để được kiểm tra kỹ hơn.",
        disclaimer:    "Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.",
      },
      {
        patientId:    patientCuc.id,
        symptomInput: "Tôi hay bị đau nhói ở ngực trái thỉnh thoảng.",
        suggestedDept: "Tim mạch",
        responseText:  "Đau nhói vùng ngực là triệu chứng cần được lưu tâm. Tình trạng này nên được đánh giá bởi bác sĩ khoa Tim mạch để loại trừ các nguyên nhân nguy hiểm.",
        disclaimer:    "Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.",
      }
    ]
  });

  console.log("✅ Seed completed!");
  console.log(`   • ${await prisma.department.count()} departments`);
  console.log(`   • ${await prisma.doctor.count()} doctors`);
  console.log(`   • ${await prisma.patient.count()} patients`);
  console.log(`   • ${await prisma.appointment.count()} appointments`);
  console.log(`   • ${await prisma.medicalRecord.count()} medical records`);
  console.log(`   • ${await prisma.aIAdvice.count()} AI advice entries`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
