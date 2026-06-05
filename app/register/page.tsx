"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronRight, Copy, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"
import { DEPARTMENTS, SECURITY_QUESTIONS } from "@/lib/types"

function generateCode(dept: string): string {
  const prefix = dept.toUpperCase().slice(0, 3)
  const digits = Math.floor(1000 + Math.random() * 9000).toString()
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                  String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `${prefix}${digits}${letters}`
}

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  const colors = ["#dc2626", "#f97316", "#eab308", "#22c55e"]
  const labels = ["ضعيفة", "مقبولة", "جيدة", "قوية"]

  if (!password) return null
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ background: i < score ? colors[score - 1] : "#333" }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: score > 0 ? colors[score - 1] : "#9ca3af" }}>
        {score > 0 ? `كلمة مرور ${labels[score - 1]}` : ""}
      </span>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAppContext()
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState<"ar" | "en">("ar")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [dept, setDept] = useState("")
  const [secQuestion, setSecQuestion] = useState(SECURITY_QUESTIONS[0])
  const [secAnswer, setSecAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  const nextStep = () => {
    setError("")
    if (step === 2) {
      if (!name.trim()) { setError("أدخل الاسم الكامل"); return }
      if (!phone.trim()) { setError("أدخل رقم الهاتف"); return }
      if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return }
      if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return }
    }
    if (step === 3 && !dept) { setError("اختر قسمك"); return }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!secAnswer.trim()) { setError("أدخل إجابة سؤال الأمان"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const code = generateCode(dept)

    const { data, error: dbErr } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        code,
        password: password.trim(),
        role: "partner",
        dept,
        rank: "iron",
        points: 0,
        shares: 0,
        security_question: secQuestion,
        security_answer: secAnswer.trim().toLowerCase(),
      })
      .select()
      .single()

    setLoading(false)
    if (dbErr) {
      setError(dbErr.message.includes("phone") ? "رقم الهاتف مسجل بالفعل" : "حدث خطأ، حاول مرة أخرى")
      return
    }
    setGeneratedCode(code)
    setUser(data)
    setStep(5)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at center, #1a0d00 0%, #0a0a0a 70%)" }}
    >
      <div
        className="w-full max-w-md animate-fadeIn"
        style={{
          background: "#111111",
          border: "2px solid #f97316",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(249,115,22,0.25)",
          padding: "36px 28px",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: "#9ca3af" }}>
              {["اللغة", "البيانات", "القسم", "الأمان"].map((s, i) => (
                <span key={i} style={{ color: i + 1 <= step ? "#f97316" : "#9ca3af", fontWeight: i + 1 === step ? "700" : "400" }}>
                  {s}
                </span>
              ))}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        )}

        {/* STEP 1: Language */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-white text-center mb-6">اختر لغتك</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
                { code: "en" as const, label: "English", flag: "🇬🇧" },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="py-6 rounded-xl flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: lang === l.code ? "#1a0d00" : "#1a1a1a",
                    border: `2px solid ${lang === l.code ? "#f97316" : "#333"}`,
                    boxShadow: lang === l.code ? "0 0 15px rgba(249,115,22,0.3)" : "none",
                  }}
                >
                  <span className="text-3xl">{l.flag}</span>
                  <span className="font-bold text-white">{l.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
              التالي
            </button>
          </div>
        )}

        {/* STEP 2: Personal Info */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-white text-center mb-6">البيانات الشخصية</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>الاسم الكامل</label>
                <input style={inputStyle} placeholder="أدخل اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>رقم الهاتف</label>
                <input style={inputStyle} placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>كلمة المرور</label>
                <div className="relative">
                  <input
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    type={showPass ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 left-3 -translate-y-1/2" style={{ color: "#9ca3af" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>تأكيد كلمة المرور</label>
                <input style={inputStyle} type="password" placeholder="أعد إدخال كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>
                رجوع
              </button>
              <button onClick={nextStep} className="flex-1 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                التالي
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Department */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-white text-center mb-4">اختر قسمك</h2>
            <div
              className="grid grid-cols-3 gap-2 mb-4"
              style={{ maxHeight: "320px", overflowY: "auto" }}
            >
              {DEPARTMENTS.map((d) => (
                <button
                  key={d.code}
                  onClick={() => setDept(d.code)}
                  className="py-2 px-1 rounded-lg text-center transition-all"
                  style={{
                    background: dept === d.code ? "#1a0d00" : "#1a1a1a",
                    border: `1.5px solid ${dept === d.code ? "#f97316" : "#333"}`,
                    boxShadow: dept === d.code ? "0 0 12px rgba(249,115,22,0.3)" : "none",
                  }}
                >
                  <span className="block text-xs font-bold" style={{ color: dept === d.code ? "#f97316" : "#fff" }}>{d.code}</span>
                  <span className="block text-xs mt-0.5 leading-tight" style={{ color: "#9ca3af", fontSize: "10px" }}>{d.name}</span>
                </button>
              ))}
            </div>
            {error && <p className="mb-3 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>
                رجوع
              </button>
              <button onClick={nextStep} className="flex-1 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                التالي
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Security */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-white text-center mb-6">سؤال الأمان</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>اختر سؤال الأمان</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={secQuestion}
                  onChange={(e) => setSecQuestion(e.target.value)}
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q} style={{ background: "#1a1a1a" }}>{q}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>الإجابة</label>
                <input style={inputStyle} placeholder="أدخل إجابتك" value={secAnswer} onChange={(e) => setSecAnswer(e.target.value)} />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>
                رجوع
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold btn-primary"
                style={{ background: loading ? "#7c3a0c" : "#f97316", color: "#000" }}
              >
                {loading ? "جارٍ التسجيل..." : "إنشاء الحساب"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <div className="animate-scaleIn text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 64, height: 64 }}>
                <CheckCircle size={32} color="#22c55e" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">تم إنشاء حسابك بنجاح!</h2>
            <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>احتفظ برمز دخولك، هو مفتاح حسابك</p>

            <div
              className="rounded-xl p-4 mb-3 relative"
              style={{ background: "#1a0d00", border: "2px solid #f97316", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}
            >
              <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>رمز الدخول الخاص بك</p>
              <p className="text-3xl font-extrabold tracking-widest" style={{ color: "#f97316" }}>{generatedCode}</p>
              <button
                onClick={copyCode}
                className="absolute top-3 left-3 p-1.5 rounded-lg transition-all"
                style={{ background: "#333", color: copied ? "#22c55e" : "#9ca3af" }}
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="rounded-xl p-3 mb-6" style={{ background: "#1a0a00", border: "1px solid #f97316" }}>
              <p className="text-xs font-bold" style={{ color: "#f97316" }}>
                تحذير: احتفظ بهذا الرمز في مكان آمن، لا يمكن استرجاعه لاحقاً
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-xl font-bold btn-primary"
              style={{ background: "#f97316", color: "#000" }}
            >
              دخول للمنصة
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
