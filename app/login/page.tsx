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

// ══════════════════════════════════════════════
// THEME TOKENS
// ══════════════════════════════════════════════
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

// ── ألوان كل نوع مستخدم ──
const ROLE_COLORS = {
  partner:  { a:"#3b82f6", b:"#06b6d4", glow:"rgba(59,130,246,0.2)"  },
  investor: { a:"#8b5cf6", b:"#d97706", glow:"rgba(139,92,246,0.2)"  },
  admin:    { a:"#10b981", b:"#ec4899", glow:"rgba(16,185,129,0.2)"  },
}

function genCode(prefix: string) {
  const d = Math.floor(1000 + Math.random() * 9000)
  const l = String.fromCharCode(65+Math.floor(Math.random()*26))
          + String.fromCharCode(65+Math.floor(Math.random()*26))
  return `${prefix.toUpperCase().slice(0,3)}${d}${l}`
}
function Glass({
  children,
  dark,
  style = {},
}: {
  children: React.ReactNode
  dark: boolean
  style?: React.CSSProperties
}) {
  const t = dark ? TK.dark : TK.light
  return (
    <div
      style={{
        background: `${t.card}cc`,
        backdropFilter: "blur(14px)",
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        boxShadow: dark
          ? "0 8px 30px rgba(0,0,0,.35)"
          : "0 8px 30px rgba(0,0,0,.08)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Input({
  icon,
  end,
  style = {},
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
  end?: React.ReactNode
}) {
  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 12,
            transform: "translateY(-50%)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        >
          {icon}
        </div>
      )}

      <input
        {...props}
        style={{
          width: "100%",
          height: 46,
          borderRadius: 12,
          outline: "none",
          border: "1px solid #25254a",
          background: "#101024",
          color: "#fff",
          paddingInlineStart: 14,
          paddingInlineEnd: icon ? 40 : 14,
          fontSize: 14,
          ...style,
        }}
      />

      {end && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 12,
            transform: "translateY(-50%)",
          }}
        >
          {end}
        </div>
      )}
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const { setUser } = useAppContext()

  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [loginCode, setLoginCode] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [role, setRole] = useState<
    "partner" | "investor" | "admin"
  >("partner")

  const supabase = createClient()
useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const savedLang = localStorage.getItem("lang")

    if (savedTheme) {
      setDark(savedTheme === "dark")
    }

    if (savedLang === "ar" || savedLang === "en") {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  useEffect(() => {
    localStorage.setItem("lang", lang)
  }, [lang])

  const T = {
    ar: {
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      accessCode: "رمز الدخول",
      password: "كلمة المرور",
      partner: "شريك",
      investor: "مستثمر",
      admin: "مدير",
      enter: "دخول",
      loading: "جارٍ التحميل...",
      createAccount: "إنشاء حساب جديد",
      forgotPassword: "نسيت كلمة المرور؟",
      welcome: "مرحبًا بك في عرباوي",
      subtitle: "منصة الاستثمار والشراكات الذكية",
    },
    en: {
      login: "Login",
      register: "Register",
      accessCode: "Access Code",
      password: "Password",
      partner: "Partner",
      investor: "Investor",
      admin: "Admin",
      enter: "Sign In",
      loading: "Loading...",
      createAccount: "Create Account",
      forgotPassword: "Forgot Password?",
      welcome: "Welcome to Arabaawy",
      subtitle: "Smart Investment & Partnership Platform",
    },
  }

  const txt = T[lang]
  const theme = dark ? TK.dark : TK.light
  const roleColor = ROLE_COLORS[role]

  async function login() {
    if (loading) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("code", loginCode.trim())
        .eq("password", loginPassword.trim())
        .single()

      if (error || !data) {
        alert(lang === "ar"
          ? "بيانات الدخول غير صحيحة"
          : "Invalid credentials")
        return
      }

      setUser(data)

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      )

      if (data.role === "admin") {
        router.push("/admin")
      } else if (data.role === "investor") {
        router.push("/market")
      } else {
        router.push("/dashboard")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
backgroundImage: dark
          ? "radial-gradient(circle at 20% 20%, rgba(59,130,246,.08), transparent 35%), radial-gradient(circle at 80% 10%, rgba(168,85,247,.08), transparent 30%)"
          : "radial-gradient(circle at 20% 20%, rgba(59,130,246,.05), transparent 35%), radial-gradient(circle at 80% 10%, rgba(168,85,247,.05), transparent 30%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        transition: "all .3s ease",
      }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* أدوات التحكم */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: lang === "ar" ? 16 : "auto",
          right: lang === "en" ? 16 : "auto",
          display: "flex",
          gap: 10,
          zIndex: 100,
        }}
      >
        <button
          onClick={() =>
            setLang((v) => (v === "ar" ? "en" : "ar"))
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: "pointer",
          }}
        >
          <Languages size={18} />
        </button>

        <button
          onClick={() => setDark(!dark)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: "pointer",
          }}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <Glass
        dark={dark}
        style={{
          width: "100%",
          maxWidth: 460,
          padding: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: roleColor.glow,
            filter: "blur(60px)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Logo
            size="lg"
            scheme={
              role === "admin"
                ? "red"
                : role === "investor"
                ? "purple"
                : "gold"
            }
            lang={lang}
          />
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          {txt.welcome}
        </h1>

        <p
          style={{
            textAlign: "center",
            color: theme.sub,
            marginBottom: 24,
          }}
        >
          {txt.subtitle}
        </p>
{/* اختيار نوع الحساب */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
            marginBottom: 22,
          }}
        >
          {[
            {
              id: "partner",
              label: txt.partner,
              icon: Users,
            },
            {
              id: "investor",
              label: txt.investor,
              icon: TrendingUp,
            },
            {
              id: "admin",
              label: txt.admin,
              icon: ShieldCheck,
            },
          ].map((item) => {
            const active = role === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => setRole(item.id as any)}
                style={{
                  height: 88,
                  borderRadius: 14,
                  border: active
                    ? `1px solid ${roleColor.a}`
                    : `1px solid ${theme.border}`,
                  background: active
                    ? `${roleColor.a}15`
                    : theme.surface,
                  color: active
                    ? roleColor.a
                    : theme.text,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: ".25s",
}}
>
  <Icon size={20} />
  <span
    style={{
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {item.label}
  </span>
</button>
)
})}
</div>
{/* نسيت كلمة المرور */}
        <div
          style={{
            display: "flex",
            justifyContent:
              lang === "ar"
                ? "flex-start"
                : "flex-end",
            marginBottom: 18,
          }}
        >
          <button
            onClick={() =>
              router.push("/recovery")
            }
            style={{
              background: "none",
              border: "none",
              color: roleColor.a,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {txt.forgotPassword}
          </button>
        </div>

        {/* زر الدخول */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 14,
            border: "none",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            background: `linear-gradient(135deg,
              ${roleColor.a},
              ${roleColor.b})`,
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            boxShadow: `0 8px 25px ${roleColor.glow}`,
            transition: ".25s",
          }}
        >
          {loading
            ? txt.loading
            : txt.enter}
        </button>

        {/* فاصل */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "24px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: theme.border,
            }}
          />

          <span
            style={{
              color: theme.sub,
              fontSize: 12,
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: 1,
              background: theme.border,
            }}
          />
        </div>
{/* رمز الدخول */}
<div style={{ marginBottom: 14 }}>
  ...
</div>

{/* كلمة المرور */}
<div style={{ marginBottom: 14 }}>
  ...
</div>

{/* نسيت كلمة المرور */}
<div>
  ...
</div>

        {/* إنشاء حساب */}
        <button
          onClick={() =>
            router.push("/register")
          }
          style={{
            width: "100%",
            height: 48,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            background: "transparent",
            color: theme.text,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {txt.createAccount}
        </button>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            color: theme.sub,
            fontSize: 11,
          }}
        >
          © 2026 Arabaawy Platform
        </div>
      </Glass>
    </div>
  )
}