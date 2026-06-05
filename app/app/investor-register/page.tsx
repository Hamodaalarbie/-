"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, ChevronRight, Copy, CheckCircle,
  TrendingUp, PieChart, Shield, User, Phone, Lock,
  Target, BarChart3, Star, Activity,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

const SECURITY_QUESTIONS = [
  "ما اسم مدرستك الابتدائية؟",
  "ما اسم حيوانك الأليف الأول؟",
  "ما اسم مدينة ميلادك؟",
  "ما اسم أمك قبل الزواج؟",
  "ما هو لقبك المفضل في الطفولة؟",
]

const INVESTMENT_RANGES = [
  { label: "أقل من 10,000 ج.م", value: "under_10k" },
  { label: "10,000 - 50,000 ج.م", value: "10k_50k" },
  { label: "50,000 - 200,000 ج.م", value: "50k_200k" },
  { label: "200,000 - 1,000,000 ج.م", value: "200k_1m" },
  { label: "أكثر من 1,000,000 ج.م", value: "above_1m" },
]

const INVESTMENT_TYPES = [
  { icon: PieChart, label: "صندوق النمو", value: "growth", return: "18%" },
  { icon: BarChart3, label: "محفظة الدخل", value: "income", return: "12%" },
  { icon: Target, label: "صندوق المشاريع", value: "projects", return: "25%" },
  { icon: Star, label: "خطة الذهب", value: "gold", return: "20%" },
]

const RISK_LEVELS = [
  { label: "منخفض", desc: "حماية رأس المال أولاً", value: "low", color: "#22c55e" },
  { label: "متوسط", desc: "توازن بين العائد والمخاطرة", value: "medium", color: "#f97316" },
  { label: "مرتفع", desc: "أقصى العوائد الممكنة", value: "high", color: "#ef4444" },
]

function PasswordStrength({ password }: { password: string }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  const colors = ["#dc2626", "#f97316", "#eab308", "#22c55e"]
  const labels = ["ضعيفة", "مقبولة", "جيدة", "قوية"]
  if (!password) return null
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: "4px", flex: 1, borderRadius: "2px", background: i < score ? colors[score - 1] : "#333", transition: "background 0.3s" }} />)}
      </div>
      <span style={{ fontSize: "11px", color: score > 0 ? colors[score - 1] : "#9ca3af" }}>{score > 0 ? `كلمة مرور ${labels[score - 1]}` : ""}</span>
    </div>
  )
}

const STEPS = [
  { num: 1, label: "البيانات الشخصية", icon: User },
  { num: 2, label: "معلومات الاستثمار", icon: TrendingUp },
  { num: 3, label: "الخطة الاستثمارية", icon: PieChart },
  { num: 4, label: "الأمان", icon: Shield },
]

function generateInvestorCode(): string {
  const digits = Math.floor(10000 + Math.random() * 90000).toString()
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `INV${digits}${letters}`
}

