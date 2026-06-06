"use client"
import { useId } from "react"

export type LogoScheme = "gold" | "red" | "blue" | "white"

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg"
  scheme?: LogoScheme
  lang?: "ar" | "en"
}

const SCHEMES = {
  gold:  { a:"#f59e0b", b:"#f97316", bolt:"#fbbf24", boltEnd:"#fb923c" },
  red:   { a:"#ef4444", b:"#f97316", bolt:"#fde047", boltEnd:"#fb923c" },
  blue:  { a:"#3b82f6", b:"#06b6d4", bolt:"#ffffff", boltEnd:"#38bdf8" },
  white: { a:"#ffffff", b:"#cccccc", bolt:"#ffffff", boltEnd:"#aaaaaa" },
}

export default function Logo({ size = "md", scheme = "gold", lang = "ar" }: LogoProps) {
  const uid  = useId().replace(/:/g, "")
  const C    = SCHEMES[scheme]
  const dim  = size === "xs" ? 34 : size === "sm" ? 40 : size === "lg" ? 64 : 50
  const arSz = size === "xs" ? 17 : size === "sm" ? 21 : size === "lg" ? 34 : 26
  const enSz = size === "xs" ?  7 : size === "sm" ?  8 : size === "lg" ? 12 : 10
  const gap  = size === "xs" ?  6 : size === "sm" ?  7 : size === "lg" ? 12 : 9

  const rim  = `rim${uid}`
  const bolt = `blt${uid}`
  const glow = `glw${uid}`
  const clip = `clp${uid}`

  return (
    <div style={{ display:"flex", alignItems:"center", gap, userSelect:"none" }}>
      <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" style={{ flexShrink:0 }}>
        <defs>
          <linearGradient id={rim} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={C.a}/>
            <stop offset="100%" stopColor={C.b}/>
          </linearGradient>
          <linearGradient id={bolt} x1="32" y1="5" x2="32" y2="59" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={C.bolt}/>
            <stop offset="100%" stopColor={C.boltEnd}/>
          </linearGradient>
          <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id={clip}>
            <polygon points="32,3 60,18 60,46 32,61 4,46 4,18"/>
          </clipPath>
        </defs>
        <polygon points="32,1 62,17 62,47 32,63 2,47 2,17"
          fill="none" stroke={C.a} strokeWidth="0.6" opacity="0.3"/>
        <polygon points="32,3 60,18 60,46 32,61 4,46 4,18"
          fill={scheme==="white" ? "#ffffff10" : "#00000040"}
          stroke={`url(#${rim})`} strokeWidth="2"/>
        <g clipPath={`url(#${clip})`} opacity="0.5">
          <polygon points="14,54 23,14 28,14 20,54" fill={`url(#${rim})`}/>
          <polygon points="36,14 41,14 50,54 44,54" fill={`url(#${rim})`} opacity="0.85"/>
          <rect x="20" y="35" width="24" height="5" rx="2" fill={`url(#${rim})`}/>
        </g>
        <path d="M35,6 L24,30 L31,30 L26,58 L44,28 L36,28 Z"
          fill={C.bolt} opacity="0.18" filter={`url(#${glow})`}/>
        <path d="M35,6 L24,30 L31,30 L26,58 L44,28 L36,28 Z"
          fill={`url(#${bolt})`} filter={`url(#${glow})`} opacity="0.92"/>
        <line x1="30" y1="30" x2="20" y2="38" stroke={C.a} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
        <line x1="36" y1="28" x2="45" y2="34" stroke={C.b} strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
        <circle cx="32" cy="3"  r="1.8" fill={C.a} opacity="0.9"/>
        <circle cx="32" cy="61" r="1.8" fill={C.b} opacity="0.9"/>
        <circle cx="60" cy="18" r="1.4" fill={C.a} opacity="0.7"/>
        <circle cx="60" cy="46" r="1.4" fill={C.b} opacity="0.7"/>
        <circle cx="4"  cy="18" r="1.4" fill={C.a} opacity="0.7"/>
        <circle cx="4"  cy="46" r="1.4" fill={C.b} opacity="0.7"/>
      </svg>

      <div style={{ display:"flex", flexDirection:"column", gap: size==="xs" ? 2 : 3 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:1, lineHeight:1 }}>
          <span style={{
            fontSize: arSz, fontWeight:900,
            fontFamily:"Cairo,Tajawal,serif", fontStyle:"italic",
            background:`linear-gradient(135deg,${C.a},${C.b})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            {lang === "ar" ? "عرب" : "Arab"}
          </span>
          <span style={{
            fontSize: arSz * 0.82, fontWeight:800,
            fontFamily:"Cairo,Tajawal,serif", fontStyle:"italic",
            background:`linear-gradient(135deg,${C.bolt},${C.boltEnd})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            {lang === "ar" ? "اوي" : "aawy"}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:3 }}>
          {[0.3,0.6,0.9].map((op,i) => (
            <svg key={i} width="5" height="8" viewBox="0 0 5 8">
              <polyline points="1,1 4,4 1,7" fill="none"
                stroke={C.a} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={op}/>
            </svg>
          ))}
          <span style={{
            fontSize:enSz, fontWeight:700, color:`${C.a}80`,
            letterSpacing:"0.12em", textTransform:"uppercase",
            fontFamily:"Cairo,Tajawal,sans-serif", whiteSpace:"nowrap", margin:"0 3px",
          }}>
            {lang === "ar" ? "النظام الرقمي" : "Digital Ecosystem"}
          </span>
          {[0.9,0.6,0.3].map((op,i) => (
            <svg key={i} width="5" height="8" viewBox="0 0 5 8">
              <polyline points="4,1 1,4 4,7" fill="none"
                stroke={C.b} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={op}/>
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}