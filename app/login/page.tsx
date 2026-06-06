"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, KeyRound, Lock, Globe,
  ShieldCheck, TrendingUp, Users, BarChart3, Zap,
  ChevronDown, ArrowRight, Briefcase
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

// التعريفات الخاصة باللغة والثيمات
type Lang = "ar" | "en"
type Theme = "dark" | "light"

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
  
  const isRTL = lang === "ar"
  
  const dark = {
    bg: "#080808", bg2: "#0f0f0f", bg3: "#141414", card: "#111111",
    border: "#1e1e1e", text: "#f5f5f5", textMuted: "#6b7280", 
    accent: "#f97316", accent2: "#fbbf24",
    gradient: "radial-gradient(ellipse 80% 60% at 50% -10%, #f9731622 0%, transparent 60%), #080808",
  }
  const light = {
    bg: "#fafaf9", bg2: "#f3f4f6", bg3: "#e5e7eb", card: "#ffffff",
    border: "#e5e7eb", text: "#111111", textMuted: "#6b7280",
    accent: "#ea6d0e", accent2: "#d97706",
    gradient: "radial-gradient(ellipse 80% 60% at 50% -10%, #f9731618 0%, transparent 60%), #fafaf9",
  }
  
  const c = theme === "dark" ? dark : light

  const handleLogin = async () => {
    if (!code.trim() || !password.trim()) { 
      setError(isRTL ? "يرجى إدخال البيانات" : "Please enter credentials"); 
      return 
    }
    setLoading(true); setError("")
    const supabase = createClient()
    const { data, error: dbErr } = await supabase.from("users").select("*")
      .eq("code", code.trim()).eq("password", password.trim()).single()
    setLoading(false)
    if (dbErr || !data) { setError(isRTL ? "بيانات غير صحيحة" : "Invalid credentials"); return }
    setUser(data)
    if (data.role === "admin") router.push("/admin")
    else router.push("/dashboard")
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: "12px", padding: "12px 40px",
    fontSize: "14px", color: c.text, background: c.bg2,
    border: `1.5px solid ${c.border}`, outline: "none",
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ background: c.bg, color: c.text, minHeight: "100vh" }}>
      <nav style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
        <Logo size="sm" />
        <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "EN" : "AR"}</button>
      </nav>

      <section id="login-section" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", background: c.card, padding: "30px", borderRadius: "24px", border: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {(["partner", "investor", "admin"] as const).map((tp) => (
              <button key={tp} onClick={() => setTab(tp)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: tab === tp ? c.accent : c.bg2 }}>
                {tp}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input type="text" placeholder={isRTL ? "رمز الدخول" : "Code"} value={code} onChange={(e) => setCode(e.target.value)} style={inputStyle} />
            <input type={showPass ? "text" : "password"} placeholder={isRTL ? "كلمة المرور" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            
            {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
            
            <button onClick={handleLogin} disabled={loading} style={{ padding: "12px", background: c.accent, border: "none", borderRadius: "12px", color: "#fff", cursor: "pointer" }}>
              {loading ? (isRTL ? "جاري الدخول..." : "Logging in...") : (isRTL ? "دخول" : "Login")}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
