'use client'

import { useStore } from '@/components/providers'
import { TrendingUp, Users, ChevronDown, Sparkles } from 'lucide-react'
import Logo from '@/components/logo'

interface Props {
  onInvestor: () => void
  onPartner: () => void
}

export function Hero({ onInvestor, onPartner }: Props) {
  const { lang, content } = useStore()
  const ar = lang === 'ar'

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-20 text-center">
      {/* خلفية نقاط */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* توهج */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 65%)',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/4 top-2/3"
        style={{
          width: 400, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Badge */}
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1.5">
        <Sparkles className="size-3 text-[#f59e0b]" />
        <span className="text-xs font-bold text-[#f59e0b]">
          {ar ? 'النظام البيئي الرقمي العربي' : 'Arab Digital Ecosystem'}
        </span>
      </div>

      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo size="lg" />
      </div>

      {/* Headline */}
      <h1 className="mb-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
        <span className="text-gradient-wave">
          {ar ? content.heroTitleAr : content.heroTitleEn}
        </span>
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {ar ? content.heroSubAr : content.heroSubEn}
      </p>

      {/* CTA */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onInvestor}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d97706] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
        >
          <TrendingUp className="size-4" />
          {ar ? 'انضم كمستثمر' : 'Join as Investor'}
        </button>
        <button
          onClick={onPartner}
          className="flex items-center gap-2 rounded-xl border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-7 py-3.5 text-sm font-bold text-[#3b82f6] transition hover:bg-[#3b82f6]/20"
        >
          <Users className="size-4" />
          {ar ? 'انضم كشريك' : 'Join as Partner'}
        </button>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-muted-foreground">
          {ar ? 'اكتشف أكثر' : 'Explore more'}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </div>
    </section>
  )
}