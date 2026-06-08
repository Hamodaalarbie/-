'use client'

import { useStore } from '@/components/providers'
import { Users, TrendingUp } from 'lucide-react'

export function Projects() {
  const { lang, projects } = useStore()
  const ar = lang === 'ar'

  const active = projects.filter((p) => p.active)

  return (
    <section className="border-t border-border/60 bg-card/50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff2d55]">
            {ar ? 'مشاريعنا' : 'Our Projects'}
          </span>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            {ar ? 'أبرز المشاريع' : 'Featured Projects'}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((p) => (
            <div key={p.id} className="glass card-frame overflow-hidden rounded-3xl">
              {p.imageUrl && (
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={ar ? p.titleAr : p.titleEn}
                    className="h-full w-full object-cover transition hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">
                    {ar ? p.titleAr : p.titleEn}
                  </h3>
                  <span className="rounded-full bg-[#1e90ff]/10 px-2.5 py-1 text-xs font-bold text-[#1e90ff]">
                    {p.tag}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {ar ? p.descAr : p.descEn}
                </p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {ar ? 'التقدم' : 'Progress'}
                    </span>
                    <span className="font-bold text-[#1e90ff]">{p.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-wave"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5 text-[#1e90ff]" />
                  <span>
                    {p.investorsCount.toLocaleString()}{' '}
                    {ar ? 'مستثمر' : 'investors'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}