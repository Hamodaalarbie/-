export type UserRole = "partner" | "admin" | "investor"
export type UserRank = "iron" | "bronze" | "silver" | "gold" | "diamond" | "royal"
export type TaskStatus = "Pending" | "Approved" | "Rejected"
export type ProjectStatus = "active" | "scaling" | "closed"
export type RequestType = "Task" | "Withdrawal" | "Project" | "ShareSale" | "SharePurchase" | "RankUpgrade"
export type ListingType = "sell_to_company" | "sell_to_investor" | "advertise"

export interface AppUser {
  id: string
  name: string
  phone: string
  code: string
  password: string
  role: UserRole
  dept: string | null
  rank: UserRank
  points: number
  shares: number
  security_question: string | null
  security_answer: string | null
  created_at: string
}

export interface Task {
  id: string
  title: string
  dept: string
  brief: string | null
  full_report: string | null
  conditions: string | null
  reward_points: number
  count: number
  limit: number
  file_url: string | null
  external_link: string | null
  created_at: string
}

export interface Project {
  id: string
  title_ar: string
  title_en: string
  description: string | null
  profit_target: string | null
  member_count: number
  status: ProjectStatus
  required_depts: string[] | null
  roadmap: RoadmapPhase[] | null
  cover_image: string | null
  progress: number
  category: string | null
  total_shares: number
  available_shares: number
  share_price_egp: number
  created_at: string
}

export interface RoadmapPhase {
  phase: string
  status: "done" | "in_progress" | "pending"
}

export interface PendingRequest {
  id: string
  user_id: string
  type: RequestType
  points_amount: number | null
  method: string | null
  wallet_details: string | null
  submission_link: string | null
  report_text: string | null
  reward_points: number | null
  task_title: string | null
  task_id: string | null
  project_id: string | null
  status: TaskStatus
  created_at: string
  users?: AppUser
  tasks?: Task
  projects?: Project
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

export interface PromoCode {
  id: string
  code: string
  points_value: number
  max_uses: number
  used_count: number
  created_at: string
}

export interface ShareListing {
  id: string
  seller_id: string
  project_id: string
  shares_count: number
  price_per_share: number
  listing_type: ListingType
  status: "active" | "sold" | "cancelled"
  created_at: string
  users?: AppUser
  projects?: Project
}

export interface Meeting {
  id: string
  title: string
  description: string | null
  date_time: string | null
  attendees: string[] | null
  status: "scheduled" | "done" | "cancelled"
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  content: string | null
  image_url: string | null
  published_at: string | null
  is_published: boolean
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string | null
  action: string
  details: string | null
  created_at: string
  users?: AppUser
}

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

export interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  date: string
  status: string
  note: string | null
}

export const DEPARTMENTS: { code: string; name: string; category: string }[] = [
  { code: "GEN", name: "إدارة عامة", category: "إدارة" },
  { code: "CTO", name: "التقنية والابتكار", category: "تقني" },
  { code: "FSD", name: "تطوير كامل المكدس", category: "تقني" },
  { code: "WEB", name: "تطوير الويب", category: "تقني" },
  { code: "ECM", name: "التجارة الإلكترونية", category: "تقني" },
  { code: "OPS", name: "العمليات", category: "إدارة" },
  { code: "ARC", name: "الهندسة المعمارية", category: "تقني" },
  { code: "CDR", name: "تطوير المحتوى", category: "إبداعي" },
  { code: "UIX", name: "تجربة المستخدم", category: "تصميم" },
  { code: "GRD", name: "الجرافيك والتصميم", category: "تصميم" },
  { code: "WDS", name: "تصميم المواقع", category: "تصميم" },
  { code: "BVI", name: "هوية العلامة", category: "تصميم" },
  { code: "MOT", name: "الموشن جرافيك", category: "تصميم" },
  { code: "DMK", name: "التسويق الرقمي", category: "تسويق" },
  { code: "SEO", name: "تحسين محركات البحث", category: "تسويق" },
  { code: "CNT", name: "كتابة المحتوى", category: "تسويق" },
  { code: "SMM", name: "إدارة السوشيال ميديا", category: "تسويق" },
  { code: "SAL", name: "المبيعات", category: "تسويق" },
  { code: "CRM", name: "علاقات العملاء", category: "إدارة" },
  { code: "PJM", name: "إدارة المشاريع", category: "إدارة" },
  { code: "PDS", name: "تطوير المنتج", category: "إدارة" },
  { code: "SUP", name: "الدعم الفني", category: "إدارة" },
  { code: "TSP", name: "الترجمة والتعريب", category: "إبداعي" },
  { code: "CSV", name: "خدمة المجتمع", category: "إبداعي" },
]

export const RANK_CONFIG: Record<UserRank, { label: string; bg: string; text: string; icon: string }> = {
  iron:    { label: "حديد",  bg: "bg-gray-700",    text: "text-gray-400",   icon: "🛡️" },
  bronze:  { label: "برونز", bg: "bg-amber-900",   text: "text-amber-400",  icon: "⚡" },
  silver:  { label: "فضي",   bg: "bg-blue-900",    text: "text-blue-300",   icon: "⭐" },
  gold:    { label: "ذهبي",  bg: "bg-yellow-900",  text: "text-yellow-400", icon: "🏆" },
  diamond: { label: "ماسي",  bg: "bg-indigo-900",  text: "text-indigo-400", icon: "💎" },
  royal:   { label: "ملكي",  bg: "bg-purple-900",  text: "text-purple-400", icon: "👑" },
}

export const SECURITY_QUESTIONS = [
  "ما هو اسم مدرستك الابتدائية؟",
  "ما هو اسم أول حيوان أليف امتلكته؟",
  "ما هي مدينة ميلادك؟",
  "ما هو اسم أفضل صديق لك في الطفولة؟",
]
