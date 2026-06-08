'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/providers'
import { Sun, Moon, Languages, LogOut } from 'lucide-react'
import Logo from '@/components/logo'
import type { Role } from '@/lib/types'

interface Props {
  children: React.ReactNode
  requiredRole: Role
}

export function DashboardShell({ children, requiredRole }: Props) {
  const { user, logout, toggleTheme, toggleLang, lang, theme } = useStore()
  const router = useRouter()
  const ar = lang === 'ar'

  useEffect(() => {
    if (!user) router.replace('/')
    else if (user.role !== requiredRole) {
      router.replace(
        user.role === 'admin' ? '/admin' :
        user.role === 'investor' ? '/dashboard' : '/partner'
      )
    }
  }, [user])

  if (!user || user.role !== requiredRole) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
            >
              <Languages className="size-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              onClick={() => { logout(); router.replace('/') }}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" />
              {ar ? 'خروج' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}