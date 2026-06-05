"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/context"

export default function RootPage() {
  const { user } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    } else if (user.role === "admin") {
      router.replace("/admin")
    } else if (user.role === "investor") {
      router.replace("/market")
    } else {
      router.replace("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#f97316" }} />
      </div>
    </div>
  )
}
