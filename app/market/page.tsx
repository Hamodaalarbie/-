"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, TrendingUp, Users, X, CheckCircle, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import { Project, ShareListing } from "@/lib/types"
import Logo from "@/components/Logo"

type MarketTab = "company" | "freelancers" | "portfolio"

function BuySharesPopup({ project, userId, onClose }: { project: Project; userId: string; onClose: () => void }) {
  const [count, setCount] = useState("")
  const [payMethod, setPayMethod] = useState("bank")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const total = (parseInt(count) || 0) * project.share_price_egp

  const submit = async () => {
    const n = parseInt(count)
    if (!n || n < 1) return
    if (n > project.available_shares) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from("pending_requests").insert({
      user_id: userId, type: "SharePurchase", project_id: project.id,
      points_amount: n, method: payMethod,
      task_title: `شراء ${n} سهم في ${project.title_ar}`, status: "Pending",
    })
    setLoading(false); setDone(true)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-scaleIn" style={{ background: "#0f1929", border: "2px solid #3b82f6", borderRadius: "20px", boxShadow: "0 0 40px rgba(59,130,246,0.3)", padding: "28px 24px" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">شراء أسهم - {project.title_ar}</h2>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={18} /></button>
        </div>
        {done ? (
          <div className="text-center py-4 animate-scaleIn">
            <div className="flex justify-center mb-3">
              <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 52, height: 52 }}>
                <CheckCircle size={26} color="#22c55e" />
              </div>
            </div>
            <h3 className="font-bold text-white mb-1">تم إرسال طلب الشراء</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>سيتواصل معك الفريق لإتمام الصفقة</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#3b82f6", color: "#fff" }}>حسناً</button>
          </div>
        ) : (
          <>
            <div className="rounded-xl p-3 mb-4" style={{ background: "#0a0f1a", border: "1px solid #1e3a5f" }}>
              <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>سعر السهم: <span className="font-bold text-white">{project.share_price_egp} جنيه</span></p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>متاح: <span className="font-bold" style={{ color: "#60a5fa" }}>{project.available_shares.toLocaleString()} سهم</span></p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>عدد الأسهم</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="1"
                min="1"
                max={project.available_shares}
                className="w-full rounded-xl py-3 px-4 text-sm text-white"
                style={{ background: "#0a0f1a", border: "1.5px solid #1e3a5f", fontFamily: "'Tajawal', sans-serif" }}
              />
            </div>
            {parseInt(count) > 0 && (
              <div className="rounded-xl p-3 mb-4 text-center animate-fadeIn" style={{ background: "#0a0f1a", border: "1px solid #3b82f6" }}>
                <p className="text-xs" style={{ color: "#9ca3af" }}>الإجمالي</p>
                <p className="text-2xl font-extrabold" style={{ color: "#3b82f6" }}>{total.toLocaleString()} جنيه</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>طريقة الدفع</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full rounded-xl py-3 px-4 text-sm text-white"
                style={{ background: "#0a0f1a", border: "1.5px solid #1e3a5f", fontFamily: "'Tajawal', sans-serif" }}
              >
                <option value="bank">تحويل بنكي</option>
                <option value="instapay">InstaPay</option>
                <option value="vodafone">Vodafone Cash</option>
              </select>
            </div>
            <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#3b82f6", color: "#fff" }}>
              {loading ? "جارٍ الإرسال..." : "تأكيد الشراء"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function MarketPage() {
  const router = useRouter()
  const { user, logout } = useAppContext()
  const [tab, setTab] = useState<MarketTab>("company")
  const [projects, setProjects] = useState<Project[]>([])
  const [listings, setListings] = useState<ShareListing[]>([])
  const [loading, setLoading] = useState(true)
  const [buyProject, setBuyProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!user) { router.replace("/login"); return }
    const supabase = createClient()
    Promise.all([
      supabase.from("projects").select("*").neq("status", "closed"),
      supabase.from("share_listings").select("*, users(name, dept), projects(title_ar)").eq("status", "active").eq("listing_type", "advertise"),
    ]).then(([{ data: p }, { data: l }]) => {
      if (p) setProjects(p)
      if (l) setListings(l as ShareListing[])
      setLoading(false)
    })
  }, [user, router])

  const bgColor = "#0a0f1a"
  const cardBg = "#0f1929"
  const accent = "#3b82f6"

  const TABS: { id: MarketTab; label: string }[] = [
    { id: "company", label: "أسهم الشركة" },
    { id: "freelancers", label: "أسهم المستقلين" },
    { id: "portfolio", label: "محفظتي" },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: bgColor }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accent }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: bgColor, color: "#fff", fontFamily: "'Tajawal', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14" style={{ background: "#060c18", borderBottom: `1px solid ${accent}30` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} style={{ color: accent }}><ArrowRight size={20} /></button>
          <Logo size="sm" variant="blue" />
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "investor" && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: `${accent}20`, color: accent }}>مستثمر</span>
          )}
          <button onClick={logout}><LogOut size={18} color="#9ca3af" /></button>
        </div>
      </header>

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold" style={{ color: accent }}>بوابة السوق</h1>
          <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>استثمر في مشاريع عرباوي وتداول الأسهم</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: "#060c18", border: `1px solid ${accent}30` }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: tab === t.id ? accent : "transparent",
                color: tab === t.id ? "#fff" : "#9ca3af",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Company Shares */}
        {tab === "company" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <p className="text-sm" style={{ color: "#9ca3af" }}>استثمر مباشرة في مشاريع عرباوي</p>
            {projects.map((proj) => (
              <div key={proj.id} className="rounded-2xl p-4" style={{ background: cardBg, border: `1.5px solid ${accent}40`, boxShadow: `0 0 15px ${accent}10` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{proj.title_ar}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{proj.category}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: `${accent}20`, color: accent }}>
                    {proj.status === "active" ? "نشط" : "توسعي"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "سعر السهم", value: `${proj.share_price_egp} ج` },
                    { label: "متاح", value: proj.available_shares.toLocaleString() },
                    { label: "الإجمالي", value: proj.total_shares.toLocaleString() },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-2 text-center" style={{ background: "#0a0f1a" }}>
                      <p className="text-xs font-bold text-white">{s.value}</p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#555" }}>
                    <span>نسبة البيع</span>
                    <span>{Math.round(((proj.total_shares - proj.available_shares) / Math.max(proj.total_shares, 1)) * 100)}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill progress-fill-blue" style={{ width: `${Math.round(((proj.total_shares - proj.available_shares) / Math.max(proj.total_shares, 1)) * 100)}%` }} /></div>
                </div>
                <button
                  onClick={() => user && setBuyProject(proj)}
                  disabled={proj.available_shares === 0}
                  className="w-full py-2.5 rounded-xl text-sm font-bold btn-primary"
                  style={{ background: proj.available_shares === 0 ? "#1a2a3a" : accent, color: "#fff" }}
                >
                  {proj.available_shares === 0 ? "لا توجد أسهم متاحة" : "اشترِ أسهم"}
                </button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-center py-12" style={{ color: "#555" }}>لا توجد مشاريع متاحة حالياً</p>}
          </div>
        )}

        {/* TAB 2: Freelancer Listings */}
        {tab === "freelancers" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="rounded-xl p-3" style={{ background: "#0a0f1a", border: `1px solid ${accent}30` }}>
              <p className="text-xs" style={{ color: "#9ca3af" }}>جميع الصفقات تتم بإشراف الشركة لضمان أمان الطرفين</p>
            </div>
            {listings.map((l) => (
              <div key={l.id} className="rounded-2xl p-4" style={{ background: cardBg, border: `1.5px solid ${accent}30` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${accent}20`, color: accent }}>
                      {(l.users as { name: string; dept: string })?.name?.[0] ?? "؟"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{(l.users as { name: string; dept: string })?.name ?? "مجهول"}</p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>{(l.users as { name: string; dept: string })?.dept}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: `${accent}20`, color: accent }}>للبيع</span>
                </div>
                <p className="text-sm font-bold text-white mb-2">{(l.projects as { title_ar: string })?.title_ar}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "الأسهم", value: l.shares_count },
                    { label: "سعر السهم", value: `${l.price_per_share} ج` },
                    { label: "الإجمالي", value: `${(l.shares_count * l.price_per_share).toLocaleString()} ج` },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-2 text-center" style={{ background: "#0a0f1a" }}>
                      <p className="text-xs font-bold text-white">{s.value}</p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl text-sm font-bold btn-primary" style={{ background: accent, color: "#fff" }}>
                  تواصل للشراء
                </button>
              </div>
            ))}
            {listings.length === 0 && <p className="text-center py-12" style={{ color: "#555" }}>لا توجد إعلانات بيع حالياً</p>}
          </div>
        )}

        {/* TAB 3: Portfolio */}
        {tab === "portfolio" && user && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1.5px solid ${accent}40` }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} color={accent} />
                <h3 className="font-bold text-white">محفظتي الاستثمارية</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "#0a0f1a" }}>
                  <p className="text-2xl font-extrabold" style={{ color: accent }}>{user.shares}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>إجمالي الأسهم</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#0a0f1a" }}>
                  <p className="text-2xl font-extrabold" style={{ color: "#22c55e" }}>{user.points}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>نقاط متاحة</p>
                </div>
              </div>
            </div>
            {user.shares === 0 ? (
              <div className="text-center py-12">
                <Users size={40} color="#1e3a5f" className="mx-auto mb-3" />
                <p style={{ color: "#555" }}>لا تملك أسهماً بعد</p>
                <button onClick={() => setTab("company")} className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold btn-primary" style={{ background: accent, color: "#fff" }}>
                  استثمر الآن
                </button>
              </div>
            ) : (
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1.5px solid ${accent}30` }}>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  لديك <span className="font-bold text-white">{user.shares} سهم</span> في محفظتك
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={async () => {
                      if (!user) return
                      const supabase = createClient()
                      await supabase.from("pending_requests").insert({
                        user_id: user.id, type: "ShareSale",
                        task_title: `بيع ${user.shares} سهم للشركة`, status: "Pending",
                      })
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-primary"
                    style={{ background: "#dc2626", color: "#fff" }}
                  >
                    بيع للشركة
                  </button>
                  <button
                    onClick={() => setTab("freelancers")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-primary"
                    style={{ background: accent, color: "#fff" }}
                  >
                    نشر إعلان بيع
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {buyProject && user && (
        <BuySharesPopup project={buyProject} userId={user.id} onClose={() => setBuyProject(null)} />
      )}
    </div>
  )
}
