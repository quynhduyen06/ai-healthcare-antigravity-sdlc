import DoctorPatientsClient from "./client";
import { getDoctorPatients, getMedicalRecords, getPatientHistory } from "@/app/actions/patient";
import { prisma } from "@/lib/prisma";

export default async function DoctorPatientsPage() {
  // Mock current doctor login
  const doctor = await prisma.doctor.findFirst();
  if (!doctor) {
    return <div>Chưa có dữ liệu bác sĩ trong hệ thống. Hãy chạy seed.</div>;
  }

  // Lấy danh sách bệnh nhân dựa trên lịch hẹn của bác sĩ
  const rawPatients = await getDoctorPatients(doctor.id);

  // Gộp thông tin chi tiết cho từng bệnh nhân
  const patientsWithDetails = await Promise.all(
    rawPatients.map(async (p) => {
      const records = await getMedicalRecords(p.id);
      const history = await getPatientHistory(p.id, doctor.id);
      
      const latestRecord = records[0];

      return {
        id: p.id,
        name: p.name,
        age: new Date().getFullYear() - p.dateOfBirth.getFullYear(),
        gender: ((p.gender === "female" || p.gender === "Nữ") ? "Nữ" : "Nam") as "Nữ" | "Nam",
        phone: p.phone || "",
        email: p.email || "",
        address: p.address || "",
        dob: p.dateOfBirth.toISOString(),
        bloodType: (p.bloodType as any) || "Chưa rõ",
        weight: p.weight || "Chưa rõ",
        height: p.height || "Chưa rõ",
        allergies: p.allergies || "Không rõ",
        tags: [],
        record: {
          condition: latestRecord?.condition || "Chưa có chẩn đoán",
          diagnosed: latestRecord?.diagnosed ? latestRecord.diagnosed.toISOString() : new Date().toISOString(),
          medication: latestRecord?.medication || "Không có",
          notes: latestRecord?.notes || "Chưa có ghi chú",
        },
        history: history.map(h => ({
          id: h.id,
          date: h.date.toISOString(),
          time: h.time,
          reason: h.reason || "Khám bệnh",
          status: h.status.toLowerCase() as any,
          note: h.notes || "",
        })),
      };
    })
  );

  return <DoctorPatientsClient initialPatients={patientsWithDetails} />;
}
