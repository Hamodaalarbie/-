'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="ms-auto flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}