// Compatibility shim for old pages that import from @/components/Logo
'use client'
import { Logo as NewLogo } from '@/components/logo'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'orange' | 'red' | 'blue'
}

export default function Logo({ size = 'md', variant = 'orange' }: LogoProps) {
  const scheme = variant === 'red' ? 'admin' : variant === 'blue' ? 'investor' : 'default'
  return <NewLogo size={size} scheme={scheme as any} />
}