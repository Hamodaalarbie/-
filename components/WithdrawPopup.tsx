"use client"

import { useState } from "react"
import { X, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AppUser } from "@/lib/types"

interface Props {
  user: AppUser
  minPoints: number
  onClose: () => void
  onSuccess: () => void
}

const METHODS = [
  { id: "vodafone", label: "Vodafone Cash", color: "#dc2626", icon: "📱" },
  { id: "instapay", label: "InstaPay", color: "#7c3aed", icon: "💜" },
  { id: "binance", label: "Binance USDT", color: "#f59e0b", icon: "🟡" },
]

export default function WithdrawPopup({ user, minPoints, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const inputStyle: React.CSSProperties = {
    background: "#1a1a1a", border: "1.5px solid #333", borderRadius: "12px",
    color: "#fff", fontFamily: "'Tajawal', sans-serif", width: "100%",
    padding: "10px 14px", fontSize: "14px",
  }

  const handleConfirm = async () => {
    const pts = parseInt(amount)
    if (!pts || pts < minPoints) { setError(`الحد الأدنى ${minPoints} نقطة`); return }
    if (pts > user.points) { setError("لا تملك نقاطاً كافية"); return }
    if (!wallet.trim()) { setError("أدخل بيانات المحفظة"); return }
    setLoading(true)
    const supabase = createClient()
    await supabase.from("pending_requests").insert({
      user_id: user.id, type: "Withdrawal", points_amount: pts,
      method, wallet_details: wallet, status: "Pending",
    })
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-scaleIn" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.3)", padding: "28px 24px" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">طلب سحب النقاط</h2>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={20} /></button>
        </div>

        {done ? (
          <div className="text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 56, height: 56 }}>
                <CheckCircle size={28} color="#22c55e" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تم إرسال الطلب</h3>
            <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>سيتم مراجعة طلبك من قبل الإدارة</p>
            <button onClick={() => { onSuccess(); onClose() }} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>حسناً</button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="h-1 flex-1 rounded-full transition-all" style={{ background: s <= step ? "#f97316" : "#333" }} />
              ))}
            </div>

            {step === 1 && (
              <div className="animate-fadeIn">
                <p className="text-sm mb-4 text-center" style={{ color: "#9ca3af" }}>اختر طريقة السحب</p>
                <div className="flex flex-col gap-3 mb-6">
                  {METHODS.map((m) => (
                    <button key={m.id} onClick={() => setMethod(m.id)} className="flex items-center gap-3 p-4 rounded-xl transition-all" style={{ background: method === m.id ? `${m.color}20` : "#1a1a1a", border: `2px solid ${method === m.id ? m.color : "#333"}` }}>
                      <span className="text-xl">{m.icon}</span>
                      <span className="font-bold" style={{ color: method === m.id ? m.color : "#fff" }}>{m.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => { if (!method) { setError("اختر طريقة السحب"); return } setError(""); setStep(2) }} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>التالي</button>
                {error && <p className="mt-2 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>عدد النقاط</label>
                  <input style={inputStyle} type="number" placeholder={`الحد الأدنى ${minPoints}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <p className="mt-1 text-xs" style={{ color: "#9ca3af" }}>رصيدك: <span style={{ color: "#f97316" }}>{user.points} نقطة</span></p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>بيانات المحفظة</label>
                  <input style={inputStyle} placeholder="رقم الهاتف / عنوان المحفظة" value={wallet} onChange={(e) => setWallet(e.target.value)} />
                </div>
                {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>رجوع</button>
                  <button onClick={() => { const pts = parseInt(amount); if (!pts || pts < minPoints) { setError(`الحد الأدنى ${minPoints}`); return } if (pts > user.points) { setError("نقاط غير كافية"); return } if (!wallet.trim()) { setError("أدخل بيانات المحفظة"); return } setError(""); setStep(3) }} className="flex-1 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>التالي</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fadeIn">
                <p className="text-sm mb-4 text-center font-bold text-white">تأكيد الطلب</p>
                <div className="rounded-xl p-4 mb-6" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  {[
                    { label: "الطريقة", value: METHODS.find(m => m.id === method)?.label },
                    { label: "النقاط", value: `${amount} نقطة` },
                    { label: "المحفظة", value: wallet },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-2" style={{ borderBottom: "1px solid #222" }}>
                      <span className="text-sm" style={{ color: "#9ca3af" }}>{row.label}</span>
                      <span className="text-sm font-bold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>رجوع</button>
                  <button onClick={handleConfirm} disabled={loading} className="flex-1 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                    {loading ? "جارٍ الإرسال..." : "تأكيد"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
