"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, X, Users, TrendingUp, CheckCircle, Clock, Circle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import { Project, RoadmapPhase } from "@/lib/types"
import Logo from "@/components/Logo"

const STATUS_CONFIG = {
  active:  { label: "نشط",      bg: "#052e16", text: "#22c55e", border: "#16a34a" },
  scaling: { label: "توسعي",    bg: "#0c1a4a", text: "#60a5fa", border: "#3b82f6" },
  closed:  { label: "مغلق",     bg: "#2a0808", text: "#ef4444", border: "#dc2626" },
}

function RoadmapStep({ phase }: { phase: RoadmapPhase }) {
  const Icon = phase.status === "done" ? CheckCircle : phase.status === "in_progress" ? Clock : Circle
  const color = phase.status === "done" ? "#22c55e" : phase.status === "in_progress" ? "#f97316" : "#555"
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={16} color={color} />
      <span className="text-sm" style={{ color: phase.status === "done" ? "#22c55e" : phase.status === "in_progress" ? "#fff" : "#555" }}>
        {phase.phase}
      </span>
    </div>
  )
}

function ProjectDetail({ project, userId, onClose }: { project: Project; userId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const status = STATUS_CONFIG[project.status]
  const roadmap: RoadmapPhase[] = Array.isArray(project.roadmap) ? project.roadmap : []

  const apply = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from("pending_requests").insert({
      user_id: userId, type: "Project", project_id: project.id,
      task_title: project.title_ar, status: "Pending",
    })
    setLoading(false); setDone(true)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md animate-scaleIn" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.3)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between p-5 shrink-0" style={{ borderBottom: "1px solid #222" }}>
          <h2 className="font-bold text-white">{project.title_ar}</h2>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {done ? (
            <div className="text-center py-6 animate-scaleIn">
              <div className="flex justify-center mb-4">
                <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 56, height: 56 }}>
                  <CheckCircle size={28} color="#22c55e" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">تم إرسال طلب الانضمام</h3>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>ستصلك إشعار عند مراجعة طلبك</p>
              <button onClick={onClose} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>حسناً</button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>{status.label}</span>
                {project.category && <span className="px-2 py-1 rounded-lg text-xs" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>{project.category}</span>}
              </div>
              {project.description && <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{project.description}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  <Users size={16} color="#f97316" className="mb-1" />
                  <p className="text-sm font-bold text-white">{project.member_count}</p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>عضو</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  <TrendingUp size={16} color="#f97316" className="mb-1" />
                  <p className="text-sm font-bold text-white">{project.profit_target ?? "-"}</p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>هدف الربح</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2 text-white">خارطة الطريق</h4>
                <div className="rounded-xl p-3" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                  {roadmap.length > 0 ? roadmap.map((p, i) => <RoadmapStep key={i} phase={p} />) : <p className="text-sm" style={{ color: "#555" }}>لا توجد مراحل</p>}
                </div>
              </div>
              {project.required_depts && project.required_depts.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold mb-2 text-white">الأقسام المطلوبة</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.required_depts.map((d) => (
                      <span key={d} className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-xl p-3" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                <p className="text-xs" style={{ color: "#9ca3af" }}>سعر السهم: <span className="text-white font-bold">{project.share_price_egp} جنيه</span></p>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>الأسهم المتاحة: <span className="text-white font-bold">{project.available_shares.toLocaleString()}</span></p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={apply} disabled={loading} className="flex-1 py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                  {loading ? "جارٍ الإرسال..." : "انضم للمشروع"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAppContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "scaling">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.replace("/login"); return }
    const supabase = createClient()
    supabase.from("projects").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setProjects(data)
      setLoading(false)
    })
  }, [user, router])

  const filtered = projects.filter((p) => filter === "all" || p.status === filter)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#f97316" }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14" style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
        <button onClick={() => router.push("/dashboard")} style={{ color: "#f97316" }}><ArrowRight size={20} /></button>
        <Logo size="sm" />
        <h1 className="font-bold text-white flex-1 text-center text-base">غرفة المشاريع</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {[
            { val: "all" as const, label: "الكل" },
            { val: "active" as const, label: "نشط" },
            { val: "scaling" as const, label: "توسعي" },
          ].map((f) => (
            <button key={f.val} onClick={() => setFilter(f.val)} className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all" style={{ background: filter === f.val ? "#f97316" : "#1a1a1a", color: filter === f.val ? "#000" : "#9ca3af" }}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Layers size={40} color="#333" className="mx-auto mb-3" />
            <p style={{ color: "#555" }}>لا توجد مشاريع</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((project) => {
              const status = STATUS_CONFIG[project.status]
              const roadmap: RoadmapPhase[] = Array.isArray(project.roadmap) ? project.roadmap : []
              return (
                <div key={project.id} className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1.5px solid rgba(249,115,22,0.3)", boxShadow: "0 0 15px rgba(249,115,22,0.08)" }}>
                  {/* Cover placeholder */}
                  <div className="h-32 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a0d00, #0d0d0d)" }}>
                    <span className="text-4xl font-extrabold" style={{ color: "rgba(249,115,22,0.15)" }}>{project.title_ar[0]}</span>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{project.title_ar}</h3>
                        <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{project.title_en}</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                        {status.label}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#9ca3af" }}>{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs" style={{ color: "#9ca3af" }}>
                      <span className="flex items-center gap-1"><Users size={12} color="#f97316" /> {project.member_count} عضو</span>
                      <span className="flex items-center gap-1"><TrendingUp size={12} color="#f97316" /> {project.profit_target}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: "#555" }}>
                        <span>التقدم</span><span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${project.progress}%` }} /></div>
                    </div>
                    {roadmap.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {roadmap.slice(0, 3).map((p, i) => {
                          const Icon = p.status === "done" ? CheckCircle : p.status === "in_progress" ? Clock : Circle
                          const color = p.status === "done" ? "#22c55e" : p.status === "in_progress" ? "#f97316" : "#555"
                          return (
                            <div key={i} className="flex items-center gap-1 shrink-0">
                              <Icon size={12} color={color} />
                              <span className="text-xs" style={{ color }}>{p.phase}</span>
                              {i < Math.min(roadmap.length, 3) - 1 && <span style={{ color: "#333" }}>←</span>}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {project.required_depts && (
                      <div className="flex flex-wrap gap-1">
                        {project.required_depts.slice(0, 4).map((d) => (
                          <span key={d} className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}>{d}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs" style={{ color: "#555" }}>سعر السهم: <span style={{ color: "#f97316" }}>{project.share_price_egp} جنيه</span></p>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setSelected(project)} className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
                        انضم للمشروع
                      </button>
                      <button onClick={() => router.push("/market")} className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-primary" style={{ background: "#3b82f6", color: "#fff" }}>
                        استثمر
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selected && user && (
        <ProjectDetail project={selected} userId={user.id} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// Needed for the empty state
function Layers(props: React.ComponentProps<"svg"> & { size?: number; color?: string }) {
  return (
    <svg width={props.size ?? 24} height={props.size ?? 24} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
