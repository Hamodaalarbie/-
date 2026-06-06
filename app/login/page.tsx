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
    bg:"#05050e",
    surface:"#0b0b18",
    card:"#0f0f22",
    border:"#1a1a35",
    text:"#eeeef8",
    sub:"#6666aa",
    muted:"#2a2a50",
    isDark:true,
  },
  light: {
    bg:"#f4f4fc",
    surface:"#ffffff",
    card:"#ffffff",
    border:"#e0e0f0",
    text:"#0a0a1f",
    sub:"#6060a0",
    muted:"#d0d0e8",
    isDark:false,
  },
}

// ── ألوان كل نوع مستخدم ──
const ROLE_COLORS = {
  partner: {
    a:"#3b82f6",
    b:"#06b6d4",
    glow:"rgba(59,130,246,0.2)"
  },
  investor: {
    a:"#8b5cf6",
    b:"#d97706",
    glow:"rgba(139,92,246,0.2)"
  },
  admin: {
    a:"#10b981",
    b:"#ec4899",
    glow:"rgba(16,185,129,0.2)"
  },
}

function genCode(prefix: string) {
  const d = Math.floor(1000 + Math.random() * 9000)

  const l =
    String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    ) +
    String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )

  return `${prefix.toUpperCase().slice(0,3)}${d}${l}`
}

