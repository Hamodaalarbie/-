"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Logo from "@/components/Logo"

export default function RecoveryPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [foundUser, setFoundUser] = useState<{ id: string; name: string; security_question: string; security_answer: string } | null>(null)
  const [answer, setAnswer] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const inputStyle: React.CSSProperties = {
    background: "#1a1a1a",
    border: "1.5px solid #333",
    borderRadius: "12px",
    color: "#fff",
    fontFamily: "'Tajawal', sans-serif",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
  }

  const findUser = async () => {
    if (!phone.trim()) { setError("أدخل رقم الهاتف"); return }
    setLoading(true); setError("")
    const supabase = createClient()
    const { data } = await supabase.from("users").select("id,name,security_question,security_answer").eq("phone", phone.trim()).single()
    setLoading(false)
    if (!data) { setError("لا يوجد حساب بهذا الرقم"); return }
    setFoundUser(data)
    setStep(2)
  }

  const verifyAnswer = () => {
    if (!answer.trim()) { setError("أدخل إجابتك"); return }
    if (answer.trim().toLowerCase() !== foundUser?.security_answer) { setError("الإجابة غير صحيحة"); return }
    setError("")
    setStep(3)
  }

  const resetPassword = async () => {
    if (newPass.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return }
    if (newPass !== confirmPass) { setError("كلمتا المرور غير متطابقتين"); return }
    setLoading(true); setError("")
    const supabase = createClient()
    await supabase.from("users").update({ password: newPass }).eq("id", foundUser!.id)
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(ellipse at center, #1a0d00 0%, #0a0a0a 70%)" }}>
      <div className="w-full max-w-sm animate-scaleIn" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.25)", padding: "36px 28px" }}>
        <div className="flex justify-center mb-6"><Logo size="md" /></div>

        {done ? (
          <div className="text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 64, height: 64 }}>
                <CheckCircle size={32} color="#22c55e" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">تم تحديث كلمة المرور</h2>
            <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة</p>
            <button onClick={() => router.push("/login")} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
              تسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => step > 1 ? setStep(step - 1) : router.push("/login")} style={{ color: "#f97316" }}>
                <ArrowRight size={20} />
              </button>
              <h2 className="text-lg font-bold text-white">
                {step === 1 ? "استرداد كلمة المرور" : step === 2 ? "سؤال الأمان" : "كلمة المرور الجديدة"}
              </h2>
            </div>

            {step === 1 && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>رقم الهاتف المسجل</label>
                <input style={inputStyle} placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                {error && <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>{error}</p>}
                <button onClick={findUser} disabled={loading} className="w-full mt-4 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                  {loading ? "جارٍ البحث..." : "التالي"}
                </button>
              </div>
            )}

            {step === 2 && foundUser && (
              <div className="animate-fadeIn">
                <div className="rounded-xl p-3 mb-4" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>تم العثور على حساب</p>
                  <p className="font-bold text-white">{foundUser.name}</p>
                </div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>{foundUser.security_question}</label>
                <input style={inputStyle} placeholder="أدخل إجابتك" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                {error && <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>{error}</p>}
                <button onClick={verifyAnswer} className="w-full mt-4 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                  التالي
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fadeIn flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>كلمة المرور الجديدة</label>
                  <div className="relative">
                    <input style={{ ...inputStyle, paddingLeft: "40px" }} type={showPass ? "text" : "password"} placeholder="كلمة مرور جديدة" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 left-3 -translate-y-1/2" style={{ color: "#9ca3af" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>تأكيد كلمة المرور</label>
                  <input style={inputStyle} type="password" placeholder="أعد الإدخال" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                </div>
                {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
                <button onClick={resetPassword} disabled={loading} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                  {loading ? "جارٍ الحفظ..." : "تحديث كلمة المرور"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
