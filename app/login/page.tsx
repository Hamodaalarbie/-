"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Lock, Sun, Moon, Languages, Users, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAppContext()
  const [tab,  setTab]  = useState<"user"|"admin">("user")
  const [code, setCode] = useState("")
  const [pass, setPass] = useState("")
  const [show, setShow] = useState(false)
  const [load, setLoad] = useState(false)
  const [err,  setErr]  = useState("")
  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<"ar"|"en">("ar")

  const isAdmin = tab === "admin"
  const dir     = lang === "ar" ? "rtl" : "ltr"

  // tokens
  const bg     = dark ? "#06060f" : "#f0f0f8"
  const card   = dark ? "#0d0d1a" : "#ffffff"
  const bord   = dark ? "#1a1a2e" : "#dde0f0"
  const inp    = dark ? "#11111f" : "#f5f5fc"
  const text   = dark ? "#eeeef8" : "#0d0d1a"
  const sub    = dark ? "#6666aa" : "#7777aa"
  const muted  = dark ? "#333355" : "#c0c0dd"
  const accent = isAdmin ? "#a78bfa" : "#f59e0b"
  const acc2   = isAdmin ? "#7c3aed" : "#f97316"
  const glow   = isAdmin ? "rgba(167,139,250,0.18)" : "rgba(245,158,11,0.18)"

  const L = {
    ar: { code:"رمز الدخول", codePh:"أدخل رمزك", pass:"كلمة المرور", passPh:"كلمة المرور",
          forgot:"نسيت كلمة المرور؟", btn:"دخول", loading:"جارٍ...",
          noAcc:"ليس لديك حساب؟", reg:"سجّل الآن",
          tabUser:"شريك / مستثمر", tabAdmin:"مدير النظام",
          subUser:"للشركاء والمستثمرين", subAdmin:"للمديرين فقط",
          e1:"أدخل الرمز وكلمة المرور", e2:"بيانات غير صحيحة",
          e3:"ليس حساب مدير", e4:"استخدم تبويب المدير" },
    en: { code:"Access Code", codePh:"Enter your code", pass:"Password", passPh:"Your password",
          forgot:"Forgot password?", btn:"Sign In", loading:"Loading...",
          noAcc:"No account?", reg:"Register",
          tabUser:"Partner / Investor", tabAdmin:"System Admin",
          subUser:"For partners & investors", subAdmin:"For admins only",
          e1:"Enter code and password", e2:"Invalid credentials",
          e3:"Not an admin account", e4:"Use the Admin tab" },
  }
  const T = L[lang]

  const login = async () => {
    if (!code.trim() || !pass.trim()) { setErr(T.e1); return }
    setLoad(true); setErr("")
    const { data, error: dbErr } = await createClient()
      .from("users").select("*")
      .eq("code", code.trim()).eq("password", pass.trim()).single()
    setLoad(false)
    if (dbErr || !data) { setErr(T.e2); return }
    if (isAdmin && data.role !== "admin") { setErr(T.e3); return }
    if (!isAdmin && data.role === "admin") { setErr(T.e4); return }
    setUser(data)
    router.push(data.role === "admin" ? "/admin" : data.role === "investor" ? "/market" : "/dashboard")
  }

  const btnStyle: React.CSSProperties = {
    width:36, height:36, borderRadius:9,
    border:`1px solid ${bord}`, background:card,
    color:sub, cursor:"pointer", display:"flex",
    alignItems:"center", justifyContent:"center",
  }

  const inpStyle: React.CSSProperties = {
    width:"100%", borderRadius:11, fontSize:14,
    background:inp, border:`1.5px solid ${bord}`,
    color:text, fontFamily:"Cairo,Tajawal,sans-serif",
    transition:"border-color .2s", boxSizing:"border-box",
  }

  return (
    <div style={{
      minHeight:"100vh", background:bg,
      backgroundImage:`radial-gradient(circle, ${dark?"#ffffff07":"#00000005"} 1px, transparent 1px)`,
      backgroundSize:"28px 28px",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, direction:dir, fontFamily:"Cairo,Tajawal,sans-serif",
      position:"relative",
    }}>

      {/* glow */}
      <div style={{
        position:"fixed", top:"10%", left:"50%", transform:"translateX(-50%)",
        width:500, height:350, borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(ellipse,${glow} 0%,transparent 65%)`,
        transition:"background .4s",
      }}/>

      {/* controls */}
      <div style={{
        position:"fixed", top:16,
        ...(lang==="ar" ? {left:16} : {right:16}),
        display:"flex", gap:8, zIndex:10,
      }}>
        <button style={btnStyle} onClick={()=>setLang(l=>l==="ar"?"en":"ar")}>
          <Languages size={15}/>
        </button>
        <button style={btnStyle} onClick={()=>setDark(d=>!d)}>
          {dark ? <Sun size={15}/> : <Moon size={15}/>}
        </button>
      </div>

      {/* card */}
      <div style={{
        position:"relative", zIndex:1,
        width:"100%", maxWidth:400,
        background:card, borderRadius:20,
        border:`1.5px solid ${accent}45`,
        boxShadow:`0 0 0 1px ${bord}, 0 20px 60px ${glow}, 0 4px 24px rgba(0,0,0,0.3)`,
        padding:"32px 26px 26px",
        transition:"all .3s",
      }}>

        {/* شريط أعلى */}
        <div style={{
          position:"absolute", top:0, left:"20%", right:"20%", height:2,
          background:`linear-gradient(90deg,transparent,${accent},${acc2},transparent)`,
          borderRadius:"0 0 6px 6px",
        }}/>

        {/* logo */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
          <Logo size="md" scheme={isAdmin?"red":"gold"} lang={lang}/>
        </div>

        {/* tabs */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {([
            { id:"user"  as const, label:T.tabUser,  sub:T.subUser,  Icon:Users,       ac:"#f59e0b" },
            { id:"admin" as const, label:T.tabAdmin, sub:T.subAdmin, Icon:ShieldCheck, ac:"#a78bfa" },
          ] as const).map(({ id, label, sub: s, Icon, ac }) => {
            const active = tab === id
            return (
              <button key={id} onClick={()=>{ setTab(id); setErr("") }} style={{
                padding:"11px 8px", borderRadius:12, cursor:"pointer",
                border:`1.5px solid ${active ? ac+"90" : bord}`,
                background: active ? ac+"12" : "transparent",
                transition:"all .2s",
                display:"flex", flexDirection:"column", alignItems:"center", gap:5,
              }}>
                <div style={{
                  width:34, height:34, borderRadius:9,
                  background: active ? ac+"22" : inp,
                  border:`1px solid ${active ? ac+"55" : bord}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon size={15} color={active ? ac : muted}/>
                </div>
                <span style={{ fontSize:11.5, fontWeight:700, color: active ? ac : sub }}>{label}</span>
                <span style={{ fontSize:9.5, color:muted, textAlign:"center", lineHeight:1.3 }}>{s}</span>
              </button>
            )
          })}
        </div>

        <div style={{ height:1, background:bord, marginBottom:18 }}/>

        {/* رمز الدخول */}
        <div style={{ marginBottom:13 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:sub, marginBottom:6 }}>{T.code}</label>
          <div style={{ position:"relative" }}>
            <input
              type="text" value={code} placeholder={T.codePh}
              onChange={e=>setCode(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()}
              style={{ ...inpStyle, padding:"10px 38px 10px 12px" }}
              onFocus={e=>(e.target.style.borderColor=accent)}
              onBlur={e=>(e.target.style.borderColor=bord)}
            />
            <KeyRound size={14} style={{ position:"absolute", top:"50%", right:12, transform:"translateY(-50%)", color:accent, pointerEvents:"none" }}/>
          </div>
        </div>

        {/* كلمة المرور */}
        <div style={{ marginBottom:10 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:sub, marginBottom:6 }}>{T.pass}</label>
          <div style={{ position:"relative" }}>
            <input
              type={show?"text":"password"} value={pass} placeholder={T.passPh}
              onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()}
              style={{ ...inpStyle, padding:"10px 38px 10px 38px" }}
              onFocus={e=>(e.target.style.borderColor=accent)}
              onBlur={e=>(e.target.style.borderColor=bord)}
            />
            <Lock size={14} style={{ position:"absolute", top:"50%", right:12, transform:"translateY(-50%)", color:accent, pointerEvents:"none" }}/>
            <button type="button" onClick={()=>setShow(s=>!s)} style={{
              position:"absolute", top:"50%", left:10, transform:"translateY(-50%)",
              background:"none", border:"none", color:muted, cursor:"pointer", padding:0, display:"flex",
            }}>
              {show ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
          </div>
        </div>

        {/* نسيت */}
        <div style={{ textAlign: lang==="ar" ? "left" : "right", marginBottom:16 }}>
          <button onClick={()=>router.push("/recovery")} style={{
            background:"none", border:"none", fontSize:11.5,
            color:accent, cursor:"pointer", fontFamily:"Cairo,Tajawal,sans-serif",
          }}>{T.forgot}</button>
        </div>

        {/* خطأ */}
        {err && (
          <div style={{
            marginBottom:14, padding:"9px 13px", borderRadius:9, fontSize:13,
            textAlign:"center", background:acc2+"15", color:"#f87171",
            border:"1px solid #f8717135",
          }}>{err}</div>
        )}

        {/* زر الدخول */}
        <button
          onClick={login} disabled={load}
          style={{
            width:"100%", height:46, borderRadius:11, border:"none",
            cursor: load ? "not-allowed" : "pointer",
            fontSize:14, fontWeight:800,
            fontFamily:"Cairo,Tajawal,sans-serif",
            background: load ? muted : `linear-gradient(135deg,${accent},${acc2})`,
            color: dark ? "#000" : "#fff",
            boxShadow: load ? "none" : `0 4px 18px ${glow}`,
            transition:"all .2s",
          }}
        >
          {load ? T.loading : T.btn}
        </button>

        <p style={{ textAlign:"center", marginTop:18, fontSize:12.5, color:sub }}>
          {T.noAcc}{" "}
          <button onClick={()=>router.push("/register")} style={{
            background:"none", border:"none", fontWeight:800,
            fontSize:12.5, color:accent, cursor:"pointer",
            fontFamily:"Cairo,Tajawal,sans-serif",
          }}>{T.reg}</button>
        </p>
      </div>
    </div>
  )
}
