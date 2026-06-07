use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, KeyRound, Lock, Moon, Sun, Globe,
  ShieldCheck, TrendingUp, Users, BarChart3, Zap,
  Building2, ChevronDown, ArrowRight, CheckCircle,
  Briefcase, Rocket, HeartHandshake, Code2, Cpu,
  Package, LineChart, Phone, Mail, MapPin, Clock,
  Layers, Target, DollarSign, Star, Sparkles,
  PieChart, Activity, Award, BadgeCheck,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

// ═══════════════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════════════
type Theme = "dark" | "light"
type Lang  = "ar"  | "en"

const DARK = {
  bg:       "#060606",
  bg2:      "#0d0d0d",
  bg3:      "#141414",
  card:     "#0d0d0d",
  border:   "#1c1c1c",
  text:     "#f5f5f5",
  textSub:  "#9ca3af",
  accent:   "#FF6B00",
  accent2:  "#FFD700",
  accent3:  "#FF3D6B",
  accent4:  "#00D4FF",
  green:    "#22c55e",
  purple:   "#A855F7",
  gradBg:   "radial-gradient(ellipse 80% 55% at 50% -8%,#FF6B001e 0%,transparent 55%),radial-gradient(ellipse at 88% 78%,#FFD70010 0%,transparent 48%),radial-gradient(ellipse at 10% 90%,#00D4FF0c 0%,transparent 50%),#060606",
  shadow:   "0 0 80px #FF6B0018,0 32px 80px rgba(0,0,0,0.6)",
  navBg:    "rgba(6,6,6,0.88)",
}
const LIGHT = {
  bg:       "#F8F7F3",
  bg2:      "#F0EEE8",
  bg3:      "#E8E5DC",
  card:     "#FFFFFF",
  border:   "#E2DFD5",
  text:     "#111111",
  textSub:  "#6b7280",
  accent:   "#D45A00",
  accent2:  "#B8860B",
  accent3:  "#C0284E",
  accent4:  "#0088A8",
  green:    "#16a34a",
  purple:   "#7C3AED",
  gradBg:   "radial-gradient(ellipse 80% 55% at 50% -8%,#FF6B0012 0%,transparent 55%),radial-gradient(ellipse at 88% 78%,#FFD7000c 0%,transparent 48%),#F8F7F3",
  shadow:   "0 4px 40px rgba(0,0,0,0.08)",
  navBg:    "rgba(248,247,243,0.92)",
}

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════
const T = {
  ar: {
    nav: { products:"المنتجات", services:"الخدمات", investors:"المستثمرون", partners:"الشركاء", contact:"تواصل معنا" },
    hero: {
      badge:   "النظام البيئي الرقمي الأول في مصر والوطن العربي",
      line1:   "منصة",
      brand:   "عرباوي",
      line2:   "للاستثمار الذكي",
      desc:    "نظام بيئي رقمي متكامل يجمع المنتجات الرقمية، الشركاء الاستراتيجيين، والمستثمرين لتحقيق أقصى العوائد وبناء مستقبل رقمي مزدهر",
      cta1:    "ابدأ الاستثمار الآن",
      cta2:    "اكتشف المنصة",
      scroll:  "اسحب للأسفل",
    },
    stats: [
      { val:"500+",  label:"شريك نشط",          icon:"Users"     },
      { val:"120M+", label:"حجم الاستثمارات",    icon:"DollarSign"},
      { val:"98%",   label:"رضا العملاء",        icon:"Star"      },
      { val:"50+",   label:"مشروع منجز بنجاح",  icon:"Award"     },
    ],
    productsTitle: "منتجاتنا الرقمية",
    productsSub:   "حلول مبتكرة وخطط استثمارية مدروسة لكل هدف وكل طموح",
    servicesTitle: "خدماتنا المتكاملة",
    servicesSub:   "منظومة شاملة من الحلول الاستثمارية المصممة لنجاحك",
    whyTitle:      "لماذا تختار عرباوي؟",
    whySub:        "نظام بيئي متكامل يخدم الجميع — المستثمرون والشركاء والشركات الناشئة",
    contactTitle:  "تواصل معنا",
    contactSub:    "فريقنا جاهز لمساعدتك في كل خطوة من رحلتك الاستثمارية",
    loginTitle:    "تسجيل الدخول",
    loginSub:      "النظام البيئي الرقمي",
    code:          "رمز الدخول",
    codePh:        "أدخل رمز الدخول",
    pass:          "كلمة المرور",
    passPh:        "أدخل كلمة المرور",
    investor:      "مستثمر",
    partner:       "شريك",
    admin:         "مدير",
    login:         "دخول",
    logging:       "جارٍ الدخول...",
    forgot:        "نسيت كلمة المرور؟",
    noAccount:     "ليس لديك حساب؟",
    regPartner:    "تسجيل شريك",
    regInvestor:   "تسجيل مستثمر",
    explore:       "اكتشف الآن",
    getStarted:    "ابدأ الآن",
    err: {
      empty:    "يرجى إدخال رمز الدخول وكلمة المرور",
      wrong:    "بيانات غير صحيحة، تحقق من الرمز وكلمة المرور",
      notAdmin: "هذا الحساب ليس حساب مدير",
      useAdmin: "استخدم زر الإدارة لتسجيل الدخول",
    },
    contact: {
      phone:   "+20 100 000 0000",
      email:   "invest@arabaawy.com",
      address: "القاهرة، جمهورية مصر العربية",
      hours:   "9 ص – 5 م | الأحد – الخميس",
    },
    footer: "جميع الحقوق محفوظة · عرباوي للاستثمار الرقمي",
  },
  en: {
    nav: { products:"Products", services:"Services", investors:"Investors", partners:"Partners", contact:"Contact" },
    hero: {
      badge:   "Egypt & Arab World's #1 Digital Investment Ecosystem",
      line1:   "Arabaawy",
      brand:   "Smart",
      line2:   "Investment Platform",
      desc:    "An integrated digital ecosystem connecting digital products, strategic partners, and investors to maximise returns and build a prosperous digital future",
      cta1:    "Start Investing Now",
      cta2:    "Explore Platform",
      scroll:  "Scroll down",
    },
    stats: [
      { val:"500+",  label:"Active Partners",      icon:"Users"      },
      { val:"120M+", label:"Investment Volume",     icon:"DollarSign" },
      { val:"98%",   label:"Client Satisfaction",   icon:"Star"       },
      { val:"50+",   label:"Completed Projects",    icon:"Award"      },
    ],
    productsTitle: "Digital Products",
    productsSub:   "Innovative solutions and investment plans for every goal and ambition",
    servicesTitle: "Our Services",
    servicesSub:   "A comprehensive suite of investment solutions designed for your success",
    whyTitle:      "Why Choose Arabaawy?",
    whySub:        "A complete ecosystem serving everyone — investors, partners, and startups",
    contactTitle:  "Contact Us",
    contactSub:    "Our team is ready to help you at every step of your investment journey",
    loginTitle:    "Sign In",
    loginSub:      "Digital Ecosystem",
    code:          "Access Code",
    codePh:        "Enter your access code",
    pass:          "Password",
    passPh:        "Enter your password",
    investor:      "Investor",
    partner:       "Partner",
    admin:         "Admin",
    login:         "Login",
    logging:       "Logging in...",
    forgot:        "Forgot password?",
    noAccount:     "Don't have an account?",
    regPartner:    "Register Partner",
    regInvestor:   "Register Investor",
    explore:       "Explore Now",
    getStarted:    "Get Started",
    err: {
      empty:    "Please enter access code and password",
      wrong:    "Invalid credentials, please check and try again",
      notAdmin: "This account is not an admin account",
      useAdmin: "Use the admin button to sign in",
    },
    contact: {
      phone:   "+20 100 000 0000",
      email:   "invest@arabaawy.com",
      address: "Cairo, Arab Republic of Egypt",
      hours:   "9 AM – 5 PM | Sun – Thu",
    },
    footer: "All rights reserved · Arabaawy Digital Investment",
  },
}

