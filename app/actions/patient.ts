"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Get all patients (doctor view – via their appointments) ───────────────
export async function getDoctorPatients(doctorId: string) {
  // Get unique patients who have appointments with this doctor
  const appointments = await prisma.appointment.findMany({
    where:   { doctorId },
    select:  { patientId: true },
    distinct: ["patientId"],
  });
  const patientIds = appointments.map((a) => a.patientId);

  return prisma.patient.findMany({
    where:   { id: { in: patientIds } },
    orderBy: { name: "asc" },
  });
}

// ── Get a patient's medical records ──────────────────────────────────────
export async function getMedicalRecords(patientId: string) {
  return prisma.medicalRecord.findMany({
    where:   { patientId },
    orderBy: { diagnosed: "desc" },
  });
}

// ── Get a patient's appointment history (for doctor view) ─────────────────
export async function getPatientHistory(patientId: string, doctorId: string) {
  return prisma.appointment.findMany({
    where:   { patientId, doctorId },
    orderBy: { date: "desc" },
    include: { doctor: true, department: true },
  });
}

// ── Get a single patient by ID ────────────────────────────────────────────
export async function getPatient(patientId: string) {
  return prisma.patient.findUnique({
    where: { id: patientId },
  });
}

// ── Save AI advice record ────────────────────────────────────────────────
export async function saveAIAdvice(data: {
  patientId: string;
  symptomInput: string;
  suggestedDept: string;
  responseText: string;
  disclaimer: string;
}) {
  const advice = await prisma.aIAdvice.create({ data });
  revalidatePath("/patient/assistant");
  return advice;
}
