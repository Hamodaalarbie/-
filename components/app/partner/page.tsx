'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import {
  LayoutGrid,
  ListChecks,
  History,
  TrendingUp,
  MessageSquare,
  Trophy,
  Coins,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Target,
} from 'lucide-react'
import { useStore } from '@/components/providers'
import { DashboardShell } from '@/components/dashboard/shell'
import { ShareCard } from '@/components/share-card'
import { Modal } from '@/components/modal'

type Tab = 'overview' | 'tasks' | 'submissions' | 'shares' | 'chat'

export default function PartnerDashboard() {
  const {
    lang,
    user,
    tasks,
    submissions,
    levels,
    shares,
    messages,
    submitTask,
    sendMessage,
  } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const ar = lang === 'ar'

  const tabs: { id: Tab; labelAr: string; labelEn: string; icon: typeof LayoutGrid }[] =
    [
      { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: LayoutGrid },
      { id: 'tasks', labelAr: 'المهام', labelEn: 'Tasks', icon: ListChecks },
      { id: 'submissions', labelAr: 'تسليماتي', labelEn: 'Submissions', icon: History },
      { id: 'shares', labelAr: 'الأسهم', labelEn: 'Shares', icon: TrendingUp },
      { id: 'chat', labelAr: 'المحادثة', labelEn: 'Chat', icon: MessageSquare },
    ]

  if (!user) return null

  const myPoints = user.points
  const currentLevel = useMemo(() => {
    const sorted = [...levels].sort((a, b) => b.minPoints - a.minPoints)
    return sorted.find((l) => myPoints >= l.minPoints) ?? levels[0]
  }, [levels, myPoints])
  const nextLevel = useMemo(() => {
    const sorted = [...levels].sort((a, b) => a.minPoints - b.minPoints)
    return sorted.find((l) => l.minPoints > myPoints) ?? null
  }, [levels, myPoints])

  const mySubmissions = submissions.filter((s) => s.partnerId === user.id)
  const myDeptTasks = tasks.filter(
    (t) => t.active && (t.assignedTo === 'all' || t.assignedTo === user.dept),
  )

  return (
    <DashboardShell requiredRole="partner">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {ar ? `أهلاً ${user.name}` : `Welcome ${user.name}`}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ar
            ? `${user.rank} • قسم ${user.dept ?? '-'}`
            : `${user.rank} • Dept ${user.dept ?? '-'}`}
        </p>
      </div>

      {/* Tabs */}
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

      {tab === 'overview' && (
        <OverviewTab
          ar={ar}
          points={myPoints}
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          rank={user.rank}
          subsCount={mySubmissions.length}
          approvedCount={mySubmissions.filter((s) => s.status === 'approved').length}
          levels={levels}
        />
      )}
      {tab === 'tasks' && (
        <TasksTab ar={ar} tasks={myDeptTasks} onSubmit={submitTask} subs={mySubmissions} />
      )}
      {tab === 'submissions' && <SubmissionsTab ar={ar} subs={mySubmissions} tasks={tasks} />}
      {tab === 'shares' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shares
            .filter((s) => s.published)
            .map((s) => (
              <ShareCard key={s.id} share={s} />
            ))}
        </div>
      )}
      {tab === 'chat' && (
        <ChatTab
          ar={ar}
          messages={messages}
          userId={user.id}
          onSend={(body) => sendMessage('admin', body)}
        />
      )}
    </DashboardShell>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Coins
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

