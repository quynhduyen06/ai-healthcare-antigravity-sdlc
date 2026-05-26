"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { saveAIAdvice } from "@/app/actions/patient";

// ── AI Logic: keyword → department mapping ──────────────────────────────
const DEPT_DISCLAIMER =
  "Nội dung từ AI Assistant chỉ mang tính tham khảo và hỗ trợ ban đầu, không phải chẩn đoán y khoa. Vui lòng gặp bác sĩ hoặc chuyên gia y tế để được tư vấn chính xác.";

interface DeptSuggestion {
  dept: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
}

function classifySymptom(text: string): DeptSuggestion | null {
  const t = text.toLowerCase().trim();

  // Greeting or very short text
  if (/^(hi|hello|chào|xin chào|alo|dạ|vâng|ok)[\s.!?]*$/iu.test(t) || t.length < 6) {
    return null;
  }

  if (/sốt|ho|đau họng|cảm|cúm|hắt hơi|sổ mũi|viêm họng/.test(t)) {
    return { dept: "Nội tổng quát", icon: "🔬", color: "#92400e", bg: "#fef3c7", desc: "Sốt, ho, đau họng, cảm cúm" };
  }
  if (/đau ngực|tim|nhịp tim|huyết áp|tức ngực|khó thở nặng/.test(t)) {
    return { dept: "Tim mạch", icon: "🫀", color: "#991b1b", bg: "#fee2e2", desc: "Đau ngực, tim, huyết áp" };
  }
  if (/nổi mẩn|ngứa|dị ứng|mụn|phát ban|da liễu|nổi ban/.test(t)) {
    return { dept: "Da liễu", icon: "🩺", color: "#9d174d", bg: "#fce7f3", desc: "Nổi mẩn, ngứa, dị ứng, mụn" };
  }
  if (/đau đầu|chóng mặt|nhức đầu|mất ngủ|co giật|tê bì|đột quỵ/.test(t)) {
    return { dept: "Thần kinh", icon: "🧠", color: "#5b21b6", bg: "#ede9fe", desc: "Đau đầu, chóng mặt, mất ngủ" };
  }
  if (/trẻ em|bé|trẻ con|nhi|con tôi|em bé/.test(t)) {
    return { dept: "Nhi khoa", icon: "👶", color: "#0c4a6e", bg: "#e0f2fe", desc: "Triệu chứng ở trẻ em" };
  }
  if (/tai|mũi|họng|viêm tai|ù tai|nghẹt mũi|viêm amidan/.test(t)) {
    return { dept: "Tai mũi họng", icon: "👂", color: "#134e4a", bg: "#ccfbf1", desc: "Tai, mũi, họng" };
  }
  if (/đau lưng|đau khớp|đau xương|cứng khớp|viêm khớp|thoát vị/.test(t)) {
    return { dept: "Cơ xương khớp", icon: "🦴", color: "#065f46", bg: "#d1fae5", desc: "Đau lưng, đau khớp, đau xương" };
  }
  if (/khó thở|ho kéo dài|viêm phổi|hen suyễn|phổi/.test(t)) {
    return { dept: "Hô hấp", icon: "🫁", color: "#1e40af", bg: "#dbeafe", desc: "Khó thở, ho, viêm phổi" };
  }
  // Default fallback if no keywords match but it's not a greeting
  return { dept: "Nội tổng quát", icon: "🔬", color: "#92400e", bg: "#fef3c7", desc: "Khám tổng quát, sốt, mệt mỏi" };
}

function buildAIResponse(symptom: string, suggestion: DeptSuggestion | null): string {
  if (!suggestion) {
    return "Xin chào! Tôi là Trợ lý AI y tế. Vui lòng mô tả chi tiết triệu chứng của bạn (ví dụ: thời gian bắt đầu, mức độ đau) để tôi có thể định hướng chuyên khoa khám phù hợp.";
  }

  const base = `Cảm ơn bạn đã chia sẻ. Dựa trên mô tả, các triệu chứng này thuộc phạm vi đánh giá của khoa **${suggestion.dept.toUpperCase()}**. `;
  
  const messages: Record<string, string> = {
    "Nội tổng quát":
      base + `Vui lòng đặt lịch khám để bác sĩ có thể chẩn đoán chính xác tình trạng của bạn. Trong thời gian chờ đợi, hãy theo dõi sát các dấu hiệu bất thường.`,
    "Tim mạch":
      base + `Vui lòng đặt lịch khám sớm để được bác sĩ kiểm tra và đánh giá chuyên sâu. Lưu ý: Nếu xuất hiện cơn đau thắt ngực dữ dội hoặc khó thở nghiêm trọng, hãy gọi **115** ngay lập tức.`,
    "Da liễu":
      base + `Bạn nên gặp bác sĩ chuyên khoa để được tư vấn. Xin lưu ý không nên tự ý bôi các loại thuốc không rõ nguồn gốc lên da trước khi có chỉ định của bác sĩ.`,
    "Thần kinh":
      base + `Vui lòng đặt lịch khám để bác sĩ tìm ra nguyên nhân cụ thể. Lưu ý: Nếu bị đau đầu đột ngột dữ dội kèm theo yếu liệt nửa người hoặc nói đớ, hãy đến cơ sở y tế cấp cứu ngay lập tức.`,
    "Nhi khoa":
      base + `Sức khoẻ của trẻ em cần được bác sĩ thăm khám trực tiếp để đảm bảo an toàn. Không nên tự ý dùng thuốc cho trẻ nếu chưa có chỉ định từ bác sĩ.`,
    "Tai mũi họng":
      base + `Bạn nên đặt lịch khám để bác sĩ kiểm tra trực tiếp. Vui lòng không tự ý sử dụng thuốc kháng sinh khi chưa có đơn thuốc từ bác sĩ.`,
    "Cơ xương khớp":
      base + `Vui lòng đặt lịch khám để bác sĩ chuyên khoa đánh giá. Trong thời gian này, hãy hạn chế vận động mạnh tại vùng đang bị đau và không lạm dụng thuốc giảm đau kéo dài.`,
    "Hô hấp":
      base + `Bạn nên gặp bác sĩ để được thăm khám chi tiết. Lưu ý: Nếu xuất hiện tình trạng khó thở nặng, nhịp thở nhanh hoặc môi tím tái, hãy gọi **115** ngay lập tức.`,
  };
  return messages[suggestion.dept] ?? (base + `Vui lòng đặt lịch khám để bác sĩ chuyên khoa đánh giá và tư vấn hướng xử trí phù hợp.`);
}

// ── Static sidebar data ─────────────────────────────────────────────────
const generalAdvice = [
  { icon: "💧", text: "Uống đủ 2 lít nước mỗi ngày" },
  { icon: "🛌", text: "Ngủ đủ 7–8 tiếng mỗi đêm" },
  { icon: "🥗", text: "Ăn đa dạng rau xanh và trái cây" },
  { icon: "🚶", text: "Vận động nhẹ ít nhất 30 phút/ngày" },
  { icon: "🚭", text: "Không hút thuốc lá và hạn chế rượu bia" },
  { icon: "😊", text: "Giảm căng thẳng bằng thiền định hoặc yoga" },
];

const allDepts = [
  { icon: "🫀", name: "Tim mạch",       desc: "Huyết áp, nhịp tim bất thường",     bg: "#fee2e2", color: "#991b1b" },
  { icon: "🧠", name: "Thần kinh",      desc: "Đau đầu, chóng mặt, mất ngủ",      bg: "#ede9fe", color: "#5b21b6" },
  { icon: "🫁", name: "Hô hấp",         desc: "Ho, khó thở, viêm phổi",           bg: "#dbeafe", color: "#1e40af" },
  { icon: "🦴", name: "Cơ xương khớp", desc: "Đau lưng, viêm khớp",              bg: "#d1fae5", color: "#065f46" },
  { icon: "🔬", name: "Nội tổng quát", desc: "Khám tổng quát, sốt, mệt mỏi",    bg: "#fef3c7", color: "#92400e" },
  { icon: "🩺", name: "Da liễu",        desc: "Nổi mẩn, ngứa, dị ứng",           bg: "#fce7f3", color: "#9d174d" },
  { icon: "👶", name: "Nhi khoa",        desc: "Triệu chứng ở trẻ em",            bg: "#e0f2fe", color: "#0c4a6e" },
  { icon: "👂", name: "Tai mũi họng",   desc: "Tai, mũi, họng, viêm amidan",     bg: "#ccfbf1", color: "#134e4a" },
];

interface Message {
  role: "user" | "ai";
  content: string;
  suggestion?: DeptSuggestion;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    content:
      "Xin chào! Tôi là trợ lý AI sức khỏe của HealthCare. Hãy mô tả triệu chứng hoặc vấn đề sức khỏe bạn đang gặp phải, tôi sẽ gợi ý khoa khám phù hợp và đưa ra lời khuyên ban đầu.",
  },
];

