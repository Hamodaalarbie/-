"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/context"
import { createClient } from "@/lib/supabase/client"
import {
  Sun, Moon, Languages, ShieldCheck, Eye, EyeOff,
  KeyRound, Lock, TrendingUp, Users, Zap, Globe,
  BarChart3, Layers, Star, ChevronDown, ArrowLeft,
  Check, Copy, X, Sparkles, Menu
} from "lucide-react"
import Logo from "@/components/Logo"
import { SECURITY_QUESTIONS, DEPARTMENTS } from "@/lib/types"

const TK = {
  dark: {
    bg:"#05050e", surface:"#0b0b18", card:"#0f0f22",
    border:"#1a1a35", text:"#eeeef8", sub:"#6666aa", muted:"#2a2a50",
    isDark:true,
  },
  light: {
    bg:"#f4f4fc", surface:"#ffffff", card:"#ffffff",
    border:"#e0e0f0", text:"#0a0a1f", sub:"#6060a0", muted:"#d0d0e8",
    isDark:false,
  },
}

const ROLE_COLORS = {
  partner:  { a:"#3b82f6", b:"#06b6d4", glow:"rgba(59,130,246,0.2)"  },
  investor: { a:"#8b5cf6", b:"#d97706", glow:"rgba(139,92,246,0.2)"  },
  admin:    { a:"#10b981", b:"#ec4899", glow:"rgba(16,185,129,0.2)"  },
}

function genCode(prefix: string) {
  const d = Math.floor(1000 + Math.random() * 9000)
  const l = String.fromCharCode(65+Math.floor(Math.random()*26)) + String.fromCharCode(65+Math.floor(Math.random()*26))
  return `${prefix.toUpperCase().slice(0,3)}${d}${l}`
}

function PwBar({ pw, sub }: { pw:string; sub:string }) {
  const s = [pw.length>=8,/[A-Z]/.test(pw),/[0-9]/.test(pw),/[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
  if (!pw) return null
  const cols = ["#ef4444","#f97316","#eab308","#22c55e"]
  const labs = ["ضعيفة","مقبولة","جيدة","قوية"]
  return (
    <div style={{ marginTop:5 }}>
      <div style={{ display:"flex", gap:3, marginBottom:3 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ flex:1, height:3, borderRadius:99,
            background: i<s ? cols[s-1] : "#2a2a50", transition:"background .3s" }}/>
        ))}
      </div>
      {s>0 && <span style={{ fontSize:10.5, color:cols[s-1] }}>كلمة مرور {labs[s-1]}</span>}
    </div>
  )
}

