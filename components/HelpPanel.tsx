"use client"

import { useState } from "react"
import { X, HelpCircle, Globe, Zap, ListChecks, Layers, TrendingUp, Wallet, ChevronDown, ChevronUp } from "lucide-react"

const TOPICS = [
  {
    icon: Globe, title: "عن عرباوي",
    content: "عرباوي هو نظام بيئي رقمي متكامل يجمع بين العمل الحر والاستثمار. يمكنك كسب النقاط من خلال إنجاز المهام، ثم تحويلها إلى أسهم أو سحبها كأموال.",
  },
  {
    icon: Zap, title: "نظام النقاط",
    content: "تكسب النقاط عند إنجاز المهام وتسليمها للمراجعة. عند موافقة الإدارة، تُضاف النقاط تلقائياً لرصيدك. يمكنك بعدها سحبها أو تحويلها لأسهم.",
  },
  {
    icon: ListChecks, title: "المهام",
    content: "اذهب لغرفة المهام، واختر مهمة مناسبة لقسمك، واقرأ التفاصيل والشروط، ثم قدّم تقريرك ورابط العمل. ستراجع الإدارة تسليمك وتعتمد المكافأة.",
  },
  {
    icon: Layers, title: "المشاريع",
    content: "يمكنك الانضمام للمشاريع الجارية والمساهمة في تنفيذها. كل مشروع له خارطة طريق وأقسام مطلوبة. الانضمام يخضع لموافقة الإدارة.",
  },
  {
    icon: TrendingUp, title: "الأسهم",
    content: "تتحول النقاط إلى أسهم بمعدل محدد من الإدارة. الأسهم تمثل حصتك في مشاريع عرباوي. يمكنك بيعها للشركة أو نشر إعلان بيع في السوق.",
  },
  {
    icon: Wallet, title: "السحب",
    content: "يمكنك سحب نقاطك عبر Vodafone Cash أو InstaPay أو Binance USDT. الحد الأدنى للسحب محدد من الإدارة. يتم معالجة الطلبات خلال 24-48 ساعة.",
  },
]

interface Props { onClose: () => void }

export default function HelpPanel({ onClose }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1" onClick={onClose} style={{ background: "rgba(0,0,0,0.5)" }} />
      <div className="w-full max-w-xs animate-slideInRight flex flex-col" style={{ background: "#111111", borderLeft: "2px solid #f97316", height: "100vh" }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #222" }}>
          <div className="flex items-center gap-2">
            <HelpCircle size={18} color="#f97316" />
            <span className="font-bold text-white">المساعدة</span>
          </div>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {TOPICS.map((t, i) => (
            <div key={i} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px", overflow: "hidden" }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-right"
              >
                <div className="flex items-center gap-3">
                  <t.icon size={18} color="#f97316" />
                  <span className="font-bold text-white text-sm">{t.title}</span>
                </div>
                {expanded === i ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{t.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
