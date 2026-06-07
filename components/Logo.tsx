"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animate?: boolean
}

export default function Logo({ size = "md", animate = false }: LogoProps) {
  const s = {
    sm: { box: 38,  icon: 24, enSize: 17,  arSize: 10, gap: 9  },
    md: { box: 50,  icon: 32, enSize: 22,  arSize: 13, gap: 11 },
    lg: { box: 64,  icon: 42, enSize: 28,  arSize: 16, gap: 13 },
    xl: { box: 84,  icon: 55, enSize: 38,  arSize: 21, gap: 16 },
  }[size]

  const id = `al-${size}`

  // Shared gradient stops
  const G1 = "#FF6B00"
  const G2 = "#FFD700"
  const G3 = "#FF3D6B"
  const G4 = "#00D4FF"

  // Diamond/rhombus clip points (percentage-based for any size)
  // top, right, bottom, left
  const half = s.box / 2
  const pts  = `${half},2 ${s.box - 2},${half} ${half},${s.box - 2} 2,${half}`

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: s.gap,
      userSelect: "none",
      fontFamily: "'Tajawal', 'Inter', sans-serif",
    }}>
      {/* ── Geometric Diamond Icon ── */}
      <svg
        width={s.box}
        height={s.box}
        viewBox={`0 0 ${s.box} ${s.box}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: animate
            ? `drop-shadow(0 0 ${s.box * 0.35}px #FF6B0066) drop-shadow(0 0 ${s.box * 0.15}px #FF3D6B44)`
            : `drop-shadow(0 0 ${s.box * 0.22}px #FF6B0044) drop-shadow(0 0 ${s.box * 0.1}px #FF3D6B28)`,
          animation: animate ? "logoPulse 3s ease-in-out infinite" : "none",
        }}
      >
        <defs>
          {/* Diamond fill gradient */}
          <linearGradient id={`${id}-df`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={`${G1}28`} />
            <stop offset="1" stopColor={`${G4}18`} />
          </linearGradient>

          {/* A-letter gradient */}
          <linearGradient id={`${id}-ag`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={G1} />
            <stop offset=".5" stopColor={G2} />
            <stop offset="1" stopColor={G1} stopOpacity=".7" />
          </linearGradient>

          {/* Bolt gradient */}
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2=".4" y2="1">
            <stop stopColor={G2} />
            <stop offset=".45" stopColor={G3} />
            <stop offset="1" stopColor={G4} />
          </linearGradient>

          {/* Border gradient */}
          <linearGradient id={`${id}-border`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={G1} stopOpacity=".9" />
            <stop offset=".4" stopColor={G2} stopOpacity=".7" />
            <stop offset="1" stopColor={G4} stopOpacity=".6" />
          </linearGradient>

          {/* Clip to diamond */}
          <clipPath id={`${id}-clip`}>
            <polygon points={pts} />
          </clipPath>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Diamond background fill */}
        <polygon points={pts} fill={`url(#${id}-df)`} />

        {/* Inner grid texture */}
        <g clipPath={`url(#${id}-clip)`}>
          {/* Horizontal lines */}
          {[.25,.5,.75].map((f, i) => (
            <line key={`h${i}`}
              x1={2} y1={s.box * f} x2={s.box - 2} y2={s.box * f}
              stroke={G1} strokeWidth=".5" strokeOpacity=".15"
            />
          ))}
          {/* Vertical lines */}
          {[.25,.5,.75].map((f, i) => (
            <line key={`v${i}`}
              x1={s.box * f} y1={2} x2={s.box * f} y2={s.box - 2}
              stroke={G1} strokeWidth=".5" strokeOpacity=".15"
            />
          ))}
          {/* Diagonal accent lines */}
          <line x1={2} y1={2} x2={s.box - 2} y2={s.box - 2} stroke={G3} strokeWidth=".4" strokeOpacity=".12" />
          <line x1={s.box - 2} y1={2} x2={2} y2={s.box - 2} stroke={G4} strokeWidth=".4" strokeOpacity=".12" />
        </g>

        {/* Diamond border */}
        <polygon
          points={pts}
          fill="none"
          stroke={`url(#${id}-border)`}
          strokeWidth="1.5"
        />

        {/* Inner diamond accent (smaller, rotated) */}
        <polygon
          points={`${half},${s.box*.12} ${s.box*.88},${half} ${half},${s.box*.88} ${s.box*.12},${half}`}
          fill="none"
          stroke={G4}
          strokeWidth=".6"
          strokeOpacity=".25"
          strokeDasharray="3 2"
        />

        {/* ── A Letter ── */}
        <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-glow)`}>
          {/* Scaled to fit diamond: viewBox 0-40 → scaled */}
          <g transform={`scale(${s.box / 40})`}>
            {/* A main shape */}
            <polygon
              points="20,5 9,33 14,33 20,19 26,33 31,33"
              fill={`url(#${id}-ag)`}
              opacity=".92"
            />
            {/* A crossbar */}
            <rect x="13" y="22" width="14" height="2.8" rx="1.4"
              fill={G2} opacity=".9" />

            {/* Lightning bolt — overlapping A */}
            <polygon
              points="23,4 17.5,19 22,19 15,36 29,16 23,16"
              fill={`url(#${id}-bg)`}
              opacity=".94"
            />
            {/* Bolt inner highlight */}
            <polygon
              points="23,8 19.5,19 22,19 17,31 26.5,17.5 23,17.5"
              fill={G2}
              opacity=".32"
            />

            {/* Intersection hotspot */}
            <circle cx="21" cy="22.5" r="2.2" fill={G3} opacity=".9" />
            <circle cx="21" cy="22.5" r="1"   fill="#fff" opacity=".8" />
          </g>
        </g>

        {/* Corner accent dots */}
        <circle cx={half}       cy={3}          r="1.5" fill={G2} opacity=".7" />
        <circle cx={s.box - 3}  cy={half}       r="1.5" fill={G3} opacity=".6" />
        <circle cx={half}       cy={s.box - 3}  r="1.5" fill={G4} opacity=".6" />
        <circle cx={3}          cy={half}       r="1.5" fill={G1} opacity=".7" />
      </svg>

      {/* ── Wordmark ── */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>

        {/* English — single unified gradient across "Arabaawy" */}
        <div style={{
          fontSize:   s.enSize,
          fontWeight: 900,
          fontStyle:  "italic",
          letterSpacing: "-0.025em",
          background: `linear-gradient(100deg, ${G1} 0%, ${G2} 38%, ${G3} 65%, ${G4} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          backgroundClip: "text",
          lineHeight: 1.08,
        }}>
          Arabaawy
        </div>

        {/* Arabic — same gradient direction, slightly smaller, matching weight */}
        <div style={{
          fontSize:   s.arSize,
          fontWeight: 800,
          fontStyle:  "italic",
          letterSpacing: "0.08em",
          marginTop:  s.arSize * 0.15,
          background: `linear-gradient(100deg, ${G1} 0%, ${G2} 50%, ${G3} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          backgroundClip: "text",
          lineHeight: 1,
        }}>
          عرباوي
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap');
        @keyframes logoPulse {
          0%,100% { filter: drop-shadow(0 0 8px #FF6B0055) drop-shadow(0 0 4px #FF3D6B33); }
          50%      { filter: drop-shadow(0 0 22px #FF6B0088) drop-shadow(0 0 12px #FF3D6B66); }
        }
      `}</style>
    </div>
  )
}
