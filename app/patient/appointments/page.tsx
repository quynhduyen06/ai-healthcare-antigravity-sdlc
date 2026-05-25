// app/patient/appointments/page.tsx – Server Component
// Fetches real DB data and passes to the client component

import { prisma } from "@/lib/prisma";
import PatientAppointmentsClient from "./client";

export default async function PatientAppointmentsPage() {
  // Get demo patient (Nguyễn Thị Lan)
  const patient = await prisma.patient.findFirst({
    where: { name: "Nguyễn Thị Lan" },
  });

  if (!patient) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <p>⚠️ Không tìm thấy bệnh nhân demo. Hãy chạy lại seed: <code>npm run db:seed</code></p>
      </div>
    );
  }

  // Load appointments with doctor + department info
  const appointments = await prisma.appointment.findMany({
    where:   { patientId: patient.id },
    orderBy: { date: "desc" },
    include: { doctor: { include: { department: true } }, department: true },
  });

  // Load all doctors for the picker (with department info)
  const doctors = await prisma.doctor.findMany({
    include: { department: true },
    orderBy: { name: "asc" },
  });

  // Serialize for client (Dates → strings)
  const serialized = appointments.map((a) => ({
    id:           a.id,
    date:         a.date.toISOString().split("T")[0],
    time:         a.time,
    doctorId:     a.doctorId,
    doctorName:   a.doctor.name,
    department:   a.department.name,
    departmentId: a.departmentId,
    location:     a.location ?? "Sẽ được thông báo",
    status:       a.status.toLowerCase() as never,
    reason:       a.reason ?? "",
  }));

  const doctorList = doctors.map((d) => ({
    id:          d.id,
    name:        d.name,
    department:  d.department.name,
    departmentId: d.departmentId,
    specialty:   d.specialty,
    experience:  d.experience,
    bio:         d.bio ?? "",
  }));

  return (
    <PatientAppointmentsClient
      patientId={patient.id}
      initialAppointments={serialized}
      doctors={doctorList}
    />
  );
}
