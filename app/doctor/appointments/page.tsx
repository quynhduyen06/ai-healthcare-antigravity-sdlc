// app/doctor/appointments/page.tsx – Server Component
import { prisma } from "@/lib/prisma";
import DoctorAppointmentsClient from "./client";

export default async function DoctorAppointmentsPage() {
  // Demo doctor = BS. Trần Minh Khoa
  const doctor = await prisma.doctor.findFirst({
    where: { name: "BS. Trần Minh Khoa" },
    include: { department: true },
  });

  if (!doctor) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <p>⚠️ Không tìm thấy bác sĩ demo. Hãy chạy lại: <code>npm run db:seed</code></p>
      </div>
    );
  }

  const appointments = await prisma.appointment.findMany({
    where:   { doctorId: doctor.id },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: { patient: true, department: true },
  });

  const serialized = appointments.map((a) => ({
    id:          a.id,
    date:        a.date.toISOString().split("T")[0],
    time:        a.time,
    patientName: a.patient.name,
    patientAge:  new Date().getFullYear() - new Date(a.patient.dateOfBirth).getFullYear(),
    department:  a.department.name,
    reason:      a.reason ?? "",
    status:      a.status.toLowerCase() as never,
    notes:       a.notes ?? "",
  }));

  return (
    <DoctorAppointmentsClient
      doctorId={doctor.id}
      doctorName={doctor.name}
      deptName={doctor.department.name}
      initialAppointments={serialized}
    />
  );
}
