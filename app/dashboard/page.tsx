'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Wallet,
  TrendingUp,
  Award,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Snowflake,
  AlertTriangle,
  FileText,
  Video,
  Mic,
  ImageIcon,
  Link as LinkIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  Banknote,
  Gift,
} from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/shell'
import { ShareCard } from '@/components/share-card'
import { useStore } from '@/components/providers'
import type { TxType } from '@/lib/types'

export default function InvestorDashboard() {
  return (
    <DashboardShell requiredRole="investor">
      <InvestorContent />
    </DashboardShell>
  )
}

function InvestorContent() {
  const {
    lang,
    user,
    shares,
    products,
    transactions,
    levels,
    addTransaction,
  } = useStore()
  const u = user!
  const published = shares.filter((s) => s.published)

  // level calc
  const sorted = [...levels].sort((a, b) => a.minPoints - b.minPoints)
  const current =
    [...sorted].reverse().find((l) => u.points >= l.minPoints) ?? sorted[0]
  const next = sorted.find((l) => l.minPoints > u.points)
  const progressPct = next
    ? Math.round(
        ((u.points - current.minPoints) / (next.minPoints - current.minPoints)) *
          100,
      )
    : 100

  const myTx = transactions.filter((t) => t.userId === u.id)

  return (
    <div className="space-y-8">
      {/* 1. Welcome header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          <span className="text-gradient-wave">
            {lang === 'ar' ? `أهلاً ${u.name}` : `Welcome ${u.name}`}
          </span>
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            u.status === 'approved'
              ? 'bg-green-500/15 text-green-500'
              : 'bg-[#ff9500]/15 text-[#ff9500]'
          }`}
        >
          {u.status === 'approved'
            ? lang === 'ar'
              ? 'حساب مفعّل'
              : 'Approved'
            : lang === 'ar'
              ? 'قيد المراجعة'
              : 'Pending'}
        </span>
      </div>

      {/* 2. Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          label={lang === 'ar' ? 'المحفظة' : 'Wallet'}
          value={`${u.wallet.toLocaleString()} ${lang === 'ar' ? 'ج.م' : 'EGP'}`}
          gradient="wave"
        />
        <StatCard
          icon={TrendingUp}
          label={lang === 'ar' ? 'الحصص المملوكة' : 'Shares Owned'}
          value={`${u.shares}`}
          gradient="marid"
        />
        <div className="glass card-frame rounded-3xl p-5">
          <div className="mb-2 flex items-center gap-2">
            <Award className="size-5" style={{ color: current.color }} />
            <span className="text-sm text-muted-foreground">
              {lang === 'ar' ? 'المستوى' : 'Level'}
            </span>
          </div>
          <div className="text-2xl font-extrabold" style={{ color: current.color }}>
            {lang === 'ar' ? current.nameAr : current.nameEn}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {u.points.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'pts'}
          </div>
        </div>
      </div>

      {/* 3. Level progress */}
      <div className="glass card-frame rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold" style={{ color: current.color }}>
            {lang === 'ar' ? current.nameAr : current.nameEn}
          </span>
          {next && (
            <span className="text-sm font-bold" style={{ color: next.color }}>
              {lang === 'ar' ? next.nameAr : next.nameEn}
            </span>
          )}
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-wave transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {next
            ? lang === 'ar'
              ? `تحتاج ${(next.minPoints - u.points).toLocaleString()} نقطة للوصول إلى ${next.nameAr}. المتطلبات: ${next.requirementsAr}`
              : `Need ${(next.minPoints - u.points).toLocaleString()} more pts for ${next.nameEn}. Requirements: ${next.requirementsEn}`
            : lang === 'ar'
              ? 'لقد وصلت إلى أعلى مستوى!'
              : 'You reached the highest level!'}
        </p>
      </div>

      {/* 4. Shares trading */}
      <Section title={lang === 'ar' ? 'تداول الحصص' : 'Shares Trading'}>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {published.map((s) => (
            <ShareCard key={s.id} share={s} />
          ))}
        </div>
      </Section>

      {/* 5. Financial products */}
      <Section title={lang === 'ar' ? 'المنتجات المالية' : 'Financial Products'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} lang={lang} />
          ))}
        </div>
      </Section>

      {/* 6. Deposit & withdrawal */}
      <DepositWithdraw lang={lang} onSubmit={addTransaction} />

      {/* 7. Transaction ledger */}
      <TransactionLedger lang={lang} transactions={myTx} />

      {/* 8. Portfolio */}
      <Section title={lang === 'ar' ? 'ملف الأعمال' : 'Portfolio'}>
        <div className="glass card-frame rounded-3xl p-5">
          {u.portfolioUrl && (
            <a
              href={u.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1e90ff] hover:underline"
            >
              <LinkIcon className="size-4" />
              {u.portfolioUrl}
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            {u.portfolioFiles.map((f) => {
              const ext = f.split('.').pop()?.toLowerCase()
              const Icon =
                ext === 'pdf'
                  ? FileText
                  : ext === 'mp4' || ext === 'mov'
                    ? Video
                    : ext === 'mp3' || ext === 'wav'
                      ? Mic
                      : ImageIcon
              return (
                <span
                  key={f}
                  className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm"
                >
                  <Icon className="size-4 text-[#1e90ff]" />
                  {f}
                </span>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: typeof Wallet
  label: string
  value: string
  gradient: 'wave' | 'marid'
}) {
  return (
    <div className="glass card-frame rounded-3xl p-5">
      <div className="mb-2 flex items-center gap-2">
        <Icon
          className={`size-5 ${gradient === 'wave' ? 'text-[#1e90ff]' : 'text-[#ff2d55]'}`}
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div
        className={`text-2xl font-extrabold ${
          gradient === 'wave' ? 'text-gradient-wave' : 'text-gradient-marid'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function ProductCard({
  product,
  lang,
}: {
  product: import('@/lib/types').FinancialProduct
  lang: 'ar' | 'en'
}) {
  const statusChip = {
    active: {
      cls: 'bg-green-500/15 text-green-500',
      ar: 'نشط',
      en: 'Active',
      icon: Check,
    },
    frozen: {
      cls: 'bg-[#1e90ff]/15 text-[#1e90ff]',
      ar: 'مجمّد',
      en: 'Frozen',
      icon: Snowflake,
    },
    completed: {
      cls: 'bg-muted text-muted-foreground',
      ar: 'مكتمل',
      en: 'Completed',
      icon: Check,
    },
  }[product.status]
  const SIcon = statusChip.icon

  return (
    <div className="glass card-frame rounded-3xl p-5">
      <div className="flex items-start justify-between">
        <h3 className="font-bold">{lang === 'ar' ? product.nameAr : product.nameEn}</h3>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusChip.cls}`}
        >
          <SIcon className="size-3" />
          {lang === 'ar' ? statusChip.ar : statusChip.en}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {lang === 'ar' ? product.descAr : product.descEn}
      </p>
      <div className="mt-3 text-3xl font-extrabold text-gradient-marid">
        {product.returnRate}%
      </div>
      {product.status === 'active' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#ff9500]">
          <AlertTriangle className="size-3.5" />
          {lang === 'ar' ? 'الخروج المبكر: خصم 10%' : 'Early exit: 10% penalty'}
        </div>
      )}
      {product.status === 'frozen' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1e90ff]">
          <Snowflake className="size-3.5" />
          {lang === 'ar' ? 'مجمّد حتى انتهاء المشروع' : 'Frozen until project ends'}
        </div>
      )}
    </div>
  )
}

function DepositWithdraw({
  lang,
  onSubmit,
}: {
  lang: 'ar' | 'en'
  onSubmit: (type: TxType, amount: number, notes: string) => void
}) {
  const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  function submit() {
    const amt = Number(amount)
    if (!amt) return
    onSubmit(mode === 'deposit' ? 'deposit' : 'withdraw', amt, notes)
    setDone(true)
    setAmount('')
    setNotes('')
    setTimeout(() => {
      setDone(false)
      setMode(null)
    }, 3500)
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">
        {lang === 'ar' ? 'الإيداع والسحب' : 'Deposit & Withdraw'}
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setMode(mode === 'deposit' ? null : 'deposit')}
          className="flex items-center gap-2 rounded-2xl bg-gradient-wave px-5 py-3 font-bold text-white transition hover:opacity-90"
        >
          <ArrowDownToLine className="size-5" />
          {lang === 'ar' ? 'إيداع' : 'Deposit'}
        </button>
        <button
          onClick={() => setMode(mode === 'withdraw' ? null : 'withdraw')}
          className="flex items-center gap-2 rounded-2xl border border-[#ff2d55]/40 px-5 py-3 font-bold text-[#ff2d55] transition hover:bg-[#ff2d55]/10"
        >
          <ArrowUpFromLine className="size-5" />
          {lang === 'ar' ? 'سحب' : 'Withdraw'}
        </button>
      </div>

      <AnimatePresence>
        {mode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass card-frame mt-4 space-y-3 rounded-3xl p-5">
              {done ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="size-5" />
                  <span className="font-semibold">
                    {lang === 'ar'
                      ? 'تم الإرسال ✓ في انتظار موافقة الإدارة خلال 48 ساعة'
                      : 'Submitted ✓ Awaiting admin approval within 48 hours'}
                  </span>
                </div>
              ) : (
                <>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={lang === 'ar' ? 'المبلغ (ج.م)' : 'Amount (EGP)'}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 outline-none focus:border-[#1e90ff]"
                  />
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'ملاحظات' : 'Notes'}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 outline-none focus:border-[#1e90ff]"
                  />
                  <button
                    onClick={submit}
                    className={`rounded-xl px-5 py-2.5 font-bold text-white ${
                      mode === 'deposit' ? 'bg-gradient-wave' : 'bg-gradient-marid'
                    }`}
                  >
                    {lang === 'ar' ? 'إرسال' : 'Submit'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

const TX_META: Record<
  TxType,
  { icon: typeof ArrowDownCircle; color: string; ar: string; en: string }
> = {
  deposit: { icon: ArrowDownCircle, color: '#22c55e', ar: 'إيداع', en: 'Deposit' },
  withdraw: { icon: ArrowUpCircle, color: '#ff2d55', ar: 'سحب', en: 'Withdraw' },
  buy: { icon: ShoppingCart, color: '#1e90ff', ar: 'شراء', en: 'Buy' },
  sell: { icon: Banknote, color: '#ff9500', ar: 'بيع', en: 'Sell' },
  distribution: { icon: Gift, color: '#00c6ff', ar: 'توزيعات', en: 'Distribution' },
}

function TransactionLedger({
  lang,
  transactions,
}: {
  lang: 'ar' | 'en'
  transactions: import('@/lib/types').Transaction[]
}) {
  const [tab, setTab] = useState<'all' | TxType>('all')
  const tabs: ('all' | TxType)[] = [
    'all',
    'buy',
    'sell',
    'deposit',
    'withdraw',
    'distribution',
  ]
  const labels: Record<string, { ar: string; en: string }> = {
    all: { ar: 'الكل', en: 'All' },
    buy: { ar: 'شراء', en: 'Buy' },
    sell: { ar: 'بيع', en: 'Sell' },
    deposit: { ar: 'إيداع', en: 'Deposit' },
    withdraw: { ar: 'سحب', en: 'Withdraw' },
    distribution: { ar: 'توزيعات', en: 'Distrib.' },
  }
  const filtered =
    tab === 'all' ? transactions : transactions.filter((t) => t.type === tab)

  // simple 6-month bar chart from transactions
  const max = Math.max(...transactions.map((t) => t.amount), 1)

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">
        {lang === 'ar' ? 'سجل المعاملات' : 'Transaction Ledger'}
      </h2>

      <div className="glass card-frame mb-4 rounded-3xl p-5">
        <div className="flex h-32 items-end justify-between gap-2">
          {transactions.slice(0, 6).reverse().map((t) => (
            <div key={t.id} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-gradient-wave"
                style={{ height: `${(t.amount / max) * 100}%`, minHeight: 4 }}
              />
              <span className="text-[10px] text-muted-foreground">
                {t.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === t
                ? 'scale-[1.03] bg-gradient-wave text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'ar' ? labels[t].ar : labels[t].en}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((t) => {
          const meta = TX_META[t.type]
          const Icon = meta.icon
          return (
            <div
              key={t.id}
              className="glass flex items-center gap-3 rounded-2xl p-3"
            >
              <span
                className="flex size-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">
                  {lang === 'ar' ? meta.ar : meta.en}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {t.notes}
                </div>
              </div>
              <div className="text-end">
                <div className="font-bold" style={{ color: meta.color }}>
                  {t.amount.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground">{t.date}</div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  t.status === 'pending'
                    ? 'bg-[#ff9500]/15 text-[#ff9500]'
                    : 'bg-green-500/15 text-green-500'
                }`}
              >
                {t.status === 'pending'
                  ? lang === 'ar'
                    ? 'معلّق'
                    : 'Pending'
                  : lang === 'ar'
                    ? 'مكتمل'
                    : 'Done'}
              </span>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {lang === 'ar' ? 'لا توجد معاملات' : 'No transactions'}
          </p>
        )}
      </div>
    </section>
  )
}
