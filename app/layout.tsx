import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Cairo, Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
})
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'عرباوي | Arabaawy — منصة الاستثمار والشراكة',
  description:
    'منصة عرباوي للاستثمار والشراكة — استثمر، اشترك، وكن جزءاً من المشاريع الناجحة.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`dark ${cairo.variable} ${inter.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}