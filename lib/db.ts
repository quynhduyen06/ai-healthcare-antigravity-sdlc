// lib/db.ts – Demo user IDs for the prototype (no real auth)
// These match the seed data in prisma/seed.ts

import { prisma } from "./prisma";

/** Returns the demo patient (Nguyễn Thị Lan) */
export async function getDemoPatient() {
  return prisma.patient.findFirst({ where: { name: "Nguyễn Thị Lan" } });
}

/** Returns the demo doctor (BS. Trần Minh Khoa) */
export async function getDemoDoctor() {
  return prisma.doctor.findFirst({
    where: { name: "BS. Trần Minh Khoa" },
    include: { department: true },
  });
}

/** Map DB status (UPPERCASE) → UI status (lowercase) */
export function mapStatus(s: string): string {
  return s.toLowerCase();
}
