"use client"

import { useState } from "react"
import { X, CheckCircle, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AppUser } from "@/lib/types"

interface Props {
  user: AppUser
  pointsPerShare: number
  onClose: () => void
  onSuccess: (newPoints: number, newShares: number) => void
}

export default function SharesPopup({ user, pointsPerShare, onClose, onSuccess }: Props) {
  const [points, setPoints] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const pts = parseInt(points) || 0
  const shares = Math.floor(pts / pointsPerShare)

  const handleConvert = async () => {
    if (pts < pointsPerShare) { setError(`الحد الأدنى ${pointsPerShare} نقطة`); return }
    if (pts > user.points) { setError("لا تملك نقاطاً كافية"); return }
    setLoading(true)
    const supabase = createClient()
    const newPoints = user.points - pts
    const newShares = user.shares + shares
    await supabase.from("users").update({ points: newPoints, shares: newShares }).eq("id", user.id)
    await supabase.from("transactions").insert({
      user_id: user.id, type: "ShareConversion", amount: shares,
      status: "completed", note: `تحويل ${pts} نقطة إلى ${shares} سهم`,
    })
    setLoading(false)
    setDone(true)
    onSuccess(newPoints, newShares)
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-scaleIn" style={{ background: "#111111", border: "2px solid #f97316", borderRadius: "20px", boxShadow: "0 0 40px rgba(249,115,22,0.3)", padding: "28px 24px" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">تحويل نقاط إلى أسهم</h2>
          <button onClick={onClose} style={{ color: "#9ca3af" }}><X size={20} /></button>
        </div>

        {done ? (
          <div className="text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center" style={{ background: "#0a2a0a", border: "2px solid #22c55e", width: 56, height: 56 }}>
                <CheckCircle size={28} color="#22c55e" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تم التحويل بنجاح</h3>
            <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>حصلت على <span style={{ color: "#f97316", fontWeight: "bold" }}>{shares} سهم</span></p>
            <button onClick={onClose} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>حسناً</button>
          </div>
        ) : (
          <>
            <div className="rounded-xl p-4 mb-5" style={{ background: "#1a0d00", border: "1px solid #f97316" }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} color="#f97316" />
                <span className="text-sm font-bold" style={{ color: "#f97316" }}>معدل التحويل</span>
              </div>
              <p className="text-xs" style={{ color: "#9ca3af" }}>كل <span style={{ color: "#fff" }}>{pointsPerShare} نقطة</span> = <span style={{ color: "#fff" }}>سهم واحد</span></p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>عدد النقاط للتحويل</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder={`الحد الأدنى ${pointsPerShare}`}
                className="w-full rounded-xl py-3 px-4 text-sm text-white"
                style={{ background: "#1a1a1a", border: "1.5px solid #333", fontFamily: "'Tajawal', sans-serif" }}
              />
              <p className="mt-1 text-xs" style={{ color: "#9ca3af" }}>رصيدك: <span style={{ color: "#f97316" }}>{user.points} نقطة</span></p>
            </div>

            {pts >= pointsPerShare && (
              <div className="rounded-xl p-3 mb-4 text-center animate-fadeIn" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                <p className="text-sm" style={{ color: "#9ca3af" }}>ستحصل على</p>
                <p className="text-2xl font-extrabold" style={{ color: "#f97316" }}>{shares} سهم</p>
              </div>
            )}

            {error && <p className="mb-3 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

            <button onClick={handleConvert} disabled={loading} className="w-full py-3 rounded-xl font-bold btn-primary" style={{ background: "#f97316", color: "#000" }}>
              {loading ? "جارٍ التحويل..." : "تحويل"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