export default function PatientAssistantClient({
  patientId,
  initialMessages = INITIAL_MESSAGES,
}: {
  patientId: string;
  initialMessages?: Message[];
}) {
  const [messages,   setMessages]   = useState<Message[]>(initialMessages);
  const [inputText,  setInputText]  = useState("");
  const [isTyping,   setIsTyping]   = useState(false);
  const [inputError, setInputError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) {
      setInputError("Vui lòng nhập triệu chứng hoặc vấn đề sức khỏe bạn đang gặp phải.");
      return;
    }
    setInputError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInputText("");
    setIsTyping(true);

    setTimeout(async () => {
      const suggestion = classifySymptom(text);
      const responseText = buildAIResponse(text, suggestion);
      setMessages((prev) => [...prev, { role: "ai", content: responseText, suggestion }]);
      setIsTyping(false);

      // Save to database
      if (patientId) {
        await saveAIAdvice({
          patientId,
          symptomInput: text,
          suggestedDept: suggestion ? suggestion.dept : "Chưa xác định",
          responseText,
          disclaimer: DEPT_DISCLAIMER,
        }).catch(console.error);
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role="patient" />

      <main className="main-content page-bg-premium" style={{ position: "relative", overflowX: "hidden" }}>
        {/* Ambient glowing meshes */}
        <div style={{ position: "absolute", top: 0, left: "15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,127,255,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }}></div>
        <div style={{ position: "absolute", top: "300px", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }}></div>

        <header className="page-header page-header-premium" style={{ position: "relative", zIndex: 10 }}>
          <div className="page-header-left">
            <h1 className="page-title" style={{ fontFamily: "Space Grotesk, var(--font-display)", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a" }}>Trợ lý AI sức khỏe</h1>
            <p className="page-subtitle" style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Hỗ trợ rà soát triệu chứng và định hướng chuyên khoa</p>
          </div>
          <div className="page-header-right">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(16,185,129,0.2)" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }}></span>
              AI ĐANG HOẠT ĐỘNG
            </div>
          </div>
        </header>

        <div className="page-body" style={{ position: "relative", zIndex: 10 }}>
          {/* BENTO GRID LAYOUT */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            {/* LEFT COLUMN: CHAT INTERFACE */}
            <div style={{ flex: "1 1 0%", minWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                height: "680px" // Fixed height for chat window
              }}>
                {/* Chat Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "24px", background: "linear-gradient(to bottom, #ffffff, #f8fafc)" }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "100%" }}>
                      <div style={{ display: "flex", gap: "12px", maxWidth: "85%", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                        {/* Avatar */}
                        <div style={{ 
                          width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          background: msg.role === "user" ? "#e0f2fe" : "rgba(0, 127, 255, 0.08)",
                          color: msg.role === "user" ? "#0284c7" : "var(--azure)",
                          fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em"
                        }}>
                          {msg.role === "user" ? "NL" : "AI"}
                        </div>
                        {/* Bubble */}
                        <div style={{
                          padding: "16px 20px",
                          borderRadius: "20px",
                          borderTopRightRadius: msg.role === "user" ? "4px" : "20px",
                          borderTopLeftRadius: msg.role === "ai" ? "4px" : "20px",
                          background: msg.role === "user" ? "var(--azure)" : "#ffffff",
                          color: msg.role === "user" ? "#ffffff" : "#1e293b",
                          border: msg.role === "user" ? "none" : "1px solid rgba(0,0,0,0.06)",
                          boxShadow: msg.role === "user" ? "0 4px 12px rgba(0,127,255,0.25)" : "0 4px 12px rgba(0,0,0,0.02)",
                          fontSize: "0.95rem",
                          lineHeight: 1.6
                        }}>
                          {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} style={{ color: msg.role === "ai" ? "var(--color-danger)" : "inherit", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                      </div>
                      
                      {/* Suggestion Card Inline */}
                      {msg.role === "ai" && msg.suggestion && (
                        <div style={{
                          marginTop: "12px",
                          marginLeft: "50px",
                          display: "inline-flex", alignItems: "center", gap: "10px",
                          background: msg.suggestion.bg,
                          border: `1px solid ${msg.suggestion.color}20`,
                          borderRadius: "12px",
                          padding: "10px 16px",
                          fontSize: "0.85rem",
                          color: msg.suggestion.color,
                          fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                        }}>
                          <span style={{ fontSize: "1.2rem", filter: "grayscale(20%)" }}>{msg.suggestion.icon}</span>
                          Gợi ý chuyên khoa: {msg.suggestion.dept}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: "flex", gap: "12px", maxWidth: "85%" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "rgba(0, 127, 255, 0.08)", color: "var(--azure)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em" }}>
                        AI
                      </div>
                      <div style={{ padding: "16px 20px", borderRadius: "20px", borderTopLeftRadius: "4px", background: "#ffffff", color: "#94a3b8", border: "1px solid rgba(0,0,0,0.06)", fontSize: "0.95rem", fontStyle: "italic" }}>
                        Đang phân tích lâm sàng...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: "24px 32px", background: "#ffffff", borderTop: "1px solid rgba(0, 127, 255, 0.08)", zIndex: 2 }}>
                  <div style={{ position: "relative" }}>
                    <textarea
                      id="symptom-input"
                      placeholder="Mô tả chi tiết triệu chứng của bạn (Ví dụ: đau nhói ngực trái từ sáng)..."
                      value={inputText}
                      onChange={(e) => { setInputText(e.target.value); if (inputError) setInputError(""); }}
                      onKeyDown={handleKeyDown}
                      maxLength={500}
                      style={{ 
                        width: "100%", 
                        minHeight: "60px", 
                        padding: "18px 24px", 
                        paddingRight: "64px",
                        borderRadius: "20px", 
                        border: inputError ? "1.5px solid var(--color-danger)" : "1px solid #cbd5e1", 
                        fontSize: "0.95rem", 
                        outline: "none", 
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                        resize: "none",
                        fontFamily: "inherit",
                        lineHeight: 1.5,
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--azure)"}
                      onBlur={(e) => e.target.style.borderColor = inputError ? "var(--color-danger)" : "#cbd5e1"}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isTyping || !inputText.trim()}
                      style={{ 
                        position: "absolute", 
                        right: "8px", 
                        bottom: "8px", 
                        background: (isTyping || !inputText.trim()) ? "#e2e8f0" : "var(--azure)", 
                        color: (isTyping || !inputText.trim()) ? "#94a3b8" : "#ffffff", 
                        border: "none", 
                        width: "44px", 
                        height: "44px", 
                        borderRadius: "12px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        cursor: (isTyping || !inputText.trim()) ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: (isTyping || !inputText.trim()) ? "none" : "0 4px 14px rgba(0,127,255,0.3)"
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                    </button>
                  </div>
                  {inputError && (
                    <div style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                      {inputError}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>{inputText.length}/500 ký tự (Nhấn Enter để gửi)</span>
                    <button
                      onClick={() => { setMessages(INITIAL_MESSAGES); setInputText(""); setInputError(""); }}
                      style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Xoá hội thoại
                    </button>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "20px", padding: "20px 24px", display: "flex", gap: "16px", alignItems: "flex-start", boxShadow: "inset 0 2px 10px rgba(245,158,11,0.02)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", color: "#b45309", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Khuyến cáo y tế</h4>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#92400e", lineHeight: 1.6, fontWeight: 500 }}>
                    {DEPT_DISCLAIMER} Nếu bạn có triệu chứng nguy hiểm (đau ngực dữ dội, khó thở, co giật), vui lòng gọi <strong>115</strong> hoặc đến cơ sở y tế gần nhất ngay lập tức.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INFO CARDS */}
            <div style={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* General Advice */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px"
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", padding: "6px 14px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  LỜI KHUYÊN SỨC KHỎE
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {generalAdvice.map((a, i) => (
                    <li key={i} style={{ display: "flex", gap: "14px", alignItems: "center", fontSize: "0.9rem", color: "#334155", fontWeight: 600, paddingBottom: i < generalAdvice.length - 1 ? "16px" : "0", borderBottom: i < generalAdvice.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>{a.icon}</div>
                      {a.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Departments */}
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid rgba(0, 127, 255, 0.08)",
                boxShadow: "0 10px 40px -10px rgba(0, 127, 255, 0.05)",
                padding: "28px"
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0, 127, 255, 0.08)", color: "var(--azure)", padding: "6px 14px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  DANH MỤC CHUYÊN KHOA
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {allDepts.map((d, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: i < allDepts.length - 1 ? "16px" : "0", borderBottom: i < allDepts.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: d.bg, color: d.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.3rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>{d.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Khoa {d.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px", fontWeight: 500 }}>{d.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
