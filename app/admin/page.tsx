"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart2, Users, ClipboardList, ListChecks, Layers,
  TrendingUp, CalendarClock, Newspaper, Settings, ScrollText,
  LogOut, Plus, Edit2, Trash2, Check, X, Search, Send,
  ChevronDown, ChevronUp, Download, Eye, RefreshCw, Bell,
  Shield, Zap, Wallet, UserPlus, ToggleLeft, ToggleRight,
  Star, AlertTriangle, CheckCircle, Clock, Ban
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import Logo from "@/components/Logo"
import {
  AppUser, Task, Project, PendingRequest, Meeting, NewsItem,
  AdminLog, Settings as AppSettings, Notification,
  DEPARTMENTS, RANK_CONFIG, SECURITY_QUESTIONS
} from "@/lib/types"

// ─── Tab definitions ───────────────────────────────────────────────────────
const TABS = [
  { id: "stats",    label: "إحصائيات",  icon: BarChart2 },
  { id: "users",    label: "المستخدمون", icon: Users },
  { id: "requests", label: "الطلبات",   icon: ClipboardList },
  { id: "tasks",    label: "المهام",    icon: ListChecks },
  { id: "projects", label: "المشاريع", icon: Layers },
  { id: "market",   label: "السوق",    icon: TrendingUp },
  { id: "meetings", label: "الاجتماعات", icon: CalendarClock },
  { id: "news",     label: "الأخبار",  icon: Newspaper },
  { id: "settings", label: "الإعدادات", icon: Settings },
  { id: "logs",     label: "السجلات",  icon: ScrollText },
] as const
type TabId = typeof TABS[number]["id"]

// ─── Request sub-tabs ────────────────────────────────────────────────────
const REQUEST_TABS = [
  { id: "Withdrawal", label: "السحب" },
  { id: "Task",       label: "المهام" },
  { id: "Project",    label: "المشاريع" },
  { id: "ShareSale",  label: "الأسهم" },
  { id: "RankUpgrade",label: "الترقيات" },
] as const

