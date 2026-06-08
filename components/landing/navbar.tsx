'use client'

import { useStore } from '@/components/providers'
import { Sun, Moon, Languages, ShieldCheck } from 'lucide-react'
import Logo from '@/components/logo'

interface Props {
  onLogin: () => void
  onAdmin: () => void
  onPartner: () => void
}

export function Navbar({ onLogin, onAdmin, onPartner }: Props) {
  const { lang, toggleLang, toggleTheme, theme } = useStore()
  const ar = lang === 'ar'

  const NAV = ar
    ? ['الرئيسية', 'خدماتنا', 'المشاريع', 'من نحن']
    : ['Home', 'Services', 'Projects', 'About']

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Logo size="sm" />

        <div className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <span
              key={n}
              className="cursor-pointer text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              {n}
            </span>
          ))}
        </div>

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
            onClick={onAdmin}
            className="flex size-8 items-center justify-center rounded-lg border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
          >
            <ShieldCheck className="size-4" />
          </button>
          <button
            onClick={onLogin}
            className="rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-4 py-1.5 text-sm font-bold text-black"
          >
            {ar ? 'دخول' : 'Sign In'}
          </button>
        </div>
      </div>
    </nav>
  )
}