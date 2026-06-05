"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/context"
import { createClient } from "@/lib/supabase/client"
import { DEPARTMENTS, SECURITY_QUESTIONS } from "@/lib/types"
import {
  Eye, EyeOff, Copy, CheckCircle, KeyRound, Lock,
  ChevronDown, ChevronRight, Users, TrendingUp, Star,
  Wallet, Megaphone, Cpu, Globe, BookOpen, Zap,
  Shield, Sun, Moon, Languages, X, Sparkles,
  BarChart3, Layers, ArrowLeft, Check, AlertCircle
} from "lucide-react"

// ═══════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════
const THEMES = {
  dark: {
    bg: "#05050f",
    surface: "#0c0c1e",
    card: "#10102a",
    cardHov: "#141432",
    border: "#1e1e3f",
    borderAcc: "#f97316",
    text: "#f0f0ff",
    sub: "#7070a0",
    muted: "#3a3a60",
    accent: "#f97316",
    accent2: "#8b5cf6",
    accentGrad: "linear-gradient(135deg, #f97316, #fb923c, #8b5cf6)",
    accentLo: "rgba(249,115,22,0.12)",
    accent2Lo: "rgba(139,92,246,0.12)",
    glow: "rgba(249,115,22,0.4)",
    glow2: "rgba(139,92,246,0.3)",
    success: "#10b981",
    error: "#ef4444",
    isDark: true,
  },
  light: {
    bg: "#f8f7ff",
    surface: "#ffffff",
    card: "#ffffff",
    cardHov: "#f3f0ff",
    border: "#e4e0ff",
    borderAcc: "#f97316",
    text: "#0a0a1f",
    sub: "#6060a0",
    muted: "#c0b8ff",
    accent: "#f97316",
    accent2: "#7c3aed",
    accentGrad: "linear-gradient(135deg, #f97316, #fb923c, #7c3aed)",
    accentLo: "rgba(249,115,22,0.08)",
    accent2Lo: "rgba(124,58,237,0.08)",
    glow: "rgba(249,115,22,0.25)",
    glow2: "rgba(124,58,237,0.2)",
    success: "#059669",
    error: "#dc2626",
    isDark: false,
  }
}
type Theme = typeof THEMES.dark

// ═══════════════════════════════════════════════
// SVG LOGO — حرف A + برق داخل شكل هندسي
// ═══════════════════════════════════════════════
function LogoMark({ size = 48, t }: { size?: number; t: Theme }) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer hexagon shape */}
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill="none"
        stroke="url(#lg1)"
        strokeWidth="1.2"
        opacity="0.9"
      />
      {/* Inner thinner hex - decorative threads */}
      <polygon
        points="24,6 40,15 40,33 24,42 8,33 8,15"
        fill="none"
        stroke="url(#lg2)"
        strokeWidth="0.5"
        opacity="0.5"
      />
      {/* Connecting diagonal threads */}
      <line x1="4" y1="13" x2="44" y2="35" stroke="url(#lg1)" strokeWidth="0.4" opacity="0.3" />
      <line x1="44" y1="13" x2="4" y2="35" stroke="url(#lg2)" strokeWidth="0.4" opacity="0.3" />
      <line x1="24" y1="2" x2="24" y2="46" stroke="url(#lg1)" strokeWidth="0.4" opacity="0.2" />
      {/* Letter A */}
      <text
        x="24" y="33"
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fontFamily="'Cairo', serif"
        fontStyle="italic"
        fill="url(#lg1)"
        filter="url(#glow)"
      >ع</text>
      {/* Lightning bolt crossing the A */}
      <path
        d="M27,12 L21,24 L25,24 L19,36"
        stroke="url(#lg2)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
        opacity="0.85"
      />
    </svg>
  )
}

