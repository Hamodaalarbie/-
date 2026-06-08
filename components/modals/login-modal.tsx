'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, Lock, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/modal'
import { useStore } from '@/components/providers'

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, login } = useStore()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    const u = login(code.trim(), password)
    if (u) {
      onClose()
      router.push(u.role === 'partner' ? '/partner' : '/dashboard')
    } else {
      setError(
        lang === 'ar'
          ? 'الكود أو كلمة المرور غير صحيحة، أو الحساب غير مفعّل.'
          : 'Invalid code or password, or account not approved.',
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      scheme="investor"
      title={lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
    >
      <p className="mb-4 text-sm text-muted-foreground">
        {lang === 'ar'
          ? 'أدخل الكود الخاص بك وكلمة المرور للوصول إلى لوحة التحكم.'
          : 'Enter your code and password to access your dashboard.'}
      </p>
      <div className="space-y-3">
        <div className="relative">
          <KeyRound className="absolute right-3 top-3 size-5 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={lang === 'ar' ? 'الكود (مثال: INV-1001)' : 'Code (e.g. INV-1001)'}
            className="w-full rounded-xl border border-border bg-secondary/50 py-3 pe-10 ps-4 outline-none focus:border-[#1e90ff]"
          />
        </div>
        <div className="relative">
          <Lock className="absolute right-3 top-3 size-5 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
            className="w-full rounded-xl border border-border bg-secondary/50 py-3 pe-10 ps-4 outline-none focus:border-[#1e90ff]"
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
          className="w-full rounded-xl bg-gradient-wave py-3 font-bold text-white transition hover:opacity-90"
        >
          {lang === 'ar' ? 'دخول' : 'Login'}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          {lang === 'ar'
            ? 'تجربة: INV-1001 / 123456 (مستثمر) — PRT-2002 / 123456 (شريك)'
            : 'Demo: INV-1001 / 123456 (investor) — PRT-2002 / 123456 (partner)'}
        </p>
      </div>
    </Modal>
  )
}