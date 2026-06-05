"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, KeyRound, Lock, Moon, Sun, Globe,
  ShieldCheck, TrendingUp, Users, BarChart3, Zap,
  Building2, ChevronDown, ArrowRight,
  Award, Target, Layers, DollarSign,
  CheckCircle, Briefcase, PieChart, Activity,
  Phone, Mail, MapPin, Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

type Lang = "ar" | "en"
type Theme = "dark" | "light"

const T = {
  ar: {
    tagline: "النظام البيئي الرقمي",
    taglineSub: "Digital Ecosystem",
    loginCode: "رمز الدخول",
    loginCodePh: "أدخل رمز الدخول",
    password: "كلمة المرور",
    passwordPh: "أدخل كلمة المرور",
    partner: "شريك",
    investor: "مستثمر",
    admin: "مدير",
    login: "دخول",
    loggingIn: "جارٍ الدخول...",
    forgotPass: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    registerPartner: "تسجيل شريك",
    registerInvestor: "تسجيل مستثمر",
    error: {
      empty: "يرجى إدخال رمز الدخول وكلمة المرور",
      wrong: "بيانات غير صحيحة، تحقق من الرمز وكلمة المرور",
      notAdmin: "هذا الحساب ليس حساب مدير",
      useAdmin: "استخدم تبويب المدير لتسجيل الدخول",
    },
    hero: {
      title1: "منصة",
      title2: "عرباوي",
      title3: "للاستثمار الذكي",
      desc: "نظام بيئي رقمي متكامل يجمع الشركاء والمستثمرين لتحقيق أقصى العوائد",
      cta1: "ابدأ الاستثمار",
      cta2: "تعرف علينا",
    },
    stats: [
      { val: "+500", label: "شريك نشط" },
      { val: "120M+", label: "حجم الاستثمارات" },
      { val: "98%", label: "رضا العملاء" },
      { val: "+50", label: "مشروع منجز" },
    ],
    about: {
      title: "من نحن",
      body: "عرباوي منصة رقمية متطورة تُعنى بإدارة وتطوير الاستثمارات، تجمع بين التقنية الحديثة والخبرة المالية لتقديم حلول استثمارية مبتكرة. نؤمن بأن الاستثمار الناجح يبدأ بشراكات قوية.",
    },
    services: {
      title: "خدماتنا",
      items: [
        { icon: TrendingUp, title: "إدارة المحافظ", desc: "تحليل وإدارة احترافية لمحافظك الاستثمارية بأعلى معايير الأداء" },
        { icon: Building2, title: "الشراكات التجارية", desc: "فرص شراكة استراتيجية مدروسة مع شبكة واسعة من رواد الأعمال" },
        { icon: BarChart3, title: "تحليل السوق", desc: "تقارير دورية وتحليلات معمقة لاتخاذ قرارات استثمارية صائبة" },
        { icon: ShieldCheck, title: "حماية الاستثمار", desc: "أنظمة حماية متعددة الطبقات لضمان سلامة أصولك ورأس مالك" },
        { icon: Users, title: "إدارة الشركاء", desc: "منظومة متكاملة لإدارة علاقات الشركاء وتتبع الأداء والعوائد" },
        { icon: Layers, title: "التنويع الاستثماري", desc: "استراتيجيات توزيع الأصول عبر قطاعات متعددة لتقليل المخاطر" },
      ],
    },
    products: {
      title: "منتجاتنا",
      items: [
        { icon: PieChart, name: "صندوق النمو", return: "18% سنوياً", risk: "متوسط", min: "10,000 ج.م" },
        { icon: Activity, name: "محفظة الدخل", return: "12% سنوياً", risk: "منخفض", min: "5,000 ج.م" },
        { icon: Target, name: "صندوق المشاريع", return: "25% سنوياً", risk: "مرتفع", min: "50,000 ج.م" },
        { icon: Award, name: "خطة الذهب", return: "20% سنوياً", risk: "متوسط", min: "25,000 ج.م" },
      ],
    },
    forInvestors: "للمستثمرين",
    forPartners: "للشركاء",
    forClients: "للعملاء",
    contact: {
      title: "تواصل معنا",
      phone: "+20 100 000 0000",
      email: "invest@arabaawy.com",
      address: "القاهرة، مصر",
      hours: "9 ص - 5 م، الأحد - الخميس",
    },
  },
  en: {
    tagline: "Digital Ecosystem",
    taglineSub: "النظام البيئي الرقمي",
    loginCode: "Access Code",
    loginCodePh: "Enter your access code",
    password: "Password",
    passwordPh: "Enter your password",
    partner: "Partner",
    investor: "Investor",
    admin: "Admin",
    login: "Login",
    loggingIn: "Logging in...",
    forgotPass: "Forgot password?",
    noAccount: "Don't have an account?",
    registerPartner: "Register as Partner",
    registerInvestor: "Register as Investor",
    error: {
      empty: "Please enter access code and password",
      wrong: "Invalid credentials, check your code and password",
      notAdmin: "This account is not an admin account",
      useAdmin: "Use the admin tab to login",
    },
    hero: {
      title1: "Arabaawy",
      title2: "Smart",
      title3: "Investment Platform",
      desc: "An integrated digital ecosystem connecting partners and investors to maximize returns",
      cta1: "Start Investing",
      cta2: "Learn More",
    },
    stats: [
      { val: "500+", label: "Active Partners" },
      { val: "120M+", label: "Investment Volume" },
      { val: "98%", label: "Client Satisfaction" },
      { val: "50+", label: "Completed Projects" },
    ],
    about: {
      title: "About Us",
      body: "Arabaawy is an advanced digital platform dedicated to managing and developing investments. We combine modern technology with financial expertise to deliver innovative investment solutions.",
    },
    services: {
      title: "Our Services",
      items: [
        { icon: TrendingUp, title: "Portfolio Management", desc: "Professional analysis and management of your investment portfolios" },
        { icon: Building2, title: "Business Partnerships", desc: "Strategic partnership opportunities with a broad network of entrepreneurs" },
        { icon: BarChart3, title: "Market Analysis", desc: "Periodic reports and in-depth analysis for informed investment decisions" },
        { icon: ShieldCheck, title: "Investment Protection", desc: "Multi-layer protection systems to ensure the safety of your assets" },
        { icon: Users, title: "Partner Management", desc: "Comprehensive system for managing partner relationships" },
        { icon: Layers, title: "Investment Diversification", desc: "Asset allocation strategies across multiple sectors to minimize risks" },
      ],
    },
    products: {
      title: "Our Products",
      items: [
        { icon: PieChart, name: "Growth Fund", return: "18% annual", risk: "Medium", min: "EGP 10,000" },
        { icon: Activity, name: "Income Portfolio", return: "12% annual", risk: "Low", min: "EGP 5,000" },
        { icon: Target, name: "Project Fund", return: "25% annual", risk: "High", min: "EGP 50,000" },
        { icon: Award, name: "Gold Plan", return: "20% annual", risk: "Medium", min: "EGP 25,000" },
      ],
    },
    forInvestors: "For Investors",
    forPartners: "For Partners",
    forClients: "For Clients",
    contact: {
      title: "Contact Us",
      phone: "+20 100 000 0000",
      email: "invest@arabaawy.com",
      address: "Cairo, Egypt",
      hours: "9 AM - 5 PM, Sun - Thu",
    },
  },
}

function AnimCounter({ val, duration = 1500 }: { val: string; duration?: number }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ""))
    if (isNaN(num)) { setDisplay(val); return }
    const prefix = val.match(/^[^0-9]*/)?.[0] ?? ""
    const suffix = val.match(/[^0-9.]*$/)?.[0] ?? ""
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(`${prefix}${Math.round(eased * num)}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tick(); observer.disconnect() } })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [val, duration])
  return <div ref={ref}>{display}</div>
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAppContext()
  const [tab, setTab] = useState<"partner" | "investor" | "admin">("partner")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [lang, setLang] = useState<Lang>("ar")
  const [theme, setTheme] = useState<Theme>("dark")
  const t = T[lang]
  const isRTL = lang === "ar"

  const dark = {
    bg: "#080808", bg2: "#0f0f0f", bg3: "#141414", card: "#111111",
    border: "#1e1e1e", borderHot: "#f97316", text: "#f5f5f5",
    textMuted: "#6b7280", accent: "#f97316", accent2: "#fbbf24",
    gradient: "radial-gradient(ellipse 80% 60% at 50% -10%, #f9731622 0%, transparent 60%), radial-gradient(ellipse at 90% 80%, #fbbf2411 0%, transparent 50%), #080808",
  }
  const light = {
    bg: "#fafaf9", bg2: "#f3f4f6", bg3: "#e5e7eb", card: "#ffffff",
    border: "#e5e7eb", borderHot: "#f97316", text: "#111111",
    textMuted: "#6b7280", accent: "#ea6d0e", accent2: "#d97706",
    gradient: "radial-gradient(ellipse 80% 60% at 50% -10%, #f9731618 0%, transparent 60%), radial-gradient(ellipse at 90% 80%, #fbbf2411 0%, transparent 50%), #fafaf9",
  }
  const c = theme === "dark" ? dark : light

  const handleLogin = async () => {
    if (!code.trim() || !password.trim()) { setError(t.error.empty); return }
    setLoading(true); setError("")
    const supabase = createClient()
    const { data, error: dbErr } = await supabase.from("users").select("*")
      .eq("code", code.trim()).eq("password", password.trim()).single()
    setLoading(false)
    if (dbErr || !data) { setError(t.error.wrong); return }
    if (tab === "admin" && data.role !== "admin") { setError(t.error.notAdmin); return }
    if (tab !== "admin" && data.role === "admin") { setError(t.error.useAdmin); return }
    setUser(data)
    if (data.role === "admin") router.push("/admin")
    else if (data.role === "investor") router.push("/market")
    else router.push("/dashboard")
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: "12px", padding: "12px 40px 12px 16px",
    fontSize: "14px", color: c.text, background: c.bg2,
    border: `1.5px solid ${c.border}`, outline: "none", transition: "border-color 0.2s",
    fontFamily: "'Tajawal', sans-serif", direction: isRTL ? "rtl" : "ltr",
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ background: c.bg, color: c.text, minHeight: "100vh", fontFamily: "'Tajawal', sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(8,8,8,0.85)" : "rgba(250,250,249,0.85)",
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${c.border}`,
        padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo size="sm" />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{
            display: "flex", alignItems: "center", gap: "6px", background: c.bg3,
            border: `1px solid ${c.border}`, borderRadius: "10px", padding: "6px 12px",
            cursor: "pointer", color: c.textMuted, fontSize: "13px", fontWeight: "600",
            fontFamily: "'Tajawal', sans-serif",
          }}>
            <Globe size={14} color={c.accent} />
            <span>{lang === "ar" ? "EN" : "AR"}</span>
          </button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
            background: c.bg3, border: `1px solid ${c.border}`, borderRadius: "10px",
            padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center",
          }}>
            {theme === "dark" ? <Sun size={15} color={c.accent} /> : <Moon size={15} color={c.accent} />}
          </button>
          <button
            onClick={() => { setTab("admin"); document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" }) }}
            style={{
              background: c.bg3, border: `1px solid ${c.border}`, borderRadius: "10px",
              padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center",
              gap: "5px", color: c.textMuted, fontSize: "12px", fontWeight: "600",
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            <ShieldCheck size={14} color={c.accent} />
            <span>{t.admin}</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", background: c.gradient,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "100px 24px 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${c.border}44 1px, transparent 1px), linear-gradient(90deg, ${c.border}44 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }} />
        <div style={{ position: "absolute", top: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent2}12 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: `${c.accent}18`, border: `1px solid ${c.accent}44`,
            borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
            fontSize: "13px", color: c.accent, fontWeight: "700",
          }}>
            <Zap size={13} fill={c.accent} />
            <span>{isRTL ? "النظام البيئي الرقمي الأول في مصر" : "Egypt's #1 Digital Investment Ecosystem"}</span>
          </div>

          <h1 style={{ margin: "0 0 20px", lineHeight: 1.1, fontWeight: 900 }}>
            {lang === "ar" ? (
              <>
                <span style={{ fontSize: "clamp(36px,7vw,72px)", display: "block", color: c.text }}>{t.hero.title1}</span>
                <span style={{ fontSize: "clamp(44px,9vw,96px)", display: "block", background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>{t.hero.title2}</span>
                <span style={{ fontSize: "clamp(24px,5vw,48px)", display: "block", color: c.textMuted, fontWeight: 700 }}>{t.hero.title3}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "clamp(48px,9vw,96px)", display: "block", background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>{t.hero.title1}</span>
                <span style={{ fontSize: "clamp(28px,5vw,56px)", display: "block", color: c.text }}>{t.hero.title2} {t.hero.title3}</span>
              </>
            )}
          </h1>

          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: c.textMuted, margin: "0 auto 36px", maxWidth: "560px" }}>{t.hero.desc}</p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`, color: "#000",
              border: "none", borderRadius: "14px", padding: "14px 32px", fontSize: "15px",
              fontWeight: "800", cursor: "pointer", boxShadow: `0 8px 32px ${c.accent}44`,
              display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Tajawal', sans-serif",
            }}>
              {t.hero.cta1} <ArrowRight size={16} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            </button>
            <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "transparent", color: c.text, border: `1.5px solid ${c.border}`,
              borderRadius: "14px", padding: "14px 32px", fontSize: "15px", fontWeight: "700",
              cursor: "pointer", fontFamily: "'Tajawal', sans-serif",
            }}>
              {t.hero.cta2}
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: c.textMuted, fontSize: "12px", cursor: "pointer", animation: "bounce 2s infinite" }}
          onClick={() => document.getElementById("stats-section")?.scrollIntoView({ behavior: "smooth" })}>
          <span>{isRTL ? "اسحب للأسفل" : "Scroll"}</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* STATS */}
      <section id="stats-section" style={{ padding: "60px 24px", background: c.bg2, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
          {t.stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, fontStyle: "italic", background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <AnimCounter val={s.val} />
              </div>
              <div style={{ color: c.textMuted, fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGIN */}
      <section id="login-section" style={{ padding: "80px 24px", background: c.bg }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><Logo size="lg" /></div>
          <p style={{ textAlign: "center", color: c.textMuted, fontSize: "14px", marginBottom: "36px" }}>
            {t.tagline} · <span style={{ fontStyle: "italic" }}>{t.taglineSub}</span>
          </p>
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: "24px", padding: "36px 32px", boxShadow: theme === "dark" ? `0 0 60px ${c.accent}18, 0 24px 60px rgba(0,0,0,0.4)` : "0 8px 40px rgba(0,0,0,0.08)" }}>

            {/* Tabs */}
            <div style={{ display: "flex", borderRadius: "14px", background: c.bg2, border: `1px solid ${c.border}`, padding: "4px", gap: "4px", marginBottom: "28px" }}>
              {(["partner", "investor", "admin"] as const).map((tp) => (
                <button key={tp} onClick={() => setTab(tp)} style={{
                  flex: 1, padding: "9px 4px", borderRadius: "10px", fontSize: "13px", fontWeight: "700",
                  border: "none", cursor: "pointer", transition: "all 0.2s",
                  background: tab === tp ? `linear-gradient(135deg, ${c.accent}, ${c.accent2})` : "transparent",
                  color: tab === tp ? "#000" : c.textMuted, fontFamily: "'Tajawal', sans-serif",
                }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    {tp === "partner" ? <><Briefcase size={12} />{t.partner}</> : tp === "investor" ? <><TrendingUp size={12} />{t.investor}</> : <><ShieldCheck size={12} />{t.admin}</>}
                  </span>
                </button>
              ))}
            </div>

            {/* Code