function Logo({ size = "md", t, lang }: { size?: "xs" | "sm" | "md" | "lg"; t: Theme; lang: "ar" | "en" }) {
  const iconSize = size === "xs" ? 30 : size === "sm" ? 36 : size === "lg" ? 64 : 48
  const main = size === "xs" ? "1rem" : size === "sm" ? "1.3rem" : size === "lg" ? "2.6rem" : "1.7rem"
  const sub = size === "xs" ? ".55rem" : size === "sm" ? ".65rem" : size === "lg" ? "1rem" : ".75rem"

  const arText = lang === "ar"
    ? <><span style={{ color: t.accent, fontStyle: "italic" }}>عرب</span><span style={{ color: t.accent2, fontStyle: "italic" }}>اوي</span></>
    : <><span style={{ color: t.accent, fontStyle: "italic" }}>Arab</span><span style={{ color: t.accent2, fontStyle: "italic" }}>aawy</span></>

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "lg" ? 14 : 9 }}>
      <div style={{ position: "relative" }}>
        <LogoMark size={iconSize} t={t} />
        <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{
          fontSize: main, fontWeight: 900,
          fontFamily: "'Cairo', serif",
          letterSpacing: "-.01em",
        }}>
          {arText}
        </span>
        <span style={{
          fontSize: sub, fontWeight: 600, letterSpacing: ".14em",
          textTransform: "uppercase",
          fontFamily: "'Montserrat', sans-serif",
          background: t.accentGrad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {lang === "ar" ? "النظام البيئي الرقمي" : "Digital Ecosystem"}
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function generateCode(prefix: string) {
  const d = Math.floor(1000 + Math.random() * 9000)
  const l = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `${prefix.toUpperCase().slice(0, 3)}${d}${l}`
}

function PasswordStrength({ password, t }: { password: string; t: Theme }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  const colors = ["#ef4444", "#f97316", "#eab308", "#10b981"]
  const labels = ["ضعيفة", "مقبولة", "جيدة", "قوية"]
  if (!password) return null
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ height: 3, flex: 1, borderRadius: 9, background: i < score ? colors[score - 1] : t.muted, transition: "background .3s" }} />)}
      </div>
      <span style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : t.sub }}>{score > 0 ? `كلمة مرور ${labels[score - 1]}` : ""}</span>
    </div>
  )
}

function CountUp({ target, suffix = "", t }: { target: number; suffix?: string; t: Theme }) {
  const [v, setV] = useState(0); const [on, setOn] = useState(false); const r = useRef<HTMLSpanElement>(null)
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !on) setOn(true) }, { threshold: .5 }); if (r.current) o.observe(r.current); return () => o.disconnect() }, [on])
  useEffect(() => { if (!on) return; let c = 0; const step = Math.ceil(target / 55); const i = setInterval(() => { c += step; if (c >= target) { setV(target); clearInterval(i) } else setV(c) }, 22); return () => clearInterval(i) }, [on, target])
  return <span ref={r}>{v.toLocaleString("ar-EG")}{suffix}</span>
}

