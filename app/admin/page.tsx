'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  LayoutGrid,
  UserCheck,
  Users,
  TrendingUp,
  ClipboardCheck,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Send,
  Coins,
  Wallet,
  Briefcase,
} from 'lucide-react'
import { useStore } from '@/components/providers'
import { DashboardShell } from '@/components/dashboard/shell'

type Tab =
  | 'overview'
  | 'requests'
  | 'users'
  | 'shares'
  | 'submissions'
  | 'chat'

export default function AdminDashboard() {
  const store = useStore()
  const { lang } = store
  const ar = lang === 'ar'
  const [tab, setTab] = useState<Tab>('overview')

  const tabs: { id: Tab; labelAr: string; labelEn: string; icon: typeof LayoutGrid }[] =
    [
      { id: 'overview', labelAr: 'لوحة القيادة', labelEn: 'Overview', icon: LayoutGrid },
      { id: 'requests', labelAr: 'الطلبات', labelEn: 'Requests', icon: UserCheck },
      { id: 'users', labelAr: 'الأعضاء', labelEn: 'Members', icon: Users },
      { id: 'shares', labelAr: 'الأسهم', labelEn: 'Shares', icon: TrendingUp },
      { id: 'submissions', labelAr: 'تسليمات المهام', labelEn: 'Submissions', icon: ClipboardCheck },
      { id: 'chat', labelAr: 'المحادثات', labelEn: 'Chat', icon: MessageSquare },
    ]

  return (
    <DashboardShell requiredRole="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {ar ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ar ? 'إدارة المنصة بالكامل' : 'Manage the entire platform'}
        </p>
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-border/60 bg-card/50 p-1.5">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00c6ff] text-white shadow-lg shadow-[#1e90ff]/25'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              {ar ? t.labelAr : t.labelEn}
            </button>
          )
        })}
      </div>

      {tab === 'overview' && <OverviewTab ar={ar} store={store} />}
      {tab === 'requests' && <RequestsTab ar={ar} store={store} />}
      {tab === 'users' && <UsersTab ar={ar} store={store} />}
      {tab === 'shares' && <SharesTab ar={ar} store={store} />}
      {tab === 'submissions' && <SubmissionsTab ar={ar} store={store} />}
      {tab === 'chat' && <ChatTab ar={ar} store={store} />}
    </DashboardShell>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex size-11 items-center justify-center rounded-xl"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ ar, store }: { ar: boolean; store: any }) {
  const pendingReqs =
    store.requests.filter((r: any) => r.status === 'pending').length +
    store.partnerRequests.filter((r: any) => r.status === 'pending').length
  const pendingSubs = store.submissions.filter((s: any) => s.status === 'pending').length
  const totalWallet = store.users.reduce((sum: number, u: any) => sum + u.wallet, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label={ar ? 'إجمالي الأعضاء' : 'Total Members'}
          value={String(store.users.length)}
          accent="#1e90ff"
        />
        <StatCard
          icon={UserCheck}
          label={ar ? 'طلبات معلقة' : 'Pending Requests'}
          value={String(pendingReqs)}
          accent="#ff9500"
        />
        <StatCard
          icon={ClipboardCheck}
          label={ar ? 'تسليمات معلقة' : 'Pending Submissions'}
          value={String(pendingSubs)}
          accent="#00c6ff"
        />
        <StatCard
          icon={Wallet}
          label={ar ? 'إجمالي المحافظ' : 'Total Wallets'}
          value={`${(totalWallet / 1000).toFixed(0)}k`}
          accent="#22c55e"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="mb-4 font-bold">{ar ? 'الأسهم المنشورة' : 'Published Shares'}</h3>
          <div className="space-y-3">
            {store.shares.map((s: any) => {
              const soldPct = Math.round(((s.total - s.available) / s.total) * 100)
              return (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-muted-foreground">{soldPct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1e90ff] to-[#00c6ff]"
                      style={{ width: `${soldPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="mb-4 font-bold">{ar ? 'الأقسام' : 'Departments'}</h3>
          <div className="space-y-3">
            {store.departments.map((d: any) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-border/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4 text-[#1e90ff]" />
                  <span className="text-sm font-semibold">{d.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {d.currentCount}/{d.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeReveal({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#22c55e]/10 px-2.5 py-1 text-xs font-bold text-[#22c55e]"
    >
      {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
      {code}
    </button>
  )
}

function RequestsTab({ ar, store }: { ar: boolean; store: any }) {
  const [tab, setTab] = useState<'investor' | 'partner'>('investor')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('investor')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === 'investor'
              ? 'bg-[#1e90ff] text-white'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          {ar ? 'طلبات المستثمرين' : 'Investor Requests'}
        </button>
        <button
          onClick={() => setTab('partner')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === 'partner'
              ? 'bg-[#1e90ff] text-white'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          {ar ? 'طلبات الشركاء' : 'Partner Requests'}
        </button>
      </div>

      <div className="space-y-3">
        {(tab === 'investor' ? store.requests : store.partnerRequests).map((r: any) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold">{r.name}</p>
                {r.status === 'approved' && r.code && <CodeReveal code={r.code} />}
              </div>
              <p className="text-sm text-muted-foreground">
                {r.phone} • {r.nationalId}
              </p>
              {tab === 'partner' && r.departments && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {r.departments.map((d: string) => (
                    <span
                      key={d}
                      className="rounded-md bg-[#1e90ff]/10 px-2 py-0.5 text-xs text-[#1e90ff]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {r.status === 'pending' ? (
                <>
                  <button
                    onClick={() =>
                      tab === 'investor'
                        ? store.approveRequest(r.id)
                        : store.approvePartnerRequest(r.id)
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white"
                  >
                    <CheckCircle2 className="size-4" />
                    {ar ? 'قبول' : 'Approve'}
                  </button>
                  <button
                    onClick={() =>
                      tab === 'investor'
                        ? store.rejectRequest(r.id)
                        : store.rejectPartnerRequest(r.id)
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive"
                  >
                    <XCircle className="size-4" />
                    {ar ? 'رفض' : 'Reject'}
                  </button>
                </>
              ) : (
                <span
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    r.status === 'approved'
                      ? 'bg-[#22c55e]/10 text-[#22c55e]'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {r.status === 'approved'
                    ? ar
                      ? 'مقبول'
                      : 'Approved'
                    : ar
                      ? 'مرفوض'
                      : 'Rejected'}
                </span>
              )}
            </div>
          </div>
        ))}
        {(tab === 'investor' ? store.requests : store.partnerRequests).length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            {ar ? 'لا توجد طلبات' : 'No requests'}
          </div>
        )}
      </div>
    </div>
  )
}

function UsersTab({ ar, store }: { ar: boolean; store: any }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border/60 bg-secondary/50 text-muted-foreground">
          <tr>
            <th className="p-3 text-start font-semibold">{ar ? 'الاسم' : 'Name'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'الكود' : 'Code'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'الدور' : 'Role'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'النقاط' : 'Points'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'الأسهم' : 'Shares'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'المحفظة' : 'Wallet'}</th>
          </tr>
        </thead>
        <tbody>
          {store.users.map((u: any) => (
            <tr key={u.id} className="border-b border-border/40 last:border-0">
              <td className="p-3 font-medium">{u.name}</td>
              <td className="p-3">
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs">
                  {u.code}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    u.role === 'investor'
                      ? 'bg-[#1e90ff]/10 text-[#1e90ff]'
                      : 'bg-[#00c6ff]/10 text-[#00c6ff]'
                  }`}
                >
                  {u.role === 'investor'
                    ? ar
                      ? 'مستثمر'
                      : 'Investor'
                    : ar
                      ? 'شريك'
                      : 'Partner'}
                </span>
              </td>
              <td className="p-3 font-semibold">{u.points.toLocaleString()}</td>
              <td className="p-3">{u.shares}</td>
              <td className="p-3">{u.wallet.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SharesTab({ ar, store }: { ar: boolean; store: any }) {
  function toggle(id: string, key: 'buyEnabled' | 'sellEnabled' | 'published') {
    store.setShares(
      store.shares.map((s: any) => (s.id === id ? { ...s, [key]: !s[key] } : s)),
    )
  }

  return (
    <div className="space-y-3">
      {store.shares.map((s: any) => {
        const soldPct = Math.round(((s.total - s.available) / s.total) * 100)
        return (
          <div
            key={s.id}
            className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold">{s.name}</p>
              <p className="text-sm text-muted-foreground">
                {s.price.toLocaleString()} {ar ? 'ج.م' : 'EGP'} • {s.available}/{s.total}{' '}
                {ar ? 'متاح' : 'available'} • {soldPct}% {ar ? 'مُباع' : 'sold'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Toggle
                on={s.published}
                onClick={() => toggle(s.id, 'published')}
                label={ar ? 'منشور' : 'Published'}
              />
              <Toggle
                on={s.buyEnabled}
                onClick={() => toggle(s.id, 'buyEnabled')}
                label={ar ? 'شراء' : 'Buy'}
              />
              <Toggle
                on={s.sellEnabled}
                onClick={() => toggle(s.id, 'sellEnabled')}
                label={ar ? 'بيع' : 'Sell'}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
        on
          ? 'bg-[#22c55e]/15 text-[#22c55e]'
          : 'bg-secondary text-muted-foreground'
      }`}
    >
      <span
        className={`size-2 rounded-full ${on ? 'bg-[#22c55e]' : 'bg-muted-foreground'}`}
      />
      {label}
    </button>
  )
}

function SubmissionsTab({ ar, store }: { ar: boolean; store: any }) {
  return (
    <div className="space-y-3">
      {store.submissions.map((sub: any) => {
        const task = store.tasks.find((t: any) => t.id === sub.taskId)
        return (
          <div
            key={sub.id}
            className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-bold">{sub.partnerName}</p>
              <p className="text-sm text-muted-foreground">
                {task ? (ar ? task.titleAr : task.titleEn) : sub.taskId} •{' '}
                <span className="inline-flex items-center gap-1 text-[#00c6ff]">
                  <Coins className="size-3" />
                  {task?.rewardPoints ?? 0}
                </span>
              </p>
              {sub.submissionUrl && (
                <a
                  href={sub.submissionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#1e90ff] underline"
                >
                  {sub.submissionUrl}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              {sub.status === 'pending' ? (
                <>
                  <button
                    onClick={() => store.approveTask(sub.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white"
                  >
                    <CheckCircle2 className="size-4" />
                    {ar ? 'قبول' : 'Approve'}
                  </button>
                  <button
                    onClick={() => store.rejectTask(sub.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive"
                  >
                    <XCircle className="size-4" />
                    {ar ? 'رفض' : 'Reject'}
                  </button>
                </>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    sub.status === 'approved'
                      ? 'bg-[#22c55e]/10 text-[#22c55e]'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {sub.status === 'approved' ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  {sub.status === 'approved'
                    ? ar
                      ? 'مقبول'
                      : 'Approved'
                    : ar
                      ? 'مرفوض'
                      : 'Rejected'}
                </span>
              )}
            </div>
          </div>
        )
      })}
      {store.submissions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
          {ar ? 'لا توجد تسليمات' : 'No submissions'}
        </div>
      )}
    </div>
  )
}

function ChatTab({ ar, store }: { ar: boolean; store: any }) {
  const partners = store.users.filter((u: any) => u.role === 'partner')
  const [activeId, setActiveId] = useState<string>(partners[0]?.id ?? '')
  const [text, setText] = useState('')

  const thread = store.messages.filter(
    (m: any) =>
      (m.fromId === activeId && m.toId === 'admin') ||
      (m.fromId === 'admin' && m.toId === activeId),
  )

  function send() {
    if (!text.trim() || !activeId) return
    store.sendMessage(activeId, text.trim())
    setText('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div className="rounded-2xl border border-border/60 bg-card p-2">
        {partners.map((p: any) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`flex w-full items-center gap-3 rounded-xl p-3 text-start transition ${
              activeId activeId === p.id ? 'bg-[#1e90ff]/10' : 'hover:bg-secondary'
              }`}
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1e90ff] to-[#00c6ff] text-sm font-bold text-white">
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.code}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex h-[28rem] flex-col rounded-2xl border border-border/60 bg-card">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {thread.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {ar ? 'لا توجد رسائل' : 'No messages yet'}
              </p>
            )}
            {thread.map((m: any) => {
              const mine = m.fromId === 'admin'
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      mine
                        ? 'bg-gradient-to-r from-[#1e90ff] to-[#00c6ff] text-white'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {m.body}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 border-t border-border/60 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={ar ? 'اكتب رسالة...' : 'Type a message...'}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#1e90ff]"
            />
            <button
              onClick={send}
              className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#1e90ff] to-[#00c6ff] text-white"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }