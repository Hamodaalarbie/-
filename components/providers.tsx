'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  Role,
  User,
  Service,
  Project,
  Share,
  FinancialProduct,
  Transaction,
  Level,
  PromoCode,
  Department,
  SiteContent,
  InvestorRequest,
  Task,
  TaskSubmission,
  ChatMessage,
  ContactLinks,
  PartnerRequest,
} from '@/lib/types'
import {
  seedUsers,
  seedServices,
  seedProjects,
  seedShares,
  seedProducts,
  seedTransactions,
  seedLevels,
  seedPromoCodes,
  seedDepartments,
  seedContent,
  seedRequests,
  seedTasks,
  seedSubmissions,
  seedMessages,
  seedContactLinks,
  seedPartnerRequests,
} from '@/lib/mock-data'

type Lang = 'ar' | 'en'
type Theme = 'dark' | 'light'

interface StoreValue {
  lang: Lang
  theme: Theme
  user: User | null
  users: User[]
  services: Service[]
  projects: Project[]
  shares: Share[]
  products: FinancialProduct[]
  transactions: Transaction[]
  levels: Level[]
  promoCodes: PromoCode[]
  departments: Department[]
  content: SiteContent
  requests: InvestorRequest[]
  tasks: Task[]
  submissions: TaskSubmission[]
  messages: ChatMessage[]
  contactLinks: ContactLinks
  partnerRequests: PartnerRequest[]
  toggleLang: () => void
  toggleTheme: () => void
  login: (code: string, password: string) => User | null
  loginAdmin: (email: string, password: string) => boolean
  logout: () => void
  setServices: (s: Service[]) => void
  setProjects: (p: Project[]) => void
  setShares: (s: Share[]) => void
  setProducts: (p: FinancialProduct[]) => void
  setLevels: (l: Level[]) => void
  setPromoCodes: (p: PromoCode[]) => void
  setDepartments: (d: Department[]) => void
  setContent: (c: SiteContent) => void
  submitInvestorRequest: (
    r: Omit<InvestorRequest, 'id' | 'status' | 'code' | 'createdAt'>,
  ) => void
  approveRequest: (id: string) => string
  rejectRequest: (id: string) => void
  buyShare: (shareId: string, qty: number) => void
  sellShare: (shareId: string, qty: number) => void
  addTransaction: (type: Transaction['type'], amount: number, notes: string) => void
  submitTask: (taskId: string, url: string, note: string) => void
  sendMessage: (toId: string, body: string) => void
  approveTask: (submissionId: string) => void
  rejectTask: (submissionId: string) => void
  setTasks: (t: Task[]) => void
  updateContactLinks: (links: Partial<ContactLinks>) => void
  submitPartnerRequest: (
    r: Omit<PartnerRequest, 'id' | 'status' | 'code' | 'createdAt'>,
  ) => void
  approvePartnerRequest: (id: string) => string
  rejectPartnerRequest: (id: string) => void
  genCode: (prefix: string) => string
}

const StoreContext = createContext<StoreValue | null>(null)