// ═══════════════════════════════════════════════════════════
// PRODUCTS & SERVICES DATA
// ═══════════════════════════════════════════════════════════
const PRODUCTS_AR = [
  { icon:Code2,         color:"#00D4FF", tag:"SaaS",        name:"نظام إدارة المحافظ",       desc:"لوحة تحكم ذكية لإدارة استثماراتك بالكامل في مكان واحد بتقارير آنية",            badge:"الأكثر مبيعاً", featured:true  },
  { icon:Cpu,           color:"#FF3D6B", tag:"أتمتة",       name:"بوت التداول الآلي",          desc:"خوارزميات ذكية تعمل 24/7 لتعظيم عوائد محفظتك الرقمية دون تدخل بشري",          badge:"جديد",          featured:true  },
  { icon:Package,       color:"#FFD700", tag:"استثمار",     name:"صندوق النمو الرقمي",         desc:"استثمر في أعلى الأصول الرقمية أداءً بعوائد سنوية تصل إلى 25%",                badge:null,            featured:false },
  { icon:LineChart,     color:"#22c55e", tag:"تحليل",       name:"منصة التحليل والتقارير",    desc:"تقارير آنية ومؤشرات دقيقة لاتخاذ قرارات استثمارية مدروسة وذكية",              badge:null,            featured:false },
  { icon:Rocket,        color:"#A855F7", tag:"ريادة",       name:"بوابة الشركات الناشئة",     desc:"ابدأ مشروعك وتواصل مع المستثمرين والمرشدين المتخصصين في بيئة آمنة",            badge:"قريباً",        featured:false },
  { icon:HeartHandshake,color:"#FF6B00", tag:"شراكات",      name:"برنامج الشراكة الذهبي",     desc:"انضم لشبكة شركاء عرباوي وحقق دخلاً إضافياً ثابتاً ومستداماً",                 badge:"حصري",          featured:false },
]
const PRODUCTS_EN = [
  { icon:Code2,         color:"#00D4FF", tag:"SaaS",        name:"Portfolio Management System",  desc:"Smart dashboard to manage all your investments in one place with live reports",   badge:"Best Seller",  featured:true  },
  { icon:Cpu,           color:"#FF3D6B", tag:"Automation",  name:"Automated Trading Bot",         desc:"Smart 24/7 algorithms to maximise your digital portfolio returns automatically",  badge:"New",          featured:true  },
  { icon:Package,       color:"#FFD700", tag:"Investment",  name:"Digital Growth Fund",           desc:"Invest in top-performing digital assets with annual returns up to 25%",           badge:null,           featured:false },
  { icon:LineChart,     color:"#22c55e", tag:"Analytics",   name:"Analytics & Reports Platform",  desc:"Real-time reports and precise indicators for smart investment decisions",          badge:null,           featured:false },
  { icon:Rocket,        color:"#A855F7", tag:"Startup",     name:"Startup Gateway",               desc:"Launch your project and connect with investors and expert mentors safely",        badge:"Soon",         featured:false },
  { icon:HeartHandshake,color:"#FF6B00", tag:"Partnerships",name:"Gold Partnership Program",      desc:"Join Arabaawy's partner network and earn steady, sustainable additional income",  badge:"Exclusive",    featured:false },
]