// ═══════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════
function Input({ label, icon: Icon, rightIcon, type = "text", placeholder, value, onChange, t, error }: {
  label?: string; icon?: React.ElementType; rightIcon?: React.ReactNode;
  type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; t: Theme; error?: string
}) {
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: t.sub, display: "block", marginBottom: 6, fontFamily: "'Cairo',sans-serif" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={14} style={{ position: "absolute", top: "50%", right: 13, transform: "translateY(-50%)", color: t.accent, pointerEvents: "none" }} />}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", background: t.surface, border: `1.5px solid ${error ? t.error : t.border}`,
            borderRadius: 12, color: t.text, fontFamily: "'Cairo',sans-serif",
            padding: `11px ${Icon ? "38px" : "14px"} 11px ${rightIcon ? "40px" : "14px"}`,
            fontSize: 14, outline: "none", transition: "border .2s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = t.accent)}
          onBlur={e => (e.currentTarget.style.borderColor = error ? t.error : t.border)}
        />
        {rightIcon && <div style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)" }}>{rightIcon}</div>}
      </div>
      {error && <p style={{ fontSize: 11, color: t.error, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════
// MODAL BASE
// ═══════════════════════════════════════════════
function Modal({ onClose, t, children, maxWidth = 460 }: { onClose: () => void; t: Theme; children: React.ReactNode; maxWidth?: number }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,.75)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="animate-scaleIn"
        style={{ width: "100%", maxWidth, background: t.card, border: `1.5px solid ${t.border}`, borderRadius: 24, boxShadow: `0 0 80px ${t.glow}, 0 0 40px ${t.glow2}`, padding: "32px 28px", maxHeight: "92vh", overflowY: "auto" }}
      >
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// LOGIN MODAL
// ═══════════════════════════════════════════════
function LoginModal({ onClose, t, lang, router, forAdmin = false }: { onClose: () => void; t: Theme; lang: "ar" | "en"; router: any; forAdmin?: boolean }) {
  const { setUser } = useAppContext()
  const [code, setCode] = useState(""); const [pass, setPass] = useState(""); const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("")

  const handleLogin = async () => {
    if (!code.trim() || !pass.trim()) { setErr("يرجى إدخال البيانات"); return }
    setLoading(true); setErr("")
    const sb = createClient()
    const { data, error: dbErr } = await sb.from("users").select("*").eq("code", code.trim()).eq("password", pass.trim()).single()
    setLoading(false)
    if (dbErr || !data) { setErr("بيانات غير صحيحة"); return }
    if (forAdmin && data.role !== "admin") { setErr("ليس حساب مدير"); return }
    if (!forAdmin && data.role === "admin") { setErr("استخدم بوابة المدراء"); return }
    setUser(data)
    if (data.role === "admin") router.push("/admin")
    else if (data.role === "investor") router.push("/market")
    else router.push("/dashboard")
  }

  return (
    <Modal onClose={onClose} t={t} maxWidth={400}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Logo size="xs" t={t} lang={lang} />
        <button onClick={onClose} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 7, cursor: "pointer", color: t.sub, display: "flex" }}><X size={15} /></button>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: t.text, marginBottom: 6, fontFamily: "'Cairo',sans-serif" }}>
        {forAdmin ? "🛡️ بوابة المدراء" : "تسجيل الدخول"}
      </h2>
      <p style={{ fontSize: 13, color: t.sub, marginBottom: 22, fontFamily: "'Cairo',sans-serif" }}>
        {forAdmin ? "للمدراء والمشرفين فقط" : "أدخل رمز الدخول وكلمة المرور"}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="رمز الدخول" icon={KeyRound} placeholder="أدخل رمز الدخول" value={code} onChange={setCode} t={t} />
        <Input label="كلمة المرور" icon={Lock} type={show ? "text" : "password"} placeholder="أدخل كلمة المرور" value={pass} onChange={setPass} t={t}
          rightIcon={<button onClick={() => setShow(!show)} style={{ background: "none", border: "none", cursor: "pointer", color: t.sub, display: "flex" }}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
        />
      </div>
      <div style={{ textAlign: lang === "ar" ? "left" : "right", margin: "10px 0 16px" }}>
        <button onClick={() => router.push("/recovery")} style={{ fontSize: 12, color: t.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>نسيت كلمة المرور؟</button>
      </div>
      {err && <div style={{ background: "#2a0808", border: `1px solid ${t.error}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: t.error, textAlign: "center", marginBottom: 14, fontFamily: "'Cairo',sans-serif" }}>{err}</div>}
      <button onClick={handleLogin} disabled={loading} className="btn-primary"
        style={{ width: "100%", padding: "13px", borderRadius: 14, fontWeight: 800, fontSize: 15, fontFamily: "'Cairo',sans-serif", background: loading ? t.muted : t.accent, color: "#000", border: "none", cursor: "pointer", boxShadow: `0 0 20px ${t.glow}` }}>
        {loading ? "..." : forAdmin ? "دخول المدراء ←" : "دخول ←"}
      </button>
    </Modal>
  )
}

// ═══════════════════════════════════════════════
// REGISTER MODAL — 3 tabs: مستثمر / شريك
// ═══════════════════════════════════════════════
function RegisterModal({ onClose, t, lang, router, defaultTab = "investor" }: { onClose: () => void; t: Theme; lang: "ar" | "en"; router: any; defaultTab?: "investor" | "partner" }) {
  const { setUser } = useAppContext()
  const [tab, setTab] = useState<"investor" | "partner">(defaultTab)
  const [step, setStep] = useState(1)
  // shared
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [pass, setPass] = useState(""); const [confirmPass, setConfirmPass] = useState(""); const [show, setShow] = useState(false)
  // investor
  const [nationalId, setNationalId] = useState(""); const [budget, setBudget] = useState(""); const [investField, setInvestField] = useState("")
  // partner
  const [dept, setDept] = useState(""); const [secQ, setSecQ] = useState(SECURITY_QUESTIONS[0]); const [secA, setSecA] = useState("")
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("")
  const [code, setCode] = useState(""); const [copied, setCopied] = useState(false)

  const BUDGETS = ["أقل من 5,000 جنيه", "5,000 – 20,000 جنيه", "20,000 – 100,000 جنيه", "أكثر من 100,000 جنيه"]
  const FIELDS = ["تقنية رقمية", "تسويق ومحتوى", "تعليم وتدريب", "إنتاج إبداعي", "شبكات وأعمال"]

  const deptGroups = DEPARTMENTS.reduce((acc, d) => {
    if (!acc[d.category]) acc[d.category] = []
    acc[d.category].push(d)
    return acc
  }, {} as Record<string, typeof DEPARTMENTS>)

  const canSubmit = () => {
    if (!name.trim() || !phone.trim() || pass.length < 6 || pass !== confirmPass) return false
    if (tab === "investor" && (!nationalId.trim() || !budget || !investField)) return false
    if (tab === "partner" && (!dept || !secA.trim())) return false
    return true
  }

  const submit = async () => {
    setErr(""); setLoading(true)
    const sb = createClient()
    const newCode = generateCode(tab === "investor" ? "INV" : dept)
    const payload = tab === "investor"
      ? { name: name.trim(), phone: phone.trim(), code: newCode, password: pass.trim(), role: "investor", rank: "iron", points: 0, shares: 0, national_id: nationalId.trim(), invest_budget: budget, invest_field: investField }
      : { name: name.trim(), phone: phone.trim(), code: newCode, password: pass.trim(), role: "partner", dept, rank: "iron", points: 0, shares: 0, security_question: secQ, security_answer: secA.trim().toLowerCase() }
    const { data, error: dbErr } = await sb.from("users").insert(payload).select().single()
    setLoading(false)
    if (dbErr) { setErr(dbErr.message.includes("phone") ? "رقم الهاتف مسجل مسبقاً" : "حدث خطأ، حاول مجدداً"); return }
    setCode(newCode); setUser(data); setStep(99)
  }

  const copyCode = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const inp: React.CSSProperties = { background: t.surface, border: `1.5px solid ${t.border}`, borderRadius: 12, color: t.text, fontFamily: "'Cairo',sans-serif", width: "100%", padding: "11px 14px", fontSize: 14, outline: "none" }
  const btnTab = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "10px 6px", borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: "'Cairo',sans-serif",
    cursor: "pointer", border: "none", transition: "all .2s",
    background: active ? t.accent : "transparent",
    color: active ? "#000" : t.sub,
    boxShadow: active ? `0 0 16px ${t.glow}` : "none",
  })

  return (
    <Modal onClose={onClose} t={t} maxWidth={500}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <Logo size="xs" t={t} lang={lang} />
        <button onClick={onClose} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 7, cursor: "pointer", color: t.sub, display: "flex" }}><X size={15} /></button>
      </div>

      {step !== 99 && (
        <>
          {/* tabs */}
          <div style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 3, marginBottom: 22, gap: 4 }}>
            <button onClick={() => { setTab("investor"); setStep(1) }} style={btnTab(tab === "investor")}>📈 مستثمر</button>
            <button onClick={() => { setTab("partner"); setStep(1) }} style={btnTab(tab === "partner")}>🤝 شريك</button>
          </div>

          {/* progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s <= step ? 24 : 8, height: 8, borderRadius: 99, background: s <= step ? t.accent : t.muted, transition: "all .3s" }} />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: t.text, marginBottom: 4, fontFamily: "'Cairo',sans-serif" }}>
                {tab === "investor" ? "بيانات المستثمر" : "بيانات الشريك"}
              </h3>
              <Input label="الاسم الكامل" placeholder="أدخل اسمك الكامل" value={name} onChange={setName} t={t} />
              <Input label="رقم الهاتف" placeholder="01xxxxxxxxx" value={phone} onChange={setPhone} t={t} />

              {tab === "investor" && <>
                <Input label="رقم الهوية الوطنية" placeholder="14 رقم" value={nationalId} onChange={setNationalId} t={t} />
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: t.sub, display: "block", marginBottom: 6, fontFamily: "'Cairo',sans-serif" }}>ميزانية الاستثمار</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              