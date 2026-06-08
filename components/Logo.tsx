'use client'

import { Zap } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'orange' | 'red' | 'blue'
}

export default function Logo({ size = 'md', variant = 'orange' }: LogoProps) {
  const color = variant === 'red' ? '#dc2626' : variant === 'blue' ? '#3b82f6' : '#f97316'
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 40 : 28
  const textEn = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-xl'
  const textAr = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm'

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          background: `${color}20`,
          border: `1.5px solid ${color}`,
          padding: size === 'sm' ? '5px' : size === 'lg' ? '10px' : '7px',
          boxShadow: `0 0 16px ${color}50`,
        }}
      >
        <Zap size={iconSize} fill={color} stroke={color} />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`font-extrabold tracking-wide ${textEn}`}
          style={{ color, letterSpacing: '0.04em' }}
        >
          Arabaawy
        </span>
        <span
          className={`font-bold ${textAr}`}
          style={{ color, marginTop: '-2px' }}
        >
          عرباوي
        </span>
      </div>
    </div>
  )
}