function CountUp({ target, suffix="" }: { target:number; suffix?:string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let c = 0
      const step = Math.ceil(target / 60)
      const t = setInterval(() => { c += step; if (c >= target) { setV(target); clearInterval(t) } else setV(c) }, 20)
      obs.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{v.toLocaleString("ar-EG")}{suffix}</span>
}

export default function HomePage() {
  const router = useRouter()
  const { user, setUser } = useAppContext()
  const [dark,   setDark]   = useState(true)
  const [lang,   setLang]   = useState<"ar"|"en">("ar")
  const [modal,  setModal]  = useState<"login"|"register"|"admin"|null>(null)
  const [regTab, setRegTab] = useState<"partner"|"investor">("partner")
  const [menuOpen, setMenuOpen] = useState(false)
  const [lCode, setLCode] = useState("")
  const [lPass, setLPass] = useState("")
  const [lShow, setLShow] = useState(false)
  const [lLoad, setLLoad] = useState(false)
  const [lErr,  setLErr]  = useState("")
  const [rName,  setRName]  = useState("")
  const [rPhone, setRPhone] = useState("")
  const [rNatId, setRNatId] = useState("")
  const [rDept,  setRDept]  = useState("")
  const [rPw,    setRPw]    = useState("")
  const [rPw2,   setRPw2]   = useState("")
  const [rSecQ,  setRSecQ]  = useState(SECURITY_QUESTIONS[0])
  const [rSecA,  setRSecA]  = useState("")
  const [rShow,  setRShow]  = useState(false)
  const [rStep,  setRStep]  = useState(1)
  const [rLoad,  setRLoad]  = useState(false)
  const [rErr,   setRErr]   = useState("")
  const [rCode,  setRCode]  = useState("")
  const [rCopied,setRCopied]= useState(false)
  const [rDone,  setRDone]  = useState(false)

  const T  = TK[dark ? "dark" : "light"]
  const RC = ROLE_COLORS[regTab === "partner" ? "partner" : "investor"]
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    if (user) router.replace(user.role === "admin" ? "/admin" : user.role === "investor" ? "/market" : "/dashboard")
  }, [user])

  const doLogin = async (isAdmin = false) => {
    if (!lCode.trim() || !lPass.trim()) { setLErr("أدخل البيانات"); return }
    setLLoad(true); setLErr("")
    const { data, error } = await createClient().from("users").select("*")
      .eq("code", lCode.trim()).eq("password", lPass.trim()).single()
    setLLoad(false)
    if (error || !data) { setLErr("بيانات غير صحيحة"); return }
    if (isAdmin && data.role !== "admin") { setLErr("ليس حساب مدير"); return }
    if (!isAdmin && data.role === "admin") { setLErr("استخدم بوابة المدراء"); return }
    setUser(data)
  }

  const doRegister = async () => {
    setRErr(""); setRLoad(true)
    const code = genCode(regTab === "partner" ? rDept : "INV")
    const payload: Record<string,unknown> = {
      name: rName.trim(), phone: rPhone.trim(), code,
      password: rPw.trim(), role: regTab,
      rank:"iron", points:0, shares:0,
      security_question: rSecQ,
      security_answer: rSecA.trim().toLowerCase(),
    }
    if (regTab === "partner") payload.dept = rDept
    if (regTab === "investor") payload.national_id = rNatId.trim()
    const { data, error } = await createClient().from("users").insert(payload).select().single()
    setRLoad(false)
    if (error) { setRErr(error.message.includes("phone") ? "الهاتف مسجل مسبقاً" : "حدث خطأ"); return }
    setRCode(code); setUser(data); setRDone(true)
  }

  const loginScheme = modal === "admin" ? "red" : "gold"
  const accent  = modal === "admin" ? "#10b981" : modal === "register" ? RC.a : "#f59e0b"
  const accent2 = modal === "admin" ? "#ec4899" : modal === "register" ? RC.b : "#f97316"

  const inp: React.CSSProperties = {
    width:"100%", padding:"11px 14px", borderRadius:11, fontSize:14,
    background:T.surface, border:`1.5px solid ${T.border}`,
    color:T.text, fontFamily:"Cairo,Tajawal,sans-serif",
    outline:"none", transition:"border-color .2s", boxSizing:"border-box",
  }

  const stats = [
    { icon:Users,    label: lang==="ar"?"عضو نشط":"Active Members",    value:1240, suffix:"+" },
    { icon:BarChart3, label: lang==="ar"?"مشروع رقمي":"Digital Projects", value:38,   suffix:"" },
    { icon:Zap,      label: lang==="ar"?"مستثمر":"Investors",            value:94,   suffix:"+" },
    { icon:Star,     label: lang==="ar"?"نجمة تقييم":"Rating",            value:4,    suffix:".9★" },
  ]

  const services = [
    { icon:Globe,    title:lang==="ar"?"التجارة الرقمية":"Digital Commerce",   desc:lang==="ar"?"منصات متكاملة للبيع والتسويق الرقمي":"Integrated platforms for digital sales & marketing" },
    { icon:BarChart3, title:lang==="ar"?"الاستثمار الذكي":"Smart Investment",  desc:lang==="ar"?"فرص استثمارية في مشاريع رقمية واعدة":"Investment opportunities in promising digital projects" },
    { icon:Layers,   title:lang==="ar"?"بناء الفرق":"Team Building",           desc:lang==="ar"?"شراكات احترافية مع كفاءات متخصصة":"Professional partnerships with specialized talents" },
    { icon:Sparkles, title:lang==="ar"?"الإبداع الرقمي":"Digital Creativity", desc:lang==="ar"?"إنتاج محتوى وتصميم وتطوير متكامل":"Content production, design & full development" },
  ]

  const NAV = lang==="ar"
    ? ["الرئيسية","خدماتنا","المشاريع","من نحن"]
    : ["Home","Services","Projects","About"]

  const ctrlBtn: React.CSSProperties = {
    width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`,
    background:"transparent", color:T.sub, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text,
      fontFamily:"Cairo,Tajawal,sans-serif", direction:dir, transition:"background .3s" }}>

      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background:`${T.surface}ee`, backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${T.border}`,
        padding:"0 24px", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <Logo size="sm" scheme="gold" lang={lang}/>
        <div style={{ display:"flex", gap:28, alignItems:"center" }}>
          {NAV.map(n => (
            <span key={n} style={{ fontSize:13, fontWeight:600, color:T.sub, cursor:"pointer", transition:"color .2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color=T.text)}
              onMouseLeave={e=>(e.currentTarget.style.color=T.sub)}>
              {n}
            </span>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button style={ctrlBtn} onClick={()=>setLang(l=>l==="ar"?"en":"ar")}><Languages size={14}/></button>
          <button style={ctrlBtn} onClick={()=>setDark(d=>!d)}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
          <button onClick={()=>{ setModal("admin"); setLErr("") }} style={{
            width:34, height:34, borderRadius:9,
            border:"1px solid #10b98155", background:"#10b98110",
            color:"#10b981", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}><ShieldCheck size={14}/></button>
          <button onClick={()=>{ setModal("login"); setLErr("") }} style={{
            padding:"8px 16px", borderRadius:9, border:"none",
            background:"linear-gradient(135deg,#f59e0b,#f97316)",
            color:"#000", fontWeight:800, fontSize:13,
            fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer",
          }}>{lang==="ar"?"دخول":"Sign In"}</button>
        </div>
      </nav>
{lang==="ar"?"سجّل الآن وابدأ رحلتك الرقمية مع عرباوي":"Register now and start your digital journey with Arabaawy"}
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>{ setRegTab("investor"); setModal("register"); setRStep(1); setRDone(false) }}
            style={{ padding:"13px 32px", borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#8b5cf6,#d97706)",
              color:"#fff", fontWeight:800, fontSize:15,
              fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer" }}>
            {lang==="ar"?"سجّل كمستثمر":"Register as Investor"}
          </button>
          <button onClick={()=>{ setRegTab("partner"); setModal("register"); setRStep(1); setRDone(false) }}
            style={{ padding:"13px 32px", borderRadius:12,
              border:"1.5px solid #3b82f6", background:"transparent",
              color:"#3b82f6", fontWeight:800, fontSize:15,
              fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer" }}>
            {lang==="ar"?"سجّل كشريك":"Register as Partner"}
          </button>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ padding:"24px", textAlign:"center",
        borderTop:`1px solid ${T.border}`, color:T.sub, fontSize:12 }}>
        <Logo size="xs" scheme="gold" lang={lang}/>
        <p style={{ marginTop:12 }}>
          {lang==="ar"?"© 2025 عرباوي — جميع الحقوق محفوظة":"© 2025 Arabaawy — All rights reserved"}
        </p>
      </footer>

      {/* MODALS */}
      {modal && (
        <div onClick={e=>{ if(e.target===e.currentTarget) setModal(null) }}
          style={{ position:"fixed", inset:0, zIndex:200,
            background:"rgba(0,0,0,0.8)", backdropFilter:"blur(12px)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>

          <div className="animate-scaleIn" style={{
            width:"100%", maxWidth: modal==="register" ? 440 : 390,
            background:T.card, border:`1.5px solid ${accent}50`,
            borderRadius:20, padding:"28px 24px",
            boxShadow:`0 0 60px ${accent}20`,
            maxHeight:"92vh", overflowY:"auto", position:"relative",
          }}>
            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2,
              background:`linear-gradient(90deg,transparent,${accent},${accent2},transparent)`,
              borderRadius:"0 0 6px 6px" }}/>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <Logo size="xs" scheme={loginScheme} lang={lang}/>
              <button onClick={()=>setModal(null)} style={{
                width:32, height:32, borderRadius:8,
                border:`1px solid ${T.border}`, background:T.surface,
                color:T.sub, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}><X size={14}/></button>
            </div>

            {/* LOGIN / ADMIN */}
            {(modal==="login" || modal==="admin") && (
              // ... (نفس ما سبق)
            )}

            {/* REGISTER */}
            {modal==="register" && (
              // STEP 1: الاسم + الهاتف + (هوية أو قسم)
              // STEP 2: كلمة المرور + تأكيدها + PwBar
              // STEP 3: سؤال الأمان + الإجابة + doRegister()
              // DONE:   عرض رمز الدخول + نسخه
            )}

          </div>
        </div>
      )}
    </div>
  )
}