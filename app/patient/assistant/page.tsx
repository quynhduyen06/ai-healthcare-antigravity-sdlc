import { prisma } from "@/lib/prisma";
import PatientAssistantClient from "./client";
import { getPatientAIAdvices } from "@/app/actions/patient";

// Lấy icon/color tương ứng với khoa khám
function getDeptVisuals(deptName: string) {
  const depts = [
    { name: "Tim mạch", icon: "🫀", bg: "#fee2e2", color: "#991b1b" },
    { name: "Thần kinh", icon: "🧠", bg: "#ede9fe", color: "#5b21b6" },
    { name: "Hô hấp", icon: "🫁", bg: "#dbeafe", color: "#1e40af" },
    { name: "Cơ xương khớp", icon: "🦴", bg: "#d1fae5", color: "#065f46" },
    { name: "Nội tổng quát", icon: "🔬", bg: "#fef3c7", color: "#92400e" },
    { name: "Da liễu", icon: "🩺", bg: "#fce7f3", color: "#9d174d" },
    { name: "Nhi khoa", icon: "👶", bg: "#e0f2fe", color: "#0c4a6e" },
    { name: "Tai mũi họng", icon: "👂", bg: "#ccfbf1", color: "#134e4a" },
  ];
  return depts.find((d) => d.name === deptName) || depts[4];
}

export default async function PatientAssistantServerPage() {
  // Lấy patient đầu tiên làm mock user đăng nhập
  const patient = await prisma.patient.findFirst();
  if (!patient) return <div>Không tìm thấy bệnh nhân</div>;

  // Lấy lịch sử AI advice của patient này
  const advices = await getPatientAIAdvices(patient.id);

  // Chuyển đổi dữ liệu db sang format của Message[] cho Client
  const initialMessages: any[] = [
    {
      role: "ai" as const,
      content:
        "Xin chào! Tôi là trợ lý AI sức khỏe của HealthCare. Hãy mô tả triệu chứng hoặc vấn đề sức khỏe bạn đang gặp phải, tôi sẽ gợi ý khoa khám phù hợp và đưa ra lời khuyên ban đầu.",
    },
  ];

  advices.forEach((advice) => {
    // Message từ User
    initialMessages.push({
      role: "user" as const,
      content: advice.symptomInput,
    });
    // Message từ AI
    const deptVisuals = getDeptVisuals(advice.suggestedDept);
    initialMessages.push({
      role: "ai" as const,
      content: advice.responseText,
      suggestion: {
        dept: advice.suggestedDept,
        icon: deptVisuals.icon,
        color: deptVisuals.color,
        bg: deptVisuals.bg,
        desc: advice.suggestedDept,
      },
    });
  });

  return (
    <PatientAssistantClient
      patientId={patient.id}
      initialMessages={initialMessages}
    />
  );
}
