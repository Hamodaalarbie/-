"use client"

import { useState } from "react"
import { X, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Notification } from "@/lib/types"

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  return `منذ ${Math.floor(hours / 24)} يوم`
}

interface Props {
  notifications: Notification[]
  userId: string
  onClose: () => void
  onMarkRead: () => void
}

export default function NotificationsPanel({ notifications, userId, onClose, onMarkRead }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const markAllRead = async () => {
    const supabase = createClient()
    await supabase.from("notifications").update({ is_read: true }).eq("target_user_id", userId).eq("is_read", false)
    onMarkRead()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1" onClick={onClose} style={{ background: "rgba(0,0,0,0.5)" }} />
      <div className="w-full max-w-xs animate-slideInRight flex flex-col" style={{ background: "#111111", borderRight: "none", borderLeft: "2px solid #f97316", height: "100vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #222" }}>
          <div className="flex items-center gap-2">
            <Bell size={18} color="#f97316" />
            <span className="font-bold text-white">الإشعارات</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={markAllRead} className="text-xs" style={{ color: "#f97316" }}>تحديد الكل كمقروء</button>
            <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={18} /></button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Bell size={32} color="#333" />
              <p className="text-sm" style={{ color: "#9ca3af" }}>لا توجد إشعارات</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                className="w-full text-right p-4 transition-all"
                style={{ borderBottom: "1px solid #1a1a1a", background: expanded === n.id ? "#1a1a1a" : "transparent" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1 w-2 h-2 rounded-full shrink-0"
                    style={{ background: n.is_read ? "#333" : "#f97316", boxShadow: n.is_read ? "none" : "0 0 6px rgba(249,115,22,0.6)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-snug">{n.title}</p>
                    {expanded === n.id ? (
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "#9ca3af" }}>{n.description}</p>
                    ) : (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{n.description}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "#555" }}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
