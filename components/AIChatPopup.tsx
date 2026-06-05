"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot } from "lucide-react"

interface Message { role: "bot" | "user"; text: string }

const RESPONSES: Record<string, string> = {
  "نقاط": "تكسب النقاط عند إنجاز المهام والحصول على موافقة الإدارة. كل مهمة لها عدد نقاط محدد.",
  "أسهم": "يمكنك تحويل نقاطك إلى أسهم من خلال لوحة التحكم. كل 100 نقطة = سهم واحد (حسب إعدادات الإدارة).",
  "سحب": "يمكنك سحب نقاطك عبر Vodafone Cash أو InstaPay أو Binance USDT من خلال زر 'السحب' في لوحتك.",
  "مهام": "اذهب لغرفة المهام، اختر مهمة مناسبة لقسمك، وقدّم عملك. ستراجع الإدارة وتعتمد المكافأة.",
  "مشاريع": "في غرفة المشاريع يمكنك الاطلاع على المشاريع الجارية والتقدم للانضمام إليها.",
  "رمز": "رمز الدخول هو هويتك في المنصة. احتفظ به بأمان ولا تشاركه مع أحد.",
}

function getBotReply(msg: string): string {
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (msg.includes(key)) return val
  }
  return "شكراً لسؤالك! للحصول على مساعدة أكثر تفصيلاً، يرجى التواصل مع فريق الدعم أو مراجعة قسم المساعدة."
}

interface Props { onClose: () => void }

export default function AIChatPopup({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "أهلاً بك في عرباوي، أنا أيا. كيف أساعدك اليوم؟" }
  ])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getBotReply(userMsg) }])
    }, 600)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm animate-scaleIn flex flex-col" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.3)", height: "500px" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #222" }}>
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{ background: "#1a0d00", border: "2px solid #f97316", width: 36, height: 36 }}>
              <Bot size={18} color="#f97316" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">أيا</p>
              <p className="text-xs" style={{ color: "#22c55e" }}>متاحة الآن</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={18} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"} animate-fadeIn`}>
              {m.role === "bot" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center ml-2 shrink-0 mt-1" style={{ background: "#1a0d00", border: "1px solid #f97316" }}>
                  <Bot size={12} color="#f97316" />
                </div>
              )}
              <div
                className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: m.role === "user" ? "#1a1a1a" : "#1a0d00",
                  border: `1px solid ${m.role === "user" ? "#333" : "#f97316"}`,
                  color: "#fff",
                  borderTopRightRadius: m.role === "user" ? "4px" : "16px",
                  borderTopLeftRadius: m.role === "bot" ? "4px" : "16px",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4" style={{ borderTop: "1px solid #222" }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="اكتب سؤالك..."
              className="flex-1 rounded-xl py-2.5 px-4 text-sm text-white"
              style={{ background: "#1a1a1a", border: "1.5px solid #333", fontFamily: "'Tajawal', sans-serif" }}
            />
            <button onClick={send} className="rounded-xl px-4 py-2.5 btn-primary" style={{ background: "#f97316" }}>
              <Send size={16} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