function OverviewTab({
  ar,
  points,
  currentLevel,
  nextLevel,
  rank,
  subsCount,
  approvedCount,
  levels,
}: {
  ar: boolean
  points: number
  currentLevel: any
  nextLevel: any
  rank: string
  subsCount: number
  approvedCount: number
  levels: any[]
}) {
  const progress = nextLevel
    ? Math.min(
        100,
        ((points - currentLevel.minPoints) /
          (nextLevel.minPoints - currentLevel.minPoints)) *
          100,
      )
    : 100

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Coins}
          label={ar ? 'النقاط' : 'Points'}
          value={points.toLocaleString()}
          accent="#00c6ff"
        />
        <StatCard
          icon={Trophy}
          label={ar ? 'المستوى' : 'Level'}
          value={ar ? currentLevel.nameAr : currentLevel.nameEn}
          accent={currentLevel.color}
        />
        <StatCard
          icon={Award}
          label={ar ? 'الرتبة' : 'Rank'}
          value={rank}
          accent="#1e90ff"
        />
        <StatCard
          icon={CheckCircle2}
          label={ar ? 'مهام مقبولة' : 'Approved'}
          value={`${approvedCount}/${subsCount}`}
          accent="#22c55e"
        />
      </div>

      {/* Level progress */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">{ar ? 'تقدم المستوى' : 'Level Progress'}</h3>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: `${currentLevel.color}1a`, color: currentLevel.color }}
          >
            {ar ? currentLevel.nameAr : currentLevel.nameEn}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${currentLevel.color}, #00c6ff)`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {nextLevel
            ? ar
              ? `${nextLevel.minPoints - points} نقطة للوصول إلى ${nextLevel.nameAr}`
              : `${nextLevel.minPoints - points} points to reach ${nextLevel.nameEn}`
            : ar
              ? 'وصلت إلى أعلى مستوى!'
              : 'You reached the top level!'}
        </p>
      </div>

      {/* Levels ladder */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h3 className="mb-4 font-bold">{ar ? 'سلم المستويات' : 'Levels Ladder'}</h3>
        <div className="space-y-3">
          {[...levels]
            .sort((a, b) => a.minPoints - b.minPoints)
            .map((l) => {
              const reached = points >= l.minPoints
              return (
                <div
                  key={l.id}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${
                    reached
                      ? 'border-[#1e90ff]/40 bg-[#1e90ff]/5'
                      : 'border-border/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                      style={{ background: `${l.color}1a`, color: l.color }}
                    >
                      {reached ? <CheckCircle2 className="size-4" /> : <Target className="size-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{ar ? l.nameAr : l.nameEn}</p>
                      <p className="text-xs text-muted-foreground">
                        {ar ? l.requirementsAr : l.requirementsEn}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {l.minPoints.toLocaleString()}
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

function TasksTab({
  ar,
  tasks,
  onSubmit,
  subs,
}: {
  ar: boolean
  tasks: any[]
  onSubmit: (taskId: string, url: string, note: string) => void
  subs: any[]
}) {
  const [active, setActive] = useState<any | null>(null)
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')

  function submit() {
    if (!active) return
    onSubmit(active.id, url, note)
    setActive(null)
    setUrl('')
    setNote('')
  }

  if (tasks.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
        {ar ? 'لا توجد مهام متاحة حالياً' : 'No tasks available right now'}
      </div>
    )

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map((t) => {
          const submitted = subs.find((s) => s.taskId === t.id)
          return (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-bold">{ar ? t.titleAr : t.titleEn}</h3>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#00c6ff]/10 px-2.5 py-1 text-xs font-bold text-[#00c6ff]">
                  <Coins className="size-3" />
                  {t.rewardPoints}
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {ar ? t.descAr : t.descEn}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {t.deadline}
                </span>
                {submitted ? (
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      submitted.status === 'approved'
                        ? 'bg-[#22c55e]/10 text-[#22c55e]'
                        : submitted.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {submitted.status === 'approved'
                      ? ar
                        ? 'مقبولة'
                        : 'Approved'
                      : submitted.status === 'rejected'
                        ? ar
                          ? 'مرفوضة'
                          : 'Rejected'
                        : ar
                          ? 'قيد المراجعة'
                          : 'Pending'}
                  </span>
                ) : (
                  <button
                    onClick={() => setActive(t)}
                    className="rounded-lg bg-gradient-to-r from-[#1e90ff] to-[#00c6ff] px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    {ar ? 'تسليم' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={ar ? 'تسليم المهمة' : 'Submit Task'}
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold">{active && (ar ? active.titleAr : active.titleEn)}</p>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {ar ? 'رابط التسليم' : 'Submission URL'}
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#1e90ff]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {ar ? 'ملاحظة' : 'Note'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#1e90ff]"
            />
          </div>
          <button
            onClick={submit}
            disabled={!url}
            className="w-full rounded-xl bg-gradient-to-r from-[#1e90ff] to-[#00c6ff] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {ar ? 'إرسال التسليم' : 'Send Submission'}
          </button>
        </div>
      </Modal>
    </>
  )
}

function SubmissionsTab({ ar, subs, tasks }: { ar: boolean; subs: any[]; tasks: any[] }) {
  if (subs.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
        {ar ? 'لم تقم بأي تسليمات بعد' : 'No submissions yet'}
      </div>
    )
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border/60 bg-secondary/50 text-muted-foreground">
          <tr>
            <th className="p-3 text-start font-semibold">{ar ? 'المهمة' : 'Task'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'التاريخ' : 'Date'}</th>
            <th className="p-3 text-start font-semibold">{ar ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => {
            const task = tasks.find((t) => t.id === s.taskId)
            return (
              <tr key={s.id} className="border-b border-border/40 last:border-0">
                <td className="p-3 font-medium">
                  {task ? (ar ? task.titleAr : task.titleEn) : s.taskId}
                </td>
                <td className="p-3 text-muted-foreground">{s.submittedAt}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.status === 'approved'
                        ? 'bg-[#22c55e]/10 text-[#22c55e]'
                        : s.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {s.status === 'approved' ? (
                      <CheckCircle2 className="size-3" />
                    ) : s.status === 'rejected' ? (
                      <XCircle className="size-3" />
                    ) : (
                      <Clock className="size-3" />
                    )}
                    {s.status === 'approved'
                      ? ar
                        ? 'مقبولة'
                        : 'Approved'
                      : s.status === 'rejected'
                        ? ar
                          ? 'مرفوضة'
                          : 'Rejected'
                        : ar
                          ? 'قيد المراجعة'
                          : 'Pending'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ChatTab({
  ar,
  messages,
  userId,
  onSend,
}: {
  ar: boolean
  messages: any[]
  userId: string
  onSend: (body: string) => void
}) {
  const [text, setText] = useState('')
  const thread = messages.filter(
    (m) =>
      (m.fromId === userId && m.toId === 'admin') ||
      (m.fromId === 'admin' && m.toId === userId),
  )

  function send() {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-2xl border border-border/60 bg-card">
      <div className="border-b border-border/60 p-4">
        <p className="font-bold">{ar ? 'المحادثة مع الإدارة' : 'Chat with Admin'}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {thread.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {ar ? 'ابدأ المحادثة مع الإدارة' : 'Start a conversation with admin'}
          </p>
        )}
        {thread.map((m) => {
          const mine = m.fromId === userId
          return (
            <div
              key={m.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
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
  )
}
