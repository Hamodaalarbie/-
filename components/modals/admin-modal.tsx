'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/modal'
import { useStore } from '@/components/providers'

export function AdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, loginAdmin } = useStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (loginAdmin(email.trim(), password)) {
      onClose()
      router.push('/admin')
    } else {
      setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid credentials.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      scheme="admin"
      title={lang === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
    >
      <div className="mb-4 flex items-center gap-2 text-[#e91e8c]">
        <Shield className="size-5" />
        <span className="text-sm font-semibold">
          {lang === 'ar' ? 'منطقة محمية للإدارة' : 'Protected admin area'}
        </span>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute right-3 top-3 size-5 text-muted-foreground" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            className="w-full rounded-xl border border-border bg-secondary/50 py-3 pe-10 ps-4 outline-none focus:border-[#e91e8c]"
          />
        </div>
        <div className="relative">
          <Lock className="absolute right-3 top-3 size-5 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
            className="w-full rounded-xl border border-border bg-secondary/50 py-3 pe-10 ps-4 outline-none focus:border-[#e91e8c]"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-gradient-pink py-3 font-bold text-white transition hover:opacity-90"
        >
          {lang === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          {lang === 'ar' ? 'تجربة: أي بريد / admin123' : 'Demo: any email / admin123'}
        </p>
      </div>
    </Modal>
  )
}