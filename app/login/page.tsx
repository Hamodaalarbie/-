"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState<"partner" | "admin">("partner")

  const inputStyle = "w-full bg-[#1a1a1a] border border-[#333] rounded-xl p-3 text-white outline-none focus:border-orange-500 transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <div className="w-full max-w-sm p-8 rounded-3xl border border-[#333] bg-[#111] shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          {role === "partner" ? "تسجيل دخول الشريك" : "لوحة تحكم الإدارة"}
        </h2>
        
        <div className="flex gap-2 mb-6 p-1 bg-[#1a1a1a] rounded-xl">
          <button onClick={() => setRole("partner")} className={`flex-1 py-2 rounded-lg ${role === "partner" ? "bg-orange-500 text-black" : "text-gray-400"}`}>شريك</button>
          <button onClick={() => setRole("admin")} className={`flex-1 py-2 rounded-lg ${role === "admin" ? "bg-orange-500 text-black" : "text-gray-400"}`}>مدير</button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input className={`${inputStyle} pl-10`} placeholder="كود الدخول" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input className={`${inputStyle} pl-10`} type={showPass ? "text" : "password"} placeholder="كلمة المرور" />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="w-full mt-8 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-all">
          دخول
        </button>
        
        <p className="text-center text-gray-500 text-sm mt-6 cursor-pointer hover:text-orange-500">
          نسيت رمز الدخول؟
        </p>
      </div>
    </div>
  )
}
