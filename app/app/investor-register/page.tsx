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
{/* ══════ HERO ══════ */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:"80px 24px 60px",
        position:"relative", overflow:"hidden", textAlign:"center" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`radial-gradient(circle, ${T.isDark?"#ffffff08":"#00000006"} 1px, transparent 1px)`,
          backgroundSize:"30px 30px" }}/>
        <div style={{ marginBottom:32 }}>
          <Logo size="lg" scheme="gold" lang={lang}/>
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,56px)", fontWeight:900, lineHeight:1.2, maxWidth:700, marginBottom:20 }}>
          <span style={{ background:"linear-gradient(135deg,#f59e0b,#f97316)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            {lang==="ar" ? "ابنِ مستقبلك الرقمي" : "Build Your Digital Future"}
          </span>
          <br/>
          <span style={{ color:T.text }}>{lang==="ar" ? "معنا اليوم" : "With Us Today"}</span>
        </h1>
        <p style={{ fontSize:16, color:T.sub, maxWidth:520, lineHeight:1.8, marginBottom:40 }}>
          {lang==="ar"
            ? "سجّل الآن وابدأ رحلتك الرقمية مع عرباوي"
            : "Register now and start your digital journey with Arabaawy"}
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

            {(modal==="login" || modal==="admin") && (
              <div>
                <h2 style={{ fontSize:17, fontWeight:900, color:T.text, marginBottom:4 }}>
                  {modal==="admin" ? "🛡️ بوابة المدراء" : lang==="ar"?"تسجيل الدخول":"Sign In"}
                </h2>
                <p style={{ fontSize:12, color:T.sub, marginBottom:20 }}>
                  {modal==="admin" ? "للمدراء والمشرفين فقط" : lang==="ar"?"أدخل بياناتك":"Enter your credentials"}
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                      {lang==="ar"?"رمز الدخول":"Access Code"}
                    </label>
                    <div style={{ position:"relative" }}>
                      <input type="text" value={lCode} placeholder={lang==="ar"?"أدخل رمزك":"Your code"}
                        onChange={e=>setLCode(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&doLogin(modal==="admin")}
                        style={{ ...inp, padding:"11px 38px 11px 12px" }}
                        onFocus={e=>(e.target.style.borderColor=accent)}
                        onBlur={e=>(e.target.style.borderColor=T.border)}/>
                      <KeyRound size={14} style={{ position:"absolute", top:"50%", right:12,
                        transform:"translateY(-50%)", color:accent, pointerEvents:"none" }}/>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                      {lang==="ar"?"كلمة المرور":"Password"}
                    </label>
                    <div style={{ position:"relative" }}>
                      <input type={lShow?"text":"password"} value={lPass}
                        placeholder={lang==="ar"?"كلمة المرور":"Password"}
                        onChange={e=>setLPass(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&doLogin(modal==="admin")}
                        style={{ ...inp, padding:"11px 38px 11px 38px" }}
                        onFocus={e=>(e.target.style.borderColor=accent)}
                        onBlur={e=>(e.target.style.borderColor=T.border)}/>
                      <Lock size={14} style={{ position:"absolute", top:"50%", right:12,
                        transform:"translateY(-50%)", color:accent, pointerEvents:"none" }}/>
                      <button type="button" onClick={()=>setLShow(s=>!s)} style={{
                        position:"absolute", top:"50%", left:10, transform:"translateY(-50%)",
                        background:"none", border:"none", color:T.sub, cursor:"pointer", padding:0, display:"flex" }}>
                        {lShow?<EyeOff size={14}/>:<Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"left", margin:"10px 0 16px" }}>
                  <button onClick={()=>router.push("/recovery")} style={{
                    background:"none", border:"none", fontSize:11.5,
                    color:accent, cursor:"pointer", fontFamily:"Cairo,Tajawal,sans-serif" }}>
                    {lang==="ar"?"نسيت كلمة المرور؟":"Forgot password?"}
                  </button>
                </div>
                {lErr && (
                  <div style={{ marginBottom:14, padding:"9px 13px", borderRadius:9,
                    fontSize:13, textAlign:"center", color:"#f87171",
                    background:"#f8717115", border:"1px solid #f8717130" }}>{lErr}</div>
                )}
                <button onClick={()=>doLogin(modal==="admin")} disabled={lLoad} style={{
                  width:"100%", height:46, borderRadius:11, border:"none",
                  cursor: lLoad?"not-allowed":"pointer", fontSize:14, fontWeight:800,
                  fontFamily:"Cairo,Tajawal,sans-serif",
                  background: lLoad ? T.muted : `linear-gradient(135deg,${accent},${accent2})`,
                  color: T.isDark ? "#000" : "#fff", transition:"all .2s",
                }}>
                  {lLoad ? "..." : lang==="ar"?"دخول →":"Sign In →"}
                </button>
                {modal==="login" && (
                  <p style={{ textAlign:"center", marginTop:16, fontSize:12.5, color:T.sub }}>
                    {lang==="ar"?"ليس لديك حساب؟ ":"No account? "}
                    <button onClick={()=>{ setModal("register"); setRStep(1); setRDone(false) }} style={{
                      background:"none", border:"none", color:accent, fontWeight:800,
                      cursor:"pointer", fontSize:12.5, fontFamily:"Cairo,Tajawal,sans-serif" }}>
                      {lang==="ar"?"سجّل الآن":"Register"}
                    </button>
                  </p>
                )}
              </div>
            )}

            {modal==="register" && (
              <div>
                <h2 style={{ fontSize:16, fontWeight:900, color:T.text, marginBottom:16 }}>
                  {lang==="ar"?"إنشاء حساب جديد":"Create Account"}
                </h2>
                {!rDone && (
                  <div style={{ display:"flex", background:T.surface, border:`1px solid ${T.border}`,
                    borderRadius:12, padding:3, marginBottom:20, gap:4 }}>
                    {([
                      { id:"partner" as const, label:lang==="ar"?"🤝 شريك":"🤝 Partner", c:ROLE_COLORS.partner },
                      { id:"investor" as const, label:lang==="ar"?"📈 مستثمر":"📈 Investor", c:ROLE_COLORS.investor },
                    ]).map(({ id, label, c }) => (
                      <button key={id} onClick={()=>{ setRegTab(id); setRStep(1); setRErr("") }} style={{
                        flex:1, padding:"9px 6px", borderRadius:9, border:"none",
                        fontWeight:700, fontSize:13, fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer",
                        background: regTab===id ? `linear-gradient(135deg,${c.a},${c.b})` : "transparent",
                        color: regTab===id ? "#fff" : T.sub, transition:"all .2s",
                      }}>{label}</button>
                    ))}
                  </div>
                )}
                {!rDone && (
                  <div style={{ display:"flex", gap:6, marginBottom:22 }}>
                    {[1,2,3].map(s => (
                      <div key={s} style={{ flex:1, height:4, borderRadius:99,
                        background: s<=rStep ? `linear-gradient(90deg,${RC.a},${RC.b})` : T.muted,
                        transition:"background .3s" }}/>
                    ))}
                  </div>
                )}
                {rDone && (
                  <div style={{ textAlign:"center", padding:"10px 0" }}>
                    <div style={{ fontSize:52, marginBottom:12 }}>{regTab==="partner"?"🤝":"💼"}</div>
                    <h3 style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:8 }}>
                      {lang==="ar"?"تم إنشاء حسابك!":"Account Created!"}
                    </h3>
                    <div style={{ padding:"14px 16px", borderRadius:12,
                      background:`${RC.a}10`, border:`1px solid ${RC.a}30`, marginBottom:20 }}>
                      <p style={{ fontSize:11, color:T.sub, marginBottom:8 }}>{lang==="ar"?"رمز الدخول":"Access Code"}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                        <span style={{ fontSize:22, fontWeight:900, color:RC.a, letterSpacing:"0.08em" }}>{rCode}</span>
                        <button onClick={()=>{ navigator.clipboard.writeText(rCode); setRCopied(true); setTimeout(()=>setRCopied(false),2000) }}
                          style={{ background:`${RC.a}15`, border:`1px solid ${RC.a}40`, borderRadius:8,
                            padding:"6px 10px", cursor:"pointer", display:"flex", alignItems:"center",
                            gap:5, color:RC.a, fontSize:11, fontWeight:700, fontFamily:"Cairo,Tajawal,sans-serif" }}>
                          {rCopied ? <><Check size={12}/>{lang==="ar"?"نُسخ":"Copied"}</> : <><Copy size={12}/>{lang==="ar"?"نسخ":"Copy"}</>}
                        </button>
                      </div>
                    </div>
                    <button onClick={()=>setModal(null)} style={{
                      width:"100%", height:44, borderRadius:11, border:"none",
                      background:`linear-gradient(135deg,${RC.a},${RC.b})`,
                      color:"#fff", fontWeight:800, fontSize:14,
                      fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer" }}>
                      {lang==="ar"?"الدخول للمنصة →":"Enter Platform →"}
                    </button>
                  </div>
                )}
                {!rDone && rStep===1 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"الاسم الكامل":"Full Name"}
                      </label>
                      <input style={inp} placeholder={lang==="ar"?"محمد أحمد":"John Doe"} value={rName}
                        onChange={e=>setRName(e.target.value)}
                        onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"رقم الهاتف":"Phone"}
                      </label>
                      <input style={inp} placeholder="01xxxxxxxxx" type="tel" value={rPhone}
                        onChange={e=>setRPhone(e.target.value)}
                        onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                    </div>
                    {regTab==="investor" && (
                      <div>
                        <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                          {lang==="ar"?"رقم الهوية":"National ID"}
                        </label>
                        <input style={inp} placeholder="14 رقم" value={rNatId}
                          onChange={e=>setRNatId(e.target.value)}
                          onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                      </div>
                    )}
                    {regTab==="partner" && (
                      <div>
                        <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                          {lang==="ar"?"القسم":"Department"}
                        </label>
                        <select style={{ ...inp, cursor:"pointer" }} value={rDept} onChange={e=>setRDept(e.target.value)}
                          onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}>
                          <option value="">{lang==="ar"?"-- اختر قسمك --":"-- Select --"}</option>
                          {DEPARTMENTS.map(d=>(
                            <option key={d.code} value={d.code} style={{ background:T.card }}>
                              {d.name} ({d.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {rErr && <p style={{ color:"#f87171", fontSize:12, textAlign:"center" }}>{rErr}</p>}
                    <button onClick={()=>{
                      setRErr("")
                      if (!rName.trim()) { setRErr("أدخل الاسم"); return }
                      if (!rPhone.trim()) { setRErr("أدخل الهاتف"); return }
                      if (regTab==="investor" && !rNatId.trim()) { setRErr("أدخل رقم الهوية"); return }
                      if (regTab==="partner" && !rDept) { setRErr("اختر القسم"); return }
                      setRStep(2)
                    }} style={{
                      width:"100%", height:44, borderRadius:11, border:"none",
                      background:`linear-gradient(135deg,${RC.a},${RC.b})`,
                      color:"#fff", fontWeight:800, fontSize:14,
                      fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer" }}>
                      {lang==="ar"?"التالي →":"Next →"}
                    </button>
                  </div>
                )}
                {!rDone && rStep===2 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"كلمة المرور":"Password"}
                      </label>
                      <div style={{ position:"relative" }}>
                        <input type={rShow?"text":"password"} style={{ ...inp, paddingLeft:36 }}
                          placeholder={lang==="ar"?"6 أحرف على الأقل":"Min 6 chars"} value={rPw}
                          onChange={e=>setRPw(e.target.value)}
                          onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                        <button type="button" onClick={()=>setRShow(s=>!s)} style={{
                          position:"absolute", top:"50%", left:10, transform:"translateY(-50%)",
                          background:"none", border:"none", color:T.sub, cursor:"pointer", padding:0, display:"flex" }}>
                          {rShow?<EyeOff size={14}/>:<Eye size={14}/>}
                        </button>
                      </div>
                      <PwBar pw={rPw} sub={T.sub}/>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"تأكيد كلمة المرور":"Confirm Password"}
                      </label>
                      <input type="password" style={inp} placeholder={lang==="ar"?"أعد الكتابة":"Repeat"} value={rPw2}
                        onChange={e=>setRPw2(e.target.value)}
                        onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                    </div>
                    {rErr && <p style={{ color:"#f87171", fontSize:12, textAlign:"center" }}>{rErr}</p>}
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setRStep(1)} style={{
                        flex:1, height:44, borderRadius:11,
                        border:`1px solid ${T.border}`, background:"transparent",
                        color:T.sub, cursor:"pointer", fontWeight:700,
                        fontFamily:"Cairo,Tajawal,sans-serif" }}>
                        {lang==="ar"?"رجوع":"Back"}
                      </button>
                      <button onClick={()=>{
                        setRErr("")
                        if (rPw.length<6) { setRErr("6 أحرف على الأقل"); return }
                        if (rPw!==rPw2) { setRErr("كلمتا المرور غير متطابقتين"); return }
  setRStep(3)
                      }} style={{
                        flex:2, height:44, borderRadius:11, border:"none",
                        background:`linear-gradient(135deg,${RC.a},${RC.b})`,
                        color:"#fff", fontWeight:800, fontSize:14,
                        fontFamily:"Cairo,Tajawal,sans-serif", cursor:"pointer" }}>
                        {lang==="ar"?"التالي →":"Next →"}
                      </button>
                    </div>
                  </div>
                )}
                {!rDone && rStep===3 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"سؤال الأمان":"Security Question"}
                      </label>
                      <select style={{ ...inp, cursor:"pointer" }} value={rSecQ} onChange={e=>setRSecQ(e.target.value)}
                        onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}>
                        {SECURITY_QUESTIONS.map(q=>(
                          <option key={q} value={q} style={{ background:T.card }}>{q}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:T.sub, display:"block", marginBottom:6 }}>
                        {lang==="ar"?"الإجابة":"Answer"}
                      </label>
                      <input style={inp} placeholder={lang==="ar"?"إجابتك السرية":"Your secret answer"} value={rSecA}
                        onChange={e=>setRSecA(e.target.value)}
                        onFocus={e=>(e.target.style.borderColor=RC.a)} onBlur={e=>(e.target.style.borderColor=T.border)}/>
                    </div>
                    {regTab==="investor" && (
                      <div style={{ padding:"10px 12px", borderRadius:10,
                        background:`${RC.a}0a`, border:`1px solid ${RC.a}25` }}>
                        <p style={{ fontSize:11, color:T.sub, margin:0, lineHeight:1.7 }}>
                          🏦 {lang==="ar"?"سيتم إنشاء محفظة رقمية خاصة بك فور التسجيل":"A digital wallet will be created upon registration"}
                        </p>
                      </div>
                    )}
                    {rErr && <p style={{ color:"#f87171", fontSize:12, textAlign:"center" }}>{rErr}</p>}
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setRStep(2)} style={{
                        flex:1, height:44, borderRadius:11,
                        border:`1px solid ${T.border}`, background:"transparent",
                        color:T.sub, cursor:"pointer", fontWeight:700,
                        fontFamily:"Cairo,Tajawal,sans-serif" }}>
                        {lang==="ar"?"رجوع":"Back"}
                      </button>
                      <button onClick={()=>{
                        if (!rSecA.trim()) { setRErr("أدخل إجابة سؤال الأمان"); return }
                        doRegister()
                      }} disabled={rLoad} style={{
                        flex:2, height:44, borderRadius:11, border:"none",
                        cursor: rLoad?"not-allowed":"pointer",
                        background: rLoad ? T.muted : `linear-gradient(135deg,${RC.a},${RC.b})`,
                        color:"#fff", fontWeight:800, fontSize:14,
                        fontFamily:"Cairo,Tajawal,sans-serif" }}>
                        {rLoad ? "..." : lang==="ar"?"إنشاء الحساب →":"Create Account →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}