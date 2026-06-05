"use client"

import React from 'react';

interface LogoProps {
  size?: "sm" | "md" | "lg"
  role?: "admin" | "investor" | "partner" | "employee"
}

export default function Logo({ size = "md", role = "employee" }: LogoProps) {
  // تحديد الألوان بناءً على دور المستخدم
  const getColors = (role: string) => {
    switch (role) {
      case "admin": return { color: "#dc2626", color2: "#ef4444" }; // أحمر للإدارة
      case "investor": return { color: "#2563eb", color2: "#60a5fa" }; // أزرق للمستثمر
      case "partner": return { color: "#059669", color2: "#34d399" }; // أخضر للشريك
      default: return { color: "#f97316", color2: "#fbbf24" }; // برتقالي افتراضي
    }
  };

  const { color, color2 } = getColors(role);

  const sizes = {
    sm: { icon: 22, enText: "text-lg", arText: "text-xs", gap: "gap-2" },
    md: { icon: 30, enText: "text-2xl", arText: "text-sm", gap: "gap-2.5" },
    lg: { icon: 44, enText: "text-4xl", arText: "text-lg", gap: "gap-3" },
  }
  const s = sizes[size]

  return (
    <div className={`flex items-center ${s.gap}`}>
      {/* الحاوية الهندسية (المعين) */}
      <div
        style={{
          width: s.icon * 1.6,
          height: s.icon * 1.6,
          background: `linear-gradient(135deg, ${color}22, ${color2}11)`,
          border: `1.5px solid ${color}88`,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 20px ${color}44, inset 0 0 12px ${color}11`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${color}18 1px, transparent 1px), linear-gradient(90deg, ${color}18 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }} />
        <svg
          width={s.icon * 0.9}
          height={s.icon * 0.9}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", zIndex: 1 }}
        >
          <path d="M18 4 L6 28 L12 28 L18 16 L24 28 L30 28 Z" fill={`url(#logoGrad${size})`} opacity="0.9" />
          <rect x="11" y="20" width="14" height="2.5" rx="1.25" fill={color2} opacity="0.8" />
          <path d="M21 2 L16 14 L20 14 L15 26 L26 11 L21 11 Z" fill={color2} opacity="0.7" />
          <defs>
            <linearGradient id={`logoGrad${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* النصوص */}
      <div className="flex flex-col leading-none">
        <div className={`font-black italic tracking-tight ${s.enText}`} style={{ lineHeight: 1.1 }}>
          <span style={{ color, fontStyle: "italic", letterSpacing: "-0.02em" }}>Arab</span>
          <span style={{ color: color2, fontStyle: "italic" }}>aawy</span>
        </div>
        <div
          className={`font-extrabold ${s.arText}`}
          style={{
            color,
            marginTop: "1px",
            letterSpacing: "0.08em",
            background: `linear-gradient(90deg, ${color}, ${color2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontStyle: "italic",
          }}
        >
          عرباوي
        </div>
      </div>
    </div>
  )
}
