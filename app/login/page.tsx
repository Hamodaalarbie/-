"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAppContext()
  const [tab, setTab] = useState<"partner" | "admin">("partner")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!code.trim() || !password.trim()) {
      setError("يرجى إدخال رمز الدخول وكلمة المرور")
      return
    }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { data, error: dbErr } = await supabase
      .from("users")
      .select("*")
      .eq("code", code.trim())
      .eq("password", password.trim())
      .single()

    setLoading(false)
    if (dbErr || !data) {
      setError("بيانات غير صحيحة، تحقق من الرمز وكلمة المرور")
      return
    }

    if (tab === "admin" && data.role !== "admin") {
      setError("هذا الحساب ليس حساب مدير")
      return
    }
    if (tab === "partner" && data.role === "admin") {
      setError("استخدم تبويب المدير لتسجيل الدخول")
      return
    }

    setUser(data)
    if (data.role === "admin") router.push("/admin")
    else if (data.role === "investor") router.push("/market")
    else router.push("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(ellipse at center, #1a0d00 0%, #0a0a0a 70%)",
      }}
    >
      <div
        className="w-full max-w-sm animate-scaleIn"
        style={{
          background: "#111111",
          border: "2px solid #f97316",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(249,115,22,0.3)",
          padding: "40px 32px",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <p className="text-center text-sm mb-8" style={{ color: "#9ca3af" }}>
          النظام البيئي الرقمي
        </p>

        {/* Tabs */}
        <div
          className="flex rounded-xl overflow-hidden mb-6"
          style={{ background: "#1a1a1a", border: "1px solid #222" }}
        >
          {(["partner", "admin"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: tab === t ? "#f97316" : "transparent",
                color: tab === t ? "#000" : "#9ca3af",
                borderRadius: "10px",
              }}
            >
              {t === "partner" ? "شريك" : "مدير"}
            </button>
          ))}
        </div>

        {/* Code input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>
            رمز الدخول
          </label>
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="أدخل رمز الدخول"
              className="w-full rounded-xl py-3 pr-10 pl-4 text-sm text-white"
              style={{
                background: "#1a1a1a",
                border: "1.5px solid #333",
                fontFamily: "'Tajawal', sans-serif",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <KeyRound
              size={16}
              className="absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: "#f97316" }}
            />
          </div>
        </div>

        {/* Password input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="w-full rounded-xl py-3 pr-10 pl-10 text-sm text-white"
              style={{
                background: "#1a1a1a",
                border: "1.5px solid #333",
                fontFamily: "'Tajawal', sans-serif",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Lock
              size={16}
              className="absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: "#f97316" }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 left-3 -translate-y-1/2"
              style={{ color: "#9ca3af" }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-sm text-center"
            style={{ background: "#2a0808", color: "#ef4444", border: "1px solid #dc2626" }}
          >
            {error}
          </div>
        )}

        {/* Forgot password */}
        <div className="text-left mb-5">
          <button
            onClick={() => router.push("/recovery")}
            className="text-xs hover:underline"
            style={{ color: "#f97316" }}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-base btn-primary"
          style={{
            background: loading ? "#7c3a0c" : "#f97316",
            color: "#000",
            border: "none",
            height: "48px",
          }}
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>

        {/* Register link */}
        <p className="text-center mt-5 text-sm" style={{ color: "#9ca3af" }}>
          ليس لديك حساب؟{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-bold hover:underline"
            style={{ color: "#f97316" }}
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  )
}
