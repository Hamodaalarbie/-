"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Bell, LogOut, Zap, TrendingUp, Briefcase, ListChecks,
  Layers, Wallet, HelpCircle, Bot, Gift, ChevronLeft
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAppContext } from "@/lib/context"
import { AppUser, Notification, Settings, RANK_CONFIG } from "@/lib/types"
import Logo from "@/components/Logo"
import WithdrawPopup from "@/components/WithdrawPopup"
import SharesPopup from "@/components/SharesPopup"
import NotificationsPanel from "@/components/NotificationsPanel"
import HelpPanel from "@/components/HelpPanel"
import AIChatPopup from "@/components/AIChatPopup"

function StatCard({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-xl p-3 flex flex-col gap-1 animate-countUp" style={{ background: "#111111", border: "1px solid rgba(249,115,22,0.3)" }}>
      <Icon size={18} color="#f97316" />
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="text-xs" style={{ color: "#9ca3af" }}>{unit}</p>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user: ctxUser, setUser, logout } = useAppContext()
  const [user, setLocalUser] = useState<AppUser | null>(ctxUser)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [promoMsg, setPromoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showShares, setShowShares] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const load = useCallback(async (uid: string) => {
    const supabase = createClient()
    const [{ data: u }, { data: notifs }, { data: sets }] = await Promise.all([
      supabase.from("users").select("*").eq("id", uid).single(),
      supabase.from("notifications").select("*").or(`target_user_id.eq.${uid},target_all.eq.true`).order("created_at", { ascending: false }).limit(20),
      supabase.from("settings").select("*").limit(1).single(),
    ])
    if (u) { setLocalUser(u); setUser(u) }
    if (notifs) setNotifications(notifs)
    if (sets) setSettings(sets)
  }, [setUser])

  useEffect(() => {
    if (!ctxUser) { router.replace("/login"); return }
    if (ctxUser.role !== "partner") { router.replace(ctxUser.role === "admin" ? "/admin" : "/market"); return }
    load(ctxUser.id)
  }, [ctxUser, router, load])

  const redeemPromo = async () => {
    if (!promoCode.trim() || !user) return
    const supabase = createClient()
    const { data: promo } = await supabase.from("promo_codes").select("*").eq("code", promoCode.trim().toUpperCase()).single()
    if (!promo) { setPromoMsg({ type: "error", text: "كود غير صحيح" }); return }
    if (promo.used_count >= promo.max_uses) { setPromoMsg({ type: "error", text: "تم استخدام الكود بالكامل" }); return }
    const newPoints = user.points + promo.points_value
    await supabase.from("users").update({ points: newPoints }).eq("id", user.id)
    await supabase.from("promo_codes").update({ used_count: promo.used_count + 1 }).eq("id", promo.id)
    setLocalUser({ ...user, points: newPoints })
    setUser({ ...user, points: newPoints })
    setPromoCode("")
    setPromoMsg({ type: "success", text: `تم إضافة ${promo.points_value} نقطة!` })
    setTimeout(() => setPromoMsg(null), 3000)
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#f97316" }} />
    </div>
  )

  const rank = RANK_CONFIG[user.rank]

  const ACTIONS = [
    { icon: ListChecks, label: "المهام", action: () => router.push("/tasks") },
    { icon: Layers, label: "المشاريع", action: () => router.push("/projects") },
    { icon: Wallet, label: "السحب", action: () => setShowWithdraw(true) },
    { icon: TrendingUp, label: "تحويل أسهم", action: () => setShowShares(true) },
    { icon: HelpCircle, label: "المساعدة", action: () => setShowHelp(true) },
    { icon: Bot, label: "دردشة AI", action: () => setShowChat(true) },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14" style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <button onClick={() => setShowNotifs(true)} className="relative">
            <Bell size={20} color="#9ca3af" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold animate-badgePulse" style={{ background: "#dc2626", color: "#fff", fontSize: "9px" }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={logout}>
            <LogOut size={20} color="#9ca3af" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-8 flex flex-col gap-4 mt-4 max-w-lg mx-auto">
        {/* Welcome banner */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, #1a0a00, #111111)",
            border: "1.5px solid #f97316",
            boxShadow: "0 0 20px rgba(249,115,22,0.15)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-bold text-white">مرحباً {user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rank.bg} ${rank.text}`}>
                  {rank.icon} {rank.label}
                </span>
              </div>
            </div>
            <div className="text-left">
              <span className="block text-xs px-2 py-1 rounded-lg font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                {user.dept}
              </span>
              <p className="text-xs mt-1" style={{ color: "#555" }}>{user.code}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Zap} label="النقاط" value={user.points.toLocaleString()} unit="نقطة" />
          <StatCard icon={TrendingUp} label="الأسهم" value={user.shares.toLocaleString()} unit="سهم" />
          <StatCard icon={Zap} label="الرتبة" value={rank.icon} unit={rank.label} />
          <StatCard icon={Briefcase} label="القسم" value={user.dept ?? "-"} unit="قسم" />
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: "#9ca3af" }}>الإجراءات السريعة</h3>
          <div className="grid grid-cols-3 gap-3">
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all card-hover"
                style={{ background: "#111111", border: "1px solid #222" }}
              >
                <a.icon size={22} color="#f97316" />
                <span className="text-xs font-bold" style={{ color: "#9ca3af" }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo code */}
        <div className="rounded-2xl p-4" style={{ background: "#111111", border: "1px solid #222" }}>
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} color="#f97316" />
            <h3 className="text-sm font-bold text-white">كود الترقية</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="أدخل الكود"
              className="flex-1 rounded-xl py-2.5 px-4 text-sm text-white"
              style={{ background: "#1a1a1a", border: "1.5px solid #333", fontFamily: "'Tajawal', sans-serif" }}
              onKeyDown={(e) => e.key === "Enter" && redeemPromo()}
            />
            <button onClick={redeemPromo} className="px-4 rounded-xl font-bold btn-primary text-sm" style={{ background: "#f97316", color: "#000" }}>
              استرداد
            </button>
          </div>
          {promoMsg && (
            <p className="mt-2 text-sm" style={{ color: promoMsg.type === "success" ? "#22c55e" : "#ef4444" }}>
              {promoMsg.text}
            </p>
          )}
        </div>

        {/* Shares card */}
        {user.shares > 0 && settings && (
          <div className="rounded-2xl p-4" style={{ background: "#111111", border: "1px solid rgba(249,115,22,0.3)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="#f97316" />
                <h3 className="text-sm font-bold text-white">أسهمي</h3>
              </div>
            </div>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              لديك <span className="font-bold text-white">{user.shares} سهم</span>
            </p>
            <button
              onClick={() => router.push("/market")}
              className="mt-3 flex items-center gap-1 text-sm btn-primary"
              style={{ color: "#f97316" }}
            >
              عرض أسهمي في السوق <ChevronLeft size={14} />
            </button>
          </div>
        )}

        {/* Notifications preview */}
        <div className="rounded-2xl p-4" style={{ background: "#111111", border: "1px solid #222" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={18} color="#f97316" />
              <h3 className="text-sm font-bold text-white">آخر الإشعارات</h3>
            </div>
            <button onClick={() => setShowNotifs(true)} className="text-xs" style={{ color: "#f97316" }}>
              عرض الكل
            </button>
          </div>
          {notifications.slice(0, 3).length === 0 ? (
            <p className="text-sm" style={{ color: "#555" }}>لا توجد إشعارات</p>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: n.is_read ? "#333" : "#f97316" }} />
                  <div>
                    <p className="text-sm font-bold text-white leading-snug">{n.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{n.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      {showWithdraw && settings && (
        <WithdrawPopup user={user} minPoints={settings.min_withdrawal_points} onClose={() => setShowWithdraw(false)} onSuccess={() => load(user.id)} />
      )}
      {showShares && settings && (
        <SharesPopup user={user} pointsPerShare={settings.points_per_share} onClose={() => setShowShares(false)} onSuccess={(p, s) => setLocalUser({ ...user, points: p, shares: s })} />
      )}
      {showNotifs && (
        <NotificationsPanel notifications={notifications} userId={user.id} onClose={() => setShowNotifs(false)} onMarkRead={() => load(user.id)} />
      )}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      {showChat && <AIChatPopup onClose={() => setShowChat(false)} />}
    </div>
  )
}
