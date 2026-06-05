"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Search, X, Download, ExternalLink, Zap, CheckCircle, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import { Task } from "@/lib/types"
import Logo from "@/components/Logo"

const DEPT_CATEGORIES = [
  { label: "الكل", value: "all" },
  { label: "تقني", depts: ["CTO", "FSD", "WEB", "ECM", "ARC"] },
  { label: "تصميم", depts: ["UIX", "GRD", "WDS", "BVI", "MOT"] },
  { label: "تسويق", depts: ["DMK", "SEO", "CNT", "SMM", "SAL"] },
  { label: "عمليات", depts: ["GEN", "OPS", "CRM", "PJM", "PDS", "SUP", "TSP", "CSV", "CDR"] },
]

interface TaskDetailProps { task: Task; userId: string; onClose: () => void; onSubmit: () => void }

function TaskDetail({ task, userId, onClose, onSubmit }: TaskDetailProps) {
  const [link, setLink] = useState("")
  const [report, setReport] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const inputStyle: React.CSSProperties = {
    background: "#1a1a1a", border: "1.5px solid #333", borderRadius: "12px",
    color: "#fff", fontFamily: "'Tajawal', sans-serif", width: "100%",
    padding: "10px 14px", fontSize: "14px",
  }

  const submit = async () => {
    if (!link.trim() && !report.trim()) { setError("أدخل رابط التسليم أو تقرير العمل"); return }
    setLoading(true)
    const supabase = createClient()
    await supabase.from("pending_requests").insert({
      user_id: userId, type: "Task", task_id: task.id,
      task_title: task.title, submission_link: link, report_text: report,
      reward_points: task.reward_points, status: "Pending",
    })
    setLoading(false); setDone(true)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md animate-scaleIn" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.3)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between p-5 shrink-0" style={{ borderBottom: "1px solid #222" }}>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>{task.dept}</span>
            <h2 className="font-bold text-white text-base">{task.title}</h2>
          </div>
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
              <h3 className="text-lg font-bold text-white mb-2">تم إرسال التسليم</h3>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>سيتم مراجعة عملك من قبل الإدارة</p>
              <button onClick={() => { onSubmit(); onClose() }} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>حسناً</button>
            </div>
          ) : (
            <>
              {task.brief && (
                <div>
                  <h4 className="text-sm font-bold mb-2" style={{ color: "#f97316" }}>الموجز</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{task.brief}</p>
                </div>
              )}
              {task.full_report && (
                <div>
                  <h4 className="text-sm font-bold mb-2" style={{ color: "#f97316" }}>التقرير الكامل</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{task.full_report}</p>
                </div>
              )}
              {task.conditions && (
                <div>
                  <h4 className="text-sm font-bold mb-2" style={{ color: "#f97316" }}>الشروط</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{task.conditions}</p>
                </div>
              )}
              <div className="flex gap-2">
                {task.file_url && (
                  <a href={task.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>
                    <Download size={14} /> ملف المهمة
                  </a>
                )}
                {task.external_link && (
                  <a href={task.external_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #333" }}>
                    <ExternalLink size={14} /> رابط خارجي
                  </a>
                )}
              </div>
              <div style={{ borderTop: "1px solid #222", paddingTop: "16px" }}>
                <h4 className="text-sm font-bold mb-3 text-white">تسليم المهمة</h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#9ca3af" }}>رابط التسليم</label>
                    <input style={inputStyle} placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#9ca3af" }}>تقرير العمل</label>
                    <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="اشرح ما قمت به..." value={report} onChange={(e) => setReport(e.target.value)} />
                  </div>
                </div>
              </div>
              {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
              <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 btn-primary" style={{ background: "#f97316", color: "#000" }}>
                <Send size={16} />
                {loading ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const router = useRouter()
  const { user } = useAppContext()
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [selected, setSelected] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.replace("/login"); return }
    const supabase = createClient()
    supabase.from("tasks").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setTasks(data)
      setLoading(false)
    })
  }, [user, router])

  const filtered = tasks.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    const cat = DEPT_CATEGORIES.find((c) => c.value === category || c.label === category)
    const matchCat = category === "all" || !cat || !("depts" in cat) || (cat.depts as string[]).includes(t.dept)
    return matchSearch && matchCat
  })

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#f97316" }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14" style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
        <button onClick={() => router.push("/dashboard")} style={{ color: "#f97316" }}><ArrowRight size={20} /></button>
        <Logo size="sm" />
        <h1 className="font-bold text-white flex-1 text-center text-base">غرفة المهام</h1>
        <div className="w-5" />
      </header>

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مهمة..."
            className="w-full rounded-xl py-3 pr-10 pl-4 text-sm text-white"
            style={{ background: "#111111", border: "1.5px solid #333", fontFamily: "'Tajawal', sans-serif" }}
          />
          <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2" style={{ color: "#9ca3af" }} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
          {DEPT_CATEGORIES.map((cat) => (
            <button
              key={cat.value ?? cat.label}
              onClick={() => setCategory(cat.value ?? cat.label)}
              className="shrink-0 px-4 py-1.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: category === (cat.value ?? cat.label) ? "#f97316" : "#1a1a1a",
                color: category === (cat.value ?? cat.label) ? "#000" : "#9ca3af",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Task grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Zap size={40} color="#333" className="mx-auto mb-3" />
            <p style={{ color: "#555" }}>لا توجد مهام متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((task) => {
              const pct = Math.round((task.count / Math.max(task.limit, 1)) * 100)
              return (
                <div
                  key={task.id}
                  className="rounded-2xl p-4 flex flex-col gap-3 card-hover"
                  style={{ background: "#111111", border: "2px solid rgba(249,115,22,0.4)", boxShadow: "0 0 15px rgba(249,115,22,0.1)" }}
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                      {task.dept}
                    </span>
                    <div className="flex items-center gap-1">
                      <Zap size={14} color="#f97316" />
                      <span className="text-sm font-bold" style={{ color: "#f97316" }}>{task.reward_points}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{task.title}</h3>
                  {task.brief && (
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#9ca3af" }}>{task.brief}</p>
                  )}
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: "#555" }}>
                      <span>التقدم</span>
                      <span>{task.count} / {task.limit}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(task)}
                    disabled={task.count >= task.limit}
                    className="w-full py-2.5 rounded-xl text-sm font-bold btn-primary"
                    style={{
                      background: task.count >= task.limit ? "#333" : "#f97316",
                      color: task.count >= task.limit ? "#666" : "#000",
                    }}
                  >
                    {task.count >= task.limit ? "اكتملت المهمة" : "ابدأ المهمة"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selected && user && (
        <TaskDetail task={selected} userId={user.id} onClose={() => setSelected(null)} onSubmit={() => setSelected(null)} />
      )}
    </div>
  )
}