const SERVICES_AR = [
  { icon:TrendingUp,  title:"إدارة المحافظ الاستثمارية", desc:"تحليل وإدارة احترافية بأعلى معايير الأداء والشفافية الكاملة"          },
  { icon:Building2,   title:"الشراكات التجارية",          desc:"فرص شراكة استراتيجية مع شبكة واسعة من رواد الأعمال والمؤسسات"        },
  { icon:BarChart3,   title:"تحليل السوق والفرص",         desc:"تقارير دورية وتحليلات معمقة لرصد أفضل الفرص الاستثمارية"              },
  { icon:ShieldCheck, title:"حماية الاستثمار",            desc:"أنظمة حماية متعددة الطبقات لصون أصولك ورأس مالك بأمان تام"           },
  { icon:Users,       title:"إدارة شبكة الشركاء",        desc:"منظومة متكاملة لتتبع الأداء والعمولات وتطوير العلاقات التجارية"       },
  { icon:Layers,      title:"التنويع الاستثماري الذكي",  desc:"استراتيجيات توزيع الأصول عبر قطاعات متعددة لتقليل المخاطر وزيادة العائد"},
]
const SERVICES_EN = [
  { icon:TrendingUp,  title:"Investment Portfolio Management", desc:"Professional analysis and management to the highest performance and transparency standards" },
  { icon:Building2,   title:"Business Partnerships",           desc:"Strategic partnership opportunities with a broad network of entrepreneurs and institutions"   },
  { icon:BarChart3,   title:"Market & Opportunity Analysis",   desc:"Periodic reports and in-depth analysis to identify the best investment opportunities"          },
  { icon:ShieldCheck, title:"Investment Protection",           desc:"Multi-layer protection systems to safeguard your assets and capital with full security"         },
  { icon:Users,       title:"Partner Network Management",      desc:"Comprehensive system for tracking performance, commissions, and business relationships"        },
  { icon:Layers,      title:"Smart Investment Diversification", desc:"Multi-sector asset allocation strategies to minimise risk and maximise returns"               },
]

const WHY_AR = [
  { color:"#22c55e", Icon:TrendingUp, title:"للمستثمرين",        items:["عوائد مضمونة حتى 25% سنوياً","تقارير أداء شهرية مفصّلة","مستشار استثماري شخصي","حماية متعددة الطبقات لرأس المال"] },
  { color:"#FF6B00", Icon:Briefcase,  title:"للشركاء",           items:["نظام عمولات شفاف ومتكامل","أدوات إدارة مشاريع احترافية","شبكة شركاء ممتدة وقوية","دعم فني وتشغيلي على مدار الساعة"] },
  { color:"#00D4FF", Icon:Rocket,     title:"للشركات الناشئة",   items:["تمويل أولي وتوسعي مرن","مرشدون متخصصون في كل المجالات","وصول مباشر لشبكة مستثمرين واسعة","بيئة عمل وبنية تحتية متكاملة"] },
]
const WHY_EN = [
  { color:"#22c55e", Icon:TrendingUp, title:"For Investors",   items:["Returns up to 25% annually","Detailed monthly performance reports","Personal investment advisor","Multi-layer capital protection"] },
  { color:"#FF6B00", Icon:Briefcase,  title:"For Partners",    items:["Transparent and integrated commission system","Professional project management tools","Strong and extended partner network","Round-the-clock technical and operational support"] },
  { color:"#00D4FF", Icon:Rocket,     title:"For Startups",    items:["Flexible seed and expansion funding","Expert mentors across all domains","Direct access to a wide investor network","Complete work environment and infrastructure"] },
]

