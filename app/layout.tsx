import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import { cookies } from 'next/headers'
import { DIRECTIONS, LANGUAGE_COOKIE, parseLanguage } from '@/lib/i18n/config'
import { LanguageProvider } from '@/lib/i18n/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bitget | Educational Crypto Trading Demo',
  description:
    'An independent educational demo platform to practice crypto trading with virtual funds. No real money, no real deposits or withdrawals.',
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d0d14',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const language = parseLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value)

  return (
    <html
      lang={language}
      dir={DIRECTIONS[language]}
      className={`${inter.variable} ${tajawal.variable} dark`}
    >
      <body>
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
