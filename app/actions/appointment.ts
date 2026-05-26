"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";

// ── Book a new appointment (Patient) ──────────────────────────────────────
export async function bookAppointment(data: {
  patientId: string;
  doctorId: string;
  departmentId: string;
  date: string;        // ISO date string "YYYY-MM-DD"
  time: string;        // "HH:mm"
  reason?: string;
}) {
  const appointment = await prisma.appointment.create({
    data: {
      patientId:    data.patientId,
      doctorId:     data.doctorId,
      departmentId: data.departmentId,
      date:         new Date(data.date),
      time:         data.time,
      reason:       data.reason ?? null,
      status:       AppointmentStatus.PENDING,
    },
    include: {
      doctor:     true,
      department: true,
    },
  });
  revalidatePath("/patient/appointments");
  revalidatePath("/doctor/appointments");
  return appointment;
}

// ── Reschedule an appointment (Patient) ──────────────────────────────────
export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string
) {
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      date:   new Date(date),
      time,
      status: AppointmentStatus.RESCHEDULED,
    },
  });
  revalidatePath("/patient/appointments");
  revalidatePath("/doctor/appointments");
  return updated;
}

// ── Cancel an appointment (Patient) ──────────────────────────────────────
export async function cancelAppointment(id: string) {
  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.CANCELLED },
  });
  revalidatePath("/patient/appointments");
  revalidatePath("/doctor/appointments");
  return updated;
}

// ── Update appointment status (Doctor) ───────────────────────────────────
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  const updated = await prisma.appointment.update({
    where: { id },
    data:  { status },
  });
  revalidatePath("/doctor/appointments");
  return updated;
}

// ── Save doctor notes (Doctor) ───────────────────────────────────────────
export async function saveAppointmentNotes(id: string, notes: string) {
  const updated = await prisma.appointment.update({
    where: { id },
    data:  { notes },
  });
  revalidatePath("/doctor/appointments");
  return updated;
}

// ── Get all appointments for a patient ───────────────────────────────────
export async function getPatientAppointments(patientId: string) {
  return prisma.appointment.findMany({
    where:   { patientId },
    orderBy: { date: "desc" },
    include: { doctor: true, department: true },
  });
}

// ── Get all appointments for a doctor ────────────────────────────────────
export async function getDoctorAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where:   { doctorId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: { patient: true, department: true },
  });
}

// ── Get all appointments (doctor view – all their patients) ──────────────
export async function getAllAppointmentsForDoctor(doctorId: string) {
  return prisma.appointment.findMany({
    where:   { doctorId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: { patient: true, department: true },
  });
}

// ── Get all doctors ──────────────────────────────────────────────────────
export async function getDoctors() {
  return prisma.doctor.findMany({
    include: { department: true },
    orderBy: { name: "asc" },
  });
}

// ── Get all departments ──────────────────────────────────────────────────
export async function getDepartments() {
  return prisma.department.findMany({ orderBy: { name: "asc" } });
}
