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
  const bg      = dark ? "#06060f" : "#f0f0f8"
  const card    = dark ? "#0d0d1a" : "#ffffff"
  const bord    = dark ? "#1a1a2e" : "#dde0f0"
  const inp     = dark ? "#11111f" : "#f5f5fc"
  const text    = dark ? "#eeeef8" : "#0d0d1a"
  const sub     = dark ? "#6666aa" : "#7777aa"
  const muted   = dark ? "#333355" : "#c0c0dd"
  const accent  = isAdmin ? "#a78bfa" : "#f59e0b"
  const acc2    = isAdmin ? "#7c3aed" : "#f97316"
  const glow    = isAdmin ? "rgba(167,139,250,0.18)" : "rgba(245,158,11,0.18)"

  const T = lang === "ar" ? {
    code:"رمز الدخول", codePh:"أدخل رمزك",
    pass:"كلمة المرور", passPh:"كلمة المرور",
    forgot:"نسيت كلمة المرور؟", btn:"دخول", loading:"جارٍ...",
    noAcc:"ليس لديك حساب؟", reg:"سجّل الآن",
    tabUser:"شريك / مستثمر", tabAdmin:"مدير النظام",
    subUser:"للشركاء والمستثمرين", subAdmin:"للمديرين فقط",
    e1:"أدخل الرمز وكلمة المرور", e2:"بيانات غير صحيحة",
    e3:"ليس حساب مدير", e4:"استخدم تبويب المدير",
  } : {
    code:"Access Code", codePh:"Enter your code",
    pass:"Password", passPh:"Your password",
    forgot:"Forgot password?", btn:"Sign In", loading:"Loading...",
    noAcc:"No account?", reg:"Register",
    tabUser:"Partner / Investor", tabAdmin:"System Admin",
    subUser:"For partners & investors", subAdmin:"For admins only",
    e1:"Enter code and password", e2:"Invalid credentials",
    e3:"Not an admin account", e4:"Use the Admin tab",
  }

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
    router