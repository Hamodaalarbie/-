"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { AppUser } from "./types"

interface AppContextType {
  user: AppUser | null
  setUser: (u: AppUser | null) => void
  logout: () => void
}

const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("arabaawy_user")
      if (stored) setUserState(JSON.parse(stored))
    } catch {}
  }, [])

  const setUser = (u: AppUser | null) => {
    setUserState(u)
    if (u) localStorage.setItem("arabaawy_user", JSON.stringify(u))
    else localStorage.removeItem("arabaawy_user")
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") window.location.href = "/login"
  }

  return (
    <AppContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
