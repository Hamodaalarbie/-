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
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0a0a" }}>
      <div style={{ width:32, height:32, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#f97316", animation:"spin 1s linear infinite" }}/>
    </div>
  )
}