'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Clock, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { Modal } from '@/components/modal'
import { useStore } from '@/components/providers'

const QUESTIONS = [
  'ما اسم مدينتك المفضلة؟',
  'ما اسم حيوانك الأليف الأول؟',
  'ما اسم أول شركة عملت بها؟',
  'ما طعامك المفضل؟',
]

export function PartnerRegistrationModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { lang, departments, submitPartnerRequest } = useStore()
  const [step, setStep] = useState(1)
  const [depts, setDepts] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    nationalId: '',
    portfolioUrl: '',
    portfolioFiles: '',
    portfolioDesc: '',
    password: '',
    securityQuestion: QUESTIONS[0],
    securityAnswer: '',
  })

  const activeDepts = departments.filter((d) => d.active)

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function toggleDept(name: string) {
    setDepts((prev) =>
      prev.includes(name)
        ? prev.filter((d) => d !== name)
        : prev.length < 4
          ? [...prev, name]
          : prev,
    )
  }

  function reset() {
    setStep(1)
    setDepts([])
    setForm({
      name: '',
      phone: '',
      nationalId: '',
      portfolioUrl: '',
      portfolioFiles: '',
      portfolioDesc: '',
      password: '',
      securityQuestion: QUESTIONS[0],
      securityAnswer: '',
    })
  }

  function submit() {
    submitPartnerRequest({
      name: form.name,
      phone: form.phone,
      nationalId: form.nationalId,
      departments: depts,
      portfolioUrl: form.portfolioUrl,
      portfolioFiles: form.portfolioFiles
        ? form.portfolioFiles.split(',').map((s) => s.trim())
        : [],
      securityQuestion: form.securityQuestion,
    })
    setStep(5)
  }

  function close() {
    onClose()
    setTimeout(reset, 300)
  }

  const inputCls =
    'w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 outline-none focus:border-[#1e90ff]'

  const canNext =
    (step === 1 && form.name && form.phone && form.nationalId) ||
    (step === 2 && depts.length === 4) ||
    step === 3 ||
    (step === 4 && form.password.length >= 6 && form.securityAnswer)

  return (
    <Modal
      open={open}
      onClose={close}
      scheme="investor"
      title={lang === 'ar' ? 'تسجيل شريك' : 'Partner Registration'}
    >
      {step < 5 && (
        <div className="mb-5 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? 'bg-gradient-wave' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <h3 className="font-bold">
            {lang === 'ar' ? 'البيانات الشخصية' : 'Personal Info'}
          </h3>
          <input
            className={inputCls}
            placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={lang === 'ar' ? 'الرقم القومي' : 'National ID'}
            value={form.nationalId}
            onChange={(e) => set('nationalId', e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h3 className="font-bold">
            {lang === 'ar' ? 'اختر 4 أقسام' : 'Choose 4 Departments'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'ar'
              ? `تم اختيار ${depts.length} من 4`
              : `${depts.length} of 4 selected`}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeDepts.map((d) => {
              const sel = depts.includes(d.name)
              return (
                <button
                  key={d.id}
                  onClick={() => toggleDept(d.name)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    sel
                      ? 'bg-gradient-wave text-white'
                      : 'border border-border bg-secondary/50 hover:border-[#1e90ff]/40'
                  }`}
                >
                  {d.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h3 className="font-bold">
            {lang === 'ar' ? 'ملف الأعمال' : 'Portfolio'}
          </h3>
          <input
            className={inputCls}
            placeholder={lang === 'ar' ? 'رابط ملف الأعمال' : 'Portfolio URL'}
            value={form.portfolioUrl}
            onChange={(e) => set('portfolioUrl', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={
              lang === 'ar'
                ? 'أسماء الملفات (مفصولة بفاصلة)'
                : 'File names (comma separated)'
            }
            value={form.portfolioFiles}
            onChange={(e) => set('portfolioFiles', e.target.value)}
          />
          <textarea
            className={`${inputCls} min-h-24 resize-none`}
            placeholder={lang === 'ar' ? 'وصف موجز عن خبراتك' : 'Brief description'}
            value={form.portfolioDesc}
            onChange={(e) => set('portfolioDesc', e.target.value)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <h3 className="font-bold">{lang === 'ar' ? 'الأمان' : 'Security'}</h3>
          <input
            type="password"
            className={inputCls}
            placeholder={
              lang === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6)'
            }
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <select
            className={inputCls}
            value={form.securityQuestion}
            onChange={(e) => set('securityQuestion', e.target.value)}
          >
            {QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <input
            className={inputCls}
            placeholder={lang === 'ar' ? 'إجابة سؤال الأمان' : 'Security answer'}
            value={form.securityAnswer}
            onChange={(e) => set('securityAnswer', e.target.value)}
          />
        </div>
      )}

      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6 text-center"
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#1e90ff]/15 text-[#1e90ff]">
            <Clock className="size-8" />
          </div>
          <h3 className="text-lg font-bold">
            {lang === 'ar' ? 'طلبك قيد المراجعة' : 'Request Under Review'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {lang === 'ar'
              ? 'سيتم إرسال كودك فور الموافقة على الطلب.'
              : 'Your code will be sent once your request is approved.'}
          </p>
          <button
            onClick={close}
            className="mt-5 rounded-xl bg-gradient-wave px-6 py-2.5 font-bold text-white"
          >
            {lang === 'ar' ? 'تم' : 'Done'}
          </button>
        </motion.div>
      )}

      {step < 5 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
          >
            <ArrowRight className="size-4" />
            {lang === 'ar' ? 'السابق' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-1 rounded-xl bg-gradient-wave px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              {lang === 'ar' ? 'التالي' : 'Next'}
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => canNext && submit()}
              disabled={!canNext}
              className="flex items-center gap-1 rounded-xl bg-gradient-wave px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              <Check className="size-4" />
              {lang === 'ar' ? 'إرسال الطلب' : 'Submit'}
            </button>
          )}
        </div>
      )}
    </Modal>
  )
}