export type Role = 'admin' | 'investor' | 'partner'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type TxType = 'buy' | 'sell' | 'deposit' | 'withdraw' | 'distribution'
export type ProductStatus = 'active' | 'frozen' | 'completed'

export interface User {
  id: string
  name: string
  phone: string
  nationalId: string
  code: string
  password: string
  role: Role
  rank: string
  dept: string | null
  points: number
  shares: number
  wallet: number
  status: RequestStatus
  securityQuestion: string | null
  securityAnswer: string | null
  portfolioUrl: string | null
  portfolioFiles: string[]
  createdAt: string
}

export interface Service {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: string
  imageUrl: string
  videoUrl: string | null
  columns: { labelAr: string; labelEn: string; valueAr: string; valueEn: string }[]
  order: number
  active: boolean
}

export interface Project {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  progress: number
  investorsCount: number
  tag: string
  imageUrl: string
  active: boolean
}

export interface Share {
  id: string
  name: string
  price: number
  total: number
  available: number
  buyEnabled: boolean
  sellEnabled: boolean
  published: boolean
}

export interface FinancialProduct {
  id: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  returnRate: number
  minInvest: number
  status: ProductStatus
  active: boolean
}

export interface Transaction {
  id: string
  userId: string
  type: TxType
  amount: number
  date: string
  notes: string
  status?: RequestStatus
}

export interface Level {
  id: string
  nameAr: string
  nameEn: string
  minPoints: number
  requirementsAr: string
  requirementsEn: string
  color: string
  icon: string
}

export interface PromoCode {
  id: string
  code: string
  discount: number
  uses: number
  maxUses: number
  active: boolean
}

export interface Department {
  id: string
  code: string
  name: string
  capacity: number
  currentCount: number
  active: boolean
}

export interface SiteContent {
  welcomeAr: string
  welcomeEn: string
  heroTitleAr: string
  heroTitleEn: string
  heroSubAr: string
  heroSubEn: string
  clientPortalAr: string
  clientPortalEn: string
}

export interface InvestorRequest {
  id: string
  name: string
  phone: string
  nationalId: string
  portfolioUrl: string
  portfolioFiles: string[]
  securityQuestion: string
  status: RequestStatus
  code: string | null
  createdAt: string
}

export interface Task {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  rewardPoints: number
  deadline: string
  assignedTo: 'all' | string
  active: boolean
}

export interface TaskSubmission {
  id: string
  taskId: string
  partnerId: string
  partnerName: string
  submissionUrl: string
  submissionNote: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export interface ChatMessage {
  id: string
  fromId: string
  fromName: string
  fromRole: Role
  toId: string
  body: string
  createdAt: string
  read: boolean
}

export interface ContactLinks {
  telegramPartner: string
  telegramLanding: string
  whatsappPartner: string
  whatsappLanding: string
}

export interface PartnerRequest {
  id: string
  name: string
  phone: string
  nationalId: string
  departments: string[]
  portfolioUrl: string
  portfolioFiles: string[]
  securityQuestion: string
  status: RequestStatus
  code: string | null
  createdAt: string
}
export const SECURITY_QUESTIONS = [
  "ما هو اسم مدرستك الابتدائية؟",
  "ما هو اسم أول حيوان أليف امتلكته؟",
  "ما هي مدينة ميلادك؟",
  "ما هو اسم أفضل صديق لك في الطفولة؟",
]

export const DEPARTMENTS = [
  { code: "WEB", name: "تطوير الويب", category: "تقني" },
  { code: "CDR", name: "تطوير المحتوى", category: "إبداعي" },
  { code: "DMK", name: "التسويق الرقمي", category: "تسويق" },
  { code: "GRD", name: "الجرافيك والتصميم", category: "تصميم" },
  { code: "SMM", name: "إدارة السوشيال ميديا", category: "تسويق" },
  { code: "SEO", name: "تحسين محركات البحث", category: "تسويق" },
  { code: "SAL", name: "المبيعات", category: "تسويق" },
  { code: "OPS", name: "العمليات", category: "إدارة" },
]

export const RANK_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  iron:    { label: "حديد",  bg: "bg-gray-700",   text: "text-gray-400",   icon: "🛡️" },
  bronze:  { label: "برونز", bg: "bg-amber-900",  text: "text-amber-400",  icon: "⚡" },
  silver:  { label: "فضي",   bg: "bg-blue-900",   text: "text-blue-300",   icon: "⭐" },
  gold:    { label: "ذهبي",  bg: "bg-yellow-900", text: "text-yellow-400", icon: "🏆" },
  platinum:{ label: "بلاتين",bg: "bg-indigo-900", text: "text-indigo-400", icon: "💎" },
  royal:   { label: "ملكي",  bg: "bg-purple-900", text: "text-purple-400", icon: "👑" },
}

export type AppUser = User
export type UserRank = string
export interface Settings {
  id: string
  share_price_per_point: number
  points_per_share: number
  trading_enabled: boolean
  market_enabled: boolean
  min_withdrawal_points: number
  announcement: string | null
  updated_at: string
}
export interface Notification {
  id: string
  target_user_id: string | null
  title: string
  description: string | null
  is_read: boolean
  target_all: boolean
  created_at: string
}