function PwBar({
  pw,
  sub
}:{
  pw:string
  sub:string
}) {
  const s = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw)
  ].filter(Boolean).length

  if (!pw) return null

  const cols = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e"
  ]

  const labs = [
    "ضعيفة",
    "مقبولة",
    "جيدة",
    "قوية"
  ]

  return (
    <div style={{ marginTop:5 }}>
      <div
        style={{
          display:"flex",
          gap:3,
          marginBottom:3
        }}
      >
        {[0,1,2,3].map(i => (
          <div
            key={i}
            style={{
              flex:1,
              height:3,
              borderRadius:99,
              background:
                i < s
                  ? cols[s-1]
                  : "#2a2a50",
              transition:"background .3s"
            }}
          />
        ))}
      </div>

      {s > 0 && (
        <span
          style={{
            fontSize:10.5,
            color:cols[s-1]
          }}
        >
          كلمة مرور {labs[s-1]}
        </span>
      )}
    </div>
  )
}
function Count({
  to,
  suffix = ""
}:{
  to:number
  suffix?:string
}) {
  const [v,setV] = useState(0)

  useEffect(() => {
    let start = 0

    const step = () => {
      start += Math.ceil(to / 40)

      if(start >= to){
        setV(to)
        return
      }

      setV(start)
      requestAnimationFrame(step)
    }

    step()
  },[to])

  return <>{v.toLocaleString()}{suffix}</>
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

  const supabase = createClient()

  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const [tab, setTab] = useState<
    "login" | "register"
  >("login")

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [loginCode, setLoginCode] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [role, setRole] = useState<
    "partner" | "investor" | "admin"
  >("partner")

  const [step, setStep] = useState(1)

  const [form, setForm] = useState<any>({
    full_name:"",
    phone:"",
    email:"",
    country:"",
    city:"",
    department:"",
    password:"",
    security_question:"",
    security_answer:"",
  })

  const deptOpen = useRef(false)
useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme")

    const savedLang =
      localStorage.getItem("lang")

    if (savedTheme) {
      setDark(savedTheme === "dark")
    }

    if (
      savedLang === "ar" ||
      savedLang === "en"
    ) {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    )
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
      subtitle:
        "منصة الاستثمار والشراكات الذكية",
      next: "التالي",
      back: "رجوع",
      finish: "إتمام التسجيل",
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
      subtitle:
        "Smart Investment & Partnership Platform",
      next: "Next",
      back: "Back",
      finish: "Finish Registration",
    },
  }

  const txt = T[lang]
  const theme = dark
    ? TK.dark
    : TK.light

  const roleColor =
    ROLE_COLORS[role]

  async function login() {
    if (loading) return

    setLoading(true)

    try {
      const { data, error } =
        await supabase
          .from("users")
          .select("*")
          .eq(
            "code",
            loginCode.trim()
          )
          .eq(
            "password",
            loginPassword.trim()
          )
          .single()

      if (error || !data) {
        alert(
          lang === "ar"
            ? "بيانات الدخول غير صحيحة"
            : "Invalid credentials"
        )

        return
      }

      setUser(data)

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      )

      if (data.role === "admin") {
        router.push("/admin")
      } else if (
        data.role === "investor"
      ) {
        router.push("/market")
      } else {
        router.push("/dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  async function registerUser() {
    if (loading) return

    setLoading(true)

    try {
      const code = genCode(role)

      const payload = {
        ...form,
        role,
        code,
        created_at:
          new Date().toISOString(),
      }

      const { error } =
        await supabase
          .from("users")
          .insert(payload)

      if (error) {
        alert(error.message)
        return
      }

      alert(
        lang === "ar"
          ? `تم إنشاء الحساب بنجاح\nرمز الدخول: ${code}`
          : `Account created\nCode: ${code}`
      )

      setTab("login")
      setLoginCode(code)
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
          ? `
            radial-gradient(
              circle at 20% 20%,
              rgba(59,130,246,.08),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 10%,
              rgba(168,85,247,.08),
              transparent 30%
            )
          `
          : `
            radial-gradient(
              circle at 20% 20%,
              rgba(59,130,246,.05),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 10%,
              rgba(168,85,247,.05),
              transparent 30%
            )
          `,
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
          left: lang === "ar"
            ? 16
            : "auto",
          right: lang === "en"
            ? 16
            : "auto",
          display: "flex",
          gap: 10,
          zIndex: 100,
        }}
      >
        <button
          onClick={() =>
            setLang(v =>
              v === "ar"
                ? "en"
                : "ar"
            )
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border:
              `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: "pointer",
          }}
        >
          <Languages size={18} />
        </button>

        <button
          onClick={() =>
            setDark(!dark)
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border:
              `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: "pointer",
          }}
        >
          {dark
            ? <Sun size={18} />
            : <Moon size={18} />
          }
        </button>
      </div>

      <Glass
        dark={dark}
        style={{
          width: "100%",
          maxWidth: 520,
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
            background:
              roleColor.glow,
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
{/* Tabs */}
        <div
          style={{
            display: "flex",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 14,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {[
            {
              id: "login",
              label: txt.login,
            },
            {
              id: "register",
              label: txt.register,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setTab(t.id as any)
              }
              style={{
                flex: 1,
                height: 42,
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                background:
                  tab === t.id
                    ? `linear-gradient(
                        135deg,
                        ${roleColor.a},
                        ${roleColor.b}
                      )`
                    : "transparent",
                color:
                  tab === t.id
                    ? "#fff"
                    : theme.text,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* اختيار نوع الحساب */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,1fr)",
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
            const active =
              role === item.id

            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() =>
                  setRole(item.id as any)
                }
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

        {tab === "login" ? (
          <>
            {/* رمز الدخول */}
            <div
              style={{
                marginBottom: 14,
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  color: theme.sub,
                  fontWeight: 700,
                }}
              >
                {txt.accessCode}
              </label>

              <Input
                value={loginCode}
                onChange={(e) =>
                  setLoginCode(
                    e.target.value
                  )
                }
                placeholder={
                  txt.accessCode
                }
                icon={
                  <KeyRound
                    size={16}
                    color={roleColor.a}
                  />
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  login()
                }
              />
            </div>

            {/* كلمة المرور */}
            <div
              style={{
                marginBottom: 14,
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  color: theme.sub,
                  fontWeight: 700,
                }}
              >
                {txt.password}
              </label>

              <Input
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(
                    e.target.value
                  )
                }
                placeholder={
                  txt.password
                }
                icon={
                  <Lock
                    size={16}
                    color={roleColor.a}
                  />
                }
                end={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPass(
                        !showPass
                      )
                    }
                    style={{
                      background:
                        "none",
                      border: "none",
                      color:
                        theme.sub,
                      cursor:
                        "pointer",
                    }}
                  >
                    {showPass ? (
                      <EyeOff
                        size={16}
                      />
                    ) : (
                      <Eye
                        size={16}
                      />
                    )}
                  </button>
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  login()
                }
              />
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
                  router.push(
                    "/recovery"
                  )
                }
                style={{
                  background:
                    "none",
                  border: "none",
                  color:
                    roleColor.a,
                  cursor:
                    "pointer",
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
                background:
                  `linear-gradient(
                    135deg,
                    ${roleColor.a},
                    ${roleColor.b}
                  )`,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                boxShadow:
                  `0 8px 25px ${roleColor.glow}`,
              }}
            >
              {loading
                ? txt.loading
                : txt.enter}
            </button>
          </>
        ) : (
            <>
            {step === 1 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <Input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        full_name:
                          e.target.value,
                      })
                    }
                    placeholder={
                      lang === "ar"
                        ? "الاسم الكامل"
                        : "Full Name"
                    }
                  />

                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone:
                          e.target.value,
                      })
                    }
                    placeholder={
                      lang === "ar"
                        ? "رقم الهاتف"
                        : "Phone Number"
                    }
                  />

                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email:
                          e.target.value,
                      })
                    }
                    placeholder="Email"
                    type="email"
                  />

                  <Input
                    value={form.country}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        country:
                          e.target.value,
                      })
                    }
                    placeholder={
                      lang === "ar"
                        ? "الدولة"
                        : "Country"
                    }
                  />

                  <Input
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city:
                          e.target.value,
                      })
                    }
                    placeholder={
                      lang === "ar"
                        ? "المدينة"
                        : "City"
                    }
                  />
                </div>

                <button
                  onClick={() =>
                    setStep(2)
                  }
                  style={{
                    width: "100%",
                    marginTop: 18,
                    height: 48,
                    border: "none",
                    borderRadius: 14,
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: 700,
                    background:
                      `linear-gradient(
                        135deg,
                        ${roleColor.a},
                        ${roleColor.b}
                      )`,
                  }}
                >
                  {txt.next}
                </button>
              </>
            )}
{step === 2 && (
              <>
                {/* اختيار القسم */}
                <div
                  style={{
                    marginBottom: 14,
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      deptOpen.current =
                        !deptOpen.current

                      setForm({
                        ...form,
                      })
                    }}
                    style={{
                      width: "100%",
                      height: 48,
                      borderRadius: 12,
                      border:
                        `1px solid ${theme.border}`,
                      background:
                        theme.surface,
                      color:
                        theme.text,
                      cursor: "pointer",
                      textAlign:
                        lang === "ar"
                          ? "right"
                          : "left",
                      padding:
                        "0 14px",
                    }}
                  >
                    {form.department ||
                      (lang === "ar"
                        ? "اختر القسم"
                        : "Select Department")}
                  </button>

                  {deptOpen.current && (
                    <div
                      style={{
                        marginTop: 6,
                        borderRadius: 12,
                        overflow:
                          "hidden",
                        border:
                          `1px solid ${theme.border}`,
                        background:
                          theme.surface,
                      }}
                    >
                      {DEPARTMENTS.map(
                        (d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setForm({
                                ...form,
                                department:
                                  d,
                              })

                              deptOpen.current =
                                false
                            }}
                            style={{
                              width:
                                "100%",
                              height:
                                42,
                              border:
                                "none",
                              background:
                                "transparent",
                              color:
                                theme.text,
                              cursor:
                                "pointer",
                            }}
                          >
                            {d}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* كلمة المرور */}
                <Input
                  type={
                    showPass
                      ? "text"
                      : "password"
                  }
                  value={
                    form.password
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder={
                    txt.password
                  }
                  icon={
                    <Lock
                      size={16}
                      color={
                        roleColor.a
                      }
                    />
                  }
                />

                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 18,
                  }}
                >
                  <PwBar
                    password={
                      form.password
                    }
                    color={
                      roleColor.a
                    }
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() =>
                      setStep(1)
                    }
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 12,
                      border:
                        `1px solid ${theme.border}`,
                      background:
                        theme.surface,
                      color:
                        theme.text,
                      cursor:
                        "pointer",
                    }}
                  >
                    {txt.back}
                  </button>

                  <button
                    onClick={() =>
                      setStep(3)
                    }
                    style={{
                      flex: 1,
                      height: 48,
                      border: "none",
                      borderRadius: 12,
                      cursor:
                        "pointer",
                      color: "#fff",
                      background:
                        `linear-gradient(
                          135deg,
                          ${roleColor.a},
                          ${roleColor.b}
                        )`,
                    }}
                  >
                    {txt.next}
                  </button>
                </div>
              </>
            )}
{step === 3 && (
              <>
                {/* سؤال الأمان */}
                <div
                  style={{
                    marginBottom: 14,
                  }}
                >
                  <select
                    value={
                      form.security_question
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        security_question:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      height: 48,
                      borderRadius: 12,
                      border:
                        `1px solid ${theme.border}`,
                      background:
                        theme.surface,
                      color:
                        theme.text,
                      padding:
                        "0 12px",
                    }}
                  >
                    <option value="">
                      {lang === "ar"
                        ? "اختر سؤال الأمان"
                        : "Select Security Question"}
                    </option>

                    {SECURITY_QUESTIONS.map(
                      (q) => (
                        <option
                          key={q}
                          value={q}
                        >
                          {q}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* إجابة السؤال */}
                <Input
                  value={
                    form.security_answer
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      security_answer:
                        e.target.value,
                    })
                  }
                  placeholder={
                    lang === "ar"
                      ? "إجابة سؤال الأمان"
                      : "Security Answer"
                  }
                />

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  <button
                    onClick={() =>
                      setStep(2)
                    }
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 12,
                      border:
                        `1px solid ${theme.border}`,
                      background:
                        theme.surface,
                      color:
                        theme.text,
                      cursor:
                        "pointer",
                    }}
                  >
                    {txt.back}
                  </button>

                  <button
                    onClick={
                      registerUser
                    }
                    disabled={
                      loading
                    }
                    style={{
                      flex: 1,
                      height: 48,
                      border: "none",
                      borderRadius: 12,
                      cursor:
                        "pointer",
                      color: "#fff",
                      fontWeight: 700,
                      background:
                        `linear-gradient(
                          135deg,
                          ${roleColor.a},
                          ${roleColor.b}
                        )`,
                    }}
                  >
                    {loading
                      ? txt.loading
                      : txt.finish}
                  </button>
                </div>
              </>
            )}

            {/* إحصائيات أسفل النموذج */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Glass
                dark={dark}
                style={{
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  <Count to={5000} suffix="+" />
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: theme.sub,
                  }}
                >
                  Users
                </div>
              </Glass>

              <Glass
                dark={dark}
                style={{
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  <Count to={120} suffix="+" />
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: theme.sub,
                  }}
                >
                  Projects
                </div>
              </Glass>

              <Glass
                dark={dark}
                style={{
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  <Count to={98} suffix="%" />
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: theme.sub,
                  }}
                >
                  Success
                </div>
              </Glass>
            </div>
          </>
        )}
      </Glass>
    </div>
  )
}