function genCode(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar')
  const [theme, setThemeState] = useState<Theme>('dark')
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [services, setServices] = useState<Service[]>(seedServices)
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [shares, setShares] = useState<Share[]>(seedShares)
  const [products, setProducts] = useState<FinancialProduct[]>(seedProducts)
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions)
  const [levels, setLevels] = useState<Level[]>(seedLevels)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(seedPromoCodes)
  const [departments, setDepartments] = useState<Department[]>(seedDepartments)
  const [content, setContent] = useState<SiteContent>(seedContent)
  const [requests, setRequests] = useState<InvestorRequest[]>(seedRequests)
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(seedSubmissions)
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages)
  const [contactLinks, setContactLinks] = useState<ContactLinks>(seedContactLinks)
  const [partnerRequests, setPartnerRequests] =
    useState<PartnerRequest[]>(seedPartnerRequests)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', lang)
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])

  const toggleLang = useCallback(() => setLang((l) => (l === 'ar' ? 'en' : 'ar')), [])
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  const login = useCallback(
    (code: string, password: string) => {
      const found = users.find(
        (u) => u.code === code && u.password === password && u.status === 'approved',
      )
      if (found) {
        setUser(found)
        return found
      }
      return null
    },
    [users],
  )

  const loginAdmin = useCallback((email: string, password: string) => {
    if (email && password === 'admin123') {
      setUser({
        id: 'admin',
        name: 'مدير النظام',
        phone: '',
        nationalId: '',
        code: 'ADMIN',
        password: 'admin123',
        role: 'admin',
        rank: 'مدير',
        dept: null,
        points: 0,
        shares: 0,
        wallet: 0,
        status: 'approved',
        securityQuestion: null,
        securityAnswer: null,
        portfolioUrl: null,
        portfolioFiles: [],
        createdAt: new Date().toISOString(),
      })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const submitInvestorRequest = useCallback(
    (r: Omit<InvestorRequest, 'id' | 'status' | 'code' | 'createdAt'>) => {
      setRequests((prev) => [
        {
          ...r,
          id: `r${Date.now()}`,
          status: 'pending',
          code: null,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
    },
    [],
  )

  const approveRequest = useCallback((id: string) => {
    const code = genCode('INV')
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved', code } : r)),
    )
    return code
  }, [])

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)),
    )
  }, [])

  const submitPartnerRequest = useCallback(
    (r: Omit<PartnerRequest, 'id' | 'status' | 'code' | 'createdAt'>) => {
      setPartnerRequests((prev) => [
        {
          ...r,
          id: `pr${Date.now()}`,
          status: 'pending',
          code: null,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
    },
    [],
  )

  const approvePartnerRequest = useCallback((id: string) => {
    const code = genCode('PRT')
    setPartnerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved', code } : r)),
    )
    return code
  }, [])

  const rejectPartnerRequest = useCallback((id: string) => {
    setPartnerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)),
    )
  }, [])

  const buyShare = useCallback((shareId: string, qty: number) => {
    setShares((prev) =>
      prev.map((s) =>
        s.id === shareId
          ? { ...s, available: Math.max(0, s.available - qty) }
          : s,
      ),
    )
  }, [])

  const sellShare = useCallback((shareId: string, qty: number) => {
    setShares((prev) =>
      prev.map((s) =>
        s.id === shareId
          ? { ...s, available: Math.min(s.total, s.available + qty) }
          : s,
      ),
    )
  }, [])

  const addTransaction = useCallback(
    (type: Transaction['type'], amount: number, notes: string) => {
      setTransactions((prev) => [
        {
          id: `t${Date.now()}`,
          userId: user?.id ?? 'u1',
          type,
          amount,
          date: new Date().toISOString().slice(0, 10),
          notes,
          status: 'pending',
        },
        ...prev,
      ])
    },
    [user],
  )

  const submitTask = useCallback(
    (taskId: string, url: string, note: string) => {
      if (!user) return
      setSubmissions((prev) => [
        {
          id: `sub${Date.now()}`,
          taskId,
          partnerId: user.id,
          partnerName: user.name,
          submissionUrl: url,
          submissionNote: note,
          status: 'pending',
          submittedAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
    },
    [user],
  )

  const sendMessage = useCallback(
    (toId: string, body: string) => {
      if (!user) return
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now()}`,
          fromId: user.id,
          fromName: user.name,
          fromRole: user.role,
          toId,
          body,
          createdAt: new Date().toISOString(),
          read: false,
        },
      ])
    },
    [user],
  )

  const approveTask = useCallback(
    (submissionId: string) => {
      setSubmissions((prev) => {
        const sub = prev.find((s) => s.id === submissionId)
        if (sub) {
          const task = tasks.find((t) => t.id === sub.taskId)
          if (task) {
            setUsers((us) =>
              us.map((u) =>
                u.id === sub.partnerId
                  ? { ...u, points: u.points + task.rewardPoints }
                  : u,
              ),
            )
          }
        }
        return prev.map((s) =>
          s.id === submissionId ? { ...s, status: 'approved' } : s,
        )
      })
    },
    [tasks],
  )

  const rejectTask = useCallback((submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s)),
    )
  }, [])

  const updateContactLinks = useCallback((links: Partial<ContactLinks>) => {
    setContactLinks((prev) => ({ ...prev, ...links }))
  }, [])

  const value: StoreValue = {
    lang, theme, user, users, services, projects, shares, products,
    transactions, levels, promoCodes, departments, content, requests,
    tasks, submissions, messages, contactLinks, partnerRequests,
    toggleLang, toggleTheme, login, loginAdmin, logout,
    setServices, setProjects, setShares, setProducts, setLevels,
    setPromoCodes, setDepartments, setContent, submitInvestorRequest,
    approveRequest, rejectRequest, buyShare, sellShare, addTransaction,
    submitTask, sendMessage, approveTask, rejectTask, setTasks,
    updateContactLinks, submitPartnerRequest, approvePartnerRequest,
    rejectPartnerRequest, genCode,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within Providers')
  return ctx
}