// ═══════════════════════════════════════════════════════════
// SMALL HELPERS
// ═══════════════════════════════════════════════════════════
function AnimCounter({ val, dur = 1800 }: { val: string; dur?: number }) {
  const [disp, setDisp] = useState("0")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ""))
    if (isNaN(num)) { setDisp(val); return }
    const pre = val.match(/^[^0-9]*/)?.[0] ?? ""
    const suf = val.match(/[^0-9.]*$/)?.[0] ?? ""
    const t0  = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisp(`${pre}${Math.round(e * num)}${suf}`)
      if (p < 1) requestAnimationFrame(tick)
    }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tick(); obs.disconnect() } })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [val, dur])
  return <div ref={ref}>{disp}</div>
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 9px", borderRadius:100,
      background:`${color}1e`, border:`1px solid ${color}55`,
      color, fontSize:10, fontWeight:800, letterSpacing:"0.04em",
    }}>{label}</span>
  )
}

function SecHead({ title, sub, accent }: { title: string; sub: string; accent: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <h2 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:900, margin:"0 0 10px", fontStyle:"italic" }}>
        <span style={{ background:`linear-gradient(90deg,${accent},#FFD700)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{title}</span>
      </h2>
      <p style={{ color:"#6b7280", fontSize:15, margin:0, maxWidth:520, marginInline:"auto" }}>{sub}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAppContext()

  const [lang,    setLang]    = useState<Lang>("ar")
  const [theme,   setTheme]   = useState<Theme>("dark")
  const [tab,     setTab]     = useState<"investor"|"partner"|"admin">("investor")
  const [code,    setCode]    = useState("")
  const [pass,    setPass]    = useState("")
  const [showP,   setShowP]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const [scrolled,setScrolled]= useState(false)

  const t   = T[lang]
  const rtl = lang === "ar"
  const c   = theme === "dark" ? DARK : LIGHT

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })

  const handleLogin = async () => {
    if (!code.trim() || !pass.trim()) { setError(t.err.empty); return }
    setLoading(true); setError("")
    const sb = createClient()
    const { data, error: dbErr } = await sb.from("users").select("*")
      .eq("code", code.trim()).eq("password", pass.trim()).single()
    setLoading(false)
    if (dbErr || !data) { setError(t.err.wrong); return }
    if (tab === "admin" && data.role !== "admin") { setError(t.err.notAdmin); return }
    if (tab !== "admin" && data.role === "admin") { setError(t.err.useAdmin); return }
    setUser(data)
    router.push(data.role === "admin" ? "/admin" : data.role === "investor" ? "/market" : "/dashboard")
  }

  const inp: React.CSSProperties = {
    width:"100%", borderRadius:12, padding:"13px 44px 13px 16px",
    fontSize:14, color:c.text, background:c.bg2,
    border:`1.5px solid ${c.border}`, outline:"none",
    fontFamily:"'Tajawal',sans-serif", direction:"rtl", transition:"border-color .2s",
  }

  const products = lang === "ar" ? PRODUCTS_AR : PRODUCTS_EN
  const services = lang === "ar" ? SERVICES_AR : SERVICES_EN
  const why      = lang === "ar" ? WHY_AR      : WHY_EN

  return (
    <div dir={rtl?"rtl":"ltr"} style={{ background:c.bg, color:c.text, minHeight:"100vh", fontFamily:"'Tajawal',sans-serif", overflowX:"hidden" }}>

      {/* ══════════ NAV ══════════ */}

      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        background: scrolled
          ? theme==="dark" ? "rgba(6,6,6,0.95)" : "rgba(248,247,243,0.97)"
          : c.navBg,
        backdropFilter:"blur(28px)",
        borderBottom:`1px solid ${scrolled ? c.border : "transparent"}`,
        padding:"0 28px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        transition:"all .3s",
      }}>
        <Logo size="sm" />

        {/* Centre links */}
        <div style={{ display:"flex", gap:2, alignItems:"center" }}>
          {Object.entries(t.nav).map(([k,v]) => (
            <button key={k} onClick={() => go(`${k}-section`)} style={{
              background:"none", border:"none", cursor:"pointer",
              color:c.textSub, fontSize:13, fontWeight:600, padding:"6px 11px",
              borderRadius:8, fontFamily:"'Tajawal',sans-serif", transition:"color .2s",
            }}
              onMouseEnter={e=>(e.currentTarget.style.color=c.accent)}
              onMouseLeave={e=>(e.currentTarget.style.color=c.textSub)}
            >{v}</button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {/* Investor login */}
          <button onClick={()=>{ setTab("investor"); go("login-section") }} style={{
            display:"flex", alignItems:"center", gap:6,
            background:`linear-gradient(135deg,${c.accent},${c.accent2})`,
            border:"none", borderRadius:10, padding:"8px 16px",
            cursor:"pointer", color:"#000", fontSize:12, fontWeight:800,
            fontFamily:"'Tajawal',sans-serif",
            boxShadow:`0 4px 16px ${c.accent}44`,
          }}>
            <TrendingUp size={12}/> {rtl?"دخول المستثمر":"Investor"}
          </button>
          {/* Partner login */}
          <button onClick={()=>{ setTab("partner"); go("login-section") }} style={{
            display:"flex", alignItems:"center", gap:6,
            background:c.bg3, border:`1px solid ${c.border}`,
            borderRadius:10, padding:"8px 14px",
            cursor:"pointer", color:c.text, fontSize:12, fontWeight:700,
            fontFamily:"'Tajawal',sans-serif",
          }}>
            <Briefcase size={12} color={c.accent}/> {rtl?"دخول الشريك":"Partner"}
          </button>
          {/* Lang */}
          <button onClick={()=>setLang(lang==="ar"?"en":"ar")} style={{
            background:c.bg3, border:`1px solid ${c.border}`,
            borderRadius:10, padding:"8px 11px", cursor:"pointer",
            color:c.textSub, fontSize:12, fontWeight:700,
            display:"flex", alignItems:"center", gap:5,
          }}>
            <Globe size={12} color={c.accent}/> {lang==="ar"?"EN":"AR"}
          </button>
          {/* Theme */}
          <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{
            background:c.bg3, border:`1px solid ${c.border}`,
            borderRadius:10, padding:"8px 9px", cursor:"pointer",
            display:"flex", alignItems:"center",
          }}>
            {theme==="dark"?<Sun size={14} color={c.accent}/>:<Moon size={14} color={c.accent}/>}
          </button>
          {/* Admin — subtle */}
          <button onClick={()=>{ setTab("admin"); go("login-section") }} title={t.admin} style={{
            background:"transparent", border:`1px solid ${c.border}`,
            borderRadius:8, padding:"7px 8px", cursor:"pointer",
            display:"flex", alignItems:"center", opacity:.4, transition:"opacity .2s",
          }}
            onMouseEnter={e=>(e.currentTarget.style.opacity="1")}
            onMouseLeave={e=>(e.currentTarget.style.opacity="0.4")}
          >
            <ShieldCheck size={13} color={c.textSub}/>
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        minHeight:"100vh", background:c.gradBg,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"120px 24px 80px", position:"relative", overflow:"hidden",
      }}>
        {/* Grid */}
        <div style={{
          position:"absolute", inset:0, zIndex:0,
          backgroundImage:`linear-gradient(${c.border}55 1px,transparent 1px),linear-gradient(90deg,${c.border}55 1px,transparent 1px)`,
          backgroundSize:"60px 60px",
          maskImage:"radial-gradient(ellipse at center,black 35%,transparent 75%)",
        }}/>
        {/* Orbs */}
        <div style={{ position:"absolute", top:"10%", right:"6%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${c.accent}14 0%,transparent 68%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"15%", left:"3%",  width:380, height:380, borderRadius:"50%", background:`radial-gradient(circle,${c.accent4}10 0%,transparent 68%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"55%", right:"18%",  width:240, height:240, borderRadius:"50%", background:`radial-gradient(circle,${c.accent3}0c 0%,transparent 65%)`, pointerEvents:"none" }}/>

        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:860 }}>
          {/* Badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:`${c.accent}18`, border:`1px solid ${c.accent}44`,
            borderRadius:100, padding:"7px 20px", marginBottom:30,
            fontSize:13, color:c.accent, fontWeight:700,
          }}>
            <Zap size={13} fill={c.accent}/> {t.hero.badge}
          </div>

          {/* Headline */}
          <h1 style={{ margin:"0 0 24px", lineHeight:1.06, fontWeight:900 }}>
            {rtl ? (
              <>
                <span style={{ fontSize:"clamp(28px,5vw,56px)", display:"block", color:c.text, fontWeight:700 }}>{t.hero.line1}</span>
                <span style={{ fontSize:"clamp(52px,10vw,110px)", display:"block", fontStyle:"italic",
                  background:`linear-gradient(135deg,${c.accent},${c.accent2},${c.accent3})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {t.hero.brand}
                </span>
                <span style={{ fontSize:"clamp(20px,3.5vw,42px)", display:"block", color:c.textSub, fontWeight:600 }}>{t.hero.line2}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize:"clamp(52px,9vw,100px)", display:"block", fontStyle:"italic",
                  background:`linear-gradient(135deg,${c.accent},${c.accent2},${c.accent3})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {t.hero.line1}
                </span>
                <span style={{ fontSize:"clamp(22px,4vw,46px)", display:"block", color:c.text, fontWeight:700 }}>
                  {t.hero.brand} {t.hero.line2}
                </span>
              </>
            )}
          </h1>

          <p style={{ fontSize:"clamp(15px,1.8vw,18px)", color:c.textSub, margin:"0 auto 44px", maxWidth:620, lineHeight:1.75 }}>
            {t.hero.desc}
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>go("login-section")} style={{
              background:`linear-gradient(135deg,${c.accent},${c.accent2})`,
              color:"#000", border:"none", borderRadius:14,
              padding:"15px 40px", fontSize:15, fontWeight:800, cursor:"pointer",
              boxShadow:`0 10px 36px ${c.accent}44`,
              display:"flex", alignItems:"center", gap:8, fontFamily:"'Tajawal',sans-serif",
            }}>
              {t.hero.cta1}
              <ArrowRight size={16} style={{ transform:rtl?"rotate(180deg)":"none" }}/>
            </button>
            <button onClick={()=>go("products-section")} style={{
              background:"transparent", color:c.text,
              border:`1.5px solid ${c.border}`, borderRadius:14,
              padding:"15px 34px", fontSize:15, fontWeight:700, cursor:"pointer",
              fontFamily:"'Tajawal',sans-serif", transition:"border-color .2s",
            }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor=c.accent)}
              onMouseLeave={e=>(e.currentTarget.style.borderColor=c.border)}
            >
              {t.hero.cta2}
            </button>
          </div>
        </div>

        <div style={{
          position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:5,
          color:c.textSub, fontSize:11, cursor:"pointer",
          animation:"bounce 2.2s ease-in-out infinite",
        }} onClick={()=>go("stats-section")}>
          <span>{t.hero.scroll}</span>
          <ChevronDown size={18}/>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section id="stats-section" style={{ padding:"60px 24px", background:c.bg2, borderTop:`1px solid ${c.border}`, borderBottom:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:32 }}>
          {t.stats.map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"clamp(30px,4.5vw,50px)", fontWeight:900, fontStyle:"italic",
                background:`linear-gradient(135deg,${c.accent},${c.accent2})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                <AnimCounter val={s.val}/>
              </div>
              <div style={{ color:c.textSub, fontSize:14, fontWeight:600, marginTop:5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ PRODUCTS ══════════ */}
      <section id="products-section" style={{ padding:"100px 24px", background:c.bg }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <SecHead title={t.productsTitle} sub={t.productsSub} accent={c.accent}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20 }}>
            {products.map((p,i)=>{
              const Icon = p.icon
              return (
                <div key={i} style={{
                  background:c.card, border:`1px solid ${c.border}`,
                  borderRadius:22, padding:p.featured?"34px 28px":"24px 22px",
                  position:"relative", overflow:"hidden", cursor:"pointer",
                  borderTop:`3px solid ${p.color}`,
                  transition:"all .3s",
                }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-6px)"; el.style.boxShadow=`0 20px 56px ${p.color}24,0 8px 24px rgba(0,0,0,.3)` }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform="none"; el.style.boxShadow="none" }}
                >
                  {/* glow bg */}
                  <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle,${p.color}14 0%,transparent 65%)`, pointerEvents:"none" }}/>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
                    <div style={{ width:48, height:48, borderRadius:13, background:`${p.color}18`, border:`1px solid ${p.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={22} color={p.color}/>
                    </div>
                    <div style={{ display:"flex", gap:5, flexDirection:"column", alignItems:"flex-end" }}>
                      <Pill label={p.tag} color={p.color}/>
                      {p.badge && <Pill label={p.badge} color={
                        p.badge==="قريباً"||p.badge==="Soon" ? "#A855F7" :
                        p.badge==="حصري"||p.badge==="Exclusive" ? "#FF3D6B" : p.color
                      }/>}
                    </div>
                  </div>
                  <h3 style={{ margin:"0 0 10px", fontSize:p.featured?18:15, fontWeight:800, color:c.text }}>{p.name}</h3>
                  <p style={{ margin:"0 0 20px", fontSize:13, color:c.textSub, lineHeight:1.7 }}>{p.desc}</p>
                  <button onClick={()=>go("login-section")} style={{
                    padding:"9px 16px", borderRadius:10, border:"none",
                    background:`${p.color}18`, color:p.color, fontSize:12, fontWeight:800,
                    cursor:"pointer", fontFamily:"'Tajawal',sans-serif",
                    display:"flex", alignItems:"center", gap:6,
                  }}>
                    {t.explore} <ArrowRight size={12} style={{ transform:rtl?"rotate(180deg)":"none" }}/>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════ LOGIN CARD ══════════ */}
      <section id="login-section" style={{ padding:"100px 24px", background:c.bg2, borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:500, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
            <Logo size="lg" animate/>
          </div>
          <p style={{ textAlign:"center", color:c.textSub, fontSize:14, marginBottom:38 }}>{t.loginSub}</p>

          <div style={{
            background:c.card, border:`1.5px solid ${c.border}`,
            borderRadius:26, padding:"38px 34px",
            boxShadow:c.shadow,
          }}>
            {/* Tabs */}
            <div style={{ display:"flex", borderRadius:14, background:c.bg2, border:`1px solid ${c.border}`, padding:4, gap:4, marginBottom:28 }}>
              {(["investor","partner"] as const).map(tp=>(
                <button key={tp} onClick={()=>setTab(tp)} style={{
                  flex:1, padding:"11px 4px", borderRadius:10, fontSize:14, fontWeight:700,
                  border:"none", cursor:"pointer", transition:"all .2s",
                  background:tab===tp ? `linear-gradient(135deg,${c.accent},${c.accent2})` : "transparent",
                  color:tab===tp ? "#000" : c.textSub,
                  fontFamily:"'Tajawal',sans-serif",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                }}>
                  {tp==="investor"?<TrendingUp size={13}/>:<Briefcase size={13}/>}
                  {tp==="investor"?t.investor:t.partner}
                </button>
              ))}
              {/* Admin micro-btn */}
              <button onClick={()=>setTab("admin")} title={t.admin} style={{
                padding:"11px 12px", borderRadius:10, border:"none", cursor:"pointer",
                background:tab==="admin" ? c.bg3 : "transparent",
                color:tab==="admin" ? c.textSub : c.border,
                fontFamily:"'Tajawal',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:tab==="admin"?1:0.38, transition:"opacity .2s",
              }}>
                <ShieldCheck size={13}/>
              </button>
            </div>

            {/* Code field */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:c.textSub, marginBottom:6 }}>{t.code}</label>
              <div style={{ position:"relative" }}>
                <input value={code} onChange={e=>setCode(e.target.value)} placeholder={t.codePh}
                  style={inp} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  onFocus={e=>(e.target.style.borderColor=c.accent)}
                  onBlur={e=>(e.target.style.borderColor=c.border)}/>
                <KeyRound size={14} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", right:14, color:c.accent }}/>
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:c.textSub, marginBottom:6 }}>{t.pass}</label>
              <div style={{ position:"relative" }}>
                <input type={showP?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder={t.passPh}
                  style={{ ...inp, paddingLeft:44 }} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  onFocus={e=>(e.target.style.borderColor=c.accent)}
                  onBlur={e=>(e.target.style.borderColor=c.border)}/>
                <Lock size={14} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", right:14, color:c.accent }}/>
                <button onClick={()=>setShowP(!showP)} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:14, background:"none", border:"none", cursor:"pointer", color:c.textSub, padding:0 }}>
                  {showP?<EyeOff size={14}/>:<Eye size={14}/>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom:14, padding:"11px 14px", borderRadius:10, background:"#dc262610", border:"1px solid #dc262644", color:"#ef4444", fontSize:13, textAlign:"center" }}>
                {error}
              </div>
            )}

            <div style={{ textAlign:"left", marginBottom:20 }}>
              <button onClick={()=>router.push("/recovery")} style={{ background:"none", border:"none", color:c.accent, fontSize:12, cursor:"pointer", fontFamily:"'Tajawal',sans-serif" }}>
                {t.forgot}
              </button>
            </div>

            <button onClick={handleLogin} disabled={loading} style={{
              width:"100%", padding:14, borderRadius:14, border:"none",
              background:loading ? c.bg3 : `linear-gradient(135deg,${c.accent},${c.accent2})`,
              color:"#000", fontSize:15, fontWeight:800,
              cursor:loading?"not-allowed":"pointer",
              fontFamily:"'Tajawal',sans-serif",
              boxShadow:loading?"none":`0 8px 28px ${c.accent}44`,
              transition:"all .2s",
            }}>
              {loading?t.logging:t.login}
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
              <div style={{ flex:1, height:1, background:c.border }}/>
              <span style={{ color:c.textSub, fontSize:12 }}>{rtl?"أو سجّل كـ":"or register as"}</span>
              <div style={{ flex:1, height:1, background:c.border }}/>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>router.push("/partner-register")} style={{
                flex:1, padding:12, borderRadius:12, cursor:"pointer",
                background:"transparent", border:`1.5px solid ${c.accent}66`,
                color:c.accent, fontSize:13, fontWeight:700,
                fontFamily:"'Tajawal',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"background .2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.background=`${c.accent}11`)}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
              >
                <Briefcase size={13}/> {t.regPartner}
              </button>
              <button onClick={()=>router.push("/investor-register")} style={{
                flex:1, padding:12, borderRadius:12, cursor:"pointer",
                background:"transparent", border:`1.5px solid ${c.accent2}66`,
                color:c.accent2, fontSize:13, fontWeight:700,
                fontFamily:"'Tajawal',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, transitionms:"center", justifyContent:"center", gap:6, transition:"background .2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.background=`${c.accent2}11`)}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
              >
                <TrendingUp size={13}/> {t.regInvestor}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="services-section" style={{ padding:"100px 24px", background:c.bg, borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <SecHead title={t.servicesTitle} sub={t.servicesSub} accent={c.accent}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:18 }}>
            {services.map((s,i)=>{
              const Icon=s.icon
              return (
                <div key={i} style={{
                  background:c.card, border:`1px solid ${c.border}`,
                  borderRadius:18, padding:"22px 20px",
                  display:"flex", gap:16, alignItems:"flex-start",
                  transition:"border-color .2s, transform .2s",
                }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=c.accent; el.style.transform="translateY(-3px)" }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=c.border; el.style.transform="none" }}
                >
                  <div style={{ width:42, height:42, borderRadius:11, flexShrink:0, background:`${c.accent}18`, border:`1px solid ${c.accent}33`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={18} color={c.accent}/>
                  </div>
                  <div>
                    <h3 style={{ margin:"0 0 6px", fontSize:15, fontWeight:800, color:c.text }}>{s.title}</h3>
                    <p style={{ margin:0, fontSize:13, color:c.textSub, lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════ WHY ══════════ */}
      <section id="investors-section" style={{ padding:"100px 24px", background:c.bg2, borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <SecHead title={t.whyTitle} sub={t.whySub} accent={c.accent}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(310px,1fr))", gap:22 }}>
            {why.map((w,i)=>(
              <div key={i} style={{
                background:c.card, border:`1px solid ${c.border}`,
                borderRadius:22, padding:30,
                borderTop:`3px solid ${w.color}`,
                transition:"transform .25s, box-shadow .25s",
              }}
                onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-5px)"; el.style.boxShadow=`0 14px 44px ${w.color}22` }}
                onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform="none"; el.style.boxShadow="none" }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:`${w.color}18`, border:`1px solid ${w.color}33`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <w.Icon size={20} color={w.color}/>
                  </div>
                  <h3 style={{ margin:0, fontSize:17, fontWeight:900, color:c.text }}>{w.title}</h3>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  {w.items.map((item,j)=>(
                    <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <CheckCircle size={14} color={w.color} style={{ flexShrink:0, marginTop:2 }}/>
                      <span style={{ fontSize:13, color:c.textSub, lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>go("login-section")} style={{
                  marginTop:24, width:"100%", padding:"10px 0", borderRadius:10,
                  background:`${w.color}18`, border:`1px solid ${w.color}44`,
                  color:w.color, fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"'Tajawal',sans-serif",
                }}>
                  {t.getStarted}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ CONTACT ══════════ */}
      <section id="contact-section" style={{ padding:"80px 24px", background:c.bg, borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
          <SecHead title={t.contactTitle} sub={t.contactSub} accent={c.accent}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
            {[
              { Icon:Phone,   val:t.contact.phone   },
              { Icon:Mail,    val:t.contact.email   },
              { Icon:MapPin,  val:t.contact.address },
              { Icon:Clock,   val:t.contact.hours   },
            ].map((item,i)=>(
              <div key={i} style={{
                background:c.card, border:`1px solid ${c.border}`,
                borderRadius:16, padding:"20px 18px",
                display:"flex", alignItems:"center", gap:14,
                transition:"border-color .2s",
              }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=c.accent)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=c.border)}
              >
                <div style={{ width:36, height:36, borderRadius:10, background:`${c.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <item.Icon size={15} color={c.accent}/>
                </div>
                <span style={{ fontSize:13, color:c.text, fontWeight:600 }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding:"28px 24px", textAlign:"center", borderTop:`1px solid ${c.border}`, background:c.bg2 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><Logo size="sm"/></div>
        <p style={{ margin:0, color:c.textSub, fontSize:12 }}>© 2025 {t.footer}</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(9px)} }
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#FF6B0055;border-radius:4px}
      `}</style>
    </div>
  )
}