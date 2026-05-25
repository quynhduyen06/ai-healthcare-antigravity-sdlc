"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

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

function classifySymptom(text: string): DeptSuggestion {
  const t = text.toLowerCase();

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
  // Default
  return { dept: "Nội tổng quát", icon: "🔬", color: "#92400e", bg: "#fef3c7", desc: "Khám tổng quát, sốt, mệt mỏi" };
}

function buildAIResponse(symptom: string, suggestion: DeptSuggestion): string {
  const messages: Record<string, string> = {
    "Nội tổng quát":
      `Cảm ơn bạn đã chia sẻ triệu chứng. Dựa trên mô tả của bạn, tôi gợi ý bạn nên đến khám tại khoa **${suggestion.dept}** để được bác sĩ đánh giá chính xác hơn. Trong thời gian chờ đợi, hãy nghỉ ngơi đầy đủ, uống nhiều nước và tránh tiếp xúc với người khác nếu nghi ngờ bệnh lây nhiễm.`,
    "Tim mạch":
      `Các triệu chứng liên quan đến ngực và tim cần được thăm khám sớm. Tôi gợi ý bạn đến khoa **${suggestion.dept}** để được đo điện tim (ECG) và kiểm tra huyết áp. Nếu cơn đau ngực dữ dội hoặc kéo dài hơn 20 phút, hãy gọi **115** ngay lập tức.`,
    "Da liễu":
      `Các triệu chứng trên da như nổi mẩn, ngứa hoặc dị ứng cần được chuyên gia đánh giá. Tôi gợi ý bạn đến khoa **${suggestion.dept}**. Tránh gãi vùng ngứa và không tự ý dùng kem bôi không rõ nguồn gốc trước khi được khám.`,
    "Thần kinh":
      `Đau đầu và chóng mặt có thể do nhiều nguyên nhân như căng thẳng, thiếu ngủ, huyết áp thay đổi hoặc các vấn đề thần kinh. Tôi gợi ý bạn đến khoa **${suggestion.dept}**. Hãy nghỉ ngơi nơi yên tĩnh và theo dõi thêm. Nếu đau đầu đột ngột dữ dội kèm yếu nửa người, hãy đến cấp cứu ngay.`,
    "Nhi khoa":
      `Đối với các triệu chứng ở trẻ em, cần được bác sĩ chuyên khoa **${suggestion.dept}** thăm khám. Trẻ em có thể diễn tiến bệnh nhanh hơn người lớn, vì vậy không nên chủ quan. Hãy giữ ấm cho bé và đảm bảo bé được bú hoặc uống nước đầy đủ.`,
    "Tai mũi họng":
      `Các triệu chứng về tai, mũi hoặc họng cần được kiểm tra bởi bác sĩ khoa **${suggestion.dept}**. Tránh tự dùng thuốc kháng sinh khi chưa được kê đơn. Xúc miệng bằng nước muối sinh lý có thể giúp giảm nhẹ triệu chứng tạm thời.`,
    "Cơ xương khớp":
      `Đau lưng và đau khớp kéo dài cần được chuyên gia khoa **${suggestion.dept}** đánh giá. Trong thời gian chờ khám, hạn chế vận động mạnh và chườm ấm vùng đau. Không tự ý dùng thuốc giảm đau kéo dài mà không có chỉ định bác sĩ.`,
    "Hô hấp":
      `Các triệu chứng về đường hô hấp như khó thở hoặc ho kéo dài cần được kiểm tra tại khoa **${suggestion.dept}**. Nếu khó thở nặng, môi hoặc ngón tay tím tái, hãy gọi **115** ngay lập tức.`,
  };
  return messages[suggestion.dept] ?? messages["Nội tổng quát"];
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

export default function PatientAssistantPage() {
  const [messages,   setMessages]   = useState<Message[]>(INITIAL_MESSAGES);
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

    setTimeout(() => {
      const suggestion = classifySymptom(text);
      const responseText = buildAIResponse(text, suggestion);
      setMessages((prev) => [...prev, { role: "ai", content: responseText, suggestion }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role="patient" />

      <main className="main-content">
        <header className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Trợ lý AI sức khỏe</h1>
            <p className="page-subtitle">Mô tả triệu chứng để nhận gợi ý khoa khám phù hợp</p>
          </div>
          <div className="page-header-right">
            <span className="badge badge-confirmed">🟢 AI đang hoạt động</span>
          </div>
        </header>

        <div className="page-body">
          <div className="chat-container">
            {/* ── Left: Chat ─────────────────────────────── */}
            <div className="chat-main">
              {/* Messages */}
              <div className="chat-messages" id="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`message ${msg.role === "user" ? "user" : ""}`}>
                      <div className={`message-avatar ${msg.role === "user" ? "user-avatar" : "ai-avatar"}`}>
                        {msg.role === "user" ? "NL" : "🤖"}
                      </div>
                      <div className="message-bubble">{msg.content}</div>
                    </div>

                    {/* Inline department suggestion after AI response */}
                    {msg.role === "ai" && msg.suggestion && (
                      <div style={{
                        marginLeft: "44px", marginTop: "8px",
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: msg.suggestion.bg,
                        border: `1px solid ${msg.suggestion.color}40`,
                        borderRadius: "var(--radius-full)",
                        padding: "4px 12px",
                        fontSize: ".78rem",
                        color: msg.suggestion.color,
                        fontWeight: 600,
                      }}>
                        <span>{msg.suggestion.icon}</span>
                        Gợi ý khoa: {msg.suggestion.dept}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="message">
                    <div className="message-avatar ai-avatar">🤖</div>
                    <div className="message-bubble" style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                      Đang phân tích triệu chứng…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="chat-input-area">
                <label className="form-label" htmlFor="symptom-input">Mô tả triệu chứng của bạn</label>
                <textarea
                  id="symptom-input"
                  placeholder="Ví dụ: Tôi bị đau đầu từ sáng hôm nay, kèm theo chóng mặt và buồn nôn..."
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); if (inputError) setInputError(""); }}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  style={{ border: inputError ? "1.5px solid var(--color-danger)" : undefined }}
                />
                {inputError && (
                  <div style={{ color: "var(--color-danger)", fontSize: ".78rem", marginTop: "4px" }}>
                    ⚠️ {inputError}
                  </div>
                )}
                <div className="chat-input-actions">
                  <span className="char-count">{inputText.length}/500 ký tự</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setMessages(INITIAL_MESSAGES); setInputText(""); setInputError(""); }}
                    id="btn-clear-chat"
                  >
                    🗑 Xoá hội thoại
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={isTyping}
                    id="btn-send-message"
                  >
                    📤 Gửi
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="disclaimer">
                <span className="disclaimer-icon">⚠️</span>
                <p>
                  <strong>Lưu ý quan trọng</strong>
                  {DEPT_DISCLAIMER}
                </p>
              </div>
            </div>

            {/* ── Right: Sidebar ──────────────────────────── */}
            <div className="chat-sidebar">
              {/* General advice */}
              <div className="advice-card">
                <div className="advice-card-header">
                  <span style={{ fontSize: "1.2rem" }}>💡</span>
                  <h3>Lời khuyên sức khỏe chung</h3>
                </div>
                <ul className="advice-list">
                  {generalAdvice.map((a, i) => (
                    <li key={i}>
                      <span className="advice-icon">{a.icon}</span>
                      {a.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Departments */}
              <div className="dept-card">
                <div className="advice-card-header">
                  <span style={{ fontSize: "1.2rem" }}>🏥</span>
                  <h3>Khoa khám gợi ý</h3>
                </div>
                {allDepts.map((d, i) => (
                  <div key={i} className="dept-item">
                    <div className="dept-icon" style={{ background: d.bg, color: d.color }}>{d.icon}</div>
                    <div className="dept-info">
                      <div className="dept-name">{d.name}</div>
                      <div className="dept-desc">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