// ─── Helpers ────────────────────────────────────────────────────────────
function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${className}`}
      style={{ background: "#2a0808", border: "1px solid rgba(220,38,38,0.25)" }}>
      {children}
    </div>
  )
}

function StatBox({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1 animate-countUp"
      style={{ background: "#2a0808", border: "1.5px solid rgba(220,38,38,0.4)", boxShadow: "0 0 18px rgba(220,38,38,0.15)" }}>
      <Icon size={20} color="#dc2626" />
      <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
      {sub && <p className="text-xs font-bold" style={{ color: "#dc2626" }}>{sub}</p>}
      <p className="text-xs" style={{ color: "#9ca3af" }}>{label}</p>
    </div>
  )
}

function AdminInput({ label, value, onChange, type = "text", placeholder = "" }:
  { label?: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-bold" style={{ color: "#9ca3af" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl py-2.5 px-4 text-sm text-white"
        style={{ background: "#1a0505", border: "1.5px solid rgba(220,38,38,0.35)", fontFamily: "'Tajawal', sans-serif" }}
      />
    </div>
  )
}

function AdminTextarea({ label, value, onChange, rows = 3, placeholder = "" }:
  { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-bold" style={{ color: "#9ca3af" }}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl py-2.5 px-4 text-sm text-white resize-none"
        style={{ background: "#1a0505", border: "1.5px solid rgba(220,38,38,0.35)", fontFamily: "'Tajawal', sans-serif" }}
      />
    </div>
  )
}

function AdminSelect({ label, value, onChange, options }:
  { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-bold" style={{ color: "#9ca3af" }}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl py-2.5 px-4 text-sm text-white"
        style={{ background: "#1a0505", border: "1.5px solid rgba(220,38,38,0.35)", fontFamily: "'Tajawal', sans-serif" }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    Pending:  { bg: "rgba(251,191,36,0.15)",  text: "#fbbf24", icon: Clock },
    Approved: { bg: "rgba(34,197,94,0.15)",   text: "#22c55e", icon: CheckCircle },
    Rejected: { bg: "rgba(239,68,68,0.15)",   text: "#ef4444", icon: Ban },
  }
  const c = cfg[status] ?? cfg.Pending
  const Icon = c.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: c.bg, color: c.text }}>
      <Icon size={11} />
      {status === "Pending" ? "معلق" : status === "Approved" ? "مقبول" : "مرفوض"}
    </span>
  )
}

function RankBadge({ rank }: { rank: string }) {
  const cfg = RANK_CONFIG[rank as keyof typeof RANK_CONFIG] ?? RANK_CONFIG.iron
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function DeptBadge({ dept }: { dept: string | null }) {
  if (!dept) return null
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: "rgba(220,38,38,0.15)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)" }}>
      {dept}
    </span>
  )
}

function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="rounded-2xl p-6 w-80 animate-scaleIn"
        style={{ background: "#2a0808", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.6)" }}>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} color="#dc2626" />
          <p className="font-bold text-white">{msg}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl font-bold btn-primary text-sm"
            style={{ background: "#dc2626", color: "#fff" }}>تأكيد</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#1a0505", color: "#9ca3af", border: "1px solid #333" }}>إلغاء</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const { user: ctxUser, logout } = useAppContext()
  const [activeTab, setActiveTab] = useState<TabId>("stats")

  // ── guard ──
  useEffect(() => {
    if (!ctxUser) { router.replace("/login"); return }
    if (ctxUser.role !== "admin") { router.replace("/dashboard"); return }
  }, [ctxUser, router])

  if (!ctxUser || ctxUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a0505" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#dc2626" }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#1a0505" }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: "#120303", borderBottom: "1px solid rgba(220,38,38,0.3)", boxShadow: "0 2px 20px rgba(220,38,38,0.15)" }}>
        <Logo size="sm" variant="red" />
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs px-2 py-1 rounded-lg font-bold"
            style={{ background: "rgba(220,38,38,0.15)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)" }}>
            <Shield size={11} className="inline ml-1" />
            {ctxUser.name}
          </span>
          <button onClick={logout} className="p-2 rounded-lg transition-colors hover:bg-red-950">
            <LogOut size={18} color="#9ca3af" />
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="sticky top-14 z-30 overflow-x-auto"
        style={{ background: "#120303", borderBottom: "1px solid rgba(220,38,38,0.2)" }}>
        <div className="flex min-w-max px-3 py-2 gap-1">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
                style={{
                  background: active ? "#dc2626" : "transparent",
                  color: active ? "#fff" : "#9ca3af",
                  boxShadow: active ? "0 0 14px rgba(220,38,38,0.5)" : "none",
                }}>
                <Icon size={14} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "stats"    && <StatsTab     adminId={ctxUser.id} />}
        {activeTab === "users"    && <UsersTab     adminId={ctxUser.id} />}
        {activeTab === "requests" && <RequestsTab  adminId={ctxUser.id} />}
        {activeTab === "tasks"    && <TasksTab     adminId={ctxUser.id} />}
        {activeTab === "projects" && <ProjectsTab  adminId={ctxUser.id} />}
        {activeTab === "market"   && <MarketTab    adminId={ctxUser.id} />}
        {activeTab === "meetings" && <MeetingsTab  adminId={ctxUser.id} />}
        {activeTab === "news"     && <NewsTab      adminId={ctxUser.id} />}
        {activeTab === "settings" && <SettingsTab  adminId={ctxUser.id} />}
        {activeTab === "logs"     && <LogsTab      />}
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 1 — STATS
// ═══════════════════════════════════════════════════════════════════
function StatsTab({ adminId }: { adminId: string }) {
  const [stats, setStats] = useState({ users: 0, points: 0, shares: 0, pending: 0 })
  const [deptBreakdown, setDeptBreakdown] = useState<{ dept: string; count: number }[]>([])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [{ count: uc }, { data: users }, { count: pc }] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("users").select("points, shares, dept"),
        supabase.from("pending_requests").select("*", { count: "exact", head: true }).eq("status", "Pending"),
      ])
      const totalPoints = users?.reduce((s, u) => s + (u.points ?? 0), 0) ?? 0
      const totalShares = users?.reduce((s, u) => s + (u.shares ?? 0), 0) ?? 0
      setStats({ users: uc ?? 0, points: totalPoints, shares: totalShares, pending: pc ?? 0 })

      const deptMap: Record<string, number> = {}
      users?.forEach((u) => { if (u.dept) deptMap[u.dept] = (deptMap[u.dept] ?? 0) + 1 })
      setDeptBreakdown(Object.entries(deptMap).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count))
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <h2 className="text-xl font-extrabold text-white">لوحة الإحصائيات</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox icon={Users}        label="إجمالي المستخدمين" value={stats.users.toLocaleString()} />
        <StatBox icon={Zap}          label="إجمالي النقاط"     value={stats.points.toLocaleString()} sub="نقطة" />
        <StatBox icon={TrendingUp}   label="إجمالي الأسهم"     value={stats.shares.toLocaleString()} sub="سهم" />
        <StatBox icon={ClipboardList} label="الطلبات المعلقة"  value={stats.pending.toLocaleString()} sub="طلب" />
      </div>

      {/* Department breakdown */}
      <AdminCard>
        <h3 className="font-bold text-white mb-4">توزيع الأقسام</h3>
        <div className="flex flex-col gap-2">
          {deptBreakdown.length === 0 && (
            <p className="text-sm" style={{ color: "#555" }}>لا توجد بيانات بعد</p>
          )}
          {deptBreakdown.map(({ dept, count }) => {
            const deptInfo = DEPARTMENTS.find((d) => d.code === dept)
            const pct = stats.users > 0 ? Math.round((count / stats.users) * 100) : 0
            return (
              <div key={dept} className="flex items-center gap-3">
                <span className="w-14 text-xs font-bold shrink-0" style={{ color: "#dc2626" }}>{dept}</span>
                <span className="w-32 text-xs shrink-0" style={{ color: "#9ca3af" }}>{deptInfo?.name ?? dept}</span>
                <div className="flex-1 progress-bar">
                  <div className="progress-fill progress-fill-red" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-xs text-left shrink-0 font-bold text-white">{count}</span>
              </div>
            )
          })}
        </div>
      </AdminCard>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 2 — USERS
// ═══════════════════════════════════════════════════════════════════
function UsersTab({ adminId }: { adminId: string }) {
  const [users, setUsers] = useState<AppUser[]>([])
  const [filtered, setFiltered] = useState<AppUser[]>([])
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<AppUser | null>(null)
  const [delUser, setDelUser] = useState<AppUser | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  const loadUsers = useCallback(async () => {
    const { data } = await createClient().from("users").select("*").order("created_at", { ascending: false })
    if (data) { setUsers(data); setFiltered(data) }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return }
    const q = search.toLowerCase()
    setFiltered(users.filter((u) =>
      u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q) || u.phone.includes(q)
    ))
  }, [search, users])

  const deleteUser = async () => {
    if (!delUser) return
    await createClient().from("users").delete().eq("id", delUser.id)
    await logAction(adminId, "حذف مستخدم", `حذف المستخدم: ${delUser.name} (${delUser.code})`)
    setDelUser(null)
    loadUsers()
  }

  const saveEdit = async () => {
    if (!editUser) return
    setLoading(true)
    await createClient().from("users").update({
      name: editUser.name, dept: editUser.dept, rank: editUser.rank,
      points: editUser.points, shares: editUser.shares, role: editUser.role,
    }).eq("id", editUser.id)
    await logAction(adminId, "تعديل مستخدم", `تعديل: ${editUser.name} (${editUser.code})`)
    setLoading(false); setEditUser(null); loadUsers()
  }

  const sendNotification = async (u: AppUser, title: string, description: string) => {
    await createClient().from("notifications").insert({ target_user_id: u.id, title, description })
    setMsg("تم إرسال الإشعار")
    setTimeout(() => setMsg(""), 2000)
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-extrabold text-white">المستخدمون ({users.length})</h2>
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#dc2626", color: "#fff" }}>
          <UserPlus size={16} /> إضافة مستخدم
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الرمز أو الهاتف..."
          className="w-full rounded-xl py-2.5 pr-10 pl-4 text-sm text-white"
          style={{ background: "#2a0808", border: "1.5px solid rgba(220,38,38,0.35)", fontFamily: "'Tajawal', sans-serif" }} />
        <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2" style={{ color: "#dc2626" }} />
      </div>

      {msg && <p className="text-sm font-bold" style={{ color: "#22c55e" }}>{msg}</p>}

      {/* Users list */}
      <div className="flex flex-col gap-3">
        {filtered.map((u) => (
          <AdminCard key={u.id}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{u.name}</span>
                  <RankBadge rank={u.rank} />
                  <DeptBadge dept={u.dept} />
                  {u.role === "admin" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(220,38,38,0.2)", color: "#dc2626" }}>مدير</span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {u.code} · {u.phone} · {new Date(u.created_at).toLocaleDateString("ar-EG")}
                </p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs"><Zap size={11} className="inline" style={{ color: "#f97316" }} /> <b className="text-white">{u.points}</b> <span style={{ color: "#9ca3af" }}>نقطة</span></span>
                  <span className="text-xs"><TrendingUp size={11} className="inline" style={{ color: "#3b82f6" }} /> <b className="text-white">{u.shares}</b> <span style={{ color: "#9ca3af" }}>سهم</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditUser({ ...u })}
                  className="p-2 rounded-lg transition-colors hover:bg-red-950"
                  style={{ color: "#fbbf24" }} title="تعديل">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => sendNotification(u, "إشعار من الإدارة", "لديك رسالة جديدة")}
                  className="p-2 rounded-lg transition-colors hover:bg-red-950"
                  style={{ color: "#3b82f6" }} title="إرسال إشعار">
                  <Bell size={15} />
                </button>
                <button onClick={() => setDelUser(u)}
                  className="p-2 rounded-lg transition-colors hover:bg-red-950"
                  style={{ color: "#ef4444" }} title="حذف">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا يوجد مستخدمون</p>
        )}
      </div>

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-md rounded-2xl p-6 animate-scaleIn"
            style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-white">تعديل المستخدم</h3>
              <button onClick={() => setEditUser(null)}><X size={20} color="#9ca3af" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <AdminInput label="الاسم" value={editUser.name} onChange={(v) => setEditUser({ ...editUser, name: v })} />
              <AdminSelect label="الرتبة" value={editUser.rank}
                onChange={(v) => setEditUser({ ...editUser, rank: v as AppUser["rank"] })}
                options={Object.entries(RANK_CONFIG).map(([k, c]) => ({ value: k, label: `${c.icon} ${c.label}` }))} />
              <AdminSelect label="القسم" value={editUser.dept ?? ""}
                onChange={(v) => setEditUser({ ...editUser, dept: v || null })}
                options={[{ value: "", label: "— بدون قسم —" }, ...DEPARTMENTS.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}` }))]} />
              <AdminSelect label="الدور" value={editUser.role}
                onChange={(v) => setEditUser({ ...editUser, role: v as AppUser["role"] })}
                options={[{ value: "partner", label: "شريك" }, { value: "admin", label: "مدير" }, { value: "investor", label: "مستثمر" }]} />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="النقاط" value={editUser.points} type="number"
                  onChange={(v) => setEditUser({ ...editUser, points: Number(v) })} />
                <AdminInput label="الأسهم" value={editUser.shares} type="number"
                  onChange={(v) => setEditUser({ ...editUser, shares: Number(v) })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
                style={{ background: "#dc2626", color: "#fff" }}>
                {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </button>
              <button onClick={() => setEditUser(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {delUser && (
        <ConfirmDialog
          msg={`هل تريد حذف المستخدم "${delUser.name}"؟ لا يمكن التراجع.`}
          onConfirm={deleteUser}
          onCancel={() => setDelUser(null)}
        />
      )}

      {showAddForm && (
        <AddUserForm onClose={() => setShowAddForm(false)} onDone={loadUsers} adminId={adminId} />
      )}
    </div>
  )
}

function AddUserForm({ onClose, onDone, adminId }: { onClose: () => void; onDone: () => void; adminId: string }) {
  const [form, setForm] = useState({
    name: "", phone: "", password: "", dept: "GEN",
    role: "partner", rank: "iron",
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.password.trim()) {
      setErr("يرجى ملء جميع الحقول"); return
    }
    setLoading(true)
    const code = form.dept.toUpperCase() + Math.floor(1000 + Math.random() * 9000) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    const { error } = await createClient().from("users").insert({
      name: form.name, phone: form.phone, password: form.password,
      code, dept: form.dept, role: form.role, rank: form.rank,
    })
    if (error) { setErr(error.message); setLoading(false); return }
    await logAction(adminId, "إضافة مستخدم", `تمت الإضافة: ${form.name} — رمز: ${code}`)
    setLoading(false); onDone(); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
      <div className="w-full max-w-sm rounded-2xl p-6 animate-scaleIn"
        style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-lg text-white">إضافة مستخدم جديد</h3>
          <button onClick={onClose}><X size={20} color="#9ca3af" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <AdminInput label="الاسم الكامل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <AdminInput label="رقم الهاتف" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <AdminInput label="كلمة المرور" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <AdminSelect label="القسم" value={form.dept}
            onChange={(v) => setForm({ ...form, dept: v })}
            options={DEPARTMENTS.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}` }))} />
          <AdminSelect label="الدور" value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            options={[{ value: "partner", label: "شريك" }, { value: "admin", label: "مدير" }, { value: "investor", label: "مستثمر" }]} />
          <AdminSelect label="الرتبة" value={form.rank}
            onChange={(v) => setForm({ ...form, rank: v })}
            options={Object.entries(RANK_CONFIG).map(([k, c]) => ({ value: k, label: `${c.icon} ${c.label}` }))} />
        </div>
        {err && <p className="text-xs mt-3" style={{ color: "#ef4444" }}>{err}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={submit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
            style={{ background: "#dc2626", color: "#fff" }}>
            {loading ? "جارٍ الإضافة..." : "إضافة"}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 3 — REQUESTS
// ═══════════════════════════════════════════════════════════════════
function RequestsTab({ adminId }: { adminId: string }) {
  const [subTab, setSubTab] = useState<string>("Withdrawal")
  const [requests, setRequests] = useState<(PendingRequest & { users?: AppUser })[]>([])
  const [loading, setLoading] = useState(false)

  const loadRequests = useCallback(async (type: string) => {
    setLoading(true)
    const { data } = await createClient()
      .from("pending_requests")
      .select("*, users(*)")
      .eq("type", type)
      .order("created_at", { ascending: false })
    setRequests(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadRequests(subTab) }, [subTab, loadRequests])

  const approve = async (req: PendingRequest & { users?: AppUser }) => {
    const supabase = createClient()
    await supabase.from("pending_requests").update({ status: "Approved" }).eq("id", req.id)

    if (req.type === "Withdrawal" && req.user_id && req.points_amount) {
      const { data: u } = await supabase.from("users").select("points").eq("id", req.user_id).single()
      if (u) await supabase.from("users").update({ points: Math.max(0, u.points - req.points_amount) }).eq("id", req.user_id)
      await supabase.from("transactions").insert({ user_id: req.user_id, type: "Withdrawal", amount: req.points_amount, status: "completed", note: `سحب عبر ${req.method}` })
    }
    if (req.type === "Task" && req.user_id && req.reward_points) {
      const { data: u } = await supabase.from("users").select("points").eq("id", req.user_id).single()
      if (u) await supabase.from("users").update({ points: u.points + req.reward_points }).eq("id", req.user_id)
      if (req.task_id) {
        const { data: t } = await supabase.from("tasks").select("count").eq("id", req.task_id).single()
        if (t) await supabase.from("tasks").update({ count: t.count + 1 }).eq("id", req.task_id)
      }
    }

    await supabase.from("notifications").insert({
      target_user_id: req.user_id, is_read: false,
      title: "تم قبول طلبك",
      description: `تم قبول طلبك: ${req.type === "Withdrawal" ? "السحب" : req.type === "Task" ? "المهمة" : "المشروع"}`,
    })
    await logAction(adminId, "قبول طلب", `قبول ${req.type} للمستخدم ${req.users?.name ?? req.user_id}`)
    loadRequests(subTab)
  }

  const reject = async (req: PendingRequest & { users?: AppUser }) => {
    await createClient().from("pending_requests").update({ status: "Rejected" }).eq("id", req.id)
    await createClient().from("notifications").insert({
      target_user_id: req.user_id, is_read: false,
      title: "تم رفض طلبك",
      description: `للأسف تم رفض طلبك. تواصل مع الإدارة لمزيد من التفاصيل.`,
    })
    await logAction(adminId, "رفض طلب", `رفض ${req.type} للمستخدم ${req.users?.name ?? req.user_id}`)
    loadRequests(subTab)
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-extrabold text-white">الطلبات</h2>
      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {REQUEST_TABS.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
            style={{
              background: subTab === t.id ? "#dc2626" : "#2a0808",
              color: subTab === t.id ? "#fff" : "#9ca3af",
              border: `1px solid ${subTab === t.id ? "#dc2626" : "rgba(220,38,38,0.2)"}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2" style={{ borderColor: "#dc2626" }} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {requests.map((req) => (
          <AdminCard key={req.id}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{req.users?.name ?? "—"}</span>
                  <DeptBadge dept={req.users?.dept ?? null} />
                  <StatusBadge status={req.status} />
                </div>
                {req.type === "Withdrawal" && (
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    <Wallet size={12} className="inline ml-1" style={{ color: "#f97316" }} />
                    {req.points_amount} نقطة · {req.method} · <span className="text-white">{req.wallet_details}</span>
                  </p>
                )}
                {req.type === "Task" && (
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    مهمة: <span className="text-white">{req.task_title}</span>
                    {req.reward_points && <span className="mr-2 font-bold" style={{ color: "#f97316" }}>+{req.reward_points} نقطة</span>}
                  </p>
                )}
                {req.type === "Project" && (
                  <p className="text-sm" style={{ color: "#9ca3af" }}>طلب انضمام لمشروع</p>
                )}
                {req.submission_link && (
                  <a href={req.submission_link} target="_blank" rel="noopener noreferrer"
                    className="text-xs underline" style={{ color: "#3b82f6" }}>
                    رابط التسليم
                  </a>
                )}
                {req.report_text && (
                  <p className="text-xs mt-1 rounded-lg p-2"
                    style={{ background: "#1a0505", color: "#9ca3af", borderRight: "2px solid #dc2626" }}>
                    {req.report_text}
                  </p>
                )}
                <p className="text-xs" style={{ color: "#555" }}>
                  {new Date(req.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
              {req.status === "Pending" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approve(req)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold btn-primary"
                    style={{ background: "#166534", color: "#22c55e" }}>
                    <Check size={13} /> قبول
                  </button>
                  <button onClick={() => reject(req)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold btn-primary"
                    style={{ background: "#450a0a", color: "#ef4444" }}>
                    <X size={13} /> رفض
                  </button>
                </div>
              )}
            </div>
          </AdminCard>
        ))}
        {!loading && requests.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد طلبات</p>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 4 — TASKS
// ═══════════════════════════════════════════════════════════════════
function TasksTab({ adminId }: { adminId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [delTask, setDelTask] = useState<Task | null>(null)

  const EMPTY: Partial<Task> = {
    title: "", dept: "GEN", brief: "", full_report: "",
    conditions: "", reward_points: 100, limit: 10, file_url: "", external_link: "",
  }
  const [form, setForm] = useState<Partial<Task>>(EMPTY)
  const [loading, setLoading] = useState(false)

  const loadTasks = useCallback(async () => {
    const { data } = await createClient().from("tasks").select("*").order("created_at", { ascending: false })
    setTasks(data ?? [])
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  const openAdd = () => { setForm(EMPTY); setEditTask(null); setShowForm(true) }
  const openEdit = (t: Task) => { setForm({ ...t }); setEditTask(t); setShowForm(true) }

  const saveTask = async () => {
    if (!form.title?.trim()) return
    setLoading(true)
    const payload = {
      title: form.title, dept: form.dept ?? "GEN",
      brief: form.brief ?? "", full_report: form.full_report ?? "",
      conditions: form.conditions ?? "", reward_points: form.reward_points ?? 0,
      limit: form.limit ?? 10, file_url: form.file_url ?? null,
      external_link: form.external_link ?? null,
    }
    if (editTask) {
      await createClient().from("tasks").update(payload).eq("id", editTask.id)
      await logAction(adminId, "تعديل مهمة", `تعديل: ${form.title}`)
    } else {
      await createClient().from("tasks").insert({ ...payload, count: 0 })
      await logAction(adminId, "إضافة مهمة", `إضافة: ${form.title}`)
    }
    setLoading(false); setShowForm(false); loadTasks()
  }

  const deleteTask = async () => {
    if (!delTask) return
    await createClient().from("tasks").delete().eq("id", delTask.id)
    await logAction(adminId, "حذف مهمة", `حذف: ${delTask.title}`)
    setDelTask(null); loadTasks()
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white">المهام ({tasks.length})</h2>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#dc2626", color: "#fff" }}>
          <Plus size={16} /> مهمة جديدة
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((t) => {
          const pct = t.limit > 0 ? Math.round((t.count / t.limit) * 100) : 0
          return (
            <AdminCard key={t.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <DeptBadge dept={t.dept} />
                    <span className="font-bold text-white">{t.title}</span>
                  </div>
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: "#9ca3af" }}>{t.brief}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: "#f97316" }}><b>{t.reward_points}</b> نقطة</span>
                    <span style={{ color: "#9ca3af" }}>{t.count}/{t.limit}</span>
                  </div>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill progress-fill-red" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-red-950" style={{ color: "#fbbf24" }}><Edit2 size={15} /></button>
                  <button onClick={() => setDelTask(t)} className="p-2 rounded-lg hover:bg-red-950" style={{ color: "#ef4444" }}><Trash2 size={15} /></button>
                </div>
              </div>
            </AdminCard>
          )
        })}
        {tasks.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد مهام</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 animate-scaleIn"
            style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-white">{editTask ? "تعديل المهمة" : "إضافة مهمة جديدة"}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#9ca3af" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <AdminInput label="عنوان المهمة" value={form.title ?? ""} onChange={(v) => setForm({ ...form, title: v })} />
              <AdminSelect label="القسم" value={form.dept ?? "GEN"}
                onChange={(v) => setForm({ ...form, dept: v })}
                options={DEPARTMENTS.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}` }))} />
              <AdminTextarea label="الموجز" value={form.brief ?? ""} onChange={(v) => setForm({ ...form, brief: v })} rows={2} />
              <AdminTextarea label="التقرير الكامل" value={form.full_report ?? ""} onChange={(v) => setForm({ ...form, full_report: v })} rows={4} />
              <AdminTextarea label="الشروط" value={form.conditions ?? ""} onChange={(v) => setForm({ ...form, conditions: v })} rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="نقاط المكافأة" value={form.reward_points ?? 0} type="number"
                  onChange={(v) => setForm({ ...form, reward_points: Number(v) })} />
                <AdminInput label="الحد الأقصى" value={form.limit ?? 10} type="number"
                  onChange={(v) => setForm({ ...form, limit: Number(v) })} />
              </div>
              <AdminInput label="رابط الملف (اختياري)" value={form.file_url ?? ""} onChange={(v) => setForm({ ...form, file_url: v })} />
              <AdminInput label="رابط خارجي (اختياري)" value={form.external_link ?? ""} onChange={(v) => setForm({ ...form, external_link: v })} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveTask} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
                style={{ background: "#dc2626", color: "#fff" }}>
                {loading ? "جارٍ الحفظ..." : editTask ? "حفظ التعديلات" : "إضافة المهمة"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {delTask && (
        <ConfirmDialog
          msg={`هل تريد حذف المهمة "${delTask.title}"؟`}
          onConfirm={deleteTask}
          onCancel={() => setDelTask(null)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 5 — PROJECTS
// ═══════════════════════════════════════════════════════════════════
function ProjectsTab({ adminId }: { adminId: string }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [delProject, setDelProject] = useState<Project | null>(null)

  const EMPTY = {
    title_ar: "", title_en: "", description: "", profit_target: "",
    category: "", status: "active" as const, required_depts: [] as string[],
    total_shares: 0, available_shares: 0, share_price_egp: 0, progress: 0,
  }
  const [form, setForm] = useState<typeof EMPTY>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [deptInput, setDeptInput] = useState("")

  const loadProjects = useCallback(async () => {
    const { data } = await createClient().from("projects").select("*").order("created_at", { ascending: false })
    setProjects(data ?? [])
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  const openAdd = () => { setForm(EMPTY); setEditProject(null); setDeptInput(""); setShowForm(true) }
  const openEdit = (p: Project) => {
    setForm({
      title_ar: p.title_ar, title_en: p.title_en, description: p.description ?? "",
      profit_target: p.profit_target ?? "", category: p.category ?? "",
      status: p.status, required_depts: p.required_depts ?? [],
      total_shares: p.total_shares, available_shares: p.available_shares,
      share_price_egp: p.share_price_egp, progress: p.progress,
    })
    setDeptInput((p.required_depts ?? []).join(", "))
    setEditProject(p); setShowForm(true)
  }

  const saveProject = async () => {
    if (!form.title_ar.trim()) return
    setLoading(true)
    const depts = deptInput.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
    const payload = { ...form, required_depts: depts }
    if (editProject) {
      await createClient().from("projects").update(payload).eq("id", editProject.id)
      await logAction(adminId, "تعديل مشروع", `تعديل: ${form.title_ar}`)
    } else {
      await createClient().from("projects").insert({ ...payload, member_count: 0 })
      await logAction(adminId, "إضافة مشروع", `إضافة: ${form.title_ar}`)
    }
    setLoading(false); setShowForm(false); loadProjects()
  }

  const deleteProject = async () => {
    if (!delProject) return
    await createClient().from("projects").delete().eq("id", delProject.id)
    await logAction(adminId, "حذف مشروع", `حذف: ${delProject.title_ar}`)
    setDelProject(null); loadProjects()
  }

  const statusLabel: Record<string, string> = { active: "نشط", scaling: "توسع", closed: "مغلق" }
  const statusColor: Record<string, string> = { active: "#22c55e", scaling: "#3b82f6", closed: "#ef4444" }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white">المشاريع ({projects.length})</h2>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#dc2626", color: "#fff" }}>
          <Plus size={16} /> مشروع جديد
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <AdminCard key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-white">{p.title_ar}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColor[p.status]}20`, color: statusColor[p.status] }}>
                    {statusLabel[p.status]}
                  </span>
                  {p.category && <DeptBadge dept={p.category} />}
                </div>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: "#9ca3af" }}>{p.description}</p>
                <div className="flex gap-4 text-xs flex-wrap" style={{ color: "#9ca3af" }}>
                  <span><b className="text-white">{p.total_shares}</b> سهم إجمالي</span>
                  <span><b className="text-white">{p.available_shares}</b> متاح</span>
                  <span><b className="text-white">{p.share_price_egp} جنيه</b>/سهم</span>
                </div>
                <div className="progress-bar mt-2">
                  <div className="progress-fill progress-fill-red" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>التقدم: {p.progress}%</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-red-950" style={{ color: "#fbbf24" }}><Edit2 size={15} /></button>
                <button onClick={() => setDelProject(p)} className="p-2 rounded-lg hover:bg-red-950" style={{ color: "#ef4444" }}><Trash2 size={15} /></button>
              </div>
            </div>
          </AdminCard>
        ))}
        {projects.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد مشاريع</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 animate-scaleIn"
            style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-white">{editProject ? "تعديل المشروع" : "مشروع جديد"}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#9ca3af" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <AdminInput label="الاسم بالعربية" value={form.title_ar} onChange={(v) => setForm({ ...form, title_ar: v })} />
              <AdminInput label="الاسم بالإنجليزية" value={form.title_en} onChange={(v) => setForm({ ...form, title_en: v })} />
              <AdminTextarea label="الوصف" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="الفئة" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="مثال: تجارة إلكترونية" />
                <AdminInput label="هدف الربح" value={form.profit_target} onChange={(v) => setForm({ ...form, profit_target: v })} placeholder="مثال: 500,000 جنيه" />
              </div>
              <AdminSelect label="الحالة" value={form.status}
                onChange={(v) => setForm({ ...form, status: v as "active" | "scaling" | "closed" })}
                options={[{ value: "active", label: "نشط" }, { value: "scaling", label: "توسع" }, { value: "closed", label: "مغلق" }]} />
              <div className="grid grid-cols-3 gap-3">
                <AdminInput label="إجمالي الأسهم" value={form.total_shares} type="number"
                  onChange={(v) => setForm({ ...form, total_shares: Number(v) })} />
                <AdminInput label="المتاح" value={form.available_shares} type="number"
                  onChange={(v) => setForm({ ...form, available_shares: Number(v) })} />
                <AdminInput label="سعر السهم (جنيه)" value={form.share_price_egp} type="number"
                  onChange={(v) => setForm({ ...form, share_price_egp: Number(v) })} />
              </div>
              <AdminInput label="نسبة التقدم %" value={form.progress} type="number"
                onChange={(v) => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(v))) })} />
              <AdminInput label="الأقسام المطلوبة (مفصولة بفاصلة)" value={deptInput}
                onChange={setDeptInput} placeholder="مثال: FSD, UIX, DMK" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveProject} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
                style={{ background: "#dc2626", color: "#fff" }}>
                {loading ? "جارٍ الحفظ..." : editProject ? "حفظ التعديلات" : "إضافة المشروع"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {delProject && (
        <ConfirmDialog
          msg={`هل تريد حذف المشروع "${delProject.title_ar}"؟`}
          onConfirm={deleteProject}
          onCancel={() => setDelProject(null)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 6 — MARKET
// ═══════════════════════════════════════════════════════════════════
function MarketTab({ adminId }: { adminId: string }) {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    createClient().from("share_listings").select("*, users(*), projects(*)").eq("status", "active")
      .order("created_at", { ascending: false }).then(({ data }) => setListings(data ?? []))
  }, [])

  const cancelListing = async (id: string) => {
    await createClient().from("share_listings").update({ status: "cancelled" }).eq("id", id)
    setListings((prev) => prev.filter((l) => l.id !== id))
    await logAction(adminId, "إلغاء إعلان أسهم", `إلغاء الإعلان ${id}`)
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-extrabold text-white">السوق — إعلانات الأسهم ({listings.length})</h2>
      {listings.map((l) => (
        <AdminCard key={l.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white">{l.users?.name ?? "—"} <DeptBadge dept={l.users?.dept ?? null} /></p>
              <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                مشروع: <span className="text-white">{l.projects?.title_ar ?? "—"}</span>
                {" · "}{l.shares_count} سهم @ {l.price_per_share} جنيه/سهم
              </p>
              <p className="text-xs mt-1 font-bold" style={{ color: "#f97316" }}>
                الإجمالي: {(l.shares_count * l.price_per_share).toLocaleString()} جنيه
              </p>
            </div>
            <button onClick={() => cancelListing(l.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold btn-primary"
              style={{ background: "#450a0a", color: "#ef4444" }}>
              <Ban size={13} /> إلغاء
            </button>
          </div>
        </AdminCard>
      ))}
      {listings.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد إعلانات نشطة</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 7 — MEETINGS
// ═══════════════════════════════════════════════════════════════════
function MeetingsTab({ adminId }: { adminId: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", date_time: "" })
  const [loading, setLoading] = useState(false)

  const loadMeetings = useCallback(async () => {
    const { data } = await createClient().from("meetings").select("*").order("date_time", { ascending: false })
    setMeetings(data ?? [])
  }, [])

  useEffect(() => { loadMeetings() }, [loadMeetings])

  const addMeeting = async () => {
    if (!form.title.trim()) return
    setLoading(true)
    await createClient().from("meetings").insert({
      title: form.title, description: form.description,
      date_time: form.date_time || null, status: "scheduled",
    })
    await logAction(adminId, "إضافة اجتماع", `إضافة: ${form.title}`)
    setLoading(false); setShowForm(false); setForm({ title: "", description: "", date_time: "" }); loadMeetings()
  }

  const updateStatus = async (id: string, status: "done" | "cancelled") => {
    await createClient().from("meetings").update({ status }).eq("id", id)
    loadMeetings()
  }

  const statusColor: Record<string, string> = { scheduled: "#fbbf24", done: "#22c55e", cancelled: "#ef4444" }
  const statusLabel: Record<string, string> = { scheduled: "مجدول", done: "منتهي", cancelled: "ملغي" }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white">الاجتماعات</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#dc2626", color: "#fff" }}>
          <Plus size={16} /> اجتماع جديد
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {meetings.map((m) => (
          <AdminCard key={m.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{m.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColor[m.status]}20`, color: statusColor[m.status] }}>
                    {statusLabel[m.status]}
                  </span>
                </div>
                {m.description && <p className="text-xs" style={{ color: "#9ca3af" }}>{m.description}</p>}
                {m.date_time && (
                  <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                    <CalendarClock size={11} className="inline ml-1" />
                    {new Date(m.date_time).toLocaleString("ar-EG")}
                  </p>
                )}
              </div>
              {m.status === "scheduled" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => updateStatus(m.id, "done")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                    <Check size={12} /> منتهي
                  </button>
                  <button onClick={() => updateStatus(m.id, "cancelled")}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                    <X size={12} /> إلغاء
                  </button>
                </div>
              )}
            </div>
          </AdminCard>
        ))}
        {meetings.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد اجتماعات</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-md rounded-2xl p-6 animate-scaleIn"
            style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-white">اجتماع جديد</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#9ca3af" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <AdminInput label="عنوان الاجتماع" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <AdminTextarea label="الوصف" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
              <AdminInput label="التاريخ والوقت" value={form.date_time} type="datetime-local"
                onChange={(v) => setForm({ ...form, date_time: v })} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addMeeting} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
                style={{ background: "#dc2626", color: "#fff" }}>
                {loading ? "جارٍ الإضافة..." : "إضافة الاجتماع"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 8 — NEWS
// ═══════════════════════════════════════════════════════════════════
function NewsTab({ adminId }: { adminId: string }) {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", image_url: "", is_published: false })
  const [loading, setLoading] = useState(false)

  const loadNews = useCallback(async () => {
    const { data } = await createClient().from("news").select("*").order("created_at", { ascending: false })
    setArticles(data ?? [])
  }, [])

  useEffect(() => { loadNews() }, [loadNews])

  const addArticle = async () => {
    if (!form.title.trim()) return
    setLoading(true)
    await createClient().from("news").insert({
      title: form.title, content: form.content, image_url: form.image_url || null,
      is_published: form.is_published, published_at: form.is_published ? new Date().toISOString() : null,
    })
    await logAction(adminId, "إضافة خبر", `إضافة: ${form.title}`)
    setLoading(false); setShowForm(false); setForm({ title: "", content: "", image_url: "", is_published: false }); loadNews()
  }

  const togglePublish = async (a: NewsItem) => {
    await createClient().from("news").update({ is_published: !a.is_published, published_at: !a.is_published ? new Date().toISOString() : null }).eq("id", a.id)
    await logAction(adminId, a.is_published ? "إلغاء نشر خبر" : "نشر خبر", a.title)
    loadNews()
  }

  const deleteArticle = async (id: string) => {
    await createClient().from("news").delete().eq("id", id)
    loadNews()
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white">الأخبار</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#dc2626", color: "#fff" }}>
          <Plus size={16} /> خبر جديد
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {articles.map((a) => (
          <AdminCard key={a.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{a.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: a.is_published ? "rgba(34,197,94,0.15)" : "rgba(107,114,128,0.15)", color: a.is_published ? "#22c55e" : "#6b7280" }}>
                    {a.is_published ? "منشور" : "مسودة"}
                  </span>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: "#9ca3af" }}>{a.content}</p>
                <p className="text-xs mt-1" style={{ color: "#555" }}>
                  {new Date(a.created_at).toLocaleDateString("ar-EG")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => togglePublish(a)}
                  className="p-2 rounded-lg hover:bg-red-950"
                  style={{ color: a.is_published ? "#6b7280" : "#22c55e" }}
                  title={a.is_published ? "إلغاء النشر" : "نشر"}>
                  {a.is_published ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => deleteArticle(a.id)}
                  className="p-2 rounded-lg hover:bg-red-950" style={{ color: "#ef4444" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
        {articles.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد أخبار</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 animate-scaleIn"
            style={{ background: "#1a0505", border: "2px solid #dc2626", boxShadow: "0 0 30px rgba(220,38,38,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-white">خبر جديد</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#9ca3af" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <AdminInput label="عنوان الخبر" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <AdminTextarea label="المحتوى" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={5} />
              <AdminInput label="رابط الصورة (اختياري)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                  <div className="w-10 h-6 rounded-full transition-colors"
                    style={{ background: form.is_published ? "#dc2626" : "#2a0808", border: "1px solid #444" }}>
                    <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                      style={{ right: form.is_published ? "2px" : "18px" }} />
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: "#9ca3af" }}>نشر فوري</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addArticle} disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold btn-primary text-sm"
                style={{ background: "#dc2626", color: "#fff" }}>
                {loading ? "جارٍ الإضافة..." : "نشر الخبر"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#2a0808", color: "#9ca3af", border: "1px solid #333" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 9 — SETTINGS
// ═══════════════════════════════════════════════════════════════════
function SettingsTab({ adminId }: { adminId: string }) {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    createClient().from("settings").select("*").limit(1).single()
      .then(({ data }) => { if (data) setSettings(data) })
  }, [])

  const save = async () => {
    if (!settings) return
    setLoading(true)
    await createClient().from("settings").update({
      share_price_per_point: settings.share_price_per_point,
      points_per_share: settings.points_per_share,
      trading_enabled: settings.trading_enabled,
      market_enabled: settings.market_enabled,
      min_withdrawal_points: settings.min_withdrawal_points,
      announcement: settings.announcement,
      updated_at: new Date().toISOString(),
    }).eq("id", settings.id)
    await logAction(adminId, "تعديل الإعدادات", "تم تحديث إعدادات المنصة")
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2" style={{ borderColor: "#dc2626" }} />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 animate-fadeIn max-w-lg">
      <h2 className="text-xl font-extrabold text-white">الإعدادات</h2>
      <AdminCard>
        <h3 className="font-bold text-white mb-4">إعدادات الأسهم والنقاط</h3>
        <div className="flex flex-col gap-4">
          <AdminInput label="سعر النقطة (جنيه)" value={settings.share_price_per_point} type="number"
            onChange={(v) => setSettings({ ...settings, share_price_per_point: Number(v) })} />
          <AdminInput label="نقاط لكل سهم" value={settings.points_per_share} type="number"
            onChange={(v) => setSettings({ ...settings, points_per_share: Number(v) })} />
          <AdminInput label="الحد الأدنى للسحب (نقطة)" value={settings.min_withdrawal_points} type="number"
            onChange={(v) => setSettings({ ...settings, min_withdrawal_points: Number(v) })} />
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-bold text-white mb-4">تفعيل الخدمات</h3>
        <div className="flex flex-col gap-4">
          {[
            { key: "trading_enabled", label: "تداول الأسهم" },
            { key: "market_enabled",  label: "بوابة السوق" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{label}</span>
              <button
                onClick={() => setSettings({ ...settings, [key]: !settings[key as keyof AppSettings] })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold text-xs"
                style={{
                  background: settings[key as keyof AppSettings] ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: settings[key as keyof AppSettings] ? "#22c55e" : "#ef4444",
                  border: `1px solid ${settings[key as keyof AppSettings] ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}>
                {settings[key as keyof AppSettings]
                  ? <><ToggleRight size={16} /> مفعّل</>
                  : <><ToggleLeft size={16} /> معطّل</>}
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-bold text-white mb-4">إعلان المنصة</h3>
        <AdminTextarea label="نص الإعلان" value={settings.announcement ?? ""}
          onChange={(v) => setSettings({ ...settings, announcement: v })} rows={3}
          placeholder="اكتب إعلاناً يظهر لجميع المستخدمين..." />
      </AdminCard>

      <button onClick={save} disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-base btn-primary"
        style={{ background: saved ? "#166534" : "#dc2626", color: "#fff" }}>
        {loading ? "جارٍ الحفظ..." : saved ? "تم الحفظ!" : "حفظ الإعدادات"}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB 10 — LOGS
// ═══════════════════════════════════════════════════════════════════
function LogsTab() {
  const [logs, setLogs] = useState<(AdminLog & { users?: AppUser })[]>([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    createClient().from("admin_logs").select("*, users(name, code)")
      .order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => setLogs(data ?? []))
  }, [])

  const filtered = filter.trim()
    ? logs.filter((l) => l.action.includes(filter) || (l.details ?? "").includes(filter))
    : logs

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-extrabold text-white">سجل الإجراءات ({logs.length})</h2>
        <button
          onClick={() => {
            const csv = ["التاريخ,المدير,الإجراء,التفاصيل",
              ...logs.map((l) => `${l.created_at},${l.users?.name ?? ""},${l.action},"${l.details ?? ""}"`)
            ].join("\n")
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a"); a.href = url; a.download = "admin_logs.csv"; a.click()
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm btn-primary"
          style={{ background: "#2a0808", color: "#dc2626", border: "1px solid rgba(220,38,38,0.35)" }}>
          <Download size={15} /> تصدير CSV
        </button>
      </div>

      <div className="relative">
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          placeholder="فلترة الإجراءات..."
          className="w-full rounded-xl py-2.5 pr-10 pl-4 text-sm text-white"
          style={{ background: "#2a0808", border: "1.5px solid rgba(220,38,38,0.35)", fontFamily: "'Tajawal', sans-serif" }} />
        <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2" style={{ color: "#dc2626" }} />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((l) => (
          <div key={l.id} className="flex gap-3 py-3 px-4 rounded-xl"
            style={{ background: "#2a0808", borderRight: "3px solid rgba(220,38,38,0.5)" }}>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                  {l.action}
                </span>
                <span className="text-xs" style={{ color: "#9ca3af" }}>{l.users?.name ?? "النظام"}</span>
              </div>
              {l.details && <p className="text-xs" style={{ color: "#6b7280" }}>{l.details}</p>}
            </div>
            <span className="text-xs shrink-0" style={{ color: "#555" }}>
              {new Date(l.created_at).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm py-8" style={{ color: "#555" }}>لا توجد سجلات</p>}
      </div>
    </div>
  )
}

// ─── Shared utility ────────────────────────────────────────────────
async function logAction(adminId: string, action: string, details?: string) {
  await createClient().from("admin_logs").insert({ admin_id: adminId, action, details: details ?? null })
}
