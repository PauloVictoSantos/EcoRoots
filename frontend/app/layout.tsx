import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Smart Greenhouse | Estufa Inteligente Amazônica',
  description: 'Monitoramento em tempo real com IA Gemini Vision, ESP32 e gêmeo digital 3D. Sistema inspirado na biodiversidade da Amazônia.',
  keywords: ['estufa inteligente', 'IoT', 'ESP32', 'Gemini IA', 'agricultura', 'monitoramento', 'Next.js'],
  authors: [{ name: 'Smart Greenhouse Team' }],
}

export const viewport: Viewport = {
  themeColor: '#0B3D2E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
