'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, ShoppingCart, Banknote } from 'lucide-react'
import { useStore } from '@/components/providers'
import type { Share } from '@/lib/types'

export function ShareCard({ share }: { share: Share }) {
  const { lang, buyShare, sellShare, addTransaction, user } = useStore()
  const ar = lang === 'ar'
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<'buy' | 'sell' | null>(null)
  const [done, setDone] = useState(false)

  const soldPct = Math.round(((share.total - share.available) / share.total) * 100)

  function handleAction() {
    if (mode === 'buy') {
      buyShare(share.id, qty)
      addTransaction('buy', share.price * qty, `شراء ${qty} حصة من ${share.name}`)
    } else {
      sellShare(share.id, qty)
      addTransaction('sell', share.price * qty, `بيع ${qty} حصة من ${share.name}`)
    }
    setDone(true)
    setTimeout(() => {
      setDone(false)
      setMode(null)
      setQty(1)
    }, 2000)
  }

  return (
    <div className="glass card-frame rounded-3xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-sm leading-snug">{share.name}</h3>
        <span className="text-xs font-bold text-[#1e90ff] bg-[#1e90ff]/10 px-2 py-1 rounded-full">
          {soldPct}% {ar ? 'مُباع' : 'sold'}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-wave"
          style={{ width: `${soldPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {ar ? 'السعر' : 'Price'}:{' '}
          <span className="font-bold text-foreground">
            {share.price.toLocaleString()} {ar ? 'ج.م' : 'EGP'}
          </span>
        </span>
        <span className="text-muted-foreground">
          {ar ? 'متاح' : 'Available'}:{' '}
          <span className="font-bold text-foreground">{share.available}</span>
        </span>
      </div>

      {!mode && !done && (
        <div className="flex gap-2">
          {share.buyEnabled && (
            <button
              onClick={() => setMode('buy')}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-wave py-2.5 text-xs font-bold text-white"
            >
              <ShoppingCart className="size-3.5" />
              {ar ? 'شراء' : 'Buy'}
            </button>
          )}
          {share.sellEnabled && (
            <button
              onClick={() => setMode('sell')}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#ff2d55]/40 py-2.5 text-xs font-bold text-[#ff2d55] hover:bg-[#ff2d55]/10"
            >
              <Banknote className="size-3.5" />
              {ar ? 'بيع' : 'Sell'}
            </button>
          )}
        </div>
      )}

      {mode && !done && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="size-8 rounded-lg bg-secondary font-bold"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="size-8 rounded-lg bg-secondary font-bold"
            >
              +
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {ar ? 'الإجمالي' : 'Total'}:{' '}
            <span className="font-bold text-foreground">
              {(share.price * qty).toLocaleString()} {ar ? 'ج.م' : 'EGP'}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setMode(null)}
              className="flex-1 rounded-xl border border-border py-2 text-xs font-bold text-muted-foreground"
            >
              {ar ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleAction}
              className={`flex-1 rounded-xl py-2 text-xs font-bold text-white ${
                mode === 'buy' ? 'bg-gradient-wave' : 'bg-gradient-marid'
              }`}
            >
              {ar ? 'تأكيد' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="text-center text-sm font-bold text-[#22c55e]">
          ✓ {ar ? 'تمت العملية بنجاح' : 'Done successfully'}
        </div>
      )}
    </div>
  )
}