'use client'

import { useStore } from '@/components/providers'
import { TrendingUp, Users, PieChart } from 'lucide-react'

const ICONS: Record<string, typeof TrendingUp> = {
  TrendingUp,
  Handshake: Users,
  PieChart,
}

export function Services() {
  const { lang, services } = useStore()
  const ar = lang === 'ar'

  const active = services.filter((s) => s.active).sort((a, b) => a.order - b.order)

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1e90ff]">
            {ar ? 'خدماتنا' : 'Our Services'}
          </span>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {ar ? 'ما نقدمه لك' : 'What We Offer'}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((s) => {
            const Icon = ICONS[s.icon] ?? TrendingUp
            return (
              <div
                key={s.id}
                className="glass card-frame rounded-3xl overflow-hidden"
              >
                {s.imageUrl && (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={s.imageUrl}
                      alt={ar ? s.titleAr : s.titleEn}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#1e90ff]/10">
                    <Icon className="size-5 text-[#1e90ff]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">
                    {ar ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {ar ? s.descAr : s.descEn}
                  </p>
                  {s.columns.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {s.columns.map((c) => (
                        <div
                          key={c.labelEn}
                          className="rounded-xl bg-secondary p-3 text-center"
                        >
                          <p className="text-xs text-muted-foreground">
                            {ar ? c.labelAr : c.labelEn}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#1e90ff]">
                            {ar ? c.valueAr : c.valueEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}