export default function InvestorRegisterPage() {
  const router = useRouter()
  const { setUser } = useAppContext()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [showPass, setShowPass] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [investmentRange, setInvestmentRange] = useState("")
  const [investmentType, setInvestmentType] = useState("")
  const [riskLevel, setRiskLevel] = useState("")
  const [experience, setExperience] = useState("")
  const [goals, setGoals] = useState("")
  const [secQuestion, setSecQuestion] = useState(SECURITY_QUESTIONS[0])
  const [secAnswer, setSecAnswer] = useState("")

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: "12px", padding: "12px 40px 12px 16px",
    fontSize: "14px", color: "#f5f5f5", background: "#1a1a1a",
    border: "1.5px solid #222", outline: "none", transition: "border-color 0.2s",
    fontFamily: "'Tajawal', sans-serif", direction: "rtl",
  }

  const nextStep = () => {
    setError("")
    if (step === 1) {
      if (!name.trim()) { setError("أدخل الاسم الكامل"); return }
      if (!phone.trim()) { setError("أدخل رقم الهاتف"); return }
      if (!nationalId.trim()) { setError("أدخل رقم الهوية الوطنية"); return }
      if (password.length < 6) { setError("كلمة المرور 6 أحرف على الأقل"); return }
      if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return }
    }
    if (step === 2) {
      if (!investmentRange) { setError("اختر نطاق الاستثمار"); return }
      if (!riskLevel) { setError("اختر مستوى المخاطرة"); return }
    }
    if (step === 3) {
      if (!investmentType) { setError("اختر نوع الاستثمار"); return }
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!secAnswer.trim()) { setError("أدخل إجابة سؤال الأمان"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const code = generateInvestorCode()
    const { data, error: dbErr } = await supabase.from("users").insert({
      name: name.trim(), phone: phone.trim(), national_id: nationalId.trim(),
      code, password: password.trim(), role: "investor",
      investment_range: investmentRange, investment_type: investmentType,
      risk_level: riskLevel, experience: experience.trim(), goals: goals.trim(),
      rank: "bronze", points: 0, shares: 0,
      security_question: secQuestion, security_answer: secAnswer.trim().toLowerCase(),
    }).select().single()
    setLoading(false)
    if (dbErr || !data) { setError("حدث خطأ، حاول مرة أخرى"); return }
    setGeneratedCode(code)
    setUser(data)
    setStep(5)
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", fontFamily: "'Tajawal', sans-serif", background: "radial-gradient(ellipse at 50% -10%, #f9731622 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, #fbbf2411 0%, transparent 50%), #080808", color: "#f5f5f5" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(#1e1e1e44 1px, transparent 1px), linear-gradient(90deg, #1e1e1e44 1px, transparent 1px)", backgroundSize: "50px 50px", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 16px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><Logo size="md" /></div>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>تسجيل مستثمر جديد</p>
        </div>

        {/* Progress */}
        <div style={{ maxWidth: "600px", margin: "0 auto 36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isDone = step > s.num
            const isActive = step === s.num
            return (
              <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: isDone ? "#22c55e" : isActive ? "#f97316" : "#1a1a1a", border: `2px solid ${isDone ? "#22c55e" : isActive ? "#f97316" : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", boxShadow: isActive ? "0 0 16px #f9731644" : "none" }}>
                  {isDone ? <CheckCircle size={16} color="#fff" /> : <Icon size={14} color={isActive ? "#fff" : "#666"} />}
                </div>
                {i < 3 && <div style={{ width: "40px", height: "2px", background: step > s.num ? "#22c55e" : "#222", transition: "background 0.3s" }} />}
              </div>
            )
          })}
        </div>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginBottom: "28px" }}>
          {step <= 4 ? `الخطوة ${step} من 4 — ${STEPS[step - 1]?.label}` : ""}
        </p>

        <div style={{ maxWidth: "520px", margin: "0 auto", background: "#111", border: "1.5px solid #1e1e1e", borderRadius: "24px", padding: "36px 32px", boxShadow: "0 0 60px #f9731618, 0 24px 60px rgba(0,0,0,0.5)" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 24px", textAlign: "center" }}>
                <span style={{ color: "#f97316" }}>البيانات </span>الشخصية
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>الاسم الكامل</label>
                  <div style={{ position: "relative" }}>
                    <input style={inputStyle} placeholder="أدخل اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} />
                    <User size={14} style={{ position: "absolute", top: "50%", right: "14px", transform: "translateY(-50%)", color: "#f97316" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>رقم الهاتف</label>
                  <div style={{ position: "relative" }}>
                    <input style={inputStyle} placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                    <Phone size={14} style={{ position: "absolute", top: "50%", right: "14px", transform: "translateY(-50%)", color: "#f97316" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>رقم الهوية الوطنية</label>
                  <div style={{ position: "relative" }}>
                    <input style={inputStyle} placeholder="أدخل رقم الهوية" value={nationalId} onChange={(e) => setNationalId(e.target.value)} maxLength={14} />
                    <Shield size={14} style={{ position: "absolute", top: "50%", right: "14px", transform: "translateY(-50%)", color: "#f97316" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>كلمة المرور</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...inputStyle, paddingLeft: "40px" }} type={showPass ? "text" : "password"} placeholder="أدخل كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Lock size={14} style={{ position: "absolute", top: "50%", right: "14px", transform: "translateY(-50%)", color: "#f97316" }} />
                    <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", top: "50%", left: "14px", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>تأكيد كلمة المرور</label>
                  <input style={inputStyle} type="password" placeholder="أعد إدخال كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 24px", textAlign: "center" }}>
                <span style={{ color: "#f97316" }}>معلومات </span>الاستثمار
              </h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "10px" }}>نطاق الاستثمار المتوقع</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {INVESTMENT_RANGES.map((r) => (
                    <button key={r.value} onClick={() => setInvestmentRange(r.value)} style={{ padding: "12px 16px", borderRadius: "12px", textAlign: "right", cursor: "pointer", background: investmentRange === r.value ? "#1a0d00" : "#1a1a1a", border: `1.5px solid ${investmentRange === r.value ? "#f97316" : "#222"}`, color: investmentRange === r.value ? "#f97316" : "#f5f5f5", fontSize: "14px", fontWeight: "600", fontFamily: "'Tajawal', sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>{r.label}</span>
                      {investmentRange === r.value && <CheckCircle size={15} color="#f97316" />}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "10px" }}>مستوى المخاطرة المقبول</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {RISK_LEVELS.map((r) => (
                    <button key={r.value} onClick={() => setRiskLevel(r.value)} style={{ padding: "14px 8px", borderRadius: "12px", cursor: "pointer", background: riskLevel === r.value ? `${r.color}18` : "#1a1a1a", border: `1.5px solid ${riskLevel === r.value ? r.color : "#222"}`, color: riskLevel === r.value ? r.color : "#9ca3af", fontFamily: "'Tajawal', sans-serif", transition: "all 0.2s", textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", marginBottom: "4px" }}>{r.label}</div>
                      <div style={{ fontSize: "10px", lineHeight: 1.3 }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>خبرتك في الاستثمار (اختياري)</label>
                <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="اذكر خبرتك السابقة في الاستثمار..." rows={3} style={{ ...inputStyle, resize: "none", height: "auto", padding: "12px 16px", lineHeight: 1.6 }} />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 24px", textAlign: "center" }}>
                <span style={{ color: "#f97316" }}>الخطة </span>الاستثمارية
              </h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "10px" }}>اختر نوع الاستثمار</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {INVESTMENT_TYPES.map((t) => {
                    const Icon = t.icon
                    return (
                      <button key={t.value} onClick={() => setInvestmentType(t.value)} style={{ padding: "16px 12px", borderRadius: "14px", cursor: "pointer", background: investmentType === t.value ? "#1a0d00" : "#1a1a1a", border: `1.5px solid ${investmentType === t.value ? "#f97316" : "#222"}`, fontFamily: "'Tajawal', sans-serif", transition: "all 0.2s", textAlign: "center", boxShadow: investmentType === t.value ? "0 0 16px #f9731630" : "none" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><Icon size={22} color={investmentType === t.value ? "#f97316" : "#666"} /></div>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: investmentType === t.value ? "#f97316" : "#f5f5f5", marginBottom: "4px" }}>{t.label}</div>
                        <div style={{ fontSize: "13px", fontWeight: "900", color: "#22c55e" }}>{t.return}</div>
                        <div style={{ fontSize: "10px", color: "#9ca3af" }}>عائد سنوي</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>أهدافك الاستثمارية (اختياري)</label>
                <textarea value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="ما الذي تسعى لتحقيقه من هذا الاستثمار؟" rows={3} style={{ ...inputStyle, resize: "none", height: "auto", padding: "12px 16px", lineHeight: 1.6 }} />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 24px", textAlign: "center" }}>
                <span style={{ color: "#f97316" }}>سؤال </span>الأمان
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>اختر سؤال الأمان</label>
                  <select value={secQuestion} onChange={(e) => setSecQuestion(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {SECURITY_QUESTIONS.map((q) => <option key={q} value={q} style={{ background: "#1a1a1a" }}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>الإجابة</label>
                  <input style={inputStyle} placeholder="أدخل إجابتك" value={secAnswer} onChange={(e) => setSecAnswer(e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: "24px", padding: "16px", borderRadius: "14px", background: "#0a0a0a", border: "1px solid #222" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 10px", fontWeight: "700" }}>ملخص تسجيلك</p>
                {[
                  { label: "الاسم", val: name },
                  { label: "الهاتف", val: phone },
                  { label: "نطاق الاستثمار", val: INVESTMENT_RANGES.find(r => r.value === investmentRange)?.label ?? "" },
                  { label: "نوع الاستثمار", val: INVESTMENT_TYPES.find(t => t.value === investmentType)?.label ?? "" },
                  { label: "مستوى المخاطرة", val: RISK_LEVELS.find(r => r.value === riskLevel)?.label ?? "" },
                ].map((item, i) => item.val && (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                    <span style={{ color: "#9ca3af" }}>{item.label}</span>
                    <span style={{ color: "#f97316", fontWeight: "700" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 SUCCESS */}
          {step === 5 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#0a2a0